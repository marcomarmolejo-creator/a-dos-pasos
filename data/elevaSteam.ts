export type ElevaSteamSection =
  | "hero"
  | "beforeAfter"
  | "video"
  | "services"
  | "process"
  | "pricing"
  | "pets"
  | "coverage"
  | "howToQuote"
  | "finalCTA"
  | "footer";

export type ElevaSteamService = {
  name: string;
  description: string;
  price: string;
  priceNote?: string;
  image?: string;
  whatsappMessage: string;
  cta: string;
};

const whatsappBase = "https://wa.me/524421316100";

export function elevaWhatsapp(message: string) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

export const elevaSteam = {
  dataSource: "local" as const,
  name: "Eleva Steam",
  slug: "eleva-steam",
  category: "Lavado profesional a domicilio",
  zone: "Querétaro y alrededores",
  shortDescription: "Lavado profundo para salas, colchones y tapetes con atención en tu hogar.",
  longDescription: "Lavado profundo con vapor para salas, colchones y tapetes, sin que tengas que salir de casa.",
  logo: "/assets/eleva-steam/logo-eleva-steam-blanco.png",
  platformLogo: "/assets/eleva-steam/a-dos-pasos-logo-horizontal-blanco.png",
  heroImage: "/assets/eleva-steam.jpg",
  whatsapp: whatsappBase,
  phoneDisplay: "442 131 6100",
  phoneHref: "tel:+524421316100",
  schedule: "Disponibilidad por confirmar",
  services: [
    { name: "Sala sencilla", description: "2–3 piezas.", price: "$850", image: "/assets/eleva-steam/servicios/sala-sencilla.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de una sala sencilla de 2–3 piezas.", cta: "Cotizar esta pieza" },
    { name: "Sala tipo L sencilla", description: "Cotización según tamaño y condición.", price: "$850", image: "/assets/eleva-steam/servicios/sala-tipo-l-sencilla.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de una sala tipo L sencilla.", cta: "Cotizar esta pieza" },
    { name: "Sala tipo L con desprendibles", description: "Cotización según número de piezas.", price: "$1,100", image: "/assets/eleva-steam/servicios/sala-tipo-l-desprendibles.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de una sala tipo L con desprendibles.", cta: "Cotizar esta pieza" },
    { name: "Sala grande", description: "Envíanos una foto para confirmar el precio.", price: "$1,450", image: "/assets/eleva-steam/servicios/sala-grande.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de una sala grande.", cta: "Cotizar esta pieza" },
    { name: "Sillón individual", description: "Lavado de una pieza en tu domicilio.", price: "$450", image: "/assets/eleva-steam/servicios/sillon-individual.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de un sillón individual.", cta: "Cotizar esta pieza" },
    { name: "Colchón individual", description: "Lavado de cara superior y laterales.", price: "$500", image: "/assets/eleva-steam/servicios/colchon-individual.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de un colchón individual.", cta: "Cotizar esta pieza" },
    { name: "Colchón matrimonial", description: "Lavado de cara superior y laterales.", price: "$600", image: "/assets/eleva-steam/servicios/colchon-matrimonial.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de un colchón matrimonial.", cta: "Cotizar esta pieza" },
    { name: "Colchón Queen", description: "Lavado de cara superior y laterales.", price: "$680", image: "/assets/eleva-steam/servicios/colchon-queen.jpg", whatsappMessage: "Hola, quiero cotizar el lavado de un colchón Queen.", cta: "Cotizar esta pieza" },
    { name: "Colchón King", description: "Lavado de cara superior y laterales.", price: "$780", image: "/assets/eleva-steam/servicios/colchon-king.jpg", priceNote: "Incluye cara superior y laterales, aspirado inferior y sanitizado con vapor. Segunda cara +$350.", whatsappMessage: "Hola, quiero cotizar el lavado de un colchón King.", cta: "Cotizar esta pieza" },
    { name: "Tapetes", description: "Precio según medidas.", price: "$600", image: "/assets/eleva-steam/servicios/tapete.jpg", priceNote: "En superficies mayores puede cotizarse aproximadamente por m².", whatsappMessage: "Hola, quiero cotizar el lavado de un tapete.", cta: "Cotizar esta pieza" },
    { name: "Alfombra de habitación", description: "Precio según medidas.", price: "$1,100", image: "/assets/eleva-steam/servicios/alfombra-habitacion.jpg", priceNote: "En superficies mayores puede cotizarse aproximadamente por m².", whatsappMessage: "Hola, quiero cotizar el lavado de una alfombra de habitación.", cta: "Cotizar esta pieza" },
    { name: "Comedor", description: "Asiento desde $85 c/u · asiento y respaldo desde $150 c/u.", price: "$450 de servicio mínimo", image: "/assets/eleva-steam/servicios/comedor.jpg", priceNote: "Cotización según cantidad y características.", whatsappMessage: "Hola, quiero cotizar el lavado de las sillas de mi comedor.", cta: "Cotizar esta pieza" }
  ] satisfies ElevaSteamService[],
  pricing: [
    ["Sala sencilla · 2–3 piezas", "$850"],
    ["Sala tipo L sencilla", "$850"],
    ["Sala tipo L con desprendibles", "$1,100"],
    ["Sala grande", "$1,450"],
    ["Sillón individual", "$450"],
    ["Colchón individual", "$500"],
    ["Colchón matrimonial", "$600"],
    ["Colchón Queen", "$680"],
    ["Colchón King", "$780"],
    ["Tapetes", "$600"],
    ["Alfombra de habitación", "$1,100"],
    ["Comedor · servicio mínimo", "$450"]
  ] as const,
  process: [
    { number: "01", name: "Revisamos", description: "Evaluamos tela, manchas y condición." },
    { number: "02", name: "Aspiramos", description: "Retiramos polvo y residuos superficiales." },
    { number: "03", name: "Tratamos", description: "Aplicamos producto según la necesidad." },
    { number: "04", name: "Vaporizamos", description: "Trabajamos con vapor a alta temperatura." },
    { number: "05", name: "Extraemos", description: "Retiramos humedad y suciedad." },
    { number: "06", name: "Verificamos", description: "Revisamos el resultado antes de terminar." }
  ],
  video: {
    src: "/assets/eleva-steam/asi-luce-tu-sala.mp4",
    poster: "/assets/eleva-steam.jpg",
    title: "Así luce tu sala después del servicio"
  },
  beforeAfter: {
    before: "/assets/eleva-steam/sillon-antes.jpg",
    after: "/assets/eleva-resultado.jpg"
  },
  pets: {
    title: "También atendemos accidentes cotidianos",
    description: "Orina, olores, manchas, pelo y uso frecuente. Cada caso se revisa antes de confirmar el tratamiento.",
    whatsappMessage: "Hola, quiero enviar una foto para consultar un accidente de mascota."
  },
  useCases: [
    { title: "Tengo niños", description: "Uso diario, comida y manchas." },
    { title: "Tengo mascotas", description: "Accidentes, olores, pelo y uso frecuente." },
    { title: "Quiero limpiar mi colchón", description: "Uso, polvo y mantenimiento." },
    { title: "Quiero recuperar una sala", description: "Suciedad acumulada y manchas visibles." },
    { title: "Tengo Airbnb u oficina", description: "Mantenimiento periódico." }
  ],
  coverage: ["Querétaro", "El Refugio", "Zibatá", "Zakia", "La Pradera", "Zonas cercanas"],
  howToQuote: [
    { number: "1", title: "Envía una fotografía", description: "Comparte por WhatsApp el mueble que quieres limpiar." },
    { number: "2", title: "Revisamos el servicio", description: "Evaluamos tamaño, piezas, condición, manchas u olores." },
    { number: "3", title: "Confirmamos precio y disponibilidad", description: "Te compartimos la cotización antes de agendar." }
  ],
  benefit: {
    title: "Evaluación sin costo por WhatsApp",
    description: "Envíanos una fotografía de tu sala, colchón o tapete y te orientamos antes de agendar.",
    whatsappMessage: "Hola, quiero una evaluación por WhatsApp. Te comparto una foto de mi mueble."
  },
  generalWhatsappMessage: "Hola, vi Eleva Steam en A Dos Pasos y quisiera cotizar un servicio de lavado. Te comparto una foto de mi mueble.",
  sectionOrder: ["hero", "beforeAfter", "video", "services", "process", "pricing", "pets", "coverage", "howToQuote", "finalCTA", "footer"] satisfies ElevaSteamSection[]
};
