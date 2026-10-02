import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "A Dos Pasos · El Refugio", template: "%s | A Dos Pasos" },
  description: "Descubre negocios, servicios, beneficios y nuevas aperturas cerca de casa en El Refugio."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
