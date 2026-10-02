import { CollectionPage } from "@/components/CollectionPage";
import { benefits } from "@/data/benefits";

export const metadata = { title: "Beneficios locales" };
export default function BenefitsPage() { return <CollectionPage eyebrow="Beneficios locales" title="Algo bueno por estar cerca" description="Beneficios seleccionados para descubrir y aprovechar negocios de tu zona." items={benefits.map(({ business, title, description }) => ({ label: "Beneficio local", title, description, image: business.heroImage, href: `/negocio/${business.slug}/`, meta: business.name }))} />; }
