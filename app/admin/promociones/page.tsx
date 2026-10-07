import type { Metadata } from "next";
import { AdminPromotions } from "@/components/admin/AdminPromotions";

export const metadata: Metadata = {
  title: "Administrar beneficios y promociones",
  robots: { index: false, follow: false }
};

export default function AdminPromotionsPage() {
  return <AdminPromotions />;
}
