"use client";

import { useEffect } from "react";
import { getPublishedBusinesses, toDirectoryBusiness, type PublishedBusiness } from "@/lib/businesses";
import { getActiveBusinessPromotions, promotionFlagsByBusiness, publicPromotionImage } from "@/lib/promotions";

declare global {
  interface Window { __PUBLISHED_BUSINESSES__?: ReturnType<typeof toDirectoryBusiness>[]; }
}

export function DirectoryBootstrap({ initialBusinesses }: { initialBusinesses: PublishedBusiness[] }) {
  useEffect(() => {
    let active = true;
    let script: HTMLScriptElement | null = null;

    const load = async () => {
      const [liveBusinesses, promotions] = await Promise.all([getPublishedBusinesses(), getActiveBusinessPromotions()]);
      if (!active) return;
      const businesses = liveBusinesses.length ? liveBusinesses : initialBusinesses;
      const flags = promotionFlagsByBusiness(promotions);
      const promotionImages = new Map<string, string>();
      promotions.forEach((promotion) => {
        const image = publicPromotionImage(promotion.image_url);
        if (image && !promotionImages.has(promotion.business_id)) promotionImages.set(promotion.business_id, image);
      });
      window.__PUBLISHED_BUSINESSES__ = businesses.map((business) => {
        const directoryBusiness = toDirectoryBusiness(business, flags.get(business.id));
        return { ...directoryBusiness, image: promotionImages.get(business.id) ?? directoryBusiness.image };
      });
      script = document.createElement("script");
      script.type = "module";
      script.src = `/legacy/directory.js?route=${Date.now()}`;
      document.body.appendChild(script);
    };

    load();
    return () => { active = false; script?.remove(); };
  }, [initialBusinesses]);

  return null;
}
