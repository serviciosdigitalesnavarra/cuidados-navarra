/*
 * IDIOMAS de Cuidados Navarra (castellano y euskera).
 *
 * Cómo funciona:
 *  - El idioma se elige con el selector de la esquina (ES | EU), se recuerda en el navegador
 *    y también se puede forzar con la dirección: index.html?lang=eu  o  ?lang=es
 *    Si la persona no ha elegido nada y su navegador está en euskera, la web se abre en euskera.
 *  - CONTENIDOS (guías, servicios, tienda, textos legales, chatbot…): están en datos/*.json (castellano)
 *    y su traducción en datos/eu/*.json. La traducción solo lleva los TEXTOS: lo que no esté traducido
 *    (o un elemento nuevo que aún no tenga traducción) se muestra en castellano. Ver LEEME.md.
 *  - TEXTOS FIJOS de la web (menús, botones, formularios…): están abajo, en TEXTOS.eu, con el texto en
 *    castellano a la izquierda y su traducción a la derecha. Si cambias un texto en castellano en el
 *    HTML o en js/, cambia también aquí la parte izquierda para que se siga traduciendo.
 *  - Las apps pueden reutilizar los mismos datos: ver APPS.md, apartado «Idiomas».
 *
 * TRADUCCIÓN AL EUSKERA: primera versión preparada automáticamente. Debe revisarla una persona
 * nativa, sobre todo los textos legales y de salud.
 */
(function () {
  var BASE = "es";
  var IDIOMAS = {
    es: { nombre: "Castellano", corto: "ES", ver: "Ver en castellano" },
    eu: { nombre: "Euskara", corto: "EU", ver: "Euskaraz ikusi" }
  };

  // ------------------------------------------------------------------
  // Textos fijos. Izquierda: castellano exacto. Derecha: euskera.
  // {n}, {fecha}, {proveedor}… son huecos que se rellenan solos.
  // Las claves que empiezan por "html:" sustituyen un bloque con enlaces o negritas (data-t="..." en el HTML).
  // ------------------------------------------------------------------
  var TEXTOS = {
    eu: {
      // Títulos y descripciones de las páginas
      "Cuidados Navarra · Cuidados para personas mayores y dependientes": "Cuidados Navarra · Adinekoen eta mendekotasuna duten pertsonen zaintza",
      "Guías, servicios y productos para acompañar a personas mayores y dependientes en Navarra, y para cuidar también de quien cuida.": "Nafarroan adinekoei eta mendekotasuna duten pertsonei laguntzeko gidak, zerbitzuak eta produktuak, eta zaintzen duena ere zaintzeko.",
      "Nuestra empresa · Cuidados Navarra": "Gure enpresa · Cuidados Navarra",
      "Quiénes somos, nuestros valores, nuestro decálogo de cuidado y formulario de contacto de Cuidados Navarra.": "Nor garen, gure balioak, zaintzaren dekalogoa eta Cuidados Navarraren harremanetarako formularioa.",
      "Nuestros servicios · Cuidados Navarra": "Gure zerbitzuak · Cuidados Navarra",
      "Cuidado en el domicilio, acompañamiento, respiro familiar, orientación en trámites de dependencia, adaptación del hogar y formación para cuidadores.": "Etxeko zaintza, laguntza, familiarentzako atsedena, mendekotasun-izapideetarako orientazioa, etxebizitzaren egokitzapena eta zaintzaileentzako prestakuntza.",
      "Tienda · Cuidados Navarra": "Denda · Cuidados Navarra",
      "Selección de productos y tecnología para el cuidado de personas mayores y dependientes: seguridad, medicación, comunicación, hogar y control de salud.": "Adinekoak eta mendekotasuna duten pertsonak zaintzeko produktu eta teknologia hautatuak: segurtasuna, medikazioa, komunikazioa, etxea eta osasun-kontrola.",
      "Términos y condiciones de uso · Cuidados Navarra": "Erabilera-baldintzak · Cuidados Navarra",
      "Aviso legal y condiciones de uso del sitio web Cuidados Navarra.": "Cuidados Navarra webgunearen lege-oharra eta erabilera-baldintzak.",
      "Privacidad y protección de datos · Cuidados Navarra": "Pribatutasuna eta datuen babesa · Cuidados Navarra",
      "Política de privacidad, protección de datos y cookies de Cuidados Navarra (RGPD y LOPDGDD).": "Cuidados Navarraren pribatutasun-politika, datuen babesa eta cookieak (DBEO eta 3/2018 Lege Organikoa).",
      "Accesibilidad · Cuidados Navarra": "Irisgarritasuna · Cuidados Navarra",
      "Cómo escuchar la web en voz alta, agrandar la letra o activar el alto contraste, y declaración de accesibilidad de Cuidados Navarra.": "Nola entzun webgunea ozen, nola handitu letra edo aktibatu kontraste handia, eta Cuidados Navarraren irisgarritasun-adierazpena.",

      // Cabecera, menú y pie (js/comun.js)
      "Saltar al contenido": "Joan edukira",
      "Cuidados Navarra, inicio": "Cuidados Navarra, hasiera",
      "Abrir menú": "Ireki menua",
      "Cerrar menú": "Itxi menua",
      "Principal": "Nagusia",
      "Inicio": "Hasiera",
      "Nuestra empresa": "Gure enpresa",
      "Nuestros servicios": "Gure zerbitzuak",
      "Tienda": "Denda",
      "Guías": "Gidak",
      "Contacto": "Harremanetarako",
      "Accesibilidad": "Irisgarritasuna",
      "Escuchar": "Entzun",
      "Leer en voz alta esta página": "Irakurri orri hau ozen",
      "Explorar": "Arakatu",
      "Temáticas": "Gaiak",
      "Quiénes somos": "Nor gara",
      "Nuestros valores": "Gure balioak",
      "Decálogo": "Dekalogoa",
      "Formulario de contacto": "Harremanetarako formularioa",
      "Urgencias: 112": "Larrialdiak: 112",
      "La información de esta web es orientativa y no sustituye la consulta con profesionales sanitarios. En caso de urgencia, llama al 112.": "Webgune honetako informazioa orientagarria da, eta ez ditu ordezten osasun-profesionalen kontsultak. Larrialdietan, deitu 112ra.",
      "Información legal": "Lege-informazioa",
      "Términos y condiciones de uso": "Erabilera-baldintzak",
      "Privacidad y protección de datos": "Pribatutasuna eta datuen babesa",
      "Cookies": "Cookieak",
      "Idioma": "Hizkuntza",
      "No se han podido cargar los contenidos. Recarga la página en unos segundos.": "Ezin izan dira edukiak kargatu. Kargatu berriro orria segundo batzuk barru.",
      "No se han podido cargar los contenidos. Si has abierto el archivo desde tu ordenador, consulta el apartado «Ver la web en tu ordenador» del archivo LEEME.md.": "Ezin izan dira edukiak kargatu. Fitxategia zure ordenagailutik ireki baduzu, ikusi LEEME.md fitxategiko «Ver la web en tu ordenador» atala.",
      "Cargando…": "Kargatzen…",
      "Cerrar": "Itxi",

      // Inicio (index.html y js/inicio.js)
      "Cuidados para mayores y dependientes": "Adinekoen eta mendekoen zaintza",
      "Cuidar mejor,": "Hobeto zaindu,",
      "con calma y con confianza": "lasai eta konfiantzaz",
      "Ver nuestros servicios": "Ikusi gure zerbitzuak",
      "Explorar guías": "Arakatu gidak",
      "¿Tienes dudas? No dudes en escribirnos": "Zalantzarik baduzu? Idatz iezaguzu lasai",
      "Para empezar": "Hasteko",
      "Guías destacadas": "Gida nabarmenak",
      "Los consejos más consultados por las familias.": "Familiek gehien kontsultatzen dituzten aholkuak.",
      "¿Sobre qué necesitas información?": "Zeri buruzko informazioa behar duzu?",
      "Elige un área para ver todas sus guías.": "Aukeratu arlo bat haren gida guztiak ikusteko.",
      "Biblioteca": "Liburutegia",
      "Todas las guías": "Gida guztiak",
      "Buscar guías": "Bilatu gidak",
      "Buscar: caídas, medicación, baño…": "Bilatu: erorikoak, medikazioa, bainua…",
      "Filtrar por temática": "Iragazi gaiaren arabera",
      "¿Necesitas apoyo en casa?": "Etxean laguntza behar duzu?",
      "Te escuchamos y te proponemos el cuidado que mejor encaja con vuestra vida.": "Entzun egiten dizugu, eta zuen bizimoduari hobekien egokitzen zaion zaintza proposatzen dizugu.",
      "Hablar con nosotros": "Hitz egin gurekin",
      "Leer guía": "Irakurri gida",
      "Escuchar la guía": "Entzun gida",
      "Cerrar la guía": "Itxi gida",
      "Todas": "Guztiak",
      "{n} guía": "{n} gida",
      "{n} guías": "{n} gida",
      "{n} guía encontrada": "Gida {n} aurkitu da",
      "{n} guías encontradas": "{n} gida aurkitu dira",
      "No hemos encontrado guías con esa búsqueda. Prueba con otras palabras o elige «Todas».": "Ez dugu bilaketa horrekin bat datorren gidarik aurkitu. Saiatu beste hitz batzuekin edo aukeratu «Guztiak».",

      // Nuestra empresa y formulario (empresa.html, js/contacto.js)
      "Apartados de Nuestra empresa": "Gure enpresaren atalak",
      "Lo que nos mueve": "Mugiarazten gaituena",
      "Nuestro compromiso": "Gure konpromisoa",
      "Decálogo del buen cuidado": "Zaintza onaren dekalogoa",
      "Diez compromisos que cumplimos con cada persona y cada familia.": "Pertsona eta familia bakoitzarekin betetzen ditugun hamar konpromiso.",
      "Estamos aquí para ayudarte": "Hemen gaude zuri laguntzeko",
      "Cuéntanos tu situación o tu duda. Te responderemos lo antes posible, con calma y sin compromiso.": "Kontaiguzu zure egoera edo zalantza. Ahalik eta lasterren erantzungo dizugu, lasai eta konpromisorik gabe.",
      "Si se trata de una urgencia médica, llama al 112.": "Larrialdi medikoa bada, deitu 112ra.",
      "Para consultas sobre la salud de una persona, contacta también con su centro de salud.": "Pertsona baten osasunari buruzko kontsultetarako, jarri harremanetan haren osasun-etxearekin ere.",
      "También puedes escribirnos a": "Helbide honetara ere idatz diezagukezu:",
      "Nombre": "Izena",
      "Teléfono (opcional)": "Telefonoa (aukerakoa)",
      "Correo electrónico": "Helbide elektronikoa",
      "Motivo de la consulta": "Kontsultaren arrazoia",
      "Información sobre servicios": "Zerbitzuei buruzko informazioa",
      "Duda sobre cuidados": "Zaintzari buruzko zalantza",
      "Ayudas y trámites": "Laguntzak eta izapideak",
      "Tienda y productos": "Denda eta produktuak",
      "Otro": "Beste bat",
      "Mensaje": "Mezua",
      "Por favor, no incluyas datos de salud que no sean necesarios.": "Mesedez, ez sartu beharrezkoak ez diren osasun-daturik.",
      "Enviar mensaje": "Bidali mezua",
      "Enviando…": "Bidaltzen…",
      "¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.": "Eskerrik asko! Zure mezua jaso dugu, eta laster erantzungo dizugu.",
      "Formulario pendiente de activar: se ha enviado un correo de confirmación a la dirección de destino. Tras confirmarlo, los mensajes llegarán con normalidad.": "Formularioa aktibatu gabe dago: berresteko mezu bat bidali da helmuga-helbidera. Berretsi ondoren, mezuak ohi bezala iritsiko dira.",
      "Información básica sobre protección de datos": "Datuen babesari buruzko oinarrizko informazioa",
      "el titular de Cuidados Navarra": "Cuidados Navarraren titularra",
      "html:casilla-privacidad": "<a href=\"privacidad.html\" target=\"_blank\">Pribatutasun-politika<span class=\"oculto\"> (beste fitxa batean irekitzen da)</span></a> irakurri dut eta onartzen dut, eta baimena ematen dut nire datuak nire kontsultari erantzuteko erabil daitezen.",
      "html:info-datos": "<strong>Arduraduna:</strong> <span id=\"resp-nombre\">Cuidados Navarraren titularra</span>. <strong>Helburua:</strong> zure kontsultari erantzutea. <strong>Legitimazioa:</strong> zure baimena. <strong>Hartzaileak:</strong> ez zaie daturik lagatzen hirugarrenei, legezko betebeharrik ez badago; bidalketa FormSubmit-ek kudeatzen du, tratamenduaren eragile gisa. <strong>Eskubideak:</strong> datuak eskuratzea, zuzentzea, ezabatzea eta beste batzuk, <a href=\"privacidad.html\">informazio gehigarrian</a> azaltzen den bezala.",

      // Servicios
      "Lo que hacemos": "Egiten duguna",
      "¿No sabes qué servicio necesitas?": "Ez dakizu zein zerbitzu behar duzun?",
      "Cuéntanos vuestra situación y te orientamos sin compromiso.": "Kontaiguzu zuen egoera, eta konpromisorik gabe orientatuko zaitugu.",
      "Pedir información": "Eskatu informazioa",
      "Solicitar": "Eskatu",

      // Tienda (tienda.html y js/tienda.js)
      "Tecnología y productos para cuidar mejor": "Hobeto zaintzeko teknologia eta produktuak",
      "Una selección de productos útiles para la seguridad, la autonomía y la tranquilidad en casa. Al pulsar «Ver en…» irás a la web del proveedor, donde se realiza la compra.": "Etxean segurtasuna, autonomia eta lasaitasuna izateko produktu erabilgarrien hautaketa. «Ikusi…» sakatzean, hornitzailearen webgunera joango zara, eta han egiten da erosketa.",
      "Enlaces de afiliado.": "Afiliazio-estekak.",
      "Filtrar productos": "Iragazi produktuak",
      "Todos": "Guztiak",
      "Ver en {proveedor}": "Ikusi hemen: {proveedor}",
      "(se abre en otra pestaña)": "(beste fitxa batean irekitzen da)",
      "Próximamente": "Laster",
      "No hay productos en esta categoría todavía.": "Oraindik ez dago produkturik kategoria honetan.",

      // Textos legales (js/legal.js)
      "Última actualización: {fecha}": "Azken eguneratzea: {fecha}",
      "Índice": "Aurkibidea",
      "html:nota-revision": "<span class=\"pendiente\">[Nabarmendutako]</span> datuak titularrak osatu behar ditu oraindik. Testu hau Espainiako eta Europako araudira egokitutako txantiloi bat da; komeni da profesional juridiko batek berrikustea.",
      "html:nota-traduccion": "Euskarazko itzulpen hau orientagarria da. Zalantzarik izanez gero, <a href=\"?lang=es\" data-idioma=\"es\">gaztelaniazko bertsioak</a> balio du.",

      // Asistente (js/asistente.js)
      "¿Dudas?": "Zalantzak?",
      "Asistente": "Laguntzailea",
      "Respuestas orientativas. Urgencias: 112.": "Erantzun orientagarriak. Larrialdiak: 112.",
      "Cerrar el asistente": "Itxi laguntzailea",
      "Escribe tu pregunta": "Idatzi zure galdera",
      "Escribe tu pregunta…": "Idatzi zure galdera…",
      "Enviar pregunta": "Bidali galdera",
      "Escribiendo": "Idazten",
      "También puede interesarte:": "Hau ere interesatuko zaizu agian:",
      "¿Quizás querías preguntar…?": "Agian hau galdetu nahi zenuen…?",
      "Guía: {titulo}": "Gida: {titulo}",
      "Servicio: {titulo}": "Zerbitzua: {titulo}",
      "Tienda: {titulo}": "Denda: {titulo}",
      "Abrir la guía completa": "Ireki gida osoa",
      "Ver los servicios": "Ikusi zerbitzuak",
      "Ver en la tienda": "Ikusi dendan",
      "Escribirnos": "Idatzi iezaguzu",
      "Precio orientativo: {precio}.": "Prezio orientagarria: {precio}.",
      "Lo tienes en nuestra tienda, en «{categoria}».": "Gure dendan duzu, «{categoria}» atalean.",
      "No tengo una respuesta para eso todavía.": "Oraindik ez daukat horretarako erantzunik.",
      "Hola, ¿en qué te puedo ayudar?": "Kaixo, zertan lagun zaitzaket?",
      "Ahora mismo no puedo cargar las respuestas. Prueba en unos segundos o escríbenos.": "Une honetan ezin ditut erantzunak kargatu. Saiatu berriro segundo batzuk barru, edo idatz iezaguzu."
    }
  };

  // ------------------------------------------------------------------
  // Idioma actual
  // ------------------------------------------------------------------
  var guardar = function (v) { try { localStorage.setItem("idioma", v); } catch (e) {} };
  var leer = function () { try { return localStorage.getItem("idioma"); } catch (e) { return null; } };
  var param = /[?&]lang=([a-z]{2})\b/i.exec(location.search);
  var idioma = param && IDIOMAS[param[1].toLowerCase()] ? param[1].toLowerCase() : null;
  if (idioma) guardar(idioma);
  else {
    idioma = leer();
    if (!IDIOMAS[idioma]) {
      var nav = navigator.languages || [navigator.language || ""];
      idioma = nav.some(function (l) { return /^eu\b/i.test(l); }) ? "eu" : BASE;
    }
  }
  var html = document.documentElement;
  html.setAttribute("lang", idioma);

  var DIC = TEXTOS[idioma] || {};

  // Traduce un texto fijo. t("Ver en {proveedor}", { proveedor: "Amazon" })
  function t(texto, datos) {
    var v = DIC.hasOwnProperty(texto) ? DIC[texto] : texto;
    if (datos) v = String(v).replace(/\{(\w+)\}/g, function (m, k) { return datos[k] == null ? m : datos[k]; });
    return v;
  }

  // Une los datos en castellano con su traducción (solo textos). Reglas:
  //  - Objetos: se mezclan campo a campo (lo que falte en la traducción queda en castellano).
  //  - Listas de elementos con "id": se emparejan por id (las guías nuevas sin traducir siguen en castellano).
  //  - Otras listas de objetos: por posición.  - Listas de textos: se sustituyen.
  //  - "palabrasClave": se suman las de los dos idiomas (el chatbot entiende ambos).
  //  - Los campos que empiezan por "_" (notas) se ignoran.
  function fusionar(base, tr, clave) {
    if (tr === undefined || tr === null) return base;
    var esObj = function (x) { return x && typeof x === "object" && !Array.isArray(x); };
    if (Array.isArray(base) && Array.isArray(tr)) {
      if (clave === "palabrasClave") return base.concat(tr.filter(function (x) { return base.indexOf(x) === -1; }));
      var conId = base.some(function (x) { return esObj(x) && x.id != null; });
      if (conId) {
        var porId = {};
        tr.forEach(function (x) { if (esObj(x) && x.id != null) porId[x.id] = x; });
        var out = base.map(function (x) { return esObj(x) && porId.hasOwnProperty(x.id) ? fusionar(x, porId[x.id]) : x; });
        tr.forEach(function (x) {
          if (esObj(x) && x.id != null && !base.some(function (b) { return esObj(b) && b.id === x.id; })) out.push(x);
        });
        return out;
      }
      if (base.length && esObj(base[0])) return base.map(function (x, i) { return fusionar(x, tr[i]); });
      return tr.slice();
    }
    if (esObj(base) && esObj(tr)) {
      var o = {};
      Object.keys(base).forEach(function (k) { o[k] = base[k]; });
      Object.keys(tr).forEach(function (k) { if (k.charAt(0) !== "_") o[k] = fusionar(base[k], tr[k], k); });
      return o;
    }
    return tr;
  }

  // ------------------------------------------------------------------
  // Selector de idioma (bandera + texto)
  // ------------------------------------------------------------------
  var BANDERAS = {
    es: '<svg class="bandera" viewBox="0 0 30 20" width="24" height="16" aria-hidden="true" focusable="false"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>',
    eu: '<svg class="bandera" viewBox="0 0 30 20" width="24" height="16" aria-hidden="true" focusable="false"><rect width="30" height="20" fill="#D52B1E"/><path d="M0 0L30 20M30 0L0 20" stroke="#009B48" stroke-width="3.4"/><path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="3.4"/></svg>'
  };
  function enlace(cod) {
    var pagina = location.pathname.split("/").pop() || "index.html";
    return pagina + "?lang=" + cod;
  }
  function selector() {
    return '<div class="idiomas" role="group" aria-label="' + t("Idioma") + (idioma === BASE ? "" : " / Idioma") + '" translate="no">' +
      Object.keys(IDIOMAS).map(function (cod) {
        var d = IDIOMAS[cod], actual = cod === idioma;
        return '<a class="idioma" href="' + enlace(cod) + '" hreflang="' + cod + '" lang="' + cod + '" data-idioma="' + cod + '"' +
          (actual ? ' aria-current="true"' : "") + ' title="' + d.ver + '" aria-label="' + d.nombre + '">' +
          BANDERAS[cod] + '<span aria-hidden="true">' + d.corto + "</span></a>";
      }).join("") + "</div>";
  }
  // Al cambiar de idioma se conserva el apartado (#ancla) en el que estaba la persona
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-idioma]");
    if (!a) return;
    e.preventDefault();
    var cod = a.getAttribute("data-idioma");
    guardar(cod);
    if (cod === idioma) return;
    location.href = enlace(cod) + location.hash;
  });

  // ------------------------------------------------------------------
  // Traducción automática de los textos fijos de la página
  // (solo cuando el idioma no es el castellano)
  // ------------------------------------------------------------------
  var ATRIBUTOS = ["placeholder", "aria-label", "title", "alt"];
  var SALTAR = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };
  var limpio = function (s) { return String(s).replace(/\s+/g, " ").trim(); };

  function traducirTexto(n) {
    var s = n.nodeValue, k = limpio(s);
    if (!k || !DIC.hasOwnProperty(k)) return;
    var p = n.parentElement;
    if (p && (SALTAR[p.nodeName] || p.closest('[translate="no"]'))) return;
    var m = /^(\s*)[\s\S]*?(\s*)$/.exec(s);
    n.nodeValue = m[1] + DIC[k] + m[2];
  }
  function traducirAtributo(el, a) {
    var v = el.getAttribute(a);
    if (v == null) return;
    var k = limpio(v);
    if (k && DIC.hasOwnProperty(k)) el.setAttribute(a, DIC[k]);
  }
  function traducirElemento(el) {
    var clave = el.getAttribute("data-t");
    if (clave && DIC.hasOwnProperty("html:" + clave)) { el.removeAttribute("data-t"); el.innerHTML = DIC["html:" + clave]; }
    for (var i = 0; i < ATRIBUTOS.length; i++) traducirAtributo(el, ATRIBUTOS[i]);
    if (el.nodeName === "META" && /^(description|apple-mobile-web-app-title)$/.test(el.getAttribute("name") || "")) traducirAtributo(el, "content");
  }
  function recorrer(n) {
    if (n.nodeType === 3) { traducirTexto(n); return; }
    if (n.nodeType !== 1 || SALTAR[n.nodeName]) return;
    if (n.getAttribute("translate") === "no" || (n.parentElement && n.parentElement.closest('[translate="no"]'))) return;
    traducirElemento(n);
    var hijos = n.childNodes;
    for (var i = 0; i < hijos.length; i++) recorrer(hijos[i]);
  }

  if (idioma !== BASE && window.MutationObserver) {
    // Se traduce a medida que el navegador lee la página y cada vez que el JavaScript añade contenido
    new MutationObserver(function (cambios) {
      cambios.forEach(function (c) {
        if (c.type === "childList") { for (var i = 0; i < c.addedNodes.length; i++) recorrer(c.addedNodes[i]); }
        else if (c.type === "attributes") { if (c.target.closest && !c.target.closest('[translate="no"]')) traducirAtributo(c.target, c.attributeName); }
        else if (c.type === "characterData") traducirTexto(c.target);
      });
    }).observe(html, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATRIBUTOS });
    recorrer(html);
  }

  // Páginas con mucho texto fijo (por ejemplo accesibilidad.html) llevan su versión traducida dentro
  // del propio HTML:  <template data-idioma="eu" data-sustituye="id-del-bloque"> …texto en euskera… </template>
  if (idioma !== BASE) {
    document.addEventListener("DOMContentLoaded", function () {
      var ts = document.querySelectorAll('template[data-idioma="' + idioma + '"][data-sustituye]');
      for (var i = 0; i < ts.length; i++) {
        var destino = document.getElementById(ts[i].getAttribute("data-sustituye"));
        if (!destino) continue;
        destino.innerHTML = "";
        destino.appendChild(ts[i].content.cloneNode(true));
      }
    });
  }

  window.I18N = {
    idioma: idioma, base: BASE, idiomas: IDIOMAS,
    t: t, fusionar: fusionar, selector: selector,
    // Ruta del archivo traducido de unos datos, o null si se está en castellano
    rutaDatos: function (nombre) { return idioma === BASE ? null : "datos/" + idioma + "/" + nombre + ".json"; }
  };
})();
