import type { Metadata } from "next";
import { AdminResidents } from "@/components/admin/AdminResidents";

export const metadata: Metadata = {
  title: "Administrar residentes",
  robots: { index: false, follow: false }
};

export default function AdminResidentsPage() {
  return <AdminResidents />;
}
