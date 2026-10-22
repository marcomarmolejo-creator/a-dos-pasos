export type AuraSpaSection =
  | "hero"
  | "experience"
  | "treatments"
  | "featuredTreatment"
  | "firstVisit"
  | "gallery"
  | "benefitPromotion"
  | "trust"
  | "visit"
  | "reservation"
  | "finalCTA"
  | "footer";

export type AuraTreatment = {
  id: string;
  name: string;
  duration: string;
  description: string;
  priceReference: string;
  priceValidated: boolean;
  image: string;
  whatsappMessage: string;
  cta: string;
};

const whatsappBase = "https://wa.me/524421234567";

export function auraWhatsapp(message: string) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

const treatmentAsset = (name: string) => `/assets/aura-spa/treatments/${name}`;

export const auraSpa = {
  dataSource: "local" as const,
  name: "Aura Spa",
  slug: "aura-spa",
  category: "Bienestar",
  zone: "El Refugio",
  locationLabel: "El Refugio · Querétaro",
  shortDescription: "Masajes, rituales y una pausa para volver a tu centro.",
  heroImage: "/assets/aura-spa.jpg",
  platformLogo: "/assets/logo-a-dos-pasos-blanco.png",
  whatsapp: {
    base: whatsappBase,
    validated: false,
    generalMessage: "Hola, vi Aura Spa en A Dos Pasos y quisiera reservar una cita."
  },
  socials: {
    instagram: null,
    facebook: null
  },
  experience: {
    eyebrow: "Tu momento",
    title: "Un espacio para desconectar del ruido",
    description: "Tratamientos pensados para ayudarte a relajarte, cuidar tu cuerpo y regalarte un momento para ti.",
    image: treatmentAsset("dia-bienestar.jpg"),
    caption: "Tu pausa empieza antes del tratamiento."
  },
  treatments: [
    { id: "masaje-relajante", name: "Masaje relajante", duration: "60 min", description: "Movimientos suaves y pausados para liberar el ritmo del día.", priceReference: "Desde $750", priceValidated: false, image: treatmentAsset("masaje-relajante.jpg"), whatsappMessage: "Hola, vi el Masaje relajante de Aura Spa en A Dos Pasos y quisiera reservarlo.", cta: "Reservar" },
    { id: "masaje-descontracturante", name: "Masaje descontracturante", duration: "60 min", description: "Trabajo focalizado para acompañar zonas con tensión acumulada.", priceReference: "Desde $850", priceValidated: false, image: treatmentAsset("masaje-descontracturante.jpg"), whatsappMessage: "Hola, vi el Masaje descontracturante de Aura Spa en A Dos Pasos y quisiera reservarlo.", cta: "Reservar" },
    { id: "facial-hidratante", name: "Facial hidratante", duration: "50 min", description: "Limpieza suave e hidratación para una piel con apariencia luminosa.", priceReference: "Desde $690", priceValidated: false, image: treatmentAsset("facial-hidratante.jpg"), whatsappMessage: "Hola, vi el Facial hidratante de Aura Spa en A Dos Pasos y quisiera reservarlo.", cta: "Reservar" },
    { id: "limpieza-facial-profunda", name: "Limpieza facial profunda", duration: "60 min", description: "Un protocolo cuidadoso de limpieza, preparación e hidratación.", priceReference: "Desde $790", priceValidated: false, image: treatmentAsset("limpieza-facial.jpg"), whatsappMessage: "Hola, vi la Limpieza facial profunda de Aura Spa en A Dos Pasos y quisiera reservarla.", cta: "Reservar" },
    { id: "ritual-corporal", name: "Ritual corporal", duration: "90 min", description: "Exfoliación, masaje y cuidado corporal en una experiencia completa.", priceReference: "Desde $1,150", priceValidated: false, image: treatmentAsset("ritual-corporal.jpg"), whatsappMessage: "Hola, vi el Ritual corporal de Aura Spa en A Dos Pasos y quisiera reservarlo.", cta: "Reservar" },
    { id: "reflexologia", name: "Reflexología", duration: "45 min", description: "Una pausa enfocada en pies y piernas, con atención personalizada.", priceReference: "Desde $590", priceValidated: false, image: treatmentAsset("reflexologia.jpg"), whatsappMessage: "Hola, vi la sesión de Reflexología de Aura Spa en A Dos Pasos y quisiera reservarla.", cta: "Reservar" },
    { id: "spa-en-pareja", name: "Spa en pareja", duration: "90 min", description: "Dos cabinas preparadas para compartir una pausa sin prisas.", priceReference: "Desde $1,850", priceValidated: false, image: treatmentAsset("spa-pareja.jpg"), whatsappMessage: "Hola, vi el Spa en pareja de Aura Spa en A Dos Pasos y quisiera reservarlo.", cta: "Reservar" },
    { id: "dia-de-bienestar", name: "Día de bienestar", duration: "Paquete especial", description: "Una selección de cuidados para dedicarte una pausa más larga.", priceReference: "Desde $2,200", priceValidated: false, image: treatmentAsset("dia-bienestar.jpg"), whatsappMessage: "Hola, vi el Día de bienestar de Aura Spa en A Dos Pasos y quisiera conocer disponibilidad.", cta: "Consultar" }
  ] satisfies AuraTreatment[],
  featuredTreatment: {
    id: "ritual-aura",
    name: "Ritual Aura",
    durationReference: "90 minutos",
    durationValidated: false,
    description: "Una experiencia que combina masaje relajante, aromaterapia y cuidado corporal.",
    priceReference: "$1,150 MXN",
    priceValidated: false,
    image: "/assets/aura-ritual.jpg",
    whatsappMessage: "Hola, vi el Ritual Aura en A Dos Pasos y quisiera conocer disponibilidad."
  },
  firstVisitGuide: {
    title: "Empieza por aquí",
    intro: "Cuatro caminos sencillos para elegir según cómo quieres sentirte hoy.",
    recommendations: [
      { number: "01", need: "Quiero relajarme", treatment: "Masaje relajante", note: "Una pausa suave para bajar el ritmo y recuperar calma." },
      { number: "02", need: "Necesito liberar tensión", treatment: "Masaje descontracturante", note: "Atención enfocada en las zonas que sienten la carga del día." },
      { number: "03", need: "Busco cuidado facial", treatment: "Facial hidratante", note: "Limpieza suave e hidratación dentro de una experiencia de cuidado." },
      { number: "04", need: "Quiero una experiencia especial", treatment: "Ritual Aura", note: "Una pausa más completa para regalarte tiempo de calidad." }
    ],
    whatsappMessage: "Hola, vi Aura Spa en A Dos Pasos y quisiera orientación para elegir un tratamiento."
  },
  gallery: [
    { src: treatmentAsset("facial-hidratante.jpg"), label: "Cuidado facial", position: "52% 42%" },
    { src: treatmentAsset("ritual-corporal.jpg"), label: "Texturas", position: "50% 50%" },
    { src: treatmentAsset("spa-pareja.jpg"), label: "Cabina doble", position: "50% 55%" },
    { src: treatmentAsset("reflexologia.jpg"), label: "Atención", position: "62% 50%" },
    { src: treatmentAsset("limpieza-facial.jpg"), label: "Cada detalle", position: "52% 42%" },
    { src: treatmentAsset("dia-bienestar.jpg"), label: "La pausa", position: "52% 52%" }
  ],
  benefit: {
    title: "15 minutos de aromaterapia sin costo",
    description: "En tu primera reserva de masaje de 60 minutos.",
    terms: "Sujeto a vigencia y disponibilidad.",
    validated: false
  },
  promotion: {
    title: "Miércoles de bienestar",
    description: "Masaje relajante de 60 min por $650",
    startDateReference: "2026-09-01",
    endDateReference: "2026-12-16",
    validated: false
  },
  trust: [
    { number: "01", title: "Atención personalizada", text: "Escuchamos lo que necesitas antes de empezar." },
    { number: "02", title: "Espacios privados", text: "Cabinas tranquilas preparadas para cada cita." },
    { number: "03", title: "Higiene en cada sesión", text: "Textiles limpios y superficies preparadas antes de recibirte." }
  ],
  schedule: {
    validated: false,
    reference: [
      { days: "Lunes a viernes", time: "10:00 – 20:00" },
      { days: "Sábado", time: "10:00 – 18:00" },
      { days: "Domingo", time: "11:00 – 16:00" }
    ]
  },
  location: {
    validated: false,
    name: "Aura Spa",
    exactAddressReference: "Paseo del Refugio 310, El Refugio, Querétaro",
    latitudeReference: 20.650715,
    longitudeReference: -100.351524,
    mapsUrlReference: "https://www.google.com/maps/search/?api=1&query=Aura+Spa+El+Refugio+Queretaro"
  },
  sectionOrder: ["hero", "experience", "treatments", "featuredTreatment", "firstVisit", "gallery", "benefitPromotion", "trust", "visit", "reservation", "finalCTA", "footer"] satisfies AuraSpaSection[]
};
