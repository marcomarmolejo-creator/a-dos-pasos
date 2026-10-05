import type { Metadata } from "next";
import { BusinessPresentation } from "@/components/BusinessPresentation";

export const metadata: Metadata = {
  title: "Presentación para negocios | A Dos Pasos",
  description: "Conoce las formas de participar y hacer visible tu negocio en A Dos Pasos."
};

export default function BusinessPresentationPage() {
  return <BusinessPresentation />;
}
