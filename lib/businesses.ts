import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Business, BusinessTheme } from "@/data/businesses";

export type ListingType = "ficha" | "micrositio";

export type PublishedBusiness = {
  id: string;
  created_at: string;
  updated_at: string;
  business_name: string;
  slug: string | null;
  category: string;
  short_description: string;
  zone: string;
  address: string | null;
  maps_url: string | null;
  business_hours: string | null;
  home_service: boolean;
  whatsapp: string;
  phone: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  logo_url: string | null;
  main_image_url: string | null;
  promotion_title: string | null;
  promotion_description: string | null;
  listing_type: ListingType;
  theme: BusinessTheme | null;
};

export type DirectoryBusiness = {
  id: string;
  name: string;
  category: string;
  categories: string[];
  zone: string;
  description: string;
  image: string;
  logo: string | null;
  listingType: "free" | "microsite";
  hours: string;
  whatsapp: string | null;
  maps: string | null;
  badges: string[];
  micrositeUrl: string | null;
  isDemo: false;
  openNow: false;
  delivery: boolean;
  isNew: boolean;
  hasBenefit: boolean;
  hasMicrosite: boolean;
};

const PUBLIC_FIELDS = [
  "id", "created_at", "updated_at", "business_name", "slug", "category",
  "short_description", "zone", "address", "maps_url", "business_hours",
  "home_service", "whatsapp", "phone", "instagram", "facebook", "website",
  "logo_url", "main_image_url", "promotion_title", "promotion_description",
  "listing_type", "theme"
].join(",");

let client: SupabaseClient | null = null;
let publishedBusinessesPromise: Promise<PublishedBusiness[]> | null = null;

function getPublicClient() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  return client;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

export function publishedBusinessSlug(business: PublishedBusiness) {
  return business.slug?.trim() || slugify(business.business_name);
}

async function fetchPublishedBusinesses() {
  const supabase = getPublicClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from("published_businesses").select(PUBLIC_FIELDS).order("business_name");
    if (error) {
      if (process.env.NODE_ENV !== "production") console.error("Published businesses unavailable", error.message);
      return [];
    }
    const unique = new Map<string, PublishedBusiness>();
    for (const row of (data ?? []) as unknown as PublishedBusiness[]) {
      const slug = publishedBusinessSlug(row);
      if (slug && !unique.has(slug)) unique.set(slug, row);
    }
    return [...unique.values()];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Published businesses request failed", error);
    return [];
  }
}

export function getPublishedBusinesses() {
  publishedBusinessesPromise ??= fetchPublishedBusinesses();
  return publishedBusinessesPromise;
}

export async function getPublishedBusinessBySlug(slug: string) {
  return (await getPublishedBusinesses()).find((business) => publishedBusinessSlug(business) === slug) ?? null;
}

export async function getPublishedBusinessesByCategory(category: string) {
  const normalized = slugify(category);
  return (await getPublishedBusinesses()).filter((business) => slugify(business.category) === normalized);
}

export async function getPublishedBusinessesByZone(zone: string) {
  const normalized = slugify(zone);
  return (await getPublishedBusinesses()).filter((business) => slugify(business.zone) === normalized);
}

function publicAssetUrl(path: string | null) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  if (/^https:\/\//.test(path) && path.includes("/storage/v1/object/public/business-public/")) return path;
  const cleanPath = path.replace(/^business-public\//, "").replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/business-public/${cleanPath.split("/").map(encodeURIComponent).join("/")}`;
}

function whatsappUrl(value: string | null) {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits.length === 10 ? `52${digits}` : digits}`;
}

function mapsUrl(business: PublishedBusiness) {
  if (business.maps_url) return business.maps_url;
  const query = [business.address, business.zone, "Querétaro"].filter(Boolean).join(", ");
  return query ? `https://maps.google.com/?q=${encodeURIComponent(query)}` : null;
}

function directoryCategories(category: string, homeService: boolean, hasPromotion: boolean) {
  const value = slugify(category);
  const categories = new Set<string>();
  if (/pizza|restaurante|comer|comida/.test(value)) categories.add("comer");
  if (/cafe|cafeteria/.test(value)) categories.add("cafe");
  if (/spa|bienestar|masaje|belleza|barber/.test(value)) categories.add("cuidarme");
  if (/limpieza|lavado|hogar|casa/.test(value) || homeService) categories.add("mi-casa");
  if (/servicio|barber|limpieza|lavado/.test(value) || homeService) categories.add("servicios");
  if (/mascota|veterin/.test(value)) categories.add("mascotas");
  if (/salud|medic|clinic/.test(value)) categories.add("salud");
  if (hasPromotion) categories.add("promociones");
  if (!categories.size) categories.add("servicios");
  return [...categories];
}

function isRecent(createdAt: string) {
  const created = new Date(createdAt).getTime();
  return Number.isFinite(created) && Date.now() - created <= 30 * 24 * 60 * 60 * 1000;
}

export function toDirectoryBusiness(business: PublishedBusiness): DirectoryBusiness {
  const slug = publishedBusinessSlug(business);
  const hasBenefit = Boolean(business.promotion_title || business.promotion_description);
  const isNew = isRecent(business.created_at);
  const hasMicrosite = business.listing_type === "micrositio";
  return {
    id: slug,
    name: business.business_name,
    category: business.category,
    categories: [...directoryCategories(business.category, business.home_service, hasBenefit), ...(isNew ? ["nuevos"] : [])],
    zone: business.zone,
    description: business.short_description,
    image: publicAssetUrl(business.main_image_url) ?? "/assets/mockup-ficha.png",
    logo: publicAssetUrl(business.logo_url),
    listingType: hasMicrosite ? "microsite" : "free",
    hours: business.business_hours || "Consulta disponibilidad",
    whatsapp: whatsappUrl(business.whatsapp),
    maps: mapsUrl(business),
    badges: [isNew ? "Nuevo" : null, business.home_service ? "A domicilio" : null, hasBenefit ? "Beneficio" : null].filter((value): value is string => Boolean(value)).slice(0, 2),
    micrositeUrl: hasMicrosite ? `/negocio/${slug}/` : null,
    isDemo: false,
    openNow: false,
    delivery: business.home_service,
    isNew,
    hasBenefit,
    hasMicrosite
  };
}

export function themeForBusiness(business: PublishedBusiness): BusinessTheme {
  if (business.theme && ["warm-editorial", "serene-light", "dark-classic", "clean-service"].includes(business.theme)) return business.theme;
  const category = slugify(business.category);
  if (/comer|comida|pizza|restaurante|cafe/.test(category)) return "warm-editorial";
  if (/cuidarme|spa|bienestar|masaje/.test(category)) return "serene-light";
  if (/barber|belleza-masculina/.test(category)) return "dark-classic";
  return "clean-service";
}

export function toMicrositeBusiness(business: PublishedBusiness): Business {
  const mainImage = publicAssetUrl(business.main_image_url) ?? "/assets/mockup-ficha.png";
  const logo = publicAssetUrl(business.logo_url);
  const contact = whatsappUrl(business.whatsapp) ?? "https://wa.me/524424223487";
  const promotion = business.promotion_title || business.promotion_description ? {
    title: business.promotion_title || "Beneficio disponible",
    description: business.promotion_description || "Consulta los detalles directamente con el negocio."
  } : undefined;
  return {
    slug: publishedBusinessSlug(business),
    name: business.business_name,
    zone: business.zone,
    category: business.category,
    theme: themeForBusiness(business),
    heroImage: mainImage,
    gallery: [mainImage, logo].filter((image, index, all): image is string => Boolean(image) && all.indexOf(image) === index),
    description: business.short_description,
    eyebrow: `${business.category} · ${business.zone}`,
    whatsapp: contact,
    maps: mapsUrl(business) ?? `https://maps.google.com/?q=${encodeURIComponent(business.zone)}`,
    services: [
      { name: business.category, detail: business.short_description },
      { name: business.home_service ? "Atención a domicilio" : "Atención local", detail: business.business_hours || "Consulta horarios y disponibilidad directamente." },
      { name: "Contacto directo", detail: "Confirma detalles, disponibilidad y condiciones con el negocio." }
    ],
    promotion,
    sectionOrder: promotion ? ["about", "services", "promotion", "gallery", "location"] : ["about", "services", "gallery", "location"]
  };
}
