import { PublicPromotionCollection } from "@/components/PublicPromotionCollection";

export const metadata = { title: "Promociones activas" };
export default function PromotionsPage() { return <PublicPromotionCollection type="promocion" />; }
