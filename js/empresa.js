// Nuestra empresa: textos de datos/empresa.json
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var esc = CN.esc, res = CN.resaltar;
  document.addEventListener("DOMContentLoaded", function () {
    CN.cargar("empresa").then(function (d) {
      var q = d.quienesSomos || {};
      $("#qs-titulo").textContent = q.titulo || "Quiénes somos";
      $("#qs-texto").innerHTML = (q.parrafos || []).map(function (p) { return "<p>" + res(p) + "</p>"; }).join("");
      $("#qs-cifras").innerHTML = (q.datos || []).map(function (c) {
        return '<div class="cifra"><strong>' + res(c.cifra) + "</strong><span>" + esc(c.texto) + "</span></div>";
      }).join("");
      $("#lista-valores").innerHTML = (d.valores || []).map(function (v, i) {
        return '<article class="valor" style="animation:subir .5s ease both ' + i * 60 + 'ms"><div class="icono" aria-hidden="true">' + v.icono + "</div><h3>" + esc(v.titulo) + "</h3><p>" + res(v.texto) + "</p></article>";
      }).join("");
      $("#lista-decalogo").innerHTML = (d.decalogo || []).map(function (t) { return "<li>" + res(t) + "</li>"; }).join("");
    }).catch(function () { CN.errorCarga($("#qs-texto")); });

    CN.cargar("sitio").then(function (s) {
      var t = s.titular || {};
      if (t.nombre && t.nombre.indexOf("[") !== 0) $("#resp-nombre").textContent = t.nombre;
      var mail = s.contacto && s.contacto.email;
      if (mail) { var a = $("#email-contacto"); a.href = "mailto:" + mail; a.textContent = mail; }
    }).catch(function () {});
  });
})();
