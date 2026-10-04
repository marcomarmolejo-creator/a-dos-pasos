import type { Metadata } from "next";
import { AdminResetPassword } from "@/components/admin/AdminResetPassword";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  robots: { index: false, follow: false }
};

export default function AdminResetPasswordPage() {
  return <AdminResetPassword />;
}
