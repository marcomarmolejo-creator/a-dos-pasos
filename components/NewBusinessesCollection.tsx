"use client";

import { useEffect, useState } from "react";
import { CollectionPage, type CollectionItem } from "@/components/CollectionPage";
import { getPublishedBusinesses, toNewDirectoryBusinesses } from "@/lib/businesses";

export function NewBusinessesCollection() {
  const [items, setItems] = useState<CollectionItem[] | null>(null);

  useEffect(() => {
    let active = true;
    void getPublishedBusinesses().then((businesses) => {
      if (!active) return;
      setItems(toNewDirectoryBusinesses(businesses).map((business) => ({
        label: `Nuevo · ${business.category}`,
        title: business.name,
        description: business.description,
        image: business.image,
        href: business.micrositeUrl || business.whatsapp || business.maps || `/directorio/?buscar=${encodeURIComponent(business.name)}`,
        meta: business.zone
      })));
    });
    return () => { active = false; };
  }, []);

  return <CollectionPage
    eyebrow="Nuevo en la zona"
    title="Descubre lo que acaba de llegar"
    description="Nuevas aperturas, servicios y experiencias cerca de casa."
    items={items ?? []}
    status={items === null ? "Cargando negocios nuevos…" : items.length === 0 ? "Por ahora no hay negocios nuevos publicados." : undefined}
  />;
}
