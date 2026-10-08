"use client";

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { commercialWhatsAppUrl } from "@/lib/commercial";
import styles from "./BusinessPresentation.module.css";

type PresentationEvent =
  | "presentation_view"
  | "presentation_cta_ficha"
  | "presentation_cta_micrositio"
  | "presentation_cta_video"
  | "presentation_cta_paquete"
  | "presentation_cta_promocion"
  | "presentation_whatsapp";

const TRACKING_KEY = "adp:presentation-events";
const WHATSAPP_BASE = "https://wa.me/524424223487";

const packageWhatsAppUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent("Hola, tengo mi negocio en A Dos Pasos y me interesa el paquete de Micrositio + Video Local para mi negocio.")}`;
const generalWhatsAppUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent("Hola, quiero conocer más sobre A Dos Pasos para mi negocio.")}`;

const examples = [
  { name: "Forno Locale", category: "Pizzería artesanal", image: "/assets/forno-locale.png", href: "/negocio/forno-locale/" },
  { name: "Aura Spa", category: "Bienestar", image: "/assets/aura-spa.jpg", href: "/negocio/aura-spa/" },
  { name: "Barbería Clásica", category: "Cuidado personal", image: "/assets/barberia-clasica.png", href: "/negocio/barberia-clasica/" },
  { name: "Eleva Steam", category: "Servicios para tu casa", image: "/assets/eleva-steam.jpg", href: "/negocio/eleva-steam/" }
] as const;

function track(event: PresentationEvent) {
  window.dispatchEvent(new CustomEvent("adp:presentation-event", { detail: { event } }));
  try {
    const current = JSON.parse(sessionStorage.getItem(TRACKING_KEY) ?? "{}") as Record<string, number>;
    current[event] = (current[event] ?? 0) + 1;
    sessionStorage.setItem(TRACKING_KEY, JSON.stringify(current));
  } catch {
    // El tracking local nunca debe interferir con la presentación.
  }
}

export function BusinessPresentation() {
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    track("presentation_view");
  }, []);

  const trackClick = (eventName: PresentationEvent) => (_event: MouseEvent<HTMLElement>) => track(eventName);

  return <div className={`${styles.page} ${presentationMode ? styles.presentationMode : ""}`}>
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/" aria-label="A Dos Pasos, volver al inicio">
        <img src="/assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" />
      </Link>
      <Link className={styles.backLink} href="/para-negocios/">Para negocios</Link>
      <button type="button" className={styles.modeButton} aria-pressed={presentationMode} onClick={() => setPresentationMode((current) => !current)}>
        {presentationMode ? "Salir de presentación" : "Modo presentación"}
      </button>
    </header>

    <main>
      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.badge}>El Refugio</span>
          <p className={styles.eyebrow}>A Dos Pasos · Para negocios</p>
          <h1>Haz que tus vecinos te descubran.</h1>
          <p>A Dos Pasos es una guía editorial hiperlocal para descubrir negocios, servicios, promociones y lugares cerca de casa.</p>
          <a className={styles.primaryCta} href="#participar">Ver cómo participar</a>
        </div>
        <div className={styles.heroVisual} aria-label="Contenido local dentro de A Dos Pasos">
          {examples.slice(0, 3).map((example, index) => <article key={example.name} style={{ "--card-index": index } as CSSProperties}>
            <img src={example.image} alt="" />
            <div><small>{example.category}</small><strong>{example.name}</strong></div>
          </article>)}
        </div>
      </section>

      <section className={`${styles.section} ${styles.problem}`}>
        <span className={styles.number}>01</span>
        <div><p className={styles.eyebrow}>El reto local</p><h2>Tus vecinos pueden estar a minutos de tu negocio y no saber que existes.</h2><p>La información local hoy está dispersa entre Google Maps, redes sociales y grupos vecinales. A Dos Pasos organiza y presenta negocios de la zona de forma visual, clara y fácil de descubrir.</p></div>
      </section>

      <section className={`${styles.section} ${styles.what}`}>
        <header><p className={styles.eyebrow}>Qué es A Dos Pasos</p><h2>Una forma más clara de estar presente en tu zona.</h2></header>
        <div className={styles.featureGrid}>
          {["Guía editorial hiperlocal", "Presencia local", "WhatsApp directo", "Google Maps", "Fotos y video", "Promociones y beneficios"].map((feature, index) => <article key={feature}><span>0{index + 1}</span><h3>{feature}</h3></article>)}
        </div>
        <blockquote>Google Maps responde dónde estás.<br /><strong>A Dos Pasos busca mostrar por qué vale la pena conocerte.</strong></blockquote>
      </section>

      <section className={`${styles.section} ${styles.participation}`} id="participar">
        <header><p className={styles.eyebrow}>Formas de participar</p><h2>Empieza gratis o construye una presencia más completa.</h2></header>
        <div className={styles.productGrid}>
          <article className={`${styles.productCard} ${styles.freeCard}`}>
            <div><span>Ficha Local</span><strong>GRATIS</strong></div>
            <p>Tu entrada a la guía local.</p>
            <ul>{["Nombre del negocio", "Imagen principal", "Categoría y descripción", "Zona", "WhatsApp", "Maps", "Redes"].map((item) => <li key={item}>{item}</li>)}</ul>
            <Link href="/para-negocios/alta/" onClick={trackClick("presentation_cta_ficha")}>Crear ficha gratuita</Link>
          </article>

          <article className={styles.productCard}>
            <div><span>Micrositio Fundador</span><strong>$1,290 <small>MXN + IVA</small></strong></div>
            <p>Pago único por 1 año.</p>
            <ul>{["Presentación visual ampliada", "Fotos", "Información del negocio", "Servicios", "WhatsApp y Maps", "Beneficios"].map((item) => <li key={item}>{item}</li>)}</ul>
            <a href={commercialWhatsAppUrl("micrositio")} target="_blank" rel="noreferrer" onClick={trackClick("presentation_cta_micrositio")}>Quiero un Micrositio</a>
          </article>

          <article className={`${styles.productCard} ${styles.videoCard}`}>
            <div><span>Video Local Básico</span><strong>$1,490 <small>MXN + IVA</small></strong></div>
            <ul>{["Video vertical de 15–20 segundos", "Grabación en una ubicación", "Edición simple y música", "Logo, texto y CTA", "1 ronda de ajustes", "Archivo final para tus redes"].map((item) => <li key={item}>{item}</li>)}</ul>
            <p className={styles.highlight}>No pagas por una publicación efímera. Te llevas el video y puedes seguir usándolo en tus propias redes.</p>
            <a href={commercialWhatsAppUrl("video-local")} target="_blank" rel="noreferrer" onClick={trackClick("presentation_cta_video")}>Quiero un Video Local</a>
          </article>

          <article className={`${styles.productCard} ${styles.bundleCard}`}>
            <div><span>Micrositio + Video Local</span><strong>$2,490 <small>MXN + IVA</small></strong></div>
            <p>Presencia + contenido audiovisual.</p>
            <div className={styles.bundleVisual}><b>Tu espacio local</b><span>+</span><b>Tu video</b></div>
            <a href={packageWhatsAppUrl} target="_blank" rel="noreferrer" onClick={trackClick("presentation_cta_paquete")}>Quiero este paquete</a>
          </article>
        </div>
        <p className={styles.taxNote}>Precios en pesos mexicanos (MXN). IVA no incluido.</p>
      </section>

      <section className={`${styles.section} ${styles.promotion}`}>
        <header><p className={styles.eyebrow}>Promoción posterior</p><h2>Cuando quieras darle más visibilidad a tu negocio.</h2></header>
        <div className={styles.promotionProducts}>
          <article><span>Beneficio Local</span><small>7 días de publicación</small><strong>Desde $299 MXN + IVA</strong><p>Ideal para promociones, beneficios especiales, lanzamientos o activaciones de corta duración dirigidas a vecinos de la zona.</p></article>
          <article><span>Promoción Activa</span><small>30 días de promoción</small><strong>Desde $590 MXN + IVA</strong><p>Pensada para negocios que buscan mantener una promoción visible durante todo el mes y generar mayor permanencia frente a la audiencia local.</p></article>
        </div>
        <p className={styles.taxNote}>Precios en pesos mexicanos (MXN). IVA no incluido.</p>
        <p>Puedes activar promociones, beneficios u ofertas sin perder la ficha ni el contenido que ya tienes.</p>
        <a href={commercialWhatsAppUrl("promocion-activa")} target="_blank" rel="noreferrer" onClick={trackClick("presentation_cta_promocion")}>Quiero promover una oferta</a>
      </section>

      <section className={`${styles.section} ${styles.examples}`}>
        <header><p className={styles.eyebrow}>Ejemplos reales</p><h2>Así se ve A Dos Pasos.</h2><p>Contenido visual de negocios que ya forman parte del proyecto.</p></header>
        <div className={styles.exampleGrid}>{examples.map((example) => <Link href={example.href} key={example.name}>
          <img src={example.image} alt={example.name} />
          <div><small>{example.category}</small><h3>{example.name}</h3><span>Conocer →</span></div>
        </Link>)}</div>
      </section>

      <section className={`${styles.section} ${styles.closing}`}>
        <img src="/assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" />
        <h2>Tu negocio también forma parte de la zona.</h2>
        <p>Empieza con tu ficha gratuita o dale más presencia con contenido, video y promoción local.</p>
        <div className={styles.closingActions}>
          <Link href="/para-negocios/alta/" onClick={trackClick("presentation_cta_ficha")}>Crear mi ficha gratis</Link>
          <a href={commercialWhatsAppUrl("micrositio")} target="_blank" rel="noreferrer" onClick={trackClick("presentation_cta_micrositio")}>Quiero un Micrositio</a>
          <a href={commercialWhatsAppUrl("video-local")} target="_blank" rel="noreferrer" onClick={trackClick("presentation_cta_video")}>Quiero un Video Local</a>
          <a href={generalWhatsAppUrl} target="_blank" rel="noreferrer" onClick={trackClick("presentation_whatsapp")}>Hablar por WhatsApp</a>
        </div>
        <a className={styles.phone} href={generalWhatsAppUrl} target="_blank" rel="noreferrer" onClick={trackClick("presentation_whatsapp")}>WhatsApp 442 422 34 87</a>
      </section>
    </main>

    <footer className={styles.footer}><span>A Dos Pasos | Descubre lo que tienes cerca de casa.</span><span>Powered by Eleva Studio Lab.</span></footer>
  </div>;
}
