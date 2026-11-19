// Botón "A+" para agrandar el texto. Recuerda la preferencia del visitante.
(function () {
  var html = document.documentElement;
  try { if (localStorage.getItem("textoGrande") === "1") html.classList.add("texto-grande"); } catch (e) {}
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("boton-texto");
    if (!b) return;
    var pintar = function () {
      var g = html.classList.contains("texto-grande");
      b.setAttribute("aria-pressed", g);
      b.textContent = g ? "A− Texto normal" : "A+ Texto grande";
    };
    pintar();
    b.addEventListener("click", function () {
      html.classList.toggle("texto-grande");
      try { localStorage.setItem("textoGrande", html.classList.contains("texto-grande") ? "1" : "0"); } catch (e) {}
      pintar();
    });
    var anio = document.getElementById("anio");
    if (anio) anio.textContent = new Date().getFullYear();
  });
})();
