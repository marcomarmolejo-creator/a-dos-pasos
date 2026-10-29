"use client";

import { useEffect, useState } from "react";
import { CollectionPage, type CollectionItem } from "@/components/CollectionPage";
import { getBusiness } from "@/data/businesses";
import { getPublicPromotionCards, type PromotionType } from "@/lib/promotions";

const elevaSteam = getBusiness("eleva-steam")!;

const elevaBenefit: CollectionItem = {
  label: "Beneficio local",
  title: elevaSteam.benefit!.title,
  description: elevaSteam.benefit!.description,
  image: elevaSteam.heroImage,
  href: "/negocio/eleva-steam/",
  meta: elevaSteam.name
};

const pageCopy = {
  beneficio: {
    eyebrow: "Beneficios locales",
    title: "Algo bueno por estar cerca",
    description: "Beneficios seleccionados para descubrir y aprovechar negocios de tu zona.",
    empty: "No hay más beneficios activos por ahora."
  },
  promocion: {
    eyebrow: "Promociones activas",
    title: "Una razón más para probar algo cerca",
    description: "Promociones vigentes seleccionadas dentro de A Dos Pasos.",
    empty: "No hay promociones activas por ahora."
  }
} as const;

export function PublicPromotionCollection({ type }: { type: PromotionType }) {
  const [items, setItems] = useState<CollectionItem[] | null>(null);
  const copy = pageCopy[type];

  useEffect(() => {
    let active = true;
    void getPublicPromotionCards().then((cards) => {
      if (!active) return;
      const liveItems = cards
        .filter((card) => card.type === type)
        .map((card) => ({
          label: card.short_label || (type === "beneficio" ? "Beneficio local" : "Promoción vigente"),
          title: card.title,
          description: card.description || "Consulta los detalles directamente con el negocio.",
          image: card.resolvedImage,
          href: card.resolvedCtaUrl,
          meta: card.businessName
        }));

      if (type === "beneficio" && !liveItems.some((item) => item.meta === elevaSteam.name)) {
        liveItems.push({
          ...elevaBenefit,
          meta: elevaBenefit.meta ?? "",
        });
      }
      setItems(liveItems);
    });
    return () => { active = false; };
  }, [type]);

  return <CollectionPage
    eyebrow={copy.eyebrow}
    title={copy.title}
    description={copy.description}
    items={items ?? []}
    status={items === null ? "Cargando opciones locales…" : items.length === 0 ? copy.empty : undefined}
  />;
}
