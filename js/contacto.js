// Envía el formulario de contacto sin salir de la página y muestra un aviso amable.
(function () {
  var DESTINO_AJAX = "https://formsubmit.co/ajax/serviciosdigitalesnavarra@protonmail.com"; // ← CORREO
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("formulario");
    if (!form) return;
    var aviso = document.getElementById("aviso");
    var boton = document.getElementById("enviar");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      boton.disabled = true; boton.textContent = "Enviando…";
      aviso.className = "aviso"; aviso.textContent = "";
      if (location.protocol === "file:") { form.submit(); return; } // abierto desde el ordenador: envío clásico
      fetch(DESTINO_AJAX, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json().then(function (d) { d._ok = r.ok; return d; }); })
        .then(function (d) {
          var txt = String(d.message || "");
          if (d._ok && String(d.success) !== "false") {
            form.reset();
            aviso.className = "aviso ok";
            aviso.textContent = "¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.";
          } else if (/activat/i.test(txt)) {
            aviso.className = "aviso ok";
            aviso.textContent = "Formulario pendiente de activar: se ha enviado un correo de confirmación a la dirección de destino. Tras confirmarlo, los mensajes llegarán con normalidad.";
          } else {
            throw new Error(txt);
          }
        })
        .catch(function () { aviso.className = "aviso"; aviso.textContent = ""; form.submit(); })
        .finally(function () { boton.disabled = false; boton.textContent = "Enviar mensaje"; });
    });
  });
})();
