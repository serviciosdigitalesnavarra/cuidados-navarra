// Tienda de enlaces: productos de datos/tienda.json
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = CN.esc;
  var D = null, filtro = "todos";

  function enlace(p, prov) {
    var url = p.url || "";
    if (!url || url.indexOf("[") !== -1) return null; // enlace aún sin rellenar
    if (prov && prov.etiquetaAfiliado && /(^|\.)amazon\./.test(url.replace(/^https?:\/\//, "").split("/")[0])) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + "tag=" + encodeURIComponent(prov.etiquetaAfiliado);
    }
    return url;
  }

  function pintar() {
    var provs = {}; (D.proveedores || []).forEach(function (p) { provs[p.id] = p; });
    var lista = (D.productos || []).filter(function (p) { return filtro === "todos" || p.categoria === filtro; });
    $("#lista-productos").innerHTML = lista.length ? lista.map(function (p, i) {
      var prov = provs[p.proveedor] || { nombre: p.proveedor || "" };
      var url = enlace(p, prov);
      var img = p.imagen ? '<img src="' + esc(p.imagen) + '" alt="" loading="lazy">' : '<span aria-hidden="true">' + (p.icono || "🛒") + "</span>";
      var boton = url
        ? '<a class="boton" href="' + esc(url) + '" target="_blank" rel="sponsored noopener">Ver en ' + esc(prov.nombre) + ' <span aria-hidden="true">↗</span><span class="oculto"> (se abre en otra pestaña)</span></a>'
        : '<span class="boton" aria-disabled="true">Próximamente</span>';
      return '<article class="producto" style="animation-delay:' + i * 40 + 'ms"><div class="imagen">' + img +
        '<span class="proveedor">' + esc(prov.nombre) + "</span></div>" +
        '<div class="cuerpo"><h3>' + esc(p.titulo) + "</h3><p>" + esc(p.texto) + "</p>" +
        (p.precio ? '<span class="precio">' + esc(p.precio) + "</span>" : "") + boton + "</div></article>";
    }).join("") : '<p class="sin-resultados">No hay productos en esta categoría todavía.</p>';
  }

  function pintarFiltros() {
    $("#filtros-tienda").innerHTML = [{ id: "todos", nombre: "Todos", icono: "✦" }].concat(D.categorias || []).map(function (c) {
      return '<button class="filtro" data-cat="' + esc(c.id) + '" aria-pressed="' + (filtro === c.id) + '">' + c.icono + " " + esc(c.nombre) + "</button>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    CN.cargar("tienda").then(function (d) {
      D = d; $("#texto-aviso").textContent = d.aviso || "";
      pintarFiltros(); pintar();
    }).catch(function () { CN.errorCarga($("#lista-productos")); });
    $("#filtros-tienda").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      filtro = b.dataset.cat; pintarFiltros(); pintar();
    });
  });
})();
