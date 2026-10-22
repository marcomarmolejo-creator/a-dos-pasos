import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuraSpaMicrosite } from "@/components/aura-spa/AuraSpaMicrosite";
import { BusinessMicrosite } from "@/components/BusinessMicrosite";
import { ElevaSteamMicrosite } from "@/components/eleva-steam/ElevaSteamMicrosite";
import { auraSpa } from "@/data/auraSpa";
import { businesses, getBusiness } from "@/data/businesses";
import { elevaSteam } from "@/data/elevaSteam";
import { getPublishedBusinessBySlug, getPublishedBusinesses, publishedBusinessSlug, toMicrositeBusiness } from "@/lib/businesses";

export const dynamicParams = false;

export async function generateStaticParams() {
  const published = await getPublishedBusinesses();
  const slugs = new Set([
    ...businesses.map(({ slug }) => slug),
    ...published.filter((business) => business.listing_type === "micrositio").map(publishedBusinessSlug)
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === auraSpa.slug) {
    return { title: { absolute: `${auraSpa.name} | A Dos Pasos` }, description: `${auraSpa.category} en ${auraSpa.zone}. ${auraSpa.shortDescription}` };
  }
  if (slug === elevaSteam.slug) {
    return { title: { absolute: `${elevaSteam.name} | A Dos Pasos` }, description: `${elevaSteam.category} en ${elevaSteam.zone}. ${elevaSteam.shortDescription}` };
  }
  const published = await getPublishedBusinessBySlug(slug);
  if (published?.listing_type === "micrositio") {
    return { title: { absolute: `${published.business_name} | A Dos Pasos` }, description: published.short_description };
  }
  const business = getBusiness(slug);
  if (!business) return { title: "Negocio no disponible" };
  return { title: business.name, description: `${business.category} en ${business.zone}. ${business.description}` };
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === auraSpa.slug) return <AuraSpaMicrosite />;
  if (slug === elevaSteam.slug) return <ElevaSteamMicrosite />;
  const published = await getPublishedBusinessBySlug(slug);
  const business = published?.listing_type === "micrositio" ? toMicrositeBusiness(published) : getBusiness(slug);
  if (!business) notFound();
  return <BusinessMicrosite business={business} />;
}
