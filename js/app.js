/*
 * APP DE CUIDADOS NAVARRA (la web instalable en el móvil).
 *
 * Lo carga js/comun.js en todas las páginas. Se encarga de:
 *  - Activar el modo app y sin conexión (registra sw.js).
 *  - Poner en el pie de todas las páginas el enlace «Instalar la app» (no aparece si ya se usa la app).
 *  - En la página de inicio del móvil, un aviso pequeño para instalarla (se puede cerrar y no vuelve a salir).
 *  - Pintar la página app.html con las instrucciones para Android, iPhone y ordenador.
 *  - Textos en castellano y euskera (abajo, en TEXTOS). El idioma es el de la página.
 *
 * CUANDO LA APP ESTÉ EN LAS TIENDAS: pega aquí abajo sus direcciones y aparecerán los botones
 * «Disponible en Google Play» y «Descárgala en App Store» en app.html.
 */
(function () {
  var TIENDAS = {
    googlePlay: "",   // p. ej. "https://play.google.com/store/apps/details?id=io.github.serviciosdigitalesnavarra.cuidados"
    appStore: ""      // p. ej. "https://apps.apple.com/es/app/cuidados-navarra/id0000000000"
  };

  var TEXTOS = {
    es: {
      titulo: "Instalar la app · Cuidados Navarra",
      pie: "Instalar la app en el móvil",
      avisoTitulo: "Lleva Cuidados Navarra en tu móvil",
      avisoTexto: "Instala la app gratis: se abre con un toque desde la pantalla de inicio y funciona sin conexión.",
      avisoBoton: "Cómo instalarla",
      avisoCerrar: "Cerrar este aviso",
      h1: "Instala la app en tu móvil",
      intro: "Cuidados Navarra también es una app. Se instala gratis desde esta misma web, sin pasar por ninguna tienda, y ocupa muy poco.",
      ventajas: [
        ["Un toque y listo", "Aparece con su icono en la pantalla de inicio, como cualquier otra app."],
        ["Funciona sin conexión", "Las guías que ya has abierto se pueden consultar aunque no tengas internet."],
        ["Siempre al día", "Cada vez que la abres con conexión muestra las guías, servicios y productos más recientes."],
        ["Sin registros ni permisos", "No pide tus datos, no tiene publicidad y no accede a tus fotos ni contactos."]
      ],
      instalarAhora: "Instalar la app",
      instalada: "¡Listo! La app ya está instalada. La encontrarás en la pantalla de inicio.",
      yaEnApp: "Ya estás usando la app. Si quieres instalarla en otro móvil, abre esta página desde ese móvil.",
      tuMovil: "En tu dispositivo",
      otros: "Otros dispositivos",
      android: "Android (Samsung, Xiaomi, Motorola…)",
      androidPasos: [
        "Abre esta web en <strong>Google Chrome</strong>.",
        "Pulsa el botón <strong>Instalar la app</strong> de esta página. Si no aparece, toca el menú <strong>⋮</strong> (arriba a la derecha).",
        "Elige <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong> y confirma con <strong>Instalar</strong>."
      ],
      androidSamsung: "En el navegador Samsung Internet: menú <strong>≡</strong> › <strong>Añadir página a</strong> › <strong>Pantalla de inicio</strong>.",
      iphone: "iPhone y iPad",
      iphonePasos: [
        "Abre esta web en <strong>Safari</strong> (también sirve Chrome en iOS 16.4 o posterior).",
        "Pulsa el botón <strong>Compartir</strong> {compartir}: abajo en el centro en Safari, o arriba a la derecha en Chrome.",
        "Baja y elige <strong>Añadir a pantalla de inicio</strong> {anadir}. Si no lo ves, pulsa antes <strong>Ver más</strong>.",
        "Pulsa <strong>Añadir</strong>, arriba a la derecha."
      ],
      ordenador: "Ordenador",
      ordenadorPasos: [
        "En <strong>Chrome</strong> o <strong>Edge</strong>, pulsa el icono de instalar {instalar} que aparece a la derecha de la barra de direcciones.",
        "En <strong>Safari</strong> (Mac): menú <strong>Archivo</strong> › <strong>Añadir al Dock</strong>."
      ],
      tiendasTitulo: "En las tiendas de apps",
      tiendasTexto: "También puedes descargarla desde la tienda de tu móvil. Es la misma app, con los mismos contenidos.",
      tiendasPronto: "Muy pronto estará también en Google Play y App Store. Mientras tanto, puedes instalarla desde aquí con los pasos de arriba.",
      googlePlay: "Disponible en Google Play",
      appStore: "Descárgala en App Store",
      dudas: "¿Tienes problemas para instalarla? Escríbenos desde el <a href=\"empresa.html#contacto\">formulario de contacto</a> y te ayudamos.",
      privacidad: "La app guarda en tu móvil una copia de las páginas que visitas para que funcionen sin conexión. No recoge datos personales. Más información en <a href=\"privacidad.html\">Privacidad</a>."
    },
    eu: {
      titulo: "Instalatu aplikazioa · Cuidados Navarra",
      pie: "Instalatu aplikazioa mugikorrean",
      avisoTitulo: "Eraman Cuidados Navarra zure mugikorrean",
      avisoTexto: "Instalatu aplikazioa doan: hasierako pantailatik ukitu batez irekitzen da eta konexiorik gabe ere badabil.",
      avisoBoton: "Nola instalatu",
      avisoCerrar: "Itxi ohar hau",
      h1: "Instalatu aplikazioa zure mugikorrean",
      intro: "Cuidados Navarra aplikazio bat ere bada. Doan instalatzen da webgune honetatik bertatik, dendarik erabili gabe, eta oso leku gutxi hartzen du.",
      ventajas: [
        ["Ukitu bat eta kitto", "Hasierako pantailan agertzen da bere ikonoarekin, beste edozein aplikazio bezala."],
        ["Konexiorik gabe ere bai", "Lehen irekitako gidak interneterik gabe ere kontsulta daitezke."],
        ["Beti egunean", "Konexioarekin irekitzen duzun bakoitzean, gida, zerbitzu eta produktu berrienak erakusten ditu."],
        ["Erregistrorik eta baimenik gabe", "Ez dizkizu datuak eskatzen, ez du publizitaterik eta ez du zure argazki edo kontaktuetara sartzen."]
      ],
      instalarAhora: "Instalatu aplikazioa",
      instalada: "Eginda! Aplikazioa instalatuta dago. Hasierako pantailan aurkituko duzu.",
      yaEnApp: "Aplikazioa erabiltzen ari zara jada. Beste mugikor batean instalatu nahi baduzu, ireki orri hau mugikor horretatik.",
      tuMovil: "Zure gailuan",
      otros: "Beste gailu batzuk",
      android: "Android (Samsung, Xiaomi, Motorola…)",
      androidPasos: [
        "Ireki webgune hau <strong>Google Chrome</strong>-n.",
        "Sakatu orri honetako <strong>Instalatu aplikazioa</strong> botoia. Agertzen ez bada, ukitu <strong>⋮</strong> menua (goian eskuinean).",
        "Aukeratu <strong>Instalatu aplikazioa</strong> edo <strong>Gehitu hasierako pantailan</strong> eta berretsi <strong>Instalatu</strong> sakatuta."
      ],
      androidSamsung: "Samsung Internet nabigatzailean: <strong>≡</strong> menua › <strong>Gehitu orria hona</strong> › <strong>Hasierako pantaila</strong>.",
      iphone: "iPhone eta iPad",
      iphonePasos: [
        "Ireki webgune hau <strong>Safari</strong>-n (iOS 16.4 edo berriagoko Chrome-k ere balio du).",
        "Sakatu <strong>Partekatu</strong> botoia {compartir}: behean erdian Safarin, edo goian eskuinean Chromen.",
        "Jaitsi eta aukeratu <strong>Gehitu hasierako pantailan</strong> {anadir}. Ikusten ez baduzu, sakatu lehenago <strong>Ikusi gehiago</strong>.",
        "Sakatu <strong>Gehitu</strong>, goian eskuinean."
      ],
      ordenador: "Ordenagailua",
      ordenadorPasos: [
        "<strong>Chrome</strong>-n edo <strong>Edge</strong>-n, sakatu helbide-barraren eskuinean agertzen den instalatzeko ikonoa {instalar}.",
        "<strong>Safari</strong>-n (Mac): <strong>Fitxategia</strong> menua › <strong>Gehitu Dock-era</strong>."
      ],
      tiendasTitulo: "Aplikazio-dendetan",
      tiendasTexto: "Zure mugikorreko dendatik ere deskarga dezakezu. Aplikazio bera da, eduki berberekin.",
      tiendasPronto: "Laster Google Play eta App Store dendetan ere egongo da. Bitartean, hemendik instala dezakezu goiko urratsekin.",
      googlePlay: "Eskuratu Google Play-n",
      appStore: "Deskargatu App Store-n",
      dudas: "Arazoak dituzu instalatzeko? Idatzi iezaguzu <a href=\"empresa.html#contacto\">harremanetarako formulariotik</a> eta lagunduko dizugu.",
      privacidad: "Aplikazioak bisitatzen dituzun orrien kopia bat gordetzen du zure mugikorrean, konexiorik gabe ibil daitezen. Ez du datu pertsonalik biltzen. Informazio gehiago <a href=\"privacidad.html\">Pribatutasuna</a> atalean."
    }
  };

  // Iconos dibujados (sin imágenes externas)
  var ICONOS = {
    compartir: '<svg class="icono-paso" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>',
    anadir: '<svg class="icono-paso" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>',
    instalar: '<svg class="icono-paso" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 7.5v6M9.5 11l2.5 2.5 2.5-2.5M8 20h8"/></svg>',
    movil: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>'
  };

  var html = document.documentElement;
  // El idioma se lee al pintar (la web en euskera cambia lang="eu" al cargar)
  var T = TEXTOS.es;
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var conIconos = function (t) { return t.replace(/\{(\w+)\}/g, function (m, k) { return ICONOS[k] || ""; }); };

  var ua = navigator.userAgent || "";
  var esIOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var esAndroid = /Android/i.test(ua);
  var esMovil = esIOS || esAndroid;
  var enApp = function () {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
      navigator.standalone === true ||
      (window.matchMedia && (matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches));
  };
  if (enApp()) html.classList.add("en-app");

  // Estilos propios de la app
  if (!document.querySelector('link[href$="css/app.css"]')) {
    var l = document.createElement("link");
    l.rel = "stylesheet"; l.href = "css/app.css";
    document.head.appendChild(l);
  }

  // 1. Modo sin conexión
  var seguro = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if ("serviceWorker" in navigator && seguro) navigator.serviceWorker.register("sw.js").catch(function () {});

  // 2. Instalación con un botón (Android y ordenador con Chrome/Edge)
  var aviso = null;
  var cambios = [];
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    aviso = e;
    cambios.forEach(function (f) { f(); });
  });
  window.addEventListener("appinstalled", function () {
    aviso = null;
    try { localStorage.setItem("appInstalada", "1"); } catch (err) {}
    cambios.forEach(function (f) { f(true); });
  });
  var instalar = function () {
    if (!aviso) return Promise.resolve(false);
    var a = aviso;
    a.prompt();
    return a.userChoice.then(function (r) {
      if (r && r.outcome === "accepted") { aviso = null; return true; }
      return false;
    }).catch(function () { return false; });
  };

  // 3. Enlace en el pie de todas las páginas
  function enlacePie() {
    if (enApp()) return;
    var marca = document.querySelector(".pie .marca");
    if (!marca || marca.querySelector(".enlace-app")) return;
    marca.insertAdjacentHTML("beforeend", '<a class="enlace-app" href="app.html">' + ICONOS.movil + "<span>" + esc(T.pie) + "</span></a>");
  }

  // 4. Aviso en la portada del móvil
  function avisoPortada() {
    if (enApp() || !esMovil || document.body.getAttribute("data-pagina") !== "inicio") return;
    var cerrado = false;
    try { cerrado = localStorage.getItem("avisoApp") === "cerrado" || localStorage.getItem("appInstalada") === "1"; } catch (e) {}
    if (cerrado) return;
    var hero = document.querySelector("#contenido .hero");
    if (!hero) return;
    hero.insertAdjacentHTML("afterend",
      '<aside class="aviso-app" aria-labelledby="aviso-app-titulo">' +
        '<img src="img/icono.svg" alt="" width="52" height="52">' +
        '<div><p class="aviso-app-titulo" id="aviso-app-titulo">' + esc(T.avisoTitulo) + "</p>" +
        "<p>" + esc(T.avisoTexto) + "</p>" +
        '<a class="boton" href="app.html">' + esc(T.avisoBoton) + "</a></div>" +
        '<button type="button" class="aviso-app-cerrar" aria-label="' + esc(T.avisoCerrar) + '">✕</button>' +
      "</aside>");
    var caja = hero.nextElementSibling;
    caja.querySelector(".aviso-app-cerrar").addEventListener("click", function () {
      try { localStorage.setItem("avisoApp", "cerrado"); } catch (e) {}
      caja.parentNode.removeChild(caja);
    });
  }

  // 5. Página app.html
  function lista(pasos) {
    return "<ol class=\"pasos-app\">" + pasos.map(function (p) { return "<li>" + conIconos(p) + "</li>"; }).join("") + "</ol>";
  }
  function bloque(id, titulo, cuerpo, abierto) {
    return '<details class="bloque-app" id="' + id + '"' + (abierto ? " open" : "") + "><summary>" + esc(titulo) + "</summary>" + cuerpo + "</details>";
  }
  function paginaApp() {
    var el = document.getElementById("app-contenido");
    if (!el) return;
    document.title = T.titulo;

    var tarjetas = T.ventajas.map(function (v) {
      return '<div class="ventaja-app"><h3>' + esc(v[0]) + "</h3><p>" + esc(v[1]) + "</p></div>";
    }).join("");

    var bloques = {
      android: bloque("android", T.android, lista(T.androidPasos) + "<p class=\"nota-app\">" + T.androidSamsung + "</p>", false),
      iphone: bloque("iphone", T.iphone, lista(T.iphonePasos), false),
      ordenador: bloque("ordenador", T.ordenador, lista(T.ordenadorPasos), false)
    };
    var propio = esIOS ? "iphone" : esAndroid ? "android" : "ordenador";
    bloques[propio] = bloques[propio].replace("<details ", "<details open ");
    var resto = ["android", "iphone", "ordenador"].filter(function (k) { return k !== propio; });

    var tiendas = "";
    if (TIENDAS.googlePlay || TIENDAS.appStore) {
      tiendas = "<p>" + esc(T.tiendasTexto) + '</p><p class="tiendas-app">' +
        (TIENDAS.googlePlay ? '<a class="boton" href="' + esc(TIENDAS.googlePlay) + '" target="_blank" rel="noopener">' + esc(T.googlePlay) + "</a>" : "") +
        (TIENDAS.appStore ? '<a class="boton" href="' + esc(TIENDAS.appStore) + '" target="_blank" rel="noopener">' + esc(T.appStore) + "</a>" : "") + "</p>";
    } else {
      tiendas = "<p>" + esc(T.tiendasPronto) + "</p>";
    }

    el.innerHTML =
      '<div class="cabecera-app">' +
        '<img src="img/icono.svg" alt="" width="96" height="96" class="icono-app">' +
        "<div><h1>" + esc(T.h1) + "</h1><p class=\"intro-app\">" + esc(T.intro) + "</p>" +
        '<div id="estado-app" class="estado-app" role="status" aria-live="polite"></div></div>' +
      "</div>" +
      '<div class="ventajas-app">' + tarjetas + "</div>" +
      '<section aria-labelledby="titulo-tu-movil"><h2 id="titulo-tu-movil">' + esc(T.tuMovil) + "</h2>" + bloques[propio] + "</section>" +
      '<section aria-labelledby="titulo-otros"><h2 id="titulo-otros">' + esc(T.otros) + "</h2>" + bloques[resto[0]] + bloques[resto[1]] + "</section>" +
      '<section aria-labelledby="titulo-tiendas"><h2 id="titulo-tiendas">' + esc(T.tiendasTitulo) + "</h2>" + tiendas + "</section>" +
      '<p class="nota-app">' + T.dudas + "</p>" +
      '<p class="nota-app">' + T.privacidad + "</p>";

    var estado = document.getElementById("estado-app");
    var pintarEstado = function (instaladaAhora) {
      if (enApp()) { estado.innerHTML = '<p class="aviso-ok-app">' + esc(T.yaEnApp) + "</p>"; return; }
      if (instaladaAhora === true) { estado.innerHTML = '<p class="aviso-ok-app">' + esc(T.instalada) + "</p>"; return; }
      if (aviso) {
        estado.innerHTML = '<button type="button" class="boton boton-instalar-app">' + ICONOS.movil + " " + esc(T.instalarAhora) + "</button>";
        estado.querySelector("button").addEventListener("click", function () {
          instalar().then(function (ok) { pintarEstado(ok); });
        });
      } else {
        estado.innerHTML = "";
      }
    };
    cambios.push(pintarEstado);
    pintarEstado();
  }

  function iniciar() {
    T = TEXTOS[/^eu/i.test(html.getAttribute("lang") || "") ? "eu" : "es"];
    enlacePie(); avisoPortada(); paginaApp(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();

  window.CNApp = { instalar: instalar, enApp: enApp };
})();
