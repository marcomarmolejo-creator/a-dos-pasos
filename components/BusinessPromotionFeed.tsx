"use client";

import { useEffect, useState } from "react";
import { getPublicPromotionCards, type PublicPromotionCard } from "@/lib/promotions";

function validity(promotion: PublicPromotionCard) {
  if (!promotion.starts_at && !promotion.ends_at) return null;
  const format = (value: string) => new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(value));
  if (promotion.starts_at && promotion.ends_at) return `Vigente del ${format(promotion.starts_at)} al ${format(promotion.ends_at)}`;
  if (promotion.ends_at) return `Vigente hasta el ${format(promotion.ends_at)}`;
  return `Disponible desde el ${format(promotion.starts_at!)}`;
}

export function BusinessPromotionFeed({ businessId }: { businessId?: string }) {
  const [promotions, setPromotions] = useState<PublicPromotionCard[]>([]);
  useEffect(() => {
    if (!businessId) return;
    let active = true;
    void getPublicPromotionCards().then((records) => {
      if (active) setPromotions(records.filter((record) => record.business_id === businessId));
    });
    return () => { active = false; };
  }, [businessId]);
  if (!businessId || !promotions.length) return null;
  return <>{promotions.map((promotion) => <section className={`business-feature ${promotion.type === "promocion" ? "business-feature--promotion" : ""}`} key={promotion.id}>
    <img className="business-feature__image" src={promotion.resolvedImage} alt={`Imagen de ${promotion.title}`} loading="lazy" />
    <span>{promotion.type === "beneficio" ? "Beneficio A Dos Pasos" : "Promoción vigente"}</span>
    <h2>{promotion.title}</h2>
    {promotion.description ? <p>{promotion.description}</p> : null}
    {validity(promotion) ? <p className="business-feature__validity">{validity(promotion)}</p> : null}
    {promotion.terms ? <small className="business-feature__terms">{promotion.terms}</small> : null}
    <a href={promotion.resolvedCtaUrl} target="_blank" rel="noreferrer">{promotion.resolvedCtaLabel}</a>
  </section>)}</>;
}
