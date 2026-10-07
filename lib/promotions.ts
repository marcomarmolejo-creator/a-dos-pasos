import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getPublishedBusinesses, publicAssetUrl, publishedBusinessSlug, whatsappUrl, type PublishedBusiness } from "@/lib/businesses";

export type PromotionType = "beneficio" | "promocion";
export type PromotionStatus = "borrador" | "activo" | "pausado" | "finalizado";

export type ActiveBusinessPromotion = {
  id: string;
  business_id: string;
  type: PromotionType;
  title: string;
  description: string | null;
  short_label: string | null;
  cta_label: string | null;
  cta_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  featured: boolean;
  image_url: string | null;
  terms: string | null;
};

export type PublicPromotionCard = ActiveBusinessPromotion & {
  businessName: string;
  businessSlug: string;
  businessCategory: string;
  businessZone: string;
  businessImage: string;
  businessLogo: string | null;
  businessWhatsapp: string | null;
  resolvedImage: string;
  resolvedCtaLabel: string;
  resolvedCtaUrl: string;
};

const ACTIVE_FIELDS = "id,business_id,type,title,description,short_label,cta_label,cta_url,starts_at,ends_at,featured,image_url,terms";

export function publicPromotionImage(value: string | null | undefined) {
  const candidate = value?.trim();
  return candidate && /^https:\/\//i.test(candidate) ? candidate : null;
}

function defaultMessage(type: PromotionType, businessName: string) {
  return type === "beneficio"
    ? `Hola, vi el beneficio de ${businessName} en A Dos Pasos y me interesa conocer los detalles.`
    : `Hola, vi esta promoción de ${businessName} en A Dos Pasos y me interesa aprovecharla.`;
}

function ctaUrl(promotion: ActiveBusinessPromotion, business: PublishedBusiness) {
  if (publicPromotionImage(promotion.cta_url)) return promotion.cta_url!;
  const base = whatsappUrl(business.whatsapp);
  if (base) {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}text=${encodeURIComponent(defaultMessage(promotion.type, business.business_name))}`;
  }
  const slug = publishedBusinessSlug(business);
  return business.listing_type === "micrositio" && slug
    ? `/negocio/${slug}/`
    : `/directorio/?buscar=${encodeURIComponent(business.business_name)}`;
}

export async function getActiveBusinessPromotions(): Promise<ActiveBusinessPromotion[]> {
  try {
    const { data, error } = await getSupabaseBrowserClient()
      .from("active_business_promotions")
      .select(ACTIVE_FIELDS)
      .order("featured", { ascending: false })
      .order("starts_at", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("[Promotions] Public records unavailable", { code: error.code, message: error.message });
      return [];
    }
    return (data ?? []) as ActiveBusinessPromotion[];
  } catch (error) {
    console.error("[Promotions] Public request failed", error instanceof Error ? error.message : "Unknown error");
    return [];
  }
}

export async function getPublicPromotionCards(): Promise<PublicPromotionCard[]> {
  const [promotions, businesses] = await Promise.all([
    getActiveBusinessPromotions(),
    getPublishedBusinesses()
  ]);
  const byId = new Map(businesses.map((business) => [business.id, business]));
  return promotions.flatMap((promotion) => {
    const business = byId.get(promotion.business_id);
    if (!business) return [];
    const slug = publishedBusinessSlug(business);
    return [{
      ...promotion,
      businessName: business.business_name,
      businessSlug: slug,
      businessCategory: business.category,
      businessZone: business.zone,
      businessImage: publicAssetUrl(business.main_image_url) ?? "/assets/mockup-ficha.png",
      businessLogo: publicAssetUrl(business.logo_url),
      businessWhatsapp: whatsappUrl(business.whatsapp),
      resolvedImage: publicPromotionImage(promotion.image_url) || publicAssetUrl(business.main_image_url) || "/assets/mockup-ficha.png",
      resolvedCtaLabel: promotion.cta_label || (promotion.type === "beneficio" ? "Ver beneficio" : "Ver promoción"),
      resolvedCtaUrl: ctaUrl(promotion, business)
    }];
  });
}

export function promotionFlagsByBusiness(promotions: ActiveBusinessPromotion[]) {
  const flags = new Map<string, { hasBenefit: boolean; hasPromotion: boolean }>();
  promotions.forEach((promotion) => {
    const current = flags.get(promotion.business_id) ?? { hasBenefit: false, hasPromotion: false };
    if (promotion.type === "beneficio") current.hasBenefit = true;
    if (promotion.type === "promocion") current.hasPromotion = true;
    flags.set(promotion.business_id, current);
  });
  return flags;
}
