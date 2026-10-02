import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessMicrosite } from "@/components/BusinessMicrosite";
import { businesses, getBusiness } from "@/data/businesses";

export const dynamicParams = false;

export function generateStaticParams() {
  return businesses.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) return { title: "Negocio no disponible" };
  return { title: business.name, description: `${business.category} en ${business.zone}. ${business.description}` };
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = getBusiness(slug);
  if (!business) notFound();
  return <BusinessMicrosite business={business} />;
}
