// Página de inicio: portada, temáticas, filtros, buscador y guías.
// Los textos salen de datos/sitio.json y datos/temas.json (no hace falta tocar este archivo).
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = CN.esc;
  var CATS = [], ARTS = [];
  var estado = { categoria: "todas", texto: "" };
  var normal = function (t) { return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var cat = function (id) { return CATS.find(function (c) { return c.id === id; }) || { nombre: id, icono: "•" }; };

  function portada(s) {
    var p = s.portada || {};
    var t = esc(p.titulo || s.lema);
    // La parte tras la primera coma se pinta en verde
    var i = t.indexOf(",");
    $("#hero-titulo").innerHTML = i > 0 ? t.slice(0, i + 1) + " <em>" + t.slice(i + 1).trim() + "</em>" : t;
    $("#hero-texto").textContent = p.texto || s.descripcion;
    if (p.imagen) {
      var f = $("#hero-foto");
      f.style.backgroundImage = "url('" + p.imagen + "')";
      f.setAttribute("aria-label", p.imagenAlt || "");
    }
    if (p.tarjeta) { $("#cristal-titulo").textContent = p.tarjeta.titulo; $("#cristal-texto").textContent = p.tarjeta.texto; }
    var mail = s.contacto && s.contacto.email;
    if (mail) { var a = $("#hero-email"); a.href = "mailto:" + mail; a.textContent = mail; }
  }

  function tarjeta(a, retraso) {
    var c = cat(a.categoria);
    return '<article class="articulo" style="animation-delay:' + retraso + 'ms">' +
      '<span class="etiqueta">' + c.icono + " " + esc(c.nombre) + "</span>" +
      "<h3>" + esc(a.titulo) + "</h3><p>" + esc(a.resumen) + "</p>" +
      '<button class="boton" data-leer="' + esc(a.id) + '">Leer guía</button></article>';
  }

  function pintarTemas() {
    $("#rejilla-temas").innerHTML = CATS.map(function (c) {
      var n = ARTS.filter(function (a) { return a.categoria === c.id; }).length;
      return '<button class="tema" data-tema="' + esc(c.id) + '"><span class="icono" aria-hidden="true">' + c.icono + "</span>" +
        "<strong>" + esc(c.nombre) + "</strong><small>" + esc(c.descripcion || "") + "</small>" +
        '<span class="cuenta">' + n + (n === 1 ? " guía" : " guías") + "</span></button>";
    }).join("");
  }

  function pintarFiltros() {
    $("#filtros").innerHTML = [{ id: "todas", nombre: "Todas", icono: "✦" }].concat(CATS).map(function (c) {
      return '<button class="filtro" data-filtro="' + esc(c.id) + '" aria-pressed="' + (estado.categoria === c.id) + '">' + c.icono + " " + esc(c.nombre) + "</button>";
    }).join("");
  }

  function pintarArticulos() {
    var q = normal(estado.texto.trim());
    var lista = ARTS.filter(function (a) {
      return (estado.categoria === "todas" || a.categoria === estado.categoria) &&
        (!q || normal(a.titulo + " " + a.resumen + " " + a.contenido).indexOf(q) !== -1);
    });
    $("#rejilla-articulos").innerHTML = lista.length
      ? lista.map(function (a, i) { return tarjeta(a, i * 50); }).join("")
      : '<p class="sin-resultados">No hemos encontrado guías con esa búsqueda. Prueba con otras palabras o elige «Todas».</p>';
    $("#resultado-busqueda").textContent = lista.length + (lista.length === 1 ? " guía encontrada" : " guías encontradas");
  }

  function pintarDestacados() {
    var d = ARTS.filter(function (a) { return a.destacado; }).slice(0, 3);
    if (!d.length) { $("#destacados").hidden = true; return; }
    $("#rejilla-destacados").innerHTML = d.map(function (a, i) { return tarjeta(a, i * 80); }).join("");
  }

  function abrir(id) {
    var a = ARTS.find(function (x) { return x.id === id; }); if (!a) return;
    var c = cat(a.categoria);
    $("#dialogo-etiqueta").textContent = c.icono + " " + c.nombre;
    $("#dialogo-titulo").textContent = a.titulo;
    $("#dialogo-cuerpo").innerHTML = CN.formatear(a.contenido);
    var d = $("#dialogo");
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }

  function elegir(id, desplazar) {
    estado.categoria = id; pintarFiltros(); pintarArticulos();
    if (desplazar) document.getElementById("guias").scrollIntoView({ behavior: "smooth" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    CN.cargar("sitio").then(portada).catch(function () {});
    CN.cargar("temas").then(function (d) {
      CATS = d.categorias || []; ARTS = d.articulos || [];
      pintarTemas(); pintarFiltros(); pintarArticulos(); pintarDestacados();
    }).catch(function () { CN.errorCarga($("#rejilla-temas")); $("#destacados").hidden = true; });

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-tema],[data-filtro],[data-leer]");
      if (!t) return;
      if (t.dataset.tema) elegir(t.dataset.tema, true);
      else if (t.dataset.filtro) elegir(t.dataset.filtro, false);
      else abrir(t.dataset.leer);
    });
    var tm;
    $("#busqueda").addEventListener("input", function (e) {
      clearTimeout(tm); tm = setTimeout(function () { estado.texto = e.target.value; pintarArticulos(); }, 150);
    });
    var d = $("#dialogo");
    $("#cerrar-dialogo").addEventListener("click", function () { d.close ? d.close() : d.removeAttribute("open"); });
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  });
})();
