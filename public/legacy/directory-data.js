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

export const directoryAliases = {
  comer: ["comer", "comida", "restaurante", "pizza", "pizzeria"],
  cafe: ["cafe", "cafeteria"],
  cuidarme: ["cuidarme", "spa", "bienestar", "masaje", "belleza"],
  "mi-casa": ["mi casa", "hogar", "casa", "limpieza", "lavado"],
  servicios: ["servicios", "servicio", "barberia", "barbero", "corte"],
  mascotas: ["mascotas", "mascota", "veterinaria", "veterinario", "perro", "gato"],
  salud: ["salud", "medico", "clinica"],
  promociones: ["promocion", "promociones", "beneficio", "beneficios"],
  nuevos: ["nuevo", "nuevos", "apertura", "novedad"]
};

export const normalizeDirectorySearch = (value = "") => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function resolveDirectoryCategory(query) {
  const normalized = normalizeDirectorySearch(query);
  return Object.entries(directoryAliases).find(([, words]) => words.some((word) => normalized.includes(word)))?.[0] || null;
}

export function findDirectoryAliasCategory(query) {
  const normalized = normalizeDirectorySearch(query);
  return Object.entries(directoryAliases).find(([, words]) => words.includes(normalized))?.[0] || null;
}

export const directoryUrlFor = (category, query = "") => {
  const params = new URLSearchParams();
  if (category && directoryCategories[category] && category !== "todo") params.set("categoria", category);
  if (query) params.set("buscar", query);
  const suffix = params.toString();
  return `/directorio/${suffix ? `?${suffix}` : ""}`;
};

const publishedBusinesses = Array.isArray(window.__PUBLISHED_BUSINESSES__) ? window.__PUBLISHED_BUSINESSES__ : [];
const publishedSlugs = new Set(publishedBusinesses.map((business) => business.id));
const elevaSteam = businesses.find((business) => business.id === "eleva-steam");
const localRealBusinesses = elevaSteam && !publishedSlugs.has(elevaSteam.id) ? [{
  id: elevaSteam.id,
  name: elevaSteam.name,
  category: elevaSteam.category,
  categories: ["mi-casa", "servicios"],
  zone: elevaSteam.zone,
  description: elevaSteam.description,
  image: elevaSteam.image.replace("./", "/"),
  logo: null,
  listingType: "microsite",
  hours: "Consulta disponibilidad",
  whatsapp: elevaSteam.whatsappUrl,
  maps: elevaSteam.mapsUrl,
  badges: ["A domicilio"],
  micrositeUrl: elevaSteam.micrositeUrl,
  isDemo: false,
  openNow: false,
  delivery: true,
  isNew: false,
  hasBenefit: true,
  hasPromotion: false,
  hasMicrosite: true,
  promotionTitle: null,
  promotionDescription: null
}] : [];
export const directoryBusinesses = [...publishedBusinesses.filter((business) => business.isDemo === false), ...localRealBusinesses];
import { businesses } from "./business-data.js";

