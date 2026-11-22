# Publicar Cuidados Navarra en Google Play y App Store

Esta carpeta convierte la web en apps para Android y iPhone con **Capacitor**.
Las apps abren la web publicada (`https://serviciosdigitalesnavarra.github.io/cuidados-navarra/`), así que:

- **Todo lo que cambies en la web aparece en las apps** la próxima vez que se abran. No hay que publicar
  versiones nuevas en las tiendas para cambiar guías, servicios, productos o textos.
- Solo hay que subir una versión nueva si cambia algo de la propia app: el icono, el nombre o funciones
  nuevas del móvil (por ejemplo, notificaciones).
- Sin conexión, la app muestra lo último que se guardó en el móvil y, si no hay nada, la página `offline.html`.

> **Antes de nada**: la versión instalable desde la web ya funciona sin tiendas (página `app.html`).
> Las tiendas son opcionales y sirven para que la gente encuentre la app buscándola en su móvil.

---

## Resumen de costes y requisitos

| | Google Play (Android) | App Store (iPhone) |
|---|---|---|
| Cuenta de desarrollador | 25 $ una sola vez | 99 $ al año |
| ¿Necesito un ordenador especial? | No: la app se compila sola en GitHub | Sí: un **Mac** con Xcode (o un servicio de compilación en la nube) |
| Tiempo de revisión | De horas a unos días (la primera vez, más) | 1 o 2 días |
| Requisito especial | Cuentas personales nuevas: prueba cerrada con **12 personas durante 14 días** antes de publicar | Revisión manual; ver «Aviso sobre Apple» |

---

## Paso 1. Datos que debes decidir antes de publicar

1. **Identificador de la app**: ahora es `io.github.serviciosdigitalesnavarra.cuidados`
   (en `capacitor.config.json` › `appId`). **No se puede cambiar** después de publicar.
   Si vas a tener dominio propio (por ejemplo `cuidadosnavarra.es`), cámbialo antes a `es.cuidadosnavarra.app`.
2. **Nombre**: «Cuidados Navarra» (`appName`).
3. **Titular**: rellena los datos entre `[corchetes]` de `datos/sitio.json` (las tiendas exigen
   una política de privacidad con titular y contacto reales).
4. **Si la web cambia de dirección** (dominio propio), cambia `server.url` en `capacitor.config.json`.

---

## Paso 2. Google Play (Android)

### 2.1 Crear la cuenta (una vez)

1. Entra en <https://play.google.com/console/signup> con la cuenta de Google que quieras usar.
2. Elige **cuenta personal** u **organización** (si tienes empresa con número D-U-N-S, mejor organización:
   no tiene la prueba obligatoria de 14 días).
3. Paga los 25 $ y verifica tu identidad (DNI y teléfono). Google tarda de 1 a 3 días en verificarla.

### 2.2 Probar la app en tu móvil (ya disponible)

1. En GitHub, abre el repositorio › pestaña **Actions** › **App Android** › botón **Run workflow**.
2. Espera unos 10 minutos. Abre la ejecución terminada y, abajo en **Artifacts**, descarga
   `cuidados-navarra-prueba-apk` (hay que tener la sesión de GitHub iniciada).
3. Pasa el `.apk` al móvil Android, ábrelo y permite «instalar apps de origen desconocido» cuando lo pida.

### 2.3 Crear la clave de firma (una vez, muy importante)

Google Play exige que la app vaya firmada. La clave es como la llave de la app: **guárdala en un sitio seguro
(y una copia)**. Sin ella no se pueden publicar actualizaciones.

- Opción fácil: **pídeme que la cree**. Te daré el archivo y las contraseñas para que los guardes, y los
  configuraré contigo como secretos de GitHub.
- Opción manual (con Java instalado), en una terminal:
  ```
  keytool -genkeypair -v -keystore cuidados-navarra.jks -alias cuidados -keyalg RSA -keysize 2048 -validity 10000
  ```

Después, en GitHub › **Settings** › **Secrets and variables** › **Actions** › **New repository secret**, crea:

| Nombre | Valor |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | El archivo `.jks` convertido a texto (en Mac/Linux: `base64 -i cuidados-navarra.jks`; en Windows: `certutil -encode`) |
| `ANDROID_KEYSTORE_PASSWORD` | Contraseña del almacén |
| `ANDROID_KEY_ALIAS` | `cuidados` |
| `ANDROID_KEY_PASSWORD` | Contraseña de la clave (si es la misma, repítela) |

Vuelve a ejecutar **App Android**: ahora en **Artifacts** aparecerá también `cuidados-navarra-google-play-aab`.

> Nunca subas el archivo `.jks` al repositorio: es público. Los secretos de GitHub no los ve nadie.

### 2.4 Publicar

1. En Play Console › **Crear aplicación**: nombre «Cuidados Navarra», idioma español, tipo **Aplicación**, **Gratis**.
2. Completa **Configurar tu aplicación** (la lista de tareas de la portada):
   - **Política de privacidad**: `https://serviciosdigitalesnavarra.github.io/cuidados-navarra/privacidad.html`
   - **Acceso a la aplicación**: todo disponible sin registro.
   - **Anuncios**: no contiene anuncios.
   - **Clasificación de contenido**: rellena el cuestionario (categoría «Salud y bienestar» / referencia).
   - **Público objetivo**: mayores de 18 años.
   - **Seguridad de los datos**: la app **no recoge ni comparte datos**. El formulario de contacto envía
     nombre, correo y mensaje solo si la persona lo rellena: decláralo como «Información personal ›
     Nombre y correo», recogido para «Comunicaciones con el desarrollador», no compartido, opcional.
   - **Aplicaciones de salud**: indica que ofrece información general, no es un dispositivo médico.
3. **Ficha de Play Store**: descripción corta y larga, icono 512×512 (`app-movil/assets/icon-only.png`
   reducido, o `img/icono-maskable-512.png`), imagen destacada 1024×500 y al menos 2 capturas del móvil.
   Puedo prepararte los textos y las imágenes.
4. **Pruebas › Prueba cerrada**: sube el `.aab`, invita a 12 personas (por correo) y mantenla 14 días.
   (Solo cuentas personales creadas después de noviembre de 2023.)
5. **Producción › Crear versión**: sube el mismo `.aab` y envía a revisión.

---

## Paso 3. App Store (iPhone y iPad)

### 3.1 Crear la cuenta (una vez)

1. Necesitas un **ID de Apple** con verificación en dos pasos.
2. Inscríbete en <https://developer.apple.com/programs/enroll/> (99 $ al año). Como persona física
   es más rápido; como organización hace falta número D-U-N-S.

### 3.2 Compilar en un Mac

Necesitas un Mac con **Xcode** (gratis en la App Store del Mac) y **Node.js** 22 o posterior (<https://nodejs.org>).

1. Descarga el repositorio (botón verde **Code** › **Download ZIP**) y descomprímelo.
2. Abre **Terminal**, entra en la carpeta `app-movil` y ejecuta:
   ```
   npm ci
   npm run ios
   ```
   Se abrirá Xcode con el proyecto.
3. En Xcode: selecciona **App** (a la izquierda) › pestaña **Signing & Capabilities** › en **Team** elige tu
   cuenta de desarrollador.
4. Para probarlo: conecta tu iPhone con cable, elígelo arriba y pulsa ▶.
5. Para publicar: menú **Product › Archive** › **Distribute App** › **App Store Connect** › **Upload**.

¿No tienes Mac? Se puede compilar en la nube (GitHub Actions con macOS, Codemagic o Ionic Appflow),
pero hay que crear antes los certificados de Apple. Puedo prepararlo cuando tengas la cuenta.

### 3.3 Publicar

1. En <https://appstoreconnect.apple.com> › **Apps** › **+** › **Nueva app**: plataforma iOS, nombre
   «Cuidados Navarra», idioma español, el identificador del paso 1.
2. Rellena: descripción, palabras clave, URL de soporte (`.../empresa.html#contacto`), URL de privacidad
   (`.../privacidad.html`), categoría **Salud y forma física** o **Medicina**, capturas de iPhone 6,9" y 6,5".
3. **Privacidad de la app**: «Datos no recopilados» salvo el formulario de contacto (nombre y correo,
   no vinculados a seguimiento).
4. Elige la versión que subiste desde Xcode y pulsa **Enviar para revisión**.

### Aviso sobre Apple

Apple puede rechazar apps que «solo muestran una web» (norma 4.2). Esta app tiene a su favor que funciona
sin conexión, lee los contenidos en voz alta, tiene ajustes de accesibilidad y un asistente. Si la rechazan,
la solución habitual es añadir alguna función propia del móvil (por ejemplo, avisos/notificaciones
o recordatorios de medicación), y podemos hacerlo en ese momento.

---

## Actualizar las apps

- **Contenidos** (guías, servicios, tienda, textos): se cambian en la web como siempre. Nada más.
- **Icono o nombre**: cambia los archivos de `app-movil/assets/` o `appName`, sube `version` en
  `package.json` (por ejemplo, `1.0.1`), compila de nuevo y sube la versión a cada tienda.

## Archivos de esta carpeta

```
capacitor.config.json   Identificador, nombre y dirección de la web que abre la app
package.json            Versión de la app y órdenes (npm run android / npm run ios)
preparar-web.js         Copia la web dentro de la app (para el primer arranque sin conexión)
assets/                 Icono (1024×1024) y pantalla de inicio de las apps
GUIA-TIENDAS.md         Esta guía
```
Las carpetas `android/` e `ios/` se crean solas al compilar y no se guardan en el repositorio.
