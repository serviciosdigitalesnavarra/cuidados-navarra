// Lógica de la página principal: pinta temáticas, filtros, buscador y artículos
// a partir de los datos de contenido/temas.js. No hace falta tocar este archivo
// para cambiar los textos.
(function () {
  var CATS = window.CATEGORIAS || [];
  var ARTS = (window.ARTICULOS || []).map(function (a, i) { a._id = i; return a; });
  var estado = { categoria: "todas", texto: "" };

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var normal = function (t) { return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
  var cat = function (id) { return CATS.find(function (c) { return c.id === id; }) || { nombre: id, icono: "•" }; };

  function tarjeta(a, retraso) {
    var c = cat(a.categoria);
    return '<article class="articulo" style="animation-delay:' + retraso + 'ms">' +
      '<span class="etiqueta">' + c.icono + " " + esc(c.nombre) + "</span>" +
      "<h3>" + esc(a.titulo) + "</h3>" +
      "<p>" + esc(a.resumen) + "</p>" +
      '<button class="boton secundario" data-leer="' + a._id + '">Leer más</button>' +
      "</article>";
  }

  function pintarTemas() {
    $("#rejilla-temas").innerHTML = CATS.map(function (c) {
      var n = ARTS.filter(function (a) { return a.categoria === c.id; }).length;
      return '<button class="tema" data-tema="' + c.id + '">' +
        '<span class="icono" aria-hidden="true">' + c.icono + "</span>" +
        "<strong>" + esc(c.nombre) + "</strong>" +
        "<small>" + esc(c.descripcion || "") + "</small>" +
        '<span class="cuenta">' + n + (n === 1 ? " guía" : " guías") + "</span></button>";
    }).join("");
  }

  function pintarFiltros() {
    var botones = [{ id: "todas", nombre: "Todas", icono: "✦" }].concat(CATS);
    $("#filtros").innerHTML = botones.map(function (c) {
      return '<button class="filtro" data-filtro="' + c.id + '" aria-pressed="' + (estado.categoria === c.id) + '">' +
        c.icono + " " + esc(c.nombre) + "</button>";
    }).join("");
  }

  function pintarArticulos() {
    var q = normal(estado.texto.trim());
    var lista = ARTS.filter(function (a) {
      var okCat = estado.categoria === "todas" || a.categoria === estado.categoria;
      var okTxt = !q || normal(a.titulo + " " + a.resumen + " " + a.contenido).indexOf(q) !== -1;
      return okCat && okTxt;
    });
    $("#rejilla-articulos").innerHTML = lista.length
      ? lista.map(function (a, i) { return tarjeta(a, i * 60); }).join("")
      : '<p class="sin-resultados">No hemos encontrado guías con esa búsqueda. Prueba con otras palabras o elige "Todas".</p>';
    $("#resultado-busqueda").textContent = lista.length + (lista.length === 1 ? " guía encontrada" : " guías encontradas");
  }

  function pintarDestacados() {
    var d = ARTS.filter(function (a) { return a.destacado; }).slice(0, 3);
    var caja = $("#destacados");
    if (!d.length) { caja.hidden = true; return; }
    $("#rejilla-destacados").innerHTML = d.map(function (a, i) { return tarjeta(a, i * 80); }).join("");
  }

  function formatear(texto) {
    return texto.split(/\n\s*\n/).map(function (bloque) {
      var lineas = bloque.trim().split("\n");
      if (lineas.every(function (l) { return /^\s*-\s+/.test(l); })) {
        return "<ul>" + lineas.map(function (l) { return "<li>" + esc(l.replace(/^\s*-\s+/, "")) + "</li>"; }).join("") + "</ul>";
      }
      return "<p>" + esc(bloque.trim()).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }

  function abrir(id) {
    var a = ARTS[id]; if (!a) return;
    var c = cat(a.categoria);
    $("#dialogo-etiqueta").textContent = c.icono + " " + c.nombre;
    $("#dialogo-titulo").textContent = a.titulo;
    $("#dialogo-cuerpo").innerHTML = formatear(a.contenido);
    var d = $("#dialogo");
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }

  function elegirCategoria(id, desplazar) {
    estado.categoria = id;
    pintarFiltros();
    pintarArticulos();
    if (desplazar) document.getElementById("guias").scrollIntoView({ behavior: "smooth" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    pintarTemas(); pintarFiltros(); pintarArticulos(); pintarDestacados();

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-tema],[data-filtro],[data-leer]");
      if (!t) return;
      if (t.dataset.tema) elegirCategoria(t.dataset.tema, true);
      else if (t.dataset.filtro) elegirCategoria(t.dataset.filtro, false);
      else abrir(+t.dataset.leer);
    });

    var temporizador;
    $("#busqueda").addEventListener("input", function (e) {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () { estado.texto = e.target.value; pintarArticulos(); }, 150);
    });

    var d = $("#dialogo");
    $("#cerrar-dialogo").addEventListener("click", function () { d.close ? d.close() : d.removeAttribute("open"); });
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  });
})();
