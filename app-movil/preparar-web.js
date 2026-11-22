/*
 * Copia la web (carpeta de arriba) a app-movil/www.
 * La app abre siempre la web publicada (capacitor.config.json → server.url) para estar sincronizada;
 * esta copia se usa solo si el móvil no tiene conexión la primera vez (offline.html).
 */
const fs = require("fs");
const path = require("path");

const ORIGEN = path.resolve(__dirname, "..");
const DESTINO = path.join(__dirname, "www");
const COPIAR = ["index.html", "empresa.html", "servicios.html", "tienda.html", "accesibilidad.html",
  "terminos.html", "privacidad.html", "contacto.html", "app.html", "offline.html", "manifest.webmanifest",
  "css", "js", "datos", "fuentes", "img"];

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO, { recursive: true });
for (const nombre of COPIAR) {
  const de = path.join(ORIGEN, nombre);
  if (fs.existsSync(de)) fs.cpSync(de, path.join(DESTINO, nombre), { recursive: true });
}
console.log("Web copiada en " + DESTINO);
