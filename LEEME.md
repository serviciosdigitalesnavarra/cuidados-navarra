# Cuidados Navarra · Web de cuidados para mayores y dependientes

Web estática (HTML, CSS y JavaScript). No necesita servidor ni base de datos:
basta con abrir `index.html` en el navegador o subir la carpeta a cualquier hosting.

## Estructura

```
index.html            Página principal (portada, destacados, temáticas, guías)
contacto.html         Página de contacto con formulario
contenido/temas.js    ← AQUÍ editas temáticas y artículos
css/estilos.css       Estilos. Los colores están al principio del archivo
js/temas.js           Lógica de filtros, buscador y lectura (no hace falta tocarlo)
js/comun.js           Botón "Texto grande"
```

## Cómo editar contenidos

Abre `contenido/temas.js` con cualquier editor de texto (Bloc de notas, VS Code…).

- **Añadir una temática:** copia una línea de `CATEGORIAS` y cambia `id`, `nombre`, `icono` y `descripcion`.
- **Añadir una guía:** copia un bloque `{ ... }` de `ARTICULOS`, pégalo con una coma y cambia los textos.
  El campo `categoria` debe coincidir con el `id` de una temática.
- **Destacar una guía:** pon `destacado: true` (se muestran hasta 3).
- **Listas en el texto:** empieza cada línea con `- `. Separa párrafos con una línea en blanco.

## Cambiar colores o nombre

- Colores: variables al inicio de `css/estilos.css`.
- Nombre "Cuidados Navarra": búscalo y reemplázalo en `index.html` y `contacto.html`.

## Formulario de contacto (paso obligatorio la primera vez)

Los mensajes se envían con **FormSubmit** a `serviciosdigitalesnavarra@protonmail.com`.

1. Publica la web (o ábrela) y envía un mensaje de prueba desde el formulario.
2. Llegará un correo de FormSubmit a esa dirección pidiendo **activar** el formulario. Pulsa el botón de confirmación.
   (Revisa la carpeta de spam si no aparece.)
3. A partir de ahí, todos los mensajes llegarán a ese correo.

Opcional: en el correo de activación FormSubmit te da un código alfanumérico. Si sustituyes
la dirección de correo por ese código en las dos líneas marcadas `← CORREO` de `contacto.html`,
tu email deja de ser visible en el código de la página (menos spam).

Para cambiar el correo de destino, edita esas mismas dos líneas.
