/*
 * SERVICE WORKER de Cuidados Navarra (lo que hace que la web funcione como app y sin conexión).
 *
 * Cómo funciona:
 *  - Siempre intenta traer de internet la versión más reciente de cada página, guía o dato
 *    (así lo que cambies en datos/*.json aparece en la app en cuanto se abre con conexión).
 *  - Cada cosa que descarga se guarda en el móvil. Si no hay conexión (o internet va muy lento),
 *    muestra la última copia guardada. Si una página nunca se abrió, muestra offline.html.
 *  - No hace falta tocar este archivo al cambiar contenidos. Si añades una página nueva y quieres que
 *    esté disponible sin conexión desde el primer día, añádela a la lista ESENCIALES y sube VERSION.
 */
var VERSION = "v1";
var CACHE = "cuidados-" + VERSION;
var ESPERA_MAXIMA = 6000; // ms: si internet tarda más y hay copia guardada, se usa la copia

var ESENCIALES = [
  "./", "index.html", "empresa.html", "servicios.html", "tienda.html", "accesibilidad.html",
  "terminos.html", "privacidad.html", "app.html", "offline.html",
  "css/estilos.css", "css/app.css",
  "js/comun.js", "js/inicio.js", "js/empresa.js", "js/contacto.js", "js/tienda.js", "js/legal.js",
  "js/accesibilidad.js", "js/asistente.js", "js/app.js",
  "datos/indice.json", "datos/sitio.json", "datos/temas.json", "datos/empresa.json",
  "datos/servicios.json", "datos/tienda.json", "datos/legal.json", "datos/preguntas.json",
  "fuentes/lato-400.woff2", "fuentes/lato-700.woff2", "fuentes/lato-900.woff2",
  "img/icono.svg", "img/portada.svg", "img/icono-192.png", "img/icono-180.png", "manifest.webmanifest"
];
// Archivos que solo existen si se usan los idiomas (castellano/euskera); si no están, no pasa nada
var OPCIONALES = [
  "js/idioma.js", "datos/eu/sitio.json", "datos/eu/temas.json", "datos/eu/empresa.json",
  "datos/eu/servicios.json", "datos/eu/tienda.json", "datos/eu/legal.json", "datos/eu/preguntas.json"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // Uno a uno: si falta algún archivo, el resto se guarda igualmente
    return Promise.all(ESENCIALES.concat(OPCIONALES).map(function (url) {
      return fetch(url, { cache: "no-cache" }).then(function (r) { if (r.ok) return c.put(url, r); }).catch(function () {});
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (claves) {
    return Promise.all(claves.filter(function (k) { return k.indexOf("cuidados-") === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;                       // formularios: siempre por internet
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;            // otras webs (tiendas, FormSubmit…): sin tocar

  e.respondWith(caches.open(CACHE).then(function (cache) {
    // La copia se busca sin ?lang=… ni otros parámetros, para que valga con cualquier idioma
    var guardada = cache.match(req, { ignoreSearch: true });
    var red = fetch(req, { cache: "no-cache" }).then(function (r) {
      if (r && r.ok && r.type === "basic") cache.put(url.pathname, r.clone());
      return r;
    });

    return new Promise(function (resolver) {
      var hecho = false;
      var usarCopia = function () {
        guardada.then(function (copia) {
          if (hecho) return;
          if (copia) { hecho = true; resolver(copia); }
        });
      };
      var temporizador = setTimeout(usarCopia, ESPERA_MAXIMA);
      red.then(function (r) {
        if (hecho) return;
        hecho = true; clearTimeout(temporizador); resolver(r);
      }).catch(function () {
        clearTimeout(temporizador);
        guardada.then(function (copia) {
          if (hecho) return;
          hecho = true;
          if (copia) return resolver(copia);
          if (req.mode === "navigate") {
            return resolver(cache.match("offline.html").then(function (o) {
              return o || new Response("Sin conexión", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
            }));
          }
          resolver(new Response("", { status: 504 }));
        });
      });
    });
  }));
});
