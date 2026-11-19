/*
 * ============================================================
 *  CONTENIDOS DE LA WEB  ·  Edita este archivo para cambiar textos
 * ============================================================
 *
 *  Hay dos listas:
 *
 *  1) CATEGORIAS: las temáticas que aparecen como botones de filtro.
 *     - id:          palabra corta sin espacios ni tildes (se usa internamente)
 *     - nombre:      el texto que verá el visitante
 *     - icono:       un emoji que acompaña a la temática
 *     - descripcion: una frase breve
 *
 *  2) ARTICULOS: cada tarjeta de contenido.
 *     - categoria:   debe coincidir con el "id" de una categoría
 *     - titulo, resumen: textos cortos para la tarjeta
 *     - contenido:   el texto completo. Separa párrafos con una línea en blanco.
 *                    Las líneas que empiezan por "- " se muestran como lista.
 *     - destacado:   true para mostrarlo en "Destacados" (opcional)
 *
 *  Para añadir un artículo, copia un bloque { ... }, pégalo debajo
 *  (con una coma entre bloques) y cambia los textos.
 *  Para borrar una temática, quita su bloque de CATEGORIAS y sus artículos.
 * ============================================================
 */

window.CATEGORIAS = [
  { id: "higiene",      nombre: "Higiene y cuidado personal", icono: "🛁", descripcion: "Aseo, piel, boca y vestido con dignidad y seguridad." },
  { id: "alimentacion", nombre: "Alimentación",               icono: "🥗", descripcion: "Dietas, hidratación y ayuda para comer." },
  { id: "movilidad",    nombre: "Movilidad y caídas",         icono: "🦯", descripcion: "Movilizaciones, transferencias y prevención de caídas." },
  { id: "medicacion",   nombre: "Medicación y salud",         icono: "💊", descripcion: "Organización de tratamientos y señales de alerta." },
  { id: "memoria",      nombre: "Memoria y demencias",        icono: "🧠", descripcion: "Acompañar el deterioro cognitivo con calma." },
  { id: "hogar",        nombre: "Hogar seguro",               icono: "🏡", descripcion: "Adaptaciones sencillas para vivir con autonomía." },
  { id: "cuidador",     nombre: "Cuidar al cuidador",         icono: "🤝", descripcion: "Descanso, apoyo emocional y recursos." },
  { id: "tramites",     nombre: "Ayudas y trámites",          icono: "📋", descripcion: "Dependencia, prestaciones y servicios disponibles." }
];

window.ARTICULOS = [
  {
    categoria: "higiene",
    titulo: "Aseo en cama paso a paso",
    resumen: "Cómo realizar un aseo completo, cómodo y respetuoso cuando la persona no puede levantarse.",
    destacado: true,
    contenido: `Antes de empezar, prepara todo lo necesario para no dejar sola a la persona: dos palanganas con agua templada, jabón neutro, esponjas, toallas y ropa limpia.

Explica cada paso antes de hacerlo y cubre con una toalla las zonas que no estés lavando para preservar su intimidad y evitar que pase frío.

- Lava de las zonas más limpias a las más sucias: cara, brazos, tórax, piernas y por último zona genital.
- Seca bien los pliegues de la piel, sobre todo axilas, ingles y entre los dedos.
- Aprovecha para revisar la piel en busca de rojeces o heridas.
- Aplica crema hidratante con un suave masaje.

Si observas una zona enrojecida que no desaparece al dejar de presionar, coméntalo con su enfermera o médico.`
  },
  {
    categoria: "higiene",
    titulo: "Prevenir las úlceras por presión",
    resumen: "Cambios posturales, hidratación de la piel y señales de alerta para actuar a tiempo.",
    contenido: `Las úlceras por presión aparecen cuando una zona del cuerpo soporta presión durante mucho tiempo. Son más frecuentes en talones, caderas, sacro y codos.

- Cambia de postura a la persona encamada cada 2 o 3 horas.
- Mantén la piel limpia, seca e hidratada.
- Usa cojines o colchones antiescaras si te los recomiendan.
- Evita arrugas en las sábanas y arrastrar a la persona al moverla.

Una buena alimentación e hidratación también protege la piel.`
  },
  {
    categoria: "alimentacion",
    titulo: "Hidratación en personas mayores",
    resumen: "Con la edad disminuye la sensación de sed. Pequeños trucos para beber lo suficiente.",
    destacado: true,
    contenido: `Las personas mayores sienten menos sed, por lo que pueden deshidratarse sin darse cuenta. Los signos de alerta son boca seca, orina oscura, cansancio o confusión.

- Ofrece agua con frecuencia, aunque no la pidan.
- Deja siempre un vaso o botella a la vista y al alcance.
- Incluye caldos, infusiones, gelatinas y frutas con mucha agua.
- Si hay problemas para tragar líquidos, consulta sobre el uso de espesantes.`
  },
  {
    categoria: "alimentacion",
    titulo: "Ayudar a comer con dificultad para tragar",
    resumen: "Postura, texturas adecuadas y qué hacer si la persona se atraganta.",
    contenido: `La dificultad para tragar (disfagia) es frecuente tras un ictus o en demencias avanzadas.

- Siéntala bien erguida, con la barbilla ligeramente hacia abajo.
- Ofrece cucharadas pequeñas y espera a que trague antes de la siguiente.
- Evita distracciones como la televisión mientras come.
- Mantén la postura sentada al menos 30 minutos después de comer.

Si tose con frecuencia al comer o beber, pide valoración a su equipo sanitario.`
  },
  {
    categoria: "movilidad",
    titulo: "Prevenir caídas en casa",
    resumen: "La mayoría de caídas se pueden evitar con pequeños cambios y buenos hábitos.",
    destacado: true,
    contenido: `Las caídas son una de las principales causas de pérdida de autonomía en personas mayores.

- Retira alfombras sueltas y cables del suelo.
- Asegura una buena iluminación, también por la noche (luces de pasillo).
- Usa calzado cerrado y con suela antideslizante.
- Instala barras de apoyo en el baño.
- Revisa con su médico los medicamentos que puedan causar mareo.

Mantenerse activo con paseos y ejercicios de equilibrio también reduce el riesgo.`
  },
  {
    categoria: "movilidad",
    titulo: "Pasar de la cama a la silla",
    resumen: "Técnica segura para la persona y para tu espalda.",
    contenido: `Antes de empezar, coloca la silla junto a la cama, frenada y en ángulo.

- Ayuda a la persona a sentarse en el borde de la cama con los pies apoyados en el suelo.
- Flexiona tus rodillas y mantén la espalda recta.
- Sujétala por la cintura o con un cinturón de transferencia, nunca por los brazos.
- Gira junto a ella pivotando sobre los pies y siéntala despacio.

Si necesitas hacer mucha fuerza, pide información sobre grúas o tablas de transferencia.`
  },
  {
    categoria: "medicacion",
    titulo: "Organizar la medicación semanal",
    resumen: "Pastilleros, listas y rutinas para no olvidar ni repetir dosis.",
    contenido: `Cuando se toman varios medicamentos, una buena organización evita errores.

- Usa un pastillero semanal con compartimentos por día y hora.
- Ten una lista actualizada con cada medicamento, dosis y para qué sirve.
- Asocia las tomas a rutinas fijas como el desayuno o la cena.
- Lleva la lista siempre a las consultas médicas.

Nunca cambies ni suspendas un tratamiento sin consultarlo.`
  },
  {
    categoria: "medicacion",
    titulo: "Señales de alerta que requieren atención",
    resumen: "Cuándo llamar al centro de salud o al 112.",
    contenido: `Llama al 112 ante dolor en el pecho, dificultad para respirar, pérdida de fuerza en un lado del cuerpo, dificultad para hablar o pérdida de consciencia.

Consulta con su centro de salud si aparece:

- Fiebre que no baja.
- Confusión o somnolencia nueva.
- Dejar de comer o beber.
- Una caída, aunque parezca leve.`
  },
  {
    categoria: "memoria",
    titulo: "Comunicarse con una persona con demencia",
    resumen: "Frases cortas, tono tranquilo y mucha paciencia.",
    contenido: `La forma de comunicarnos puede reducir mucho la ansiedad de la persona.

- Ponte a su altura y mírale a los ojos.
- Usa frases cortas y una sola idea cada vez.
- No le corrijas ni discutas; acompaña su emoción.
- Apóyate en gestos, caricias y una sonrisa.

Mantener rutinas diarias estables le aporta seguridad.`
  },
  {
    categoria: "hogar",
    titulo: "Adaptar el baño",
    resumen: "El baño es el lugar de más riesgo. Ideas sencillas y económicas.",
    contenido: `Pequeñas adaptaciones mejoran mucho la seguridad y la autonomía.

- Cambia la bañera por un plato de ducha a ras de suelo si es posible.
- Coloca una silla o taburete de ducha.
- Instala barras de apoyo junto al inodoro y la ducha.
- Usa alfombrillas antideslizantes dentro y fuera.
- Un elevador de inodoro facilita sentarse y levantarse.`
  },
  {
    categoria: "cuidador",
    titulo: "Reconocer el cansancio del cuidador",
    resumen: "Cuidar de ti también es cuidar de la persona a la que atiendes.",
    destacado: true,
    contenido: `Cuidar de forma continuada puede generar agotamiento físico y emocional.

Señales a tener en cuenta:

- Cansancio que no mejora con el descanso.
- Irritabilidad, tristeza o sensación de culpa.
- Abandono de tus aficiones y relaciones.

Pide ayuda a familiares, busca grupos de apoyo y consulta los servicios de respiro de tu zona. Reservar un rato al día para ti no es egoísmo.`
  },
  {
    categoria: "tramites",
    titulo: "Solicitar la valoración de dependencia",
    resumen: "Primeros pasos para acceder a ayudas y servicios.",
    contenido: `La valoración de la situación de dependencia da acceso a servicios como ayuda a domicilio, centro de día o prestaciones económicas.

- Acude a los servicios sociales de tu ayuntamiento o de tu comunidad autónoma.
- Prepara el informe de salud actualizado de su médico.
- Rellena la solicitud con los datos de la persona y del cuidador.

Una trabajadora social puede orientarte durante todo el proceso.`
  }
];
