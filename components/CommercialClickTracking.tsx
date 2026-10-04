"use client";

import { useEffect } from "react";

const STORAGE_KEY = "adp:commercial-clicks";

export function CommercialClickTracking() {
  useEffect(() => {
    const track = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-commercial-product]") : null;
      if (!target) return;
      const product = target.dataset.commercialProduct;
      if (!product) return;
      const source = target.dataset.commercialSource ?? "unknown";
      window.dispatchEvent(new CustomEvent("adp:commercial-click", { detail: { product, source } }));
      try {
        const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, number>;
        const key = `${source}:${product}`;
        stored[key] = (stored[key] ?? 0) + 1;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch {
        // El tracking local nunca debe bloquear la navegación a WhatsApp.
      }
    };
    document.addEventListener("click", track);
    return () => document.removeEventListener("click", track);
  }, []);

  return null;
}
