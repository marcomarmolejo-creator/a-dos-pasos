import type { Metadata } from "next";
import { AdminBusinesses } from "@/components/admin/AdminBusinesses";

export const metadata: Metadata = {
  title: "Administrar negocios",
  robots: { index: false, follow: false }
};

export default function AdminBusinessesPage() {
  return <AdminBusinesses />;
}
