/*
 * Asistente de preguntas frecuentes (chatbot) de Cuidados Navarra.
 *
 *  - Se actualiza solo: además de datos/preguntas.json, lee al abrirse las guías (temas.json),
 *    los servicios (servicios.json), la tienda (tienda.json) y los datos de contacto (sitio.json).
 *    Cada guía, servicio o producto nuevo se convierte en una respuesta sin tocar nada más.
 *  - Para respuestas a medida, edita datos/preguntas.json, no este archivo.
 *  - Funciona entero en el navegador: lo que escribe la persona NO se envía a ningún sitio.
 *  - Busca por palabras clave (sin importar tildes ni mayúsculas). Si no encuentra respuesta,
 *    propone preguntas parecidas y guías de datos/temas.json.
 *  - Preparado para inteligencia artificial: si en preguntas.json se activa "ia" con un
 *    "endpoint", pregunta primero al servidor y, si falla, responde con las preguntas frecuentes.
 *    (Ver APPS.md, apartado «Asistente».)
 */
(function () {
  if (!window.CN || document.getElementById("asistente")) return;

  var esc = CN.esc, t = CN.t || function (x) { return x; };
  var DATOS = null, GUIAS = [], historial = [], abierto = false, cargado = null;

  // ---------- Búsqueda por palabras clave ----------
  var VACIAS = ("a al algo algun alguna como con cual cuales cuando de del el ella ellos en es esa ese eso esta este esto estoy " +
    "ha hay he la las le les lo los me mi mis mucho muy no nos o os para pero por puedo puede que se ser si sin sobre " +
    "su sus te tengo tiene tu un una uno unos unas usted y ya yo hacer hago debo quiero necesito saber favor " +
    "casa persona mayor paso cada todo toda ante " +
    // euskera
    "eta edo da dira du dut duzu dute ditu ditut dituzu naiz zara gara dago daude dauka dut al ba bai ez ere baina oso asko " +
    "bat batzuk hau hori hura hau honek horrek nire zure gure bere haren ni zu gu zer nola noiz non zein zergatik " +
    "behar nahi egin egiten izan ahal ari dela dena edozein etxe etxean pertsona adineko mesedez").split(" ");
  var normal = function (t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  };
  // Raíz muy simple: quita plurales para que «caídas» encuentre «caída»
  var raiz = function (w) {
    if (w.length > 4 && /es$/.test(w) && !/[aeiou]es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w)) return w.slice(0, -1);
    return w;
  };
  var palabras = function (t) { return normal(t).split(" ").filter(Boolean).map(raiz); };
  var utiles = function (lista) { return lista.filter(function (w) { return w.length > 1 && VACIAS.indexOf(w) === -1; }); };
  var parecida = function (a, b) {
    if (a === b || (b.length >= 4 && a.indexOf(b) === 0) || (a.length >= 5 && b.indexOf(a) === 0)) return true;
    // Misma palabra con otra terminación: «caído» / «caída», «cansado» / «cansada»
    var n = Math.min(a.length, b.length);
    return n >= 5 && Math.abs(a.length - b.length) <= 1 && a.slice(0, n - 1) === b.slice(0, n - 1);
  };

  function puntuar(texto) {
    var todas = palabras(texto), frase = " " + todas.join(" ") + " ", clave = utiles(todas);
    return (DATOS.preguntas || []).map(function (p) {
      var puntos = 0, coincide = false;
      (p.palabrasClave || []).forEach(function (k) {
        var kp = palabras(k);
        if (!kp.length) return;
        if (kp.length > 1) {
          if (frase.indexOf(" " + kp.join(" ") + " ") !== -1) { puntos += 3 + kp.length; coincide = true; }
        } else if (clave.some(function (w) { return parecida(w, kp[0]); }) ||
                   (VACIAS.indexOf(kp[0]) !== -1 && todas.indexOf(kp[0]) !== -1)) {
          puntos += 3; coincide = true;
        }
      });
      // Palabras sacadas automáticamente del título de una guía, servicio o producto
      (p.clavesAuto || []).forEach(function (k) {
        if (clave.some(function (w) { return parecida(w, k); })) { puntos += 2; coincide = true; }
      });
      var enunciado = p._enunciado || (p._enunciado = utiles(palabras(p.pregunta + " " + (p.textoExtra || ""))));
      clave.forEach(function (w) { if (enunciado.some(function (e) { return parecida(w, e); })) puntos += 1; });
      if (p.urgente && coincide) puntos += 100;
      return { p: p, puntos: puntos };
    }).filter(function (r) { return r.puntos > 0; }).sort(function (a, b) { return b.puntos - a.puntos; });
  }

  function buscarGuias(texto) {
    var clave = utiles(palabras(texto));
    if (!clave.length) return [];
    return GUIAS.map(function (g) {
      var t = utiles(palabras(g.titulo + " " + g.resumen)), c = utiles(palabras(g.contenido));
      var n = 0;
      clave.forEach(function (w) {
        if (t.some(function (e) { return parecida(e, w); })) n += 2;
        else if (c.some(function (e) { return parecida(e, w); })) n += 1;
      });
      return { g: g, n: n };
    }).filter(function (r) { return r.n >= 2; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 2);
  }

  function responderLocal(texto) {
    var r = puntuar(texto), mejor = r[0];
    if (mejor && mejor.puntos >= 3) {
      var otra = r[1] && !r[1].p.oculta && r[1].puntos >= 3 && r[1].puntos >= mejor.puntos * 0.75 && !mejor.p.urgente ? r[1].p : null;
      return { pregunta: mejor.p, relacionadas: otra ? [otra] : [] };
    }
    return {
      sinRespuesta: true,
      relacionadas: r.filter(function (x) { return !x.p.oculta; }).slice(0, 3).map(function (x) { return x.p; }),
      guias: buscarGuias(texto).map(function (x) { return x.g; })
    };
  }

  // ---------- Respuestas automáticas a partir del contenido de la web ----------
  var sinPendientes = function (t) { return t && String(t).indexOf("[") === -1; };
  var lista = function (items) { return items.map(function (t) { return "- " + t; }).join("\n"); };
  // Palabras útiles de un título, para buscar sin tener que escribir palabras clave a mano
  var clavesDe = function (t) {
    return utiles(palabras(t)).filter(function (w, i, a) { return w.length >= 4 && a.indexOf(w) === i; });
  };

  function construir(d, temas, servicios, tienda, sitio) {
    temas = temas || {}; servicios = servicios || {}; tienda = tienda || {}; sitio = sitio || {};
    var arts = temas.articulos || [], cats = temas.categorias || [], servs = servicios.servicios || [],
        prods = tienda.productos || [], catsTienda = tienda.categorias || [];
    var cat = function (lista, id) { return lista.find(function (c) { return c.id === id; }) || { nombre: "" }; };

    // Datos que se pueden usar en las respuestas: {{contacto.horario}}, {{lista.servicios}}…
    var ctx = {
      sitio: sitio, contacto: sitio.contacto || {},
      lista: {
        servicios: lista(servs.map(function (x) { return x.titulo + ": " + x.resumen; })),
        temas: lista(cats.map(function (c) { return c.nombre; })),
        tienda: lista(catsTienda.map(function (c) { return c.nombre; })),
        guias: lista(arts.map(function (a) { return a.titulo; }))
      }
    };

    function deGuia(a, base) {
      var c = cat(cats, a.categoria);
      base = base || {};
      return {
        id: base.id || "guia-" + a.id, auto: !base.id, tema: base.tema || c.nombre, origen: t("Guía: {titulo}", { titulo: a.titulo }),
        pregunta: base.pregunta || a.titulo,
        palabrasClave: (base.palabrasClave || []).concat(a.palabrasClave || []),
        clavesAuto: clavesDe(a.titulo), textoExtra: a.resumen + " " + c.nombre,
        respuesta: base.respuesta || a.contenido,
        enlaces: [{ texto: t("Abrir la guía completa"), url: "index.html#guia-" + a.id }].concat(base.enlaces || []),
        urgente: base.urgente, oculta: base.oculta
      };
    }
    function deServicio(x, base) {
      base = base || {};
      var texto = x.resumen + (x.detalles && x.detalles.length ? "\n\n" + lista(x.detalles) : "") +
        (sinPendientes(x.precio) ? "\n\n" + t("Precio orientativo: {precio}.", { precio: x.precio }) : "");
      return {
        id: base.id || "servicio-" + x.id, auto: !base.id, tema: base.tema || t("Nuestros servicios"), origen: t("Servicio: {titulo}", { titulo: x.titulo }),
        pregunta: base.pregunta || x.titulo,
        palabrasClave: (base.palabrasClave || []).concat(x.palabrasClave || []),
        clavesAuto: clavesDe(x.titulo), textoExtra: x.resumen,
        respuesta: base.respuesta || texto,
        enlaces: (base.enlaces || [{ texto: t("Ver los servicios"), url: "servicios.html" }]).concat([{ texto: t("Pedir información"), url: "empresa.html#contacto" }]),
        oculta: base.oculta
      };
    }

    var usadasG = {}, usadosS = {}, salida = [];
    (d.preguntas || []).forEach(function (p) {
      var a = p.guia && arts.find(function (x) { return x.id === p.guia; });
      var x = p.servicio && servs.find(function (y) { return y.id === p.servicio; });
      if (a) { usadasG[a.id] = 1; salida.push(deGuia(a, p)); }
      else if (x) { usadosS[x.id] = 1; salida.push(deServicio(x, p)); }
      else if (p.respuesta) salida.push(p); // si la guía o el servicio se borró y no hay texto propio, se omite
    });
    arts.forEach(function (a) { if (!usadasG[a.id]) salida.push(deGuia(a)); });
    servs.forEach(function (x) { if (!usadosS[x.id]) salida.push(deServicio(x)); });
    prods.forEach(function (x) {
      var c = cat(catsTienda, x.categoria);
      salida.push({
        id: "producto-" + x.id, auto: true, tema: t("Tienda"), origen: t("Tienda: {titulo}", { titulo: x.titulo }), pregunta: x.titulo,
        palabrasClave: x.palabrasClave || [], clavesAuto: clavesDe(x.titulo), textoExtra: x.texto + " " + c.nombre,
        respuesta: x.texto + "\n\n" + t("Lo tienes en nuestra tienda, en «{categoria}».", { categoria: c.nombre }),
        enlaces: [{ texto: t("Ver en la tienda"), url: "tienda.html" }]
      });
    });
    salida.forEach(function (p) { if (p.respuesta) p.respuesta = CN.plantilla(p.respuesta, ctx); });
    return salida;
  }

  // ---------- Inteligencia artificial (desactivada por defecto) ----------
  function responder(texto) {
    var ia = DATOS.asistente && DATOS.asistente.ia;
    var local = responderLocal(texto);
    // Las urgencias se responden siempre al instante con el texto revisado
    if (!ia || !ia.activa || !ia.endpoint || (local.pregunta && local.pregunta.urgente)) return Promise.resolve(local);
    var control = window.AbortController ? new AbortController() : null;
    var reloj = setTimeout(function () { if (control) control.abort(); }, 15000);
    return fetch(ia.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: texto, historial: historial.slice(-6), pagina: location.pathname }),
      signal: control ? control.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error("IA " + res.status);
      return res.json();
    }).then(function (d) {
      if (!d || !d.respuesta) throw new Error("IA sin respuesta");
      return { ia: true, pregunta: { respuesta: d.respuesta, enlaces: d.enlaces || [] }, relacionadas: [] };
    }).catch(function () { return local; }).finally(function () { clearTimeout(reloj); });
  }

  // ---------- Interfaz ----------
  var ICONO = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z"/><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01" stroke-width="3"/></svg>';
  var ENVIAR = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  document.body.insertAdjacentHTML("beforeend",
    '<div id="asistente" class="asistente">' +
      '<button type="button" class="asistente-boton" id="asistente-boton" aria-expanded="false" aria-controls="asistente-panel">' +
        ICONO + '<span id="asistente-boton-texto">¿Dudas?</span></button>' +
      '<section class="asistente-panel" id="asistente-panel" role="dialog" aria-modal="false" aria-labelledby="asistente-titulo" hidden>' +
        '<header class="asistente-cabecera">' +
          '<span class="asistente-avatar" aria-hidden="true">' + ICONO + "</span>" +
          '<div><h2 id="asistente-titulo">Asistente</h2><p id="asistente-aviso">Respuestas orientativas. Urgencias: 112.</p></div>' +
          '<button type="button" class="asistente-cerrar" id="asistente-cerrar" aria-label="Cerrar el asistente">×</button>' +
        "</header>" +
        '<div class="asistente-mensajes" id="asistente-mensajes" role="log" aria-live="polite" aria-relevant="additions"></div>' +
        '<form class="asistente-formulario" id="asistente-formulario" autocomplete="off">' +
          '<label for="asistente-texto" class="oculto">Escribe tu pregunta</label>' +
          '<input id="asistente-texto" type="text" maxlength="300" placeholder="Escribe tu pregunta…" enterkeyhint="send">' +
          '<button type="submit" class="asistente-enviar" aria-label="Enviar pregunta">' + ENVIAR + "</button>" +
        "</form>" +
      "</section>" +
    "</div>");

  var $ = function (id) { return document.getElementById(id); };
  var boton = $("asistente-boton"), panel = $("asistente-panel"), log = $("asistente-mensajes"),
      form = $("asistente-formulario"), campo = $("asistente-texto");

  function bajar() { log.scrollTop = log.scrollHeight; }

  // Separa las listas del texto que las rodea para que se vean como lista
  function formatear(t) {
    return CN.formatear(String(t || "").replace(/([^\n])\n(\s*- )/g, "$1\n\n$2").replace(/(\n\s*- [^\n]*)\n(?!\s*- |\n)/g, "$1\n\n"));
  }

  function enlacesHTML(lista) {
    if (!lista || !lista.length) return "";
    return '<div class="asistente-enlaces">' + lista.map(function (e) {
      var url = String(e.url || "");
      if (!/^(https?:|tel:|mailto:|[\w\-]+\.html|#)/i.test(url)) return "";
      var externo = /^https?:/i.test(url);
      return '<a class="asistente-enlace" href="' + esc(url) + '"' + (externo ? ' target="_blank" rel="noopener"' : "") + ">" + esc(e.texto) + "</a>";
    }).join("") + "</div>";
  }

  function chipsHTML(lista, titulo) {
    if (!lista || !lista.length) return "";
    return (titulo ? '<p class="asistente-pista">' + esc(titulo) + "</p>" : "") +
      '<div class="asistente-chips">' + lista.map(function (p) {
        return '<button type="button" class="asistente-chip" data-pregunta="' + esc(p.id) + '">' + esc(p.pregunta) + "</button>";
      }).join("") + "</div>";
  }

  function decir(html, quien) {
    var div = document.createElement("div");
    div.className = "asistente-mensaje " + (quien === "yo" ? "yo" : "bot");
    if (quien === "yo") div.setAttribute("translate", "no"); // lo que escribe la persona no se traduce
    div.innerHTML = html;
    log.appendChild(div);
    // Las respuestas largas se muestran desde su principio, no desde el final
    if (quien !== "yo" && div.offsetHeight > log.clientHeight - 40) log.scrollTop = div.offsetTop - log.offsetTop - 12;
    else bajar();
    return div;
  }

  function mostrar(res) {
    if (res.pregunta) {
      var p = res.pregunta;
      decir((p.origen ? '<p class="asistente-origen">' + esc(p.origen) + "</p>" : "") +
        '<div class="asistente-texto' + (p.urgente ? " urgente" : "") + '">' + formatear(p.respuesta) + "</div>" +
        enlacesHTML(p.enlaces) + chipsHTML(res.relacionadas, t("También puede interesarte:")));
      historial.push({ rol: "asistente", texto: p.respuesta });
      return;
    }
    var a = DATOS.asistente || {};
    var guias = (res.guias || []).map(function (g) { return { texto: t("Guía: {titulo}", { titulo: g.titulo }), url: "index.html#guia-" + g.id }; });
    decir('<div class="asistente-texto">' + formatear(a.sinRespuesta || t("No tengo una respuesta para eso todavía.")) + "</div>" +
      enlacesHTML(guias.concat([{ texto: t("Escribirnos"), url: "empresa.html#contacto" }])) +
      chipsHTML(res.relacionadas, res.relacionadas && res.relacionadas.length ? t("¿Quizás querías preguntar…?") : ""));
  }

  function preguntar(texto, id) {
    texto = String(texto || "").trim();
    if (!texto) return;
    decir(esc(texto), "yo");
    historial.push({ rol: "persona", texto: texto });
    var escribiendo = decir('<span class="asistente-escribiendo" aria-label="Escribiendo"><i></i><i></i><i></i></span>');
    var p = id && DATOS.preguntas.find(function (x) { return x.id === id; });
    var promesa = p ? Promise.resolve({ pregunta: p, relacionadas: [] }) : responder(texto);
    promesa.then(function (res) {
      setTimeout(function () { escribiendo.remove(); mostrar(res); }, p ? 250 : 450);
    });
  }

  function iniciar() {
    if (cargado) return cargado;
    var opcional = function (n) { return CN.cargar(n).catch(function () { return null; }); };
    cargado = Promise.all([CN.cargar("preguntas"), opcional("temas"), opcional("servicios"), opcional("tienda"), opcional("sitio")]).then(function (r) {
      var d = r[0];
      DATOS = d;
      GUIAS = (r[1] && r[1].articulos) || [];
      DATOS.preguntas = construir(d, r[1], r[2], r[3], r[4]);
      var a = d.asistente || {};
      if (a.nombre) $("asistente-titulo").textContent = a.nombre;
      if (a.aviso) $("asistente-aviso").textContent = a.aviso;
      var sug = (a.sugerencias || []).map(function (id) { return d.preguntas.find(function (p) { return p.id === id; }); }).filter(Boolean);
      decir('<div class="asistente-texto">' + formatear(a.bienvenida || t("Hola, ¿en qué te puedo ayudar?")) + "</div>" + chipsHTML(sug));
    }).catch(function () {
      cargado = null;
      decir('<div class="asistente-texto"><p>' + t("Ahora mismo no puedo cargar las respuestas. Prueba en unos segundos o escríbenos.") + "</p></div>" +
        enlacesHTML([{ texto: t("Escribirnos"), url: "empresa.html#contacto" }]));
    });
    return cargado;
  }

  function abrir() {
    abierto = true;
    panel.hidden = false;
    boton.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("asistente-abierto");
    iniciar();
    setTimeout(function () { campo.focus(); bajar(); }, 50);
  }
  function cerrar(devolverFoco) {
    abierto = false;
    panel.hidden = true;
    boton.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("asistente-abierto");
    if (devolverFoco) boton.focus();
  }

  boton.addEventListener("click", function () { abierto ? cerrar(true) : abrir(); });
  $("asistente-cerrar").addEventListener("click", function () { cerrar(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && abierto) cerrar(true); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!DATOS) { iniciar(); return; }
    var t = campo.value; campo.value = "";
    preguntar(t);
  });

  log.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-pregunta]");
    if (chip && DATOS) { preguntar(chip.textContent, chip.getAttribute("data-pregunta")); return; }
    var a = e.target.closest("a");
    // En el móvil el panel ocupa toda la pantalla: lo cerramos al seguir un enlace de la web
    if (a && !/^(tel:|mailto:|https?:)/i.test(a.getAttribute("href")) && window.matchMedia("(max-width: 560px)").matches) cerrar(false);
  });

  // Enlaces en cualquier página con href="#asistente" abren el asistente
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href="#asistente"]');
    if (a) { e.preventDefault(); abrir(); }
  });
})();
