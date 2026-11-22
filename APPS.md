# Base para las apps Android e iPhone

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
| `preguntas.json` | Asistente (chatbot) | `asistente {bienvenida, aviso, sinRespuesta, sugerencias[], ia}`, `preguntas[] {id, tema, pregunta, palabrasClave[], respuesta, enlaces[], urgente?, oculta?}` |

Convenciones de texto (igual que en la web):
- Párrafos separados por `\n\n`; líneas que empiezan por `- ` son listas.
- `{{titular.nif}}`, `{{sitio.nombre}}`… se sustituyen con los valores de `sitio.json`.
- Lo que va entre `[corchetes]` es un dato pendiente de rellenar.
- Los `id` son estables: úsalos como claves (favoritos, enlaces profundos, notificaciones).

## Asistente (chatbot)

La web incluye un asistente de preguntas frecuentes (`js/asistente.js`) que lee `preguntas.json`.
Las apps pueden reutilizar los mismos datos y la misma lógica de búsqueda:

1. Normalizar el texto (minúsculas, sin tildes, solo letras y números) y quitar plurales sencillos.
2. Por cada pregunta, sumar 3 puntos por cada palabra clave que aparezca (frases de varias palabras: 3 + nº de palabras)
   y 1 punto por cada palabra útil compartida con el enunciado. `urgente: true` suma 100 si coincide alguna clave.
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
