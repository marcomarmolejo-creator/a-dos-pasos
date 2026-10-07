"use client";

import { useEffect } from "react";
import { getPublicPromotionCards, type PublicPromotionCard } from "@/lib/promotions";

declare global {
  interface Window { __ACTIVE_BUSINESS_PROMOTIONS__?: PublicPromotionCard[]; }
}

export function HomePromotionsBootstrap() {
  useEffect(() => {
    let active = true;
    const script = document.createElement("script");
    script.type = "module";
    script.src = `/legacy/app.js?promotions=${Date.now()}`;
    void getPublicPromotionCards().then((promotions) => {
      if (!active) return;
      window.__ACTIVE_BUSINESS_PROMOTIONS__ = promotions;
      document.body.appendChild(script);
    });
    return () => { active = false; script.remove(); };
  }, []);
  return null;
}
