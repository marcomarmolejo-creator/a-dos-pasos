import { businesses } from "./business-data.js";

export const directoryCategories = {
  comer: { label: "Comer", title: "Comer cerca de ti" },
  cafe: { label: "Café", title: "Café cerca de ti" },
  cuidarme: { label: "Cuidarme", title: "Cuidarme cerca de ti" },
  "mi-casa": { label: "Mi casa", title: "Mi casa cerca de ti" },
  servicios: { label: "Servicios", title: "Servicios cerca de ti" },
  promociones: { label: "Promociones", title: "Promociones cerca de ti" },
  nuevos: { label: "Nuevos", title: "Nuevo en la zona" }
};

const terms = {
  comer: ["comer", "comida", "pizza", "pizzeria", "forno"],
  cafe: ["cafe", "cafeteria"],
  cuidarme: ["cuidarme", "spa", "bienestar", "aura", "barberia", "barbero", "corte"],
  "mi-casa": ["mi casa", "casa", "hogar", "lavado", "sala", "colchon", "tapete", "eleva"],
  servicios: ["servicio", "servicios", "veterinaria", "mascotas"],
  promociones: ["promocion", "promociones", "beneficio", "beneficios"],
  nuevos: ["nuevo", "nuevos", "apertura", "novedad"]
};

export const normalizeDirectorySearch = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function resolveDirectoryCategory(query) {
  const normalized = normalizeDirectorySearch(query);
  return Object.entries(terms).find(([, words]) => words.some((word) => normalized.includes(word)))?.[0] || null;
}

export const directoryUrlFor = (category, query = "") => {
  const params = new URLSearchParams();
  if (category && directoryCategories[category]) params.set("categoria", category);
  if (query) params.set("buscar", query);
  return `./directorio.html?${params.toString()}`;
};

const micrositeDirectoryBusinesses = businesses.map((business) => ({
  ...business,
  listingType: "microsite",
  directoryCategory: business.tag,
  address: business.zone === "Querétaro" ? "Servicio a domicilio en tu zona" : "Consulta ubicación en su micrositio",
  schedule: business.isOpen ? "Disponibilidad visible en su micrositio" : "Consulta disponibilidad",
  isDelivery: business.id === "eleva-steam",
  depthSignal: "Experiencia completa"
}));

/*
  REGLAS INTERNAS DE PRODUCTO

  FICHA GRATUITA incluye: nombre, logo, una imagen principal, categoría,
  descripción, zona, dirección, horarios, WhatsApp, Maps y redes.
  No incluye: micrositio, video, galería, promoción incluida, diseño
  promocional ni portada garantizada.

  MICROSITIO puede incluir: galería, video, historia, servicios, precios,
  promociones, beneficios y contenido editorial.

  La portada editorial es selección de A Dos Pasos. Una ficha gratuita puede
  ser seleccionada editorialmente. La portada patrocinada es un espacio
  comercial contratado; no existe una regla que excluya fichas gratuitas.
*/
const freeDemoBusinesses = [
  {
    id: "cafe-patio-demo",
    name: "Café Patio",
    category: "Café",
    directoryCategory: "Café",
    categories: ["cafe"],
    listingType: "free",
    image: "./assets/forno-table.png",
    logo: null,
    description: "Café de especialidad y desayunos para una pausa cerca de casa.",
    zone: "El Refugio",
    address: "Dirección disponible al contactar",
    schedule: "Horario por confirmar",
    distance: "En El Refugio",
    whatsappUrl: null,
    phone: null,
    mapsUrl: null,
    instagramUrl: null,
    facebookUrl: null,
    isOpen: false,
    isNew: false,
    hasPromotion: false,
    isDelivery: false,
    demo: true
  },
  {
    id: "vet-cerca-demo",
    name: "Vet Cerca",
    category: "Mascotas / Servicios",
    directoryCategory: "Servicios",
    categories: ["servicios"],
    listingType: "free",
    image: "./assets/vet-cerca-demo.png",
    logo: null,
    description: "Atención veterinaria y servicios básicos para mascotas de la zona.",
    zone: "El Refugio",
    address: "Dirección disponible al contactar",
    schedule: "Horario por confirmar",
    distance: "En El Refugio",
    whatsappUrl: null,
    phone: null,
    mapsUrl: null,
    instagramUrl: null,
    facebookUrl: null,
    isOpen: false,
    isNew: false,
    hasPromotion: false,
    isDelivery: false,
    demo: true
  }
];

export const directoryBusinesses = [...micrositeDirectoryBusinesses, ...freeDemoBusinesses];
