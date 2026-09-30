import { businesses } from "./business-data.js";

export const directoryCategories = {
  todo: { label: "Todo" },
  comer: { label: "Comer" },
  cafe: { label: "Café" },
  cuidarme: { label: "Cuidarme" },
  "mi-casa": { label: "Mi casa" },
  servicios: { label: "Servicios" },
  mascotas: { label: "Mascotas" },
  salud: { label: "Salud" },
  promociones: { label: "Promociones" },
  nuevos: { label: "Nuevos" }
};

const terms = {
  comer: ["comer", "comida", "pizza", "pizzeria", "forno"],
  cafe: ["cafe", "cafeteria"],
  cuidarme: ["cuidarme", "spa", "bienestar", "aura", "barberia", "barbero", "corte"],
  "mi-casa": ["mi casa", "casa", "hogar", "limpieza", "lavado", "sala", "colchon", "tapete", "eleva"],
  servicios: ["servicio", "servicios", "veterinaria", "mascotas"],
  mascotas: ["mascota", "mascotas", "veterinaria", "veterinario"],
  salud: ["salud", "medico", "clinica"],
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
  if (category && directoryCategories[category] && category !== "todo") params.set("categoria", category);
  if (query) params.set("buscar", query);
  const suffix = params.toString();
  return `/directorio/${suffix ? `?${suffix}` : ""}`;
};

const categoryOverrides = {
  "forno-locale": ["comer", "promociones", "nuevos"],
  "aura-spa": ["cuidarme", "promociones"],
  "barberia-clasica": ["cuidarme", "servicios"],
  "eleva-steam": ["mi-casa", "servicios"]
};

const micrositeDirectoryBusinesses = businesses.map((business) => ({
  id: business.id,
  name: business.name,
  category: business.category,
  categories: categoryOverrides[business.id],
  zone: business.zone,
  description: business.id === "eleva-steam" ? "Limpieza y lavado profundo para salas, colchones y tapetes a domicilio." : business.description,
  image: business.image.replace("./", "/"),
  logo: null,
  listingType: "microsite",
  hours: business.isOpen ? "Disponibilidad en su micrositio" : "Consulta disponibilidad",
  whatsapp: business.whatsappUrl,
  maps: business.mapsUrl,
  badges: [business.isNew ? "Nuevo" : null, business.status === "Abierto ahora" ? "Abierto ahora" : null, business.id === "eleva-steam" ? "A domicilio" : null, business.hasPromotion ? "Beneficio" : null, /^A \d+ min$/.test(business.distance) ? business.distance : null].filter(Boolean).slice(0, 2),
  micrositeUrl: business.micrositeUrl,
  isDemo: false,
  isOpen: business.isOpen,
  isNew: business.isNew,
  hasBenefit: business.hasPromotion,
  isDelivery: business.id === "eleva-steam"
}));

const freeDemoBusinesses = [
  {
    id: "cafe-patio-demo", name: "Café Patio", category: "Café", categories: ["cafe"], zone: "El Refugio",
    description: "Café de especialidad y desayunos para una pausa cerca de casa.", image: "/assets/cafe-patio-demo.svg", logo: null,
    listingType: "free", hours: "8:00–20:00", whatsapp: null, maps: null, badges: ["A 5 min"], micrositeUrl: null,
    isDemo: true, isOpen: true, isNew: false, hasBenefit: false, isDelivery: false
  },
  {
    id: "vet-cerca-demo", name: "Vet Cerca", category: "Mascotas", categories: ["mascotas", "servicios"], zone: "El Refugio",
    description: "Atención veterinaria y servicios básicos para mascotas de la zona.", image: "/assets/vet-cerca-demo.png", logo: null,
    listingType: "free", hours: "Horario por confirmar", whatsapp: null, maps: null, badges: [], micrositeUrl: null,
    isDemo: true, isOpen: false, isNew: false, hasBenefit: false, isDelivery: false
  }
];

export const directoryBusinesses = [...micrositeDirectoryBusinesses, ...freeDemoBusinesses];
