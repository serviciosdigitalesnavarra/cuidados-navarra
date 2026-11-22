/*
 * Accesibilidad de Cuidados Navarra:
 *  - Panel «Accesibilidad» de la cabecera: tamaño de letra, alto contraste, más espaciado,
 *    velocidad de la voz y lectura automática de las respuestas del asistente.
 *    Las preferencias se guardan en este navegador (localStorage), no se envían a ningún sitio.
 *  - Lectura en voz alta con la voz del propio móvil u ordenador (Web Speech API, gratis y sin servidor).
 *
 * Para añadir un botón «Escuchar» a cualquier parte de la web basta con escribir en el HTML:
 *    <button type="button" data-escuchar="#id-de-la-zona">Escuchar</button>
 * (data-escuchar="main" lee el contenido principal de la página).
 * Lo que tenga la clase "no-leer" se salta al leer en voz alta.
 *
 * La voz sigue el idioma de la página (<html lang="es">, "eu"…) y todos los textos visibles
 * de estos botones y del panel están en TEXTOS, justo debajo, para poder traducirlos.
 */
(function () {
  if (!window.CN || window.CN.lector) return;

  var html = document.documentElement;
  var prefs = CN.preferencias;
  var synth = window.speechSynthesis;
  var soporta = !!(synth && window.SpeechSynthesisUtterance);
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Textos visibles (uno por idioma; si falta un idioma se usa "es") ----------
  var TEXTOS = {
    es: {
      escuchar: "Escuchar", parar: "Parar",
      escucharPagina: "Escuchar esta página", escucharGuia: "Escuchar la guía", pararLectura: "Parar la lectura",
      tituloEscuchar: "Leer en voz alta esta página",
      estaRespuesta: " esta respuesta",
      barra: "Lectura en voz alta", leyendo: "Leyendo", leyendoDe: "Leyendo · {n} de {total}", enPausa: "En pausa",
      pausar: "Pausar", seguir: "Seguir leyendo", anterior: "Párrafo anterior", siguiente: "Párrafo siguiente",
      pulsaDeNuevo: "Pulsa de nuevo «Escuchar» para empezar",
      sinVoz: "Tu dispositivo no tiene voz en español: se usará otra",
      accesibilidad: "Accesibilidad", cerrarPanel: "Cerrar ajustes de accesibilidad",
      sinSoporte: "Este navegador no permite la lectura en voz alta. Prueba con Chrome, Safari o Edge actualizados, o con el lector de pantalla de tu dispositivo.",
      tamano: "Tamaño de letra", normal: "Normal", grande: "Grande", muyGrande: "Muy grande",
      velocidad: "Velocidad de la voz", lenta: "Lenta", rapida: "Rápida",
      contraste: "Alto contraste", contrasteAyuda: "Texto negro, bordes marcados y enlaces subrayados",
      espaciado: "Más espacio", espaciadoAyuda: "Más separación entre líneas, palabras y letras",
      leerAsistente: "Leer en voz alta el asistente", leerAsistenteAyuda: "Lee cada respuesta del botón «¿Dudas?»",
      restablecer: "Restablecer", ayuda: "Ayuda y declaración de accesibilidad"
    }
  };
  var idioma = function () { return (html.getAttribute("lang") || "es").slice(0, 2).toLowerCase(); };
  var T = TEXTOS[idioma()] || TEXTOS.es;
  for (var k in TEXTOS.es) if (!(k in T)) T[k] = TEXTOS.es[k];

  var ICONO_ALTAVOZ = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var ICONO_PARAR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  var ICONO_PAUSA = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var ICONO_SEGUIR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 5v14l12-7L7 5Z"/></svg>';
  var ICONO_ATRAS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6 5h2v14H6zM20 5v14L9 12l11-7Z"/></svg>';
  var ICONO_ADELANTE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16 5h2v14h-2zM4 5v14l11-7L4 5Z"/></svg>';

  /* ============================================================
     1. LECTURA EN VOZ ALTA
     ============================================================ */
  var NO_LEER = "script,style,noscript,template,svg,button,.boton,select,textarea,input,option,nav,[hidden],[aria-hidden='true'],.oculto,.no-leer,.saltar,.lector-barra,.panel-acc,.asistente-chips,.asistente-pista";
  var lector = { cola: [], i: 0, activo: false, pausado: false, raiz: null, actual: null, marcado: null };

  // Quita emojis y símbolos decorativos que la voz leería de forma extraña («pie», «flecha»…)
  var limpiar = function (t) {
    t = String(t).replace(/[←-⇿⌀-⏿①-➿⤀-⥿⬀-⯿️‍]/g, " ");
    try { t = t.replace(/\p{Extended_Pictographic}/gu, " "); } catch (e) { t = t.replace(/[\uD83C-\uD83E][\uDC00-\uDFFF]/g, " "); }
    return t.replace(/\s+/g, " ").trim();
  };

  var esBloque = function (el) {
    var d = getComputedStyle(el).display;
    return d.indexOf("inline") !== 0 && d !== "contents";
  };

  // Recorre la zona y agrupa el texto visible por párrafos/bloques, en orden de lectura
  function extraer(raiz) {
    var trozos = [], actual = null;
    var walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p || p.closest(NO_LEER)) return NodeFilter.FILTER_REJECT;
        if (!p.getClientRects().length) return NodeFilter.FILTER_REJECT; // no se ve
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      var b = n.parentElement;
      while (b !== raiz && !esBloque(b)) b = b.parentElement;
      if (!actual || actual.el !== b) { actual = { el: b, texto: "" }; trozos.push(actual); }
      // Un salto de línea (<br>) se lee como una pausa
      var prev = n.previousSibling || (n.parentElement !== b && n.parentElement.previousSibling);
      actual.texto += (prev && prev.nodeName === "BR" ? ", " : "") + n.nodeValue;
    }
    var cola = [];
    trozos.forEach(function (t) {
      var texto = limpiar(t.texto);
      if (!/[\wáéíóúüñ]/i.test(texto)) return;
      // Frases cortas: algunos navegadores cortan la voz en textos largos
      var frases = texto.match(/[^.!?…;:]+[.!?…;:]*\s*/g) || [texto], buf = "";
      frases.forEach(function (f) {
        if ((buf + f).length > 180 && buf) { cola.push({ el: t.el, texto: buf.trim() }); buf = ""; }
        while (f.length > 180) {
          var corte = f.lastIndexOf(",", 180); if (corte < 60) corte = f.lastIndexOf(" ", 180); if (corte < 60) corte = 180;
          cola.push({ el: t.el, texto: f.slice(0, corte + 1).trim() }); f = f.slice(corte + 1);
        }
        buf += f;
      });
      if (buf.trim()) cola.push({ el: t.el, texto: buf.trim() });
    });
    return cola;
  }

  // Elige la voz del idioma de la página (mejor de España e instalada en el dispositivo)
  var vozElegida = null, vozIdioma = null;
  function vozDe(pref) {
    var voces = soporta ? synth.getVoices() : [];
    var del = voces.filter(function (v) { return String(v.lang).toLowerCase().indexOf(pref) === 0; });
    var deEspana = del.filter(function (v) { return /[-_]ES$/i.test(v.lang); });
    var preferir = function (lista) { return lista.filter(function (v) { return v.localService; })[0] || lista[0]; };
    return preferir(deEspana) || preferir(del) || null;
  }
  function voz() {
    var id = idioma();
    if (vozElegida && vozIdioma === id) return vozElegida;
    vozIdioma = id;
    vozElegida = vozDe(id);
    return vozElegida;
  }
  var langVoz = function () { var id = idioma(); return id === "es" || id === "eu" || id === "ca" || id === "gl" ? id + "-ES" : id; };
  if (soporta && "onvoiceschanged" in synth) synth.addEventListener("voiceschanged", function () { vozElegida = null; });

  // Barra de control (pausar, anterior, siguiente, parar)
  var barra = document.createElement("div");
  barra.className = "lector-barra";
  barra.setAttribute("role", "region");
  barra.setAttribute("aria-label", T.barra);
  barra.hidden = true;
  barra.innerHTML =
    '<span class="lector-icono" aria-hidden="true">' + ICONO_ALTAVOZ + "</span>" +
    '<span class="lector-estado">' + T.leyendo + "</span>" +
    '<button type="button" data-lector="anterior" aria-label="' + T.anterior + '" title="' + T.anterior + '">' + ICONO_ATRAS + "</button>" +
    '<button type="button" data-lector="pausa" aria-label="' + T.pausar + '" title="' + T.pausar + '">' + ICONO_PAUSA + "</button>" +
    '<button type="button" data-lector="siguiente" aria-label="' + T.siguiente + '" title="' + T.siguiente + '">' + ICONO_ADELANTE + "</button>" +
    '<button type="button" data-lector="parar" class="lector-parar">' + ICONO_PARAR + "<span>" + T.parar + "</span></button>";

  function colocarBarra() {
    // Dentro de una ventana (guía, asistente) la barra va dentro, para poder pulsarla
    var r = lector.raiz, dialogo = r && r.closest("dialog[open]"), panel = r && r.closest(".asistente-panel");
    if (dialogo) dialogo.appendChild(barra);
    else if (panel) panel.insertBefore(barra, panel.querySelector("form"));
    else document.body.appendChild(barra);
    barra.classList.toggle("en-ventana", !!(dialogo || panel));
  }

  function marcar(el) {
    if (lector.marcado === el) return;
    if (lector.marcado) lector.marcado.classList.remove("lector-actual");
    lector.marcado = el;
    if (!el) return;
    el.classList.add("lector-actual");
    var r = el.getBoundingClientRect(), alto = window.innerHeight || 600;
    if (r.top < 90 || r.bottom > alto - 90) {
      try { el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
      catch (e) { el.scrollIntoView(); }
    }
  }

  function estado(texto) { barra.querySelector(".lector-estado").textContent = texto; }

  function pintarBotones() {
    document.querySelectorAll("[data-escuchar]").forEach(function (b) {
      var sel = b.getAttribute("data-escuchar");
      var leyendo = lector.activo && lector.raiz && lector.raiz === document.querySelector(sel);
      b.classList.toggle("leyendo", !!leyendo);
      var t = b.querySelector(".texto-escuchar");
      var ic = b.querySelector(".icono-escuchar");
      // data-texto y data-texto-parar llevan una clave de TEXTOS (o un texto literal)
      var normal = b.getAttribute("data-texto") || "escuchar", parando = b.getAttribute("data-texto-parar") || "parar";
      if (t) t.textContent = leyendo ? (T[parando] || parando) : (T[normal] || normal);
      if (ic) ic.innerHTML = leyendo ? ICONO_PARAR : ICONO_ALTAVOZ;
    });
    var p = barra.querySelector("[data-lector=pausa]");
    p.innerHTML = lector.pausado ? ICONO_SEGUIR : ICONO_PAUSA;
    p.setAttribute("aria-label", lector.pausado ? T.seguir : T.pausar);
    p.title = p.getAttribute("aria-label");
  }

  function hablar() {
    if (!lector.activo || lector.pausado) return;
    // Si la zona ya no se ve (se cerró la guía o el asistente), se para
    if (!lector.raiz.isConnected || !lector.raiz.getClientRects().length) return parar();
    if (lector.i >= lector.cola.length) { parar(); return; }
    var t = lector.cola[lector.i];
    var u = new SpeechSynthesisUtterance(t.texto);
    u.lang = langVoz();
    var v = voz(); if (v) { try { u.voice = v; u.lang = v.lang; } catch (e) {} }
    u.rate = prefs.velocidad || 1;
    u.onend = function () { if (u !== lector.actual) return; lector.i++; hablar(); };
    u.onerror = function (e) {
      if (u !== lector.actual || e.error === "interrupted" || e.error === "canceled") return;
      if (e.error === "not-allowed") { estado(T.pulsaDeNuevo); return; }
      lector.i++; hablar();
    };
    lector.actual = u;
    marcar(t.el);
    estado(lector.cola.length > 1 ? T.leyendoDe.replace("{n}", lector.i + 1).replace("{total}", lector.cola.length) : T.leyendo);
    synth.speak(u);
  }

  function empezar(raiz) {
    if (!soporta || !raiz) return;
    parar(true);
    var cola = extraer(raiz);
    if (!cola.length) return;
    lector.cola = cola; lector.i = 0; lector.activo = true; lector.pausado = false; lector.raiz = raiz;
    colocarBarra();
    barra.hidden = false;
    html.classList.add("lector-activo");
    pintarBotones();
    if (!voz() && synth.getVoices().length) estado(T.sinVoz);
    // Pequeña espera tras cancelar: algunos navegadores (Chrome) se saltan la primera frase si no
    setTimeout(hablar, 60);
  }

  function parar(silencioso) {
    lector.actual = null;
    if (soporta) synth.cancel();
    marcar(null);
    var estaba = lector.activo;
    lector.activo = false; lector.pausado = false; lector.cola = []; lector.raiz = null;
    barra.hidden = true;
    html.classList.remove("lector-activo");
    if (estaba && !silencioso) pintarBotones();
  }

  // Pausar = cancelar y recordar el párrafo (pause() falla en Android y en algunos iPhone)
  function pausa() {
    if (!lector.activo) return;
    if (lector.pausado) { lector.pausado = false; pintarBotones(); hablar(); return; }
    lector.pausado = true; lector.actual = null; synth.cancel();
    estado(T.enPausa);
    pintarBotones();
  }
  function saltar(n) {
    if (!lector.activo) return;
    // Salta al principio del párrafo anterior/siguiente, no solo de la frase
    var el = lector.cola[lector.i] && lector.cola[lector.i].el, i = lector.i;
    if (n > 0) { while (i < lector.cola.length && lector.cola[i].el === el) i++; }
    else {
      while (i > 0 && lector.cola[i - 1].el === el) i--;
      if (i > 0) { var prev = lector.cola[i - 1].el; i--; while (i > 0 && lector.cola[i - 1].el === prev) i--; }
    }
    if (i >= lector.cola.length) return parar();
    lector.i = i; lector.actual = null; synth.cancel();
    lector.pausado = false; pintarBotones();
    setTimeout(hablar, 60);
  }

  barra.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lector]"); if (!b) return;
    var a = b.getAttribute("data-lector");
    if (a === "parar") parar();
    else if (a === "pausa") pausa();
    else saltar(a === "siguiente" ? 1 : -1);
  });

  // Cualquier botón con data-escuchar="selector" lee esa zona (o para si ya la está leyendo)
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-escuchar]"); if (!b) return;
    e.preventDefault();
    var raiz = document.querySelector(b.getAttribute("data-escuchar"));
    if (lector.activo && lector.raiz === raiz) parar(); else empezar(raiz);
    if (panel.contains(b)) { cerrarPanel(false); $("boton-escuchar").focus(); }
  });

  // iPhone/iPad solo dejan hablar tras un toque: se «desbloquea» la voz con el primer toque
  var desbloqueada = false;
  var desbloquear = function () {
    if (desbloqueada || !soporta) return;
    desbloqueada = true;
    if (!lector.activo) { var u = new SpeechSynthesisUtterance(" "); u.volume = 0; synth.speak(u); }
  };
  document.addEventListener("touchend", desbloquear, { passive: true });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lector.activo && !document.querySelector("dialog[open]") && !html.classList.contains("asistente-abierto") && $("panel-acc").hidden) parar();
  });

  // Al cerrar una guía (dialog) se deja de leer
  document.addEventListener("close", function (e) { if (lector.raiz && e.target.contains(lector.raiz)) parar(); }, true);
  // Al salir de la página, que no siga hablando
  window.addEventListener("pagehide", function () { if (soporta) synth.cancel(); });
  if (soporta) synth.cancel();

  /* ============================================================
     2. ASISTENTE (chatbot): botón «Escuchar» en cada respuesta
     ============================================================ */
  var nMensaje = 0;
  function prepararMensaje(m) {
    if (!soporta || m.querySelector(".lector-mini") || m.querySelector(".asistente-escribiendo")) return false;
    if (!m.id) m.id = "asistente-msg-" + (++nMensaje);
    m.insertAdjacentHTML("beforeend",
      '<button type="button" class="lector-mini" data-escuchar="#' + m.id + '">' +
      '<span class="icono-escuchar">' + ICONO_ALTAVOZ + '</span><span class="texto-escuchar">' + T.escuchar + "</span>" +
      '<span class="oculto">' + T.estaRespuesta + "</span></button>");
    return true;
  }
  function engancharAsistente(log) {
    new MutationObserver(function (cambios) {
      cambios.forEach(function (c) {
        Array.prototype.forEach.call(c.addedNodes, function (m) {
          if (m.nodeType !== 1 || !m.classList.contains("bot")) return;
          if (prepararMensaje(m) && prefs.leerAsistente) empezar(m);
        });
      });
    }).observe(log, { childList: true });
    Array.prototype.forEach.call(log.querySelectorAll(".asistente-mensaje.bot"), prepararMensaje);
  }
  (function esperarAsistente() {
    var log = $("asistente-mensajes");
    if (log) return engancharAsistente(log);
    var obs = new MutationObserver(function () {
      var l = $("asistente-mensajes");
      if (l) { obs.disconnect(); engancharAsistente(l); }
    });
    obs.observe(document.body, { childList: true });
  })();

  /* ============================================================
     3. PANEL DE AJUSTES
     ============================================================ */
  var panel = $("panel-acc"), botonAjustes = $("boton-ajustes");
  var radio = function (nombre, valor, texto, extra) {
    return '<label class="opcion"><input type="radio" name="' + nombre + '" value="' + valor + '"><span' + (extra ? ' class="' + extra + '"' : "") + ">" + texto + "</span></label>";
  };
  var interruptor = function (id, texto, ayuda) {
    return '<label class="interruptor" for="' + id + '"><span><strong>' + texto + "</strong>" + (ayuda ? "<small>" + ayuda + "</small>" : "") + "</span>" +
      '<input type="checkbox" role="switch" id="' + id + '"><span class="pista-interruptor" aria-hidden="true"></span></label>';
  };
  panel.innerHTML =
    '<div class="panel-acc-cabecera"><h2 id="acc-titulo">' + T.accesibilidad + "</h2>" +
      '<button type="button" class="panel-acc-cerrar" id="acc-cerrar" aria-label="' + T.cerrarPanel + '">×</button></div>' +
    (soporta
      ? '<button type="button" class="boton verde acc-escuchar" data-escuchar="main" data-texto="escucharPagina" data-texto-parar="pararLectura">' +
        '<span class="icono-escuchar">' + ICONO_ALTAVOZ + '</span><span class="texto-escuchar">' + T.escucharPagina + "</span></button>"
      : '<p class="acc-nota">' + T.sinSoporte + "</p>") +
    "<fieldset><legend>" + T.tamano + '</legend><div class="opciones">' +
      radio("acc-tam", "normal", T.normal, "muestra-normal") + radio("acc-tam", "grande", T.grande, "muestra-grande") + radio("acc-tam", "muy-grande", T.muyGrande, "muestra-muy-grande") +
    "</div></fieldset>" +
    (soporta ? "<fieldset><legend>" + T.velocidad + '</legend><div class="opciones">' +
      radio("acc-vel", "0.8", T.lenta) + radio("acc-vel", "1", T.normal) + radio("acc-vel", "1.2", T.rapida) +
    "</div></fieldset>" : "") +
    interruptor("acc-contraste", T.contraste, T.contrasteAyuda) +
    interruptor("acc-espaciado", T.espaciado, T.espaciadoAyuda) +
    (soporta ? interruptor("acc-asistente", T.leerAsistente, T.leerAsistenteAyuda) : "") +
    '<div class="panel-acc-pie"><button type="button" class="boton claro" id="acc-restablecer">' + T.restablecer + "</button>" +
    '<a href="accesibilidad.html">' + T.ayuda + "</a></div>";

  // Textos de los botones de la cabecera
  var be = $("boton-escuchar"); if (be) be.title = T.tituloEscuchar;
  var ta = botonAjustes.querySelector(".texto-acc"); if (ta) ta.textContent = T.accesibilidad;

  function pintarPanel() {
    panel.querySelectorAll('[name="acc-tam"]').forEach(function (r) { r.checked = r.value === prefs.tam; });
    panel.querySelectorAll('[name="acc-vel"]').forEach(function (r) { r.checked = Number(r.value) === Number(prefs.velocidad || 1); });
    $("acc-contraste").checked = !!prefs.contraste;
    $("acc-espaciado").checked = !!prefs.espaciado;
    if ($("acc-asistente")) $("acc-asistente").checked = !!prefs.leerAsistente;
  }
  pintarPanel();

  panel.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "acc-tam") prefs.tam = t.value;
    else if (t.name === "acc-vel") { prefs.velocidad = Number(t.value); }
    else if (t.id === "acc-contraste") prefs.contraste = t.checked;
    else if (t.id === "acc-espaciado") prefs.espaciado = t.checked;
    else if (t.id === "acc-asistente") prefs.leerAsistente = t.checked;
    CN.guardarPreferencias();
  });
  $("acc-restablecer").addEventListener("click", function () {
    CN.guardarPreferencias({ tam: "normal", contraste: false, espaciado: false, velocidad: 1, leerAsistente: false });
    prefs = CN.preferencias;
    pintarPanel();
  });

  function abrirPanel() {
    panel.hidden = false;
    html.classList.add("acc-abierto");
    botonAjustes.setAttribute("aria-expanded", "true");
    var primero = panel.querySelector(".acc-escuchar, input:checked, input");
    setTimeout(function () { (primero || panel).focus(); }, 30);
  }
  function cerrarPanel(devolverFoco) {
    if (panel.hidden) return;
    panel.hidden = true;
    html.classList.remove("acc-abierto");
    botonAjustes.setAttribute("aria-expanded", "false");
    if (devolverFoco) botonAjustes.focus();
  }
  botonAjustes.addEventListener("click", function () { panel.hidden ? abrirPanel() : cerrarPanel(true); });
  $("acc-cerrar").addEventListener("click", function () { cerrarPanel(true); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) cerrarPanel(true); });
  document.addEventListener("click", function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !botonAjustes.contains(e.target)) cerrarPanel(false);
  });
  // Si el foco sale del panel con el tabulador, se cierra
  panel.addEventListener("focusout", function (e) {
    if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== botonAjustes) cerrarPanel(false);
  });

  // Sin voz disponible: se ocultan los botones «Escuchar»
  if (!soporta) html.classList.add("sin-voz");
  pintarBotones();

  CN.lector = { empezar: empezar, parar: parar, pausa: pausa, soporta: soporta, textos: TEXTOS };
})();
