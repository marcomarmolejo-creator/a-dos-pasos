"use client";

import Link from "next/link";
import { useState } from "react";
import { BusinessOwnerCTA } from "@/components/BusinessMicrosite";
import { elevaSteam, elevaWhatsapp, type ElevaSteamSection } from "@/data/elevaSteam";
import styles from "./ElevaSteamMicrosite.module.css";

const business = elevaSteam;

function Hero() {
  return <section className={styles.hero} id="inicio">
    <img className={styles.heroImage} src={business.heroImage} alt="Técnico de Eleva Steam realizando un servicio de lavado con vapor" />
    <div className={styles.heroShade} />
    <nav className={styles.heroNav} aria-label="Navegación del micrositio">
      <Link href="/" aria-label="Ir a A Dos Pasos">A DOS PASOS</Link>
      <Link href="/directorio/">Volver al directorio</Link>
    </nav>
    <div className={styles.heroContent}>
      <img className={styles.businessLogo} src={business.logo} alt="Eleva Steam" />
      <p className={styles.kicker}>{business.category} · {business.zone}</p>
      <h1>Lavado profundo<br /><span>sin salir de casa.</span></h1>
      <p className={styles.heroLead}>{business.longDescription}</p>
      <div className={styles.actions}>
        <a className={styles.primaryButton} href={elevaWhatsapp(business.generalWhatsappMessage)} target="_blank" rel="noreferrer">Cotizar por WhatsApp <span aria-hidden="true">↗</span></a>
        <a className={styles.secondaryButton} href="#video">Ver cómo trabajamos <span aria-hidden="true">↓</span></a>
      </div>
      <div className={styles.heroMeta}><span>Atención a domicilio</span><span>Experiencia desde 2011</span><a href={business.phoneHref}>Tel. {business.phoneDisplay}</a></div>
    </div>
    <aside className={styles.platformSeal}><small>Negocio local en</small><strong>A Dos Pasos</strong></aside>
  </section>;
}

function BeforeAfter() {
  const [split, setSplit] = useState(50);
  return <section className={`${styles.section} ${styles.results}`} id="resultados">
    <header className={styles.splitHeading}>
      <div><span className={styles.eyebrow}>Resultado real</span><h2>Mira la diferencia</h2></div>
      <p>Resultado de un servicio realizado por Eleva Steam. Desliza para comparar ambas fotografías.</p>
    </header>
    <div className={styles.comparisonLayout}>
      <div className={styles.comparisonFrame} style={{ "--split": `${split}%` } as React.CSSProperties}>
        <img className={styles.comparisonImage} src={business.beforeAfter.before} alt="Sillón antes del servicio de Eleva Steam" />
        <div className={styles.afterClip}><img className={styles.comparisonImage} src={business.beforeAfter.after} alt="Sillón después del servicio de Eleva Steam" /></div>
        <span className={`${styles.photoLabel} ${styles.beforeLabel}`}>Antes</span>
        <span className={`${styles.photoLabel} ${styles.afterLabel}`}>Después</span>
        <div className={styles.comparisonLine} aria-hidden="true"><span>↔</span></div>
        <input className={styles.comparisonRange} type="range" min="0" max="100" value={split} onChange={(event) => setSplit(Number(event.target.value))} aria-label="Comparar fotografía de antes y después" />
      </div>
      <aside className={styles.resultNote}><span>Caso real · Sala</span><strong>Limpieza de tapicería clara</strong><p>Las imágenes mantienen su proporción y contenido para que la comparación sea clara.</p></aside>
    </div>
  </section>;
}

function Video() {
  return <section className={`${styles.section} ${styles.darkSection}`} id="video">
    <div className={styles.videoGrid}>
      <div><span className={styles.eyebrow}>Así trabajamos</span><h2>{business.video.title}</h2><p>Conoce el proceso aplicado a una sala y revisa el resultado antes de solicitar tu cotización.</p><a className={styles.primaryButton} href={elevaWhatsapp("Hola, vi el video de Eleva Steam en A Dos Pasos y quiero cotizar el lavado de mi sala.")} target="_blank" rel="noreferrer">Quiero cotizar mi sala <span aria-hidden="true">↗</span></a></div>
      <figure className={styles.videoShell}><video controls playsInline preload="metadata" poster={business.video.poster}><source src={business.video.src} type="video/mp4" />Tu navegador no puede reproducir este video.</video><figcaption><span>Video del servicio</span><strong>Así luce tu sala</strong></figcaption></figure>
    </div>
  </section>;
}

function Services() {
  return <section className={`${styles.section} ${styles.mistSection}`} id="servicios">
    <header className={styles.splitHeading}><div><span className={styles.eyebrow}>Qué podemos limpiar</span><h2>Servicio para cada pieza de tu hogar</h2></div></header>
    <div className={styles.servicesGrid}>{business.services.map((service, index) => <article className={styles.serviceCard} key={service.name}>
      <div className={styles.serviceMedia}>
        <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
        {service.image ? <img src={service.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} /> : null}
      </div>
      <div className={styles.serviceBody}><h3>{service.name}</h3><p className={styles.priceFrom}>Desde {service.price}</p><p>{service.description}</p>{service.priceNote ? <small>{service.priceNote}</small> : null}<a href={elevaWhatsapp(service.whatsappMessage)} target="_blank" rel="noreferrer">{service.cta} <span aria-hidden="true">↗</span></a></div>
    </article>)}</div>
  </section>;
}

function Process() {
  return <section className={styles.section} id="proceso">
    <header className={styles.splitHeading}><div><span className={styles.eyebrow}>Proceso profesional</span><h2>Seis pasos, una revisión cuidadosa</h2></div><p>El proceso se adapta a la tela y condición de cada mueble.</p></header>
    <div className={styles.processGrid}>{business.process.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.name}</h3><p>{step.description}</p></article>)}</div>
    <div className={styles.differentiators}><strong>Por qué Eleva Steam</strong><span>Vapor a alta temperatura</span><span>Atención a domicilio</span><span>Puntualidad</span><span>Experiencia desde 2011</span></div>
  </section>;
}

function Pricing() {
  return <section className={`${styles.section} ${styles.darkSection}`} id="precios">
    <div className={styles.pricingLayout}>
      <header><span className={styles.eyebrow}>Precios orientativos</span><h2>Precios desde</h2><p>El precio final puede variar según tamaño, número de piezas, características, condición, manchas y necesidades especiales.</p><a className={styles.primaryButton} href={elevaWhatsapp(business.generalWhatsappMessage)} target="_blank" rel="noreferrer">Enviar foto para cotizar <span aria-hidden="true">↗</span></a></header>
      <div className={styles.priceList}>{business.pricing.map(([name, price]) => <div key={name}><span>{name}</span><strong>{price}</strong></div>)}<p><b>Colchón King:</b> incluye cara superior y laterales, aspirado inferior y sanitizado con vapor. Segunda cara +$350.</p><p><b>Tapetes y alfombras:</b> precio según medidas. En superficies mayores puede cotizarse aproximadamente por m².</p><p><b>Comedor:</b> asiento desde $85 c/u · asiento y respaldo desde $150 c/u. Cotización según cantidad y características.</p></div>
    </div>
  </section>;
}

function PetsAndUseCases() {
  return <section className={`${styles.section} ${styles.mistSection}`} id="mascotas">
    <div className={styles.petsPanel}><span className={styles.eyebrow}>Hogares con mascotas</span><h2>{business.pets.title}</h2><p>{business.pets.description}</p><a className={styles.darkButton} href={elevaWhatsapp(business.pets.whatsappMessage)} target="_blank" rel="noreferrer">Consultar por accidente de mascota <span aria-hidden="true">↗</span></a></div>
    <header className={styles.useCaseHeading}><span className={styles.eyebrow}>Casos de uso</span><h2>Una limpieza pensada para la vida real</h2></header>
    <div className={styles.useCaseGrid}>{business.useCases.map((useCase) => <article key={useCase.title}><span aria-hidden="true">→</span><h3>{useCase.title}</h3><p>{useCase.description}</p></article>)}</div>
  </section>;
}

function Coverage() {
  return <section className={`${styles.section} ${styles.coverage}`} id="cobertura">
    <div><span className={styles.eyebrow}>Servicio a domicilio</span><h2>Vamos hasta tu casa</h2><p>Servicio a domicilio en Querétaro y zonas de cobertura. La disponibilidad puede variar según la zona y cantidad de piezas.</p><div className={styles.coverageTags}>{business.coverage.map((zone) => <span key={zone}>{zone}</span>)}</div><a className={styles.darkButton} href={elevaWhatsapp("Hola, quiero consultar si Eleva Steam tiene cobertura en mi zona.")} target="_blank" rel="noreferrer">Consultar cobertura por WhatsApp <span aria-hidden="true">↗</span></a></div>
    <div className={styles.coverageVisual} aria-label="Representación visual de las zonas de cobertura de Eleva Steam"><div className={styles.coverageRings}><i /><i /><i /><strong>QRO</strong></div>{business.coverage.slice(1, 5).map((zone, index) => <span className={styles[`zone${index + 1}`]} key={zone}>{zone}</span>)}</div>
  </section>;
}

function HowToQuote() {
  return <section className={`${styles.section} ${styles.darkSection} ${styles.quote}`} id="cotizar">
    <header><span className={styles.eyebrow}>Cotizar es fácil</span><h2>Una foto es el primer paso</h2></header>
    <div className={styles.quoteGrid}>{business.howToQuote.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
    <div className={styles.benefit}><div><span>Beneficio A Dos Pasos</span><h3>{business.benefit.title}</h3><p>{business.benefit.description}</p></div><a className={styles.primaryButton} href={elevaWhatsapp(business.benefit.whatsappMessage)} target="_blank" rel="noreferrer">Solicitar evaluación <span aria-hidden="true">↗</span></a></div>
  </section>;
}

function FinalCTA() {
  return <section className={styles.finalCta} style={{ "--final-image": `url(${business.beforeAfter.after})` } as React.CSSProperties}><div><span className={styles.eyebrow}>Tu sala puede verse diferente</span><h2>¿Quieres saber cuánto cuesta limpiar la tuya?</h2><p>Envíanos una fotografía y recibe una cotización antes de agendar.</p><a className={styles.primaryButton} href={elevaWhatsapp(business.generalWhatsappMessage)} target="_blank" rel="noreferrer">Cotizar por WhatsApp <span aria-hidden="true">↗</span></a></div></section>;
}

function Footer() {
  return <><BusinessOwnerCTA /><footer className={styles.footer}><div><a href="#inicio"><img className={styles.footerBusinessLogo} src={business.logo} alt="Eleva Steam" /></a><p>{business.category} · {business.zone}</p></div><div className={styles.platformSignature}><small>Negocio local en</small><img src={business.platformLogo} alt="A Dos Pasos — Descubre lo que tienes cerca de casa" /></div><Link href="/directorio/">Volver al directorio</Link></footer></>;
}

const sectionComponents: Record<ElevaSteamSection, () => React.JSX.Element> = {
  hero: Hero,
  beforeAfter: BeforeAfter,
  video: Video,
  services: Services,
  process: Process,
  pricing: Pricing,
  pets: PetsAndUseCases,
  coverage: Coverage,
  howToQuote: HowToQuote,
  finalCTA: FinalCTA,
  footer: Footer
};

export function ElevaSteamMicrosite() {
  return <main className={styles.site} data-source={business.dataSource}>
    <a className={styles.skipLink} href="#resultados">Saltar al contenido</a>
    {business.sectionOrder.map((section) => {
      const Section = sectionComponents[section];
      return <Section key={section} />;
    })}
    <a className={styles.floatingWhatsapp} href={elevaWhatsapp(business.generalWhatsappMessage)} target="_blank" rel="noreferrer" aria-label="Cotizar con Eleva Steam por WhatsApp">Cotizar por WhatsApp <span aria-hidden="true">↗</span></a>
  </main>;
}
