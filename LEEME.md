# Cuidados Navarra · Web de cuidados para mayores y dependientes

Web estática (HTML, CSS y JavaScript), publicada con GitHub Pages en
https://serviciosdigitalesnavarra.github.io/cuidados-navarra/

Todos los textos están en archivos de datos **JSON** dentro de `datos/`. La web los lee al abrirse,
y las futuras apps Android e iPhone leerán **los mismos archivos**, así que todo queda sincronizado:
cambias un texto una vez y se actualiza en la web y en las apps.

## Estructura

```
index.html            Inicio: portada, guías destacadas, temáticas y buscador de guías
empresa.html          Nuestra empresa: Quiénes somos, Valores, Decálogo y Formulario de contacto
servicios.html        Nuestros servicios
tienda.html           Tienda de enlaces (Amazon, Shopify y otros proveedores)
terminos.html         Términos y condiciones de uso (aviso legal)
privacidad.html       Privacidad, protección de datos y cookies
contacto.html         Redirige al formulario de empresa.html#contacto

datos/                ← AQUÍ se editan todos los contenidos
  sitio.json          Nombre, correo, DATOS DEL TITULAR (NIF, domicilio…) y textos de portada
  temas.json          Temáticas (categorias) y guías (articulos)
  empresa.json        Quiénes somos, valores y decálogo
  servicios.json      Servicios
  tienda.json         Proveedores, categorías y productos de la tienda
  legal.json          Textos legales
  preguntas.json      Preguntas y respuestas del asistente (chatbot)
  indice.json         Índice y versiones de los datos (para las apps)

css/estilos.css       Estilos. Colores al principio del archivo (verde #47C269, negro, blanco)
js/                   Lógica de cada página (no hace falta tocarla para cambiar textos)
fuentes/              Tipografía Lato, alojada en la propia web (sin conexiones a Google)
img/                  Imagen de portada e iconos
```

## Primeros pasos obligatorios

1. **Datos del titular**: abre `datos/sitio.json` y rellena todo lo que esté entre `[corchetes]` dentro de
   `titular` (nombre o razón social, NIF/CIF, domicilio, teléfono, registro mercantil, DPD).
   Se rellenan solos en Términos y condiciones y en Privacidad. Mientras queden corchetes, se ven resaltados en amarillo.
2. **Revisión legal**: los textos legales son una plantilla adaptada a LSSI-CE, RGPD, LOPDGDD y la Ley
   General para la Defensa de los Consumidores y Usuarios. Conviene que los revise un profesional jurídico.
3. **Quiénes somos y servicios**: sustituye los textos y precios entre corchetes en `empresa.json` y `servicios.json`.

## Cómo editar contenidos (JSON)

JSON es texto con un formato estricto. Reglas básicas:
- Los textos van entre comillas dobles `"..."`.
- Entre elementos de una lista va una coma, pero **no** después del último.
- Para un salto de párrafo dentro de un texto escribe `\n\n`; para una línea de lista empieza por `- `.
- Si algo deja de verse, pega el archivo en https://jsonlint.com para localizar el error.

Ejemplos:
- **Añadir una guía**: en `temas.json`, copia un bloque `{ ... }` de `articulos`, cambia su `id` (por ejemplo `art-013`) y sus textos. `categoria` debe coincidir con el `id` de una temática. `destacado: true` la muestra en portada (máximo 3).
- **Añadir un producto a la tienda**: en `tienda.json`, copia un bloque de `productos`. `proveedor` es `amazon`, `shopify` u `otros` (o uno nuevo que añadas en `proveedores`). Puedes poner `imagen` con la dirección de una foto; si no, se muestra el `icono`.
- **ID de afiliado de Amazon**: escríbelo en `proveedores` → `amazon` → `etiquetaAfiliado` (por ejemplo `"cuidados-21"`) y se añadirá solo a todos los enlaces de Amazon.
- Un enlace con `[corchetes]` aparece como «Próximamente» hasta que pongas la dirección real.

## Asistente de preguntas frecuentes (chatbot)

En todas las páginas aparece abajo a la derecha el botón **«¿Dudas?»**. Funciona sin servidor y sin coste, y lo
que escribe la gente **no se envía ni se guarda** en ningún sitio.

**Se actualiza solo.** Cada vez que alguien lo abre, lee los contenidos publicados en ese momento:
- Cada **guía** de `temas.json` se convierte en una respuesta (con su texto actual y un botón «Abrir la guía completa»).
- Cada **servicio** de `servicios.json` y cada **producto** de `tienda.json`, igual.
- El **horario**, el **correo** y la **lista de servicios** salen de `sitio.json` y `servicios.json`.

Es decir: publicas una guía, un servicio o un producto nuevo, o cambias uno existente, y el asistente ya lo sabe
(GitHub Pages tarda 1 o 2 minutos en publicar los cambios). No hace falta tocar `preguntas.json`.
Si quieres que una guía, servicio o producto se encuentre con más palabras, añádele en su propio archivo
`"palabrasClave": ["...", "..."]`.

**Preguntas a medida** (`datos/preguntas.json`), para lo que no está en ninguna guía o para afinar:
- Copia un bloque `{ ... }` de `preguntas`, ponle un `id` nuevo y rellena `pregunta` y `palabrasClave`
  (palabras o frases cortas que usaría una persona, como «se ha caído» o «cuánto cuesta»; da igual tildes, mayúsculas o plurales).
- Y uno de estos tres: `respuesta` (texto propio), `guia` (id de una guía, por ejemplo `"art-005"`: responde con su
  texto actual) o `servicio` (id de un servicio, por ejemplo `"respiro"`).
- En las respuestas puedes escribir `{{contacto.horario}}`, `{{contacto.email}}`, `{{sitio.nombre}}`,
  `{{lista.servicios}}`, `{{lista.temas}}`, `{{lista.tienda}}` o `{{lista.guias}}`, y se rellenan solos.
- `enlaces` (opcional): botones bajo la respuesta. Para abrir una guía usa `index.html#guia-art-005`.
- `urgente: true` hace que esa respuesta gane siempre (se usa para la del 112). `oculta: true` evita que se proponga como sugerencia.
- En `asistente` cambias el saludo, el aviso, el texto cuando no sabe responder y las preguntas que se ofrecen al
  abrir (`sugerencias`, por su `id`).
- Si se borra una guía o un servicio al que apunta una pregunta sin texto propio, esa pregunta desaparece sola.

Para que algún día responda con inteligencia artificial, ver `APPS.md`, apartado «Asistente».

Cuando cambies un archivo, sube su número de `version` en `datos/indice.json` (lo usan las apps para saber que hay novedades).

## Ver la web en tu ordenador

Como los textos se leen de archivos JSON, el navegador no los carga si abres `index.html` con doble clic.
Para verla en local, abre una terminal en la carpeta y ejecuta `python3 -m http.server`, luego entra en
http://localhost:8000. O simplemente consulta la web publicada.

## Formulario de contacto

Los mensajes se envían con **FormSubmit** a `serviciosdigitalesnavarra@protonmail.com`.
La primera vez, envía un mensaje de prueba y confirma el correo de activación que llega a esa dirección
(mira en spam). Para cambiar el correo, edita las líneas marcadas `← CORREO` en `empresa.html` y `js/contacto.js`.

## Cookies

La web no usa cookies. Solo guarda en el navegador la preferencia de «Texto grande» (técnica, exenta de
consentimiento). Si algún día añades analítica (Google Analytics, etc.), necesitarás un banner de consentimiento
y actualizar el apartado de cookies en `legal.json`.

## Apps Android e iPhone

Ver `APPS.md`.
