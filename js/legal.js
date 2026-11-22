// Páginas legales: textos de datos/legal.json con los datos del titular de datos/sitio.json
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("documento-legal");
    var doc = el.getAttribute("data-doc");
    Promise.all([CN.cargar("legal"), CN.cargar("sitio")]).then(function (r) {
      var d = r[0][doc], s = r[1];
      var datos = { sitio: s, titular: s.titular || {} };
      var ids = d.secciones.map(function (sec, i) {
        return /cookie/i.test(sec.titulo) ? "cookies" : "seccion-" + (i + 1);
      });
      var pendientes = JSON.stringify(s.titular || {}).indexOf("[") !== -1;
      el.innerHTML = "<h1>" + CN.esc(d.titulo) + "</h1>" +
        '<p class="fecha">' + CN.esc(CN.t("Última actualización: {fecha}", { fecha: d.actualizado })) + "</p>" +
        (window.I18N && I18N.idioma !== I18N.base ? '<p class="nota-revision">' + CN.t("html:nota-traduccion") + "</p>" : "") +
        (pendientes ? '<p class="nota-revision" data-t="nota-revision">Los datos <span class="pendiente">[resaltados]</span> están pendientes de completar por el titular. Este texto es una plantilla adaptada a la normativa española y europea; se recomienda su revisión por un profesional jurídico.</p>' : "") +
        '<nav class="indice-legal" aria-label="Índice">' + d.secciones.map(function (sec, i) {
          return '<a href="#' + ids[i] + '">' + CN.esc(sec.titulo) + "</a>";
        }).join("") + "</nav>" +
        d.secciones.map(function (sec, i) {
          return '<section id="' + ids[i] + '"><h2>' + CN.esc(sec.titulo) + "</h2>" + CN.formatear(CN.plantilla(sec.texto, datos)) + "</section>";
        }).join("");
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    }).catch(function () { CN.errorCarga(el); });
  });
})();
