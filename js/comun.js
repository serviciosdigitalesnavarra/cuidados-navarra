/*
 * Código común a todas las páginas:
 *  - cabecera y pie (menú igual en todas las páginas: se cambia solo aquí, en MENU y PIE)
 *  - menú del móvil y botones «Escuchar» y «Accesibilidad» (su lógica está en js/accesibilidad.js)
 *  - CN.cargar("nombre"): lee datos/nombre.json (los mismos datos que usarán las apps) y, en euskera, su traducción
 *  - CN.t("texto"): traduce un texto fijo (diccionario en js/idioma.js)
 *  - utilidades para escribir textos con seguridad
 */
(function () {
  var MENU = [
    { id: "inicio",    texto: "Inicio",           url: "index.html" },
    { id: "empresa",   texto: "Nuestra empresa",  url: "empresa.html" },
    { id: "servicios", texto: "Nuestros servicios", url: "servicios.html" },
    { id: "tienda",    texto: "Tienda",           url: "tienda.html" },
    { id: "guias",     texto: "Guías",            url: "index.html#guias" }
  ];
  var PIE = [
    { titulo: "Explorar", enlaces: [["Inicio", "index.html"], ["Temáticas", "index.html#temas"], ["Guías", "index.html#guias"], ["Tienda", "tienda.html"]] },
    { titulo: "Nuestra empresa", enlaces: [["Quiénes somos", "empresa.html#quienes-somos"], ["Nuestros valores", "empresa.html#valores"], ["Decálogo", "empresa.html#decalogo"], ["Nuestros servicios", "servicios.html"]] },
    { titulo: "Contacto", enlaces: [["Formulario de contacto", "empresa.html#contacto"], ["Urgencias: 112", "tel:112"], ["Accesibilidad", "accesibilidad.html"]] }
  ];

  var html = document.documentElement;

  // Preferencias de accesibilidad (se guardan solo en este navegador)
  var POR_DEFECTO = { tam: "normal", contraste: false, espaciado: false, velocidad: 1, leerAsistente: false };
  var preferencias = {};
  try { preferencias = JSON.parse(localStorage.getItem("accesibilidad") || "null") || null; } catch (e) { preferencias = null; }
  if (!preferencias) {
    preferencias = {};
    try { if (localStorage.getItem("textoGrande") === "1") preferencias.tam = "grande"; } catch (e) {} // ajuste antiguo «A+ Texto»
    // Si el dispositivo pide más contraste, se activa de inicio
    if (window.matchMedia && matchMedia("(prefers-contrast: more)").matches) preferencias.contraste = true;
  }
  for (var k in POR_DEFECTO) if (!(k in preferencias)) preferencias[k] = POR_DEFECTO[k];
  function aplicarPreferencias() {
    var p = preferencias;
    html.classList.toggle("texto-grande", p.tam === "grande");
    html.classList.toggle("texto-muy-grande", p.tam === "muy-grande");
    html.classList.toggle("alto-contraste", !!p.contraste);
    html.classList.toggle("espaciado", !!p.espaciado);
  }
  function guardarPreferencias(nuevas) {
    if (nuevas) for (var k in nuevas) preferencias[k] = nuevas[k];
    aplicarPreferencias();
    try { localStorage.setItem("accesibilidad", JSON.stringify(preferencias)); } catch (e) {}
  }
  aplicarPreferencias();

  var esc = function (t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  // Resalta en amarillo lo que esté [entre corchetes] (datos pendientes de rellenar)
  var resaltar = function (t) { return esc(t).replace(/\[([^\]]+)\]/g, '<span class="pendiente">[$1]</span>'); };
  // Convierte enlaces http(s) en enlaces pulsables (ya escapados)
  var enlazar = function (t) { return t.replace(/(https?:\/\/[^\s<]+[^\s<.,;:)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>'); };
  // Sustituye {{titular.nif}}, {{sitio.nombre}}, etc.
  var plantilla = function (t, datos) {
    return String(t).replace(/\{\{\s*([\w.]+)\s*\}\}/g, function (m, ruta) {
      var v = ruta.split(".").reduce(function (o, k) { return o && o[k]; }, datos);
      return v == null ? m : v;
    });
  };
  // Texto con párrafos (línea en blanco) y listas (líneas que empiezan por "- ")
  var formatear = function (texto) {
    return String(texto).split(/\n\s*\n/).map(function (bloque) {
      var lineas = bloque.trim().split("\n");
      if (lineas.every(function (l) { return /^\s*-\s+/.test(l); })) {
        return "<ul>" + lineas.map(function (l) { return "<li>" + enlazar(resaltar(l.replace(/^\s*-\s+/, ""))) + "</li>"; }).join("") + "</ul>";
      }
      return "<p>" + enlazar(resaltar(bloque.trim())).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  };

  var cache = {};
  var leerJSON = function (ruta) {
    return fetch(ruta, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("No se pudo cargar " + ruta);
      return r.json();
    });
  };
  // En euskera se une datos/nombre.json con su traducción datos/eu/nombre.json (ver js/idioma.js)
  var cargar = function (nombre) {
    if (!cache[nombre]) {
      cache[nombre] = leerJSON("datos/" + nombre + ".json").then(function (base) {
        var ruta = window.I18N && I18N.rutaDatos(nombre);
        if (!ruta) return base;
        return leerJSON(ruta).then(function (tr) { return I18N.fusionar(base, tr); }, function () { return base; });
      });
    }
    return cache[nombre];
  };
  var t = window.I18N ? I18N.t : function (texto, datos) {
    return datos ? String(texto).replace(/\{(\w+)\}/g, function (m, k) { return datos[k] == null ? m : datos[k]; }) : texto;
  };
  var errorCarga = function (el) {
    if (!el) return;
    el.innerHTML = '<p class="sin-resultados">No se han podido cargar los contenidos. ' +
      (location.protocol === "file:" ? "Si has abierto el archivo desde tu ordenador, consulta el apartado «Ver la web en tu ordenador» del archivo LEEME.md." : "Recarga la página en unos segundos.") + "</p>";
  };

  function cabecera(pagina) {
    var nav = MENU.map(function (m) {
      return '<a href="' + m.url + '"' + (m.id === pagina ? ' aria-current="page"' : "") + ">" + m.texto + "</a>";
    }).join("");
    return '<a class="saltar" href="#contenido">Saltar al contenido</a>' +
      '<header class="cabecera"><div class="contenedor"><div class="barra" style="position:relative">' +
      '<a class="logo" href="index.html" aria-label="Cuidados Navarra, inicio">Cuidados <span>Navarra</span></a>' +
      (window.I18N ? I18N.selector() : "") +
      '<button class="menu-movil" id="menu-movil" aria-expanded="false" aria-controls="nav" aria-label="Abrir menú">☰</button>' +
      '<nav class="nav" id="nav" aria-label="Principal">' + nav +
      '<a class="boton" href="empresa.html#contacto">Contacto</a></nav>' +
      '<div class="herramientas-acc">' +
        '<button type="button" class="boton-acc boton-escuchar" id="boton-escuchar" data-escuchar="main" title="Leer en voz alta esta página">' +
          '<span class="icono-escuchar"></span><span class="texto-escuchar">Escuchar</span></button>' +
        '<button type="button" class="boton-acc" id="boton-ajustes" aria-expanded="false" aria-controls="panel-acc">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="4.5" r="1.8" fill="currentColor"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3 6M12 14.5l3 6"/></svg>' +
          '<span class="texto-acc">Accesibilidad</span></button>' +
      "</div>" +
      '<div class="panel-acc" id="panel-acc" role="dialog" aria-modal="false" aria-labelledby="acc-titulo" tabindex="-1" hidden></div>' +
      "</div></div></header>" +
      '<span class="deco d1" aria-hidden="true"></span><span class="deco d2" aria-hidden="true"></span>';
  }

  function pie() {
    var cols = PIE.map(function (c) {
      return "<div><h3>" + c.titulo + "</h3><ul>" + c.enlaces.map(function (e) {
        return '<li><a href="' + e[1] + '">' + e[0] + "</a></li>";
      }).join("") + "</ul></div>";
    }).join("");
    return '<footer class="pie"><div class="contenedor"><div class="caja">' +
      '<div class="pie-rejilla"><div class="marca"><a class="logo" href="index.html">Cuidados <span>Navarra</span></a>' +
      '<p id="aviso-sanitario">La información de esta web es orientativa y no sustituye la consulta con profesionales sanitarios. En caso de urgencia, llama al 112.</p></div>' +
      cols + "</div>" +
      '<div class="pie-legal"><span>© ' + new Date().getFullYear() + ' Cuidados Navarra</span>' +
      '<nav aria-label="Información legal"><a href="terminos.html">Términos y condiciones de uso</a><a href="privacidad.html">Privacidad y protección de datos</a><a href="privacidad.html#cookies">Cookies</a><a href="accesibilidad.html">Accesibilidad</a></nav></div>' +
      "</div></div></footer>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var pagina = document.body.getAttribute("data-pagina");
    document.body.insertAdjacentHTML("afterbegin", cabecera(pagina));
    document.body.insertAdjacentHTML("beforeend", pie());

    var nav = document.getElementById("nav"), bm = document.getElementById("menu-movil");
    bm.addEventListener("click", function () {
      var abierto = nav.classList.toggle("abierto");
      bm.setAttribute("aria-expanded", abierto);
      bm.textContent = abierto ? "✕" : "☰";
      bm.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("abierto")) bm.click();
    });

    // «Saltar al contenido» lleva el foco al contenido principal también en Safari
    var main = document.getElementById("contenido");
    if (main && !main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");

    // Lectura en voz alta y panel de accesibilidad
    var sac = document.createElement("script");
    sac.src = "js/accesibilidad.js";
    document.body.appendChild(sac);

    cargar("sitio").then(function (s) {
      var a = document.getElementById("aviso-sanitario");
      if (a && s.avisoSanitario) a.textContent = s.avisoSanitario;
    }).catch(function () {});

    // Asistente de preguntas frecuentes (chatbot): sus textos están en datos/preguntas.json
    var sa = document.createElement("script");
    sa.src = "js/asistente.js"; sa.defer = true;
    document.body.appendChild(sa);

    // Si la página se abre con #ancla, vuelve a situarla cuando se pinten los contenidos
    if (location.hash && location.hash.indexOf("#guia-") !== 0) setTimeout(function () { var el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }, 400);
  });

  window.CN = { t: t, preferencias: preferencias, guardarPreferencias: guardarPreferencias, esc: esc, resaltar: resaltar, plantilla: plantilla, formatear: formatear, cargar: cargar, errorCarga: errorCarga };
})();
