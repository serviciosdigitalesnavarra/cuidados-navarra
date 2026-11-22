/*
 * Código común a todas las páginas:
 *  - cabecera y pie (menú igual en todas las páginas: se cambia solo aquí, en MENU y PIE)
 *  - menú del móvil y botón "Texto grande"
 *  - CN.cargar("nombre"): lee datos/nombre.json (los mismos datos que usarán las apps)
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
    { titulo: "Contacto", enlaces: [["Formulario de contacto", "empresa.html#contacto"], ["Urgencias: 112", "tel:112"]] }
  ];

  var html = document.documentElement;
  try { if (localStorage.getItem("textoGrande") === "1") html.classList.add("texto-grande"); } catch (e) {}

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
  var cargar = function (nombre) {
    if (!cache[nombre]) {
      cache[nombre] = fetch("datos/" + nombre + ".json", { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error("No se pudo cargar " + nombre);
        return r.json();
      });
    }
    return cache[nombre];
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
      '<button class="menu-movil" id="menu-movil" aria-expanded="false" aria-controls="nav" aria-label="Abrir menú">☰</button>' +
      '<nav class="nav" id="nav" aria-label="Principal">' + nav +
      '<button class="boton-texto" id="boton-texto" type="button">A+ Texto</button>' +
      '<a class="boton" href="empresa.html#contacto">Contacto</a></nav>' +
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
      '<nav aria-label="Información legal"><a href="terminos.html">Términos y condiciones de uso</a><a href="privacidad.html">Privacidad y protección de datos</a><a href="privacidad.html#cookies">Cookies</a></nav></div>' +
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

    var b = document.getElementById("boton-texto");
    var pintar = function () {
      var g = html.classList.contains("texto-grande");
      b.setAttribute("aria-pressed", g);
      b.textContent = g ? "A− Texto" : "A+ Texto";
      b.title = g ? "Volver al tamaño de letra normal" : "Aumentar el tamaño de letra";
    };
    pintar();
    b.addEventListener("click", function () {
      html.classList.toggle("texto-grande");
      try { localStorage.setItem("textoGrande", html.classList.contains("texto-grande") ? "1" : "0"); } catch (e) {}
      pintar();
    });

    cargar("sitio").then(function (s) {
      var a = document.getElementById("aviso-sanitario");
      if (a && s.avisoSanitario) a.textContent = s.avisoSanitario;
    }).catch(function () {});

    // Si la página se abre con #ancla, vuelve a situarla cuando se pinten los contenidos
    if (location.hash) setTimeout(function () { var el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); }, 400);
  });

  window.CN = { esc: esc, resaltar: resaltar, plantilla: plantilla, formatear: formatear, cargar: cargar, errorCarga: errorCarga };
})();
