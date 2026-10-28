"use client";

import { useEffect } from "react";
import { getPublishedBusinesses, toDirectoryBusiness, toNewDirectoryBusinesses } from "@/lib/businesses";
import { getPublicPromotionCards, type PublicPromotionCard } from "@/lib/promotions";

declare global {
  interface Window {
    __ACTIVE_BUSINESS_PROMOTIONS__?: PublicPromotionCard[];
    __NEW_PUBLISHED_BUSINESSES__?: ReturnType<typeof toDirectoryBusiness>[];
  }
}

export function HomePromotionsBootstrap() {
  useEffect(() => {
    let active = true;
    const script = document.createElement("script");
    script.type = "module";
    script.src = `/legacy/app.js?home=${Date.now()}`;
    void Promise.all([getPublicPromotionCards(), getPublishedBusinesses()]).then(([promotions, liveBusinesses]) => {
      if (!active) return;
      window.__ACTIVE_BUSINESS_PROMOTIONS__ = promotions;
      window.__NEW_PUBLISHED_BUSINESSES__ = toNewDirectoryBusinesses(liveBusinesses, 4);
      document.body.appendChild(script);
    });
    return () => { active = false; script.remove(); };
  }, []);
  return null;
}
