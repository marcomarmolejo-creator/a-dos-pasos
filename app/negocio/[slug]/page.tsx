import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessMicrosite } from "@/components/BusinessMicrosite";
import { businesses, getBusiness } from "@/data/businesses";
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
  const published = await getPublishedBusinessBySlug(slug);
  if (published?.listing_type === "micrositio") {
    return { title: `${published.business_name} | A Dos Pasos`, description: published.short_description };
  }
  const business = getBusiness(slug);
  if (!business) return { title: "Negocio no disponible" };
  return { title: business.name, description: `${business.category} en ${business.zone}. ${business.description}` };
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const published = await getPublishedBusinessBySlug(slug);
  const business = published?.listing_type === "micrositio" ? toMicrositeBusiness(published) : getBusiness(slug);
  if (!business) notFound();
  return <BusinessMicrosite business={business} />;
}
