import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Información sobre el tratamiento de datos del registro de residentes de A Dos Pasos."
};

export default function ResidentPrivacyNoticePage() {
  return <div className="route-shell">
    <SiteHeader />
    <main className="route-main">
      <article className="legal-card">
        <span className="eyebrow">Información para residentes</span>
        <h1>Aviso de privacidad</h1>
        <p>A Dos Pasos, proyecto operado por Eleva Studio Lab, es responsable del tratamiento de los datos proporcionados mediante el registro de residentes.</p>
        <h2>Finalidad</h2>
        <p>Utilizamos la información para gestionar tu registro y enviarte lugares, promociones, beneficios, aperturas, ideas y servicios útiles de tu zona que hayan sido seleccionados por A Dos Pasos.</p>
        <h2>Datos recabados</h2>
        <p>El registro solicita nombre, WhatsApp, zona e intereses. También puedes proporcionar opcionalmente email, colonia o privada y comentarios.</p>
        <h2>Uso y resguardo</h2>
        <p>A Dos Pasos no vende tu información de contacto ni la comparte con los negocios publicados en la plataforma. El canal se administra directamente desde A Dos Pasos.</p>
        <h2>Baja o corrección</h2>
        <p>Puedes solicitar la baja de tus datos o corregirlos escribiendo por WhatsApp al <a href="https://wa.me/524424223487" target="_blank" rel="noreferrer">442 422 34 87</a>.</p>
        <p>Este aviso describe el funcionamiento actual del registro y podrá actualizarse conforme evolucionen sus procesos.</p>
      </article>
    </main>
    <SiteFooter />
  </div>;
}
