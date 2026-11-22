# Base para las apps Android e iPhone

## Estado actual

1. **App instalable desde la web (PWA)**, ya incluida: `manifest.webmanifest`, `sw.js` (funciona sin conexión y
   siempre trae lo más reciente), `offline.html` y la página `app.html` con las instrucciones para Android, iPhone y
   ordenador (textos en castellano y euskera en `js/app.js`). Al cambiar contenidos no hay que tocar nada.
2. **Apps para Google Play y App Store** en `app-movil/` (Capacitor): abren la web publicada, así que están siempre
   sincronizadas. La app Android se compila sola en GitHub (Actions › «App Android»). Pasos para publicar:
   `app-movil/GUIA-TIENDAS.md`.

Lo que sigue describe los datos por si en el futuro se hace una app nativa que los lea directamente.

La web es la «raíz»: las apps deben leer los mismos datos JSON publicados, para que web y apps
muestren siempre lo mismo sin duplicar contenidos.

## Origen de los datos

```
https://serviciosdigitalesnavarra.github.io/cuidados-navarra/datos/indice.json
```

`indice.json` lista cada archivo con su `version`. Flujo recomendado en la app:

1. Al abrir, descargar `indice.json`.
2. Comparar cada `version` con la guardada en el móvil; descargar solo los archivos que cambiaron.
3. Guardar en caché local para funcionar sin conexión.

## Modelo de datos

| Archivo | Contenido | Campos clave |
|---|---|---|
| `sitio.json` | Marca, contacto, titular, portada | `nombre`, `contacto.email`, `titular.*`, `portada.*`, `avisoSanitario` |
| `temas.json` | Guías | `categorias[] {id, nombre, icono, descripcion}`, `articulos[] {id, categoria, titulo, resumen, contenido, destacado}` |
| `empresa.json` | Nuestra empresa | `quienesSomos {titulo, parrafos[], datos[]}`, `valores[]`, `decalogo[]` |
| `servicios.json` | Servicios | `servicios[] {id, icono, titulo, resumen, detalles[], precio}` |
| `tienda.json` | Tienda de enlaces | `proveedores[] {id, nombre, etiquetaAfiliado}`, `categorias[]`, `productos[] {id, categoria, proveedor, titulo, texto, url, imagen?, icono, precio}` |
| `legal.json` | Textos legales | `terminos` y `privacidad`, cada uno con `secciones[] {titulo, texto}` |
| `preguntas.json` | Asistente (chatbot) | `asistente {bienvenida, aviso, sinRespuesta, sugerencias[], ia}`, `preguntas[] {id, tema, pregunta, palabrasClave[], respuesta \| guia \| servicio, enlaces[], urgente?, oculta?}` |

Convenciones de texto (igual que en la web):
- Párrafos separados por `\n\n`; líneas que empiezan por `- ` son listas.
- `{{titular.nif}}`, `{{sitio.nombre}}`… se sustituyen con los valores de `sitio.json`.
- Lo que va entre `[corchetes]` es un dato pendiente de rellenar.
- Los `id` son estables: úsalos como claves (favoritos, enlaces profundos, notificaciones).

## Asistente (chatbot)

La web incluye un asistente de preguntas frecuentes (`js/asistente.js`). Se actualiza solo: al abrirse lee
`preguntas.json`, `temas.json`, `servicios.json`, `tienda.json` y `sitio.json` y construye la lista de respuestas:

- Preguntas de `preguntas.json` con `respuesta` propia; las que tienen `guia` o `servicio` toman el texto actual de esa guía o servicio.
- Una respuesta automática por cada guía, servicio y producto que no tenga ya una pregunta a medida
  (palabras clave = palabras del título, más `palabrasClave` opcionales en el propio elemento).
- `{{contacto.horario}}`, `{{lista.servicios}}`, etc. se sustituyen con los datos de `sitio.json` y los demás archivos.

Las apps pueden reutilizar los mismos datos y la misma lógica de búsqueda:

1. Normalizar el texto (minúsculas, sin tildes, solo letras y números) y quitar plurales sencillos.
2. Por cada pregunta, sumar 3 puntos por cada palabra clave que aparezca (frases de varias palabras: 3 + nº de palabras)
   2 puntos por cada palabra del título (respuestas automáticas) y 1 punto por cada palabra útil compartida con el enunciado o el resumen. `urgente: true` suma 100 si coincide alguna clave.
3. Responder con la mejor si tiene 3 puntos o más; si no, proponer las 3 más parecidas, guías de `temas.json` y contacto.

Los enlaces del tipo `index.html#guia-<id>` apuntan a una guía de `temas.json`: en la app conviene abrir esa guía en pantalla.

### Paso futuro a inteligencia artificial

`preguntas.json` → `asistente.ia` tiene `activa` y `endpoint`. Al activarlo, la web envía por `POST` a ese endpoint
`{ "pregunta": "...", "historial": [{ "rol": "persona|asistente", "texto": "..." }], "pagina": "/..." }` y espera
`{ "respuesta": "texto con el mismo formato", "enlaces": [{ "texto": "...", "url": "..." }] }`.
Si el servidor falla o tarda más de 15 segundos, responde con las preguntas frecuentes. Las urgencias se responden
siempre con el texto revisado, sin pasar por la IA.

El endpoint sería un pequeño servidor (por ejemplo, una función en Cloudflare Workers o Netlify) que guarda la clave de API
en secreto y usa como contexto `preguntas.json`, `temas.json` y `servicios.json`. Antes de activarlo hay que actualizar
la política de privacidad (los mensajes pasarían a enviarse a un tercero) y avisar en el propio asistente.

## Idiomas (castellano y euskera)

`indice.json` → `idiomas` lista los idiomas disponibles y `traducciones` las versiones de cada archivo traducido
(`datos/eu/temas.json`, etc.). Una traducción contiene **solo los textos**; la app debe descargar el archivo en castellano
y el traducido, y **unirlos** con las mismas reglas que la web (`I18N.fusionar` en `js/idioma.js`):

1. Objetos: campo a campo; lo que falte en la traducción se queda en castellano. Se ignoran los campos que empiezan por `_`.
2. Listas de objetos con `id`: se emparejan por `id` (un elemento sin traducir se muestra en castellano).
3. Otras listas de objetos: por posición. Listas de textos: la traducción sustituye a la original.
4. `palabrasClave`: se suman las de los dos idiomas.

Idioma inicial: el elegido por la persona; si no hay, el del sistema si es `eu`, y si no, `es`. Los textos fijos de la
interfaz de la app son propios de cada app, pero pueden tomarse como referencia los de `js/idioma.js` y
`js/accesibilidad.js` (`TEXTOS.eu`). Para la lectura en voz alta, usar el código `eu-ES` o `es-ES`.

## Identidad visual

- Verde `#47C269` (marca), verde texto `#237A3B`, negro `#000000`, blanco `#FFFFFF`, fondo `#EAF6EC`.
- Tipografía Lato (400, 700, 900), incluida en `fuentes/`.
- Tarjetas con radio 18–32 px, botones negros con radio 12 px, campos grises `#F4F6F7` sin borde.
- Iconos de app en `img/icono-512.png` y `img/icono.svg`.

## Recomendaciones

- Tecnología multiplataforma (Flutter o React Native) permite una sola base de código para Android e iOS.
- Si más adelante el equipo necesita editar contenidos sin tocar JSON, estos archivos pueden migrarse
  a un CMS o a una base de datos (Firebase, Supabase) manteniendo la misma estructura.
- Para el formulario de contacto en la app se puede reutilizar el endpoint de FormSubmit.
- Las apps deben enlazar a las mismas páginas legales o mostrar `legal.json`, y en las tiendas de apps
  hay que declarar la URL de privacidad: `.../privacidad.html`.
