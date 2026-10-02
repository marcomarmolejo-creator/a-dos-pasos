import { CollectionPage } from "@/components/CollectionPage";
import { promotions } from "@/data/promotions";

export const metadata = { title: "Promociones activas" };
export default function PromotionsPage() { return <CollectionPage eyebrow="Promoción activa" title="Una razón más para probar algo cerca" description="Promociones vigentes seleccionadas dentro de A Dos Pasos." items={promotions.map(({ business, title, description }) => ({ label: "Promoción vigente", title, description, image: business.heroImage, href: `/negocio/${business.slug}/`, meta: business.name }))} />; }
