import Link from "next/link";
import { BusinessOwnerCTA } from "@/components/BusinessMicrosite";
import { auraSpa as business, auraWhatsapp } from "@/data/auraSpa";
import styles from "./AuraSpaMicrosite.module.css";

function Hero() {
  return <section className="business-hero" id="inicio">
    <img src={business.heroImage} alt={business.name} />
    <div className="business-hero__shade" />
    <nav className="business-hero__nav" aria-label="Navegación del micrositio">
      <Link href="/">A Dos Pasos</Link>
      <Link href="/directorio/">Volver al directorio</Link>
    </nav>
    <div className="business-hero__copy">
      <span>{business.category} · {business.zone}</span>
      <h1>{business.name}</h1>
      <p>{business.shortDescription}</p>
      <a href={auraWhatsapp(business.whatsapp.generalMessage)} target="_blank" rel="noreferrer">Contactar por WhatsApp</a>
    </div>
  </section>;
}

function Experience() {
  return <section className={`${styles.section} ${styles.experience}`} id="experiencia">
    <div className={styles.experienceCopy}>
      <span className={styles.eyebrow}>{business.experience.eyebrow}</span>
      <h2>{business.experience.title}</h2>
      <p>{business.experience.description}</p>
      <div className={styles.quietNote}><span aria-hidden="true">○</span><small>Una experiencia de bienestar<br />y cuidado personal.</small></div>
    </div>
    <figure className={styles.experienceImage}>
      <img src={business.experience.image} alt="Ambiente tranquilo de Aura Spa" />
      <figcaption>{business.experience.caption}</figcaption>
    </figure>
  </section>;
}

function Treatments() {
  return <section className={`${styles.section} ${styles.treatments}`} id="tratamientos">
    <header className={styles.sectionHeading}>
      <div><span className={styles.eyebrow}>Tratamientos</span><h2>Elige cómo quieres sentirte.</h2></div>
      <p>Opciones claras y tiempos visibles para encontrar una pausa que se adapte a ti.</p>
    </header>
    <div className={styles.treatmentGrid}>{business.treatments.map((treatment) => <article className={styles.treatmentCard} data-treatment-id={treatment.id} key={treatment.id}>
      <div className={styles.treatmentImage}><img src={treatment.image} alt={`${treatment.name} en Aura Spa`} loading="lazy" /><span>{treatment.duration}</span></div>
      <div className={styles.treatmentCopy}>
        <h3>{treatment.name}</h3>
        <p>{treatment.description}</p>
        <div>{treatment.priceValidated ? <strong>{treatment.priceReference}</strong> : <span>Consulta disponibilidad</span>}<a href={auraWhatsapp(treatment.whatsappMessage)} target="_blank" rel="noreferrer" aria-label={`${treatment.cta} ${treatment.name}`}>{treatment.cta} <span aria-hidden="true">↗</span></a></div>
      </div>
    </article>)}</div>
  </section>;
}

function FeaturedTreatment() {
  const treatment = business.featuredTreatment;
  return <section className={styles.featuredTreatment} data-treatment-id={treatment.id}>
    <div className={styles.featuredImage}><img src={treatment.image} alt={`${treatment.name} en Aura Spa`} loading="lazy" /></div>
    <div className={styles.featuredCopy}>
      <span className={styles.eyebrow}>Experiencia distintiva</span>
      <h2>{treatment.name}</h2>
      <p>{treatment.description}</p>
      {treatment.durationValidated || treatment.priceValidated ? <div className={styles.featuredMeta}>{treatment.durationValidated ? <span>{treatment.durationReference}</span> : null}{treatment.priceValidated ? <strong>{treatment.priceReference}</strong> : null}</div> : null}
      <a className={styles.lightButton} href={auraWhatsapp(treatment.whatsappMessage)} target="_blank" rel="noreferrer">Conocer disponibilidad <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}

function FirstVisit() {
  const guide = business.firstVisitGuide;
  return <section className={`${styles.section} ${styles.firstVisit}`}>
    <div className={styles.guideIntro}>
      <span className={styles.eyebrow}>Si es tu primera vez</span>
      <h2>{guide.title}</h2>
      <p>{guide.intro}</p>
      <a href={auraWhatsapp(guide.whatsappMessage)} target="_blank" rel="noreferrer">Pedir orientación <span aria-hidden="true">↗</span></a>
    </div>
    <div className={styles.guideGrid}>{guide.recommendations.map((item) => <article key={item.number}>
      <span>{item.number}</span><p>{item.need}</p><h3>{item.treatment}</h3><small>{item.note}</small>
    </article>)}</div>
  </section>;
}

function Gallery() {
  return <section className={`${styles.section} ${styles.gallerySection}`} id="galeria">
    <header className={styles.sectionHeading}>
      <div><span className={styles.eyebrow}>Dentro de Aura</span><h2>Conoce el ambiente antes de venir.</h2></div>
      <p>Cabinas, texturas y detalles que forman parte de la experiencia.</p>
    </header>
    <div className={styles.galleryGrid}>{business.gallery.map((photo) => <figure className={styles.galleryItem} key={photo.src}>
      <img src={photo.src} style={{ objectPosition: photo.position }} alt={`${photo.label} en Aura Spa`} loading="lazy" />
      <figcaption>{photo.label}</figcaption>
    </figure>)}</div>
  </section>;
}

function BenefitPromotion() {
  const showBenefit = business.benefit.validated;
  const showPromotion = business.promotion.validated;
  if (!showBenefit && !showPromotion) return null;
  return <section className={`${styles.section} ${styles.offerSection}`}>
    {showBenefit ? <article><span className={styles.eyebrow}>Beneficio A Dos Pasos</span><h2>{business.benefit.title}</h2><p>{business.benefit.description}</p><small>{business.benefit.terms}</small></article> : null}
    {showPromotion ? <article><span className={styles.eyebrow}>Promoción vigente</span><h2>{business.promotion.title}</h2><p>{business.promotion.description}</p></article> : null}
  </section>;
}

function Trust() {
  return <section className={`${styles.section} ${styles.trust}`}>
    <header className={styles.trustHeading}><span className={styles.eyebrow}>Confianza</span><h2>Tu bienestar en buenas manos</h2><p>El cuidado también se nota en lo que sucede antes de tu cita.</p></header>
    <div className={styles.trustGrid}>{business.trust.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
  </section>;
}

function Visit() {
  return <section className={`${styles.section} ${styles.visit}`} id="ubicacion">
    <div className={styles.visitCopy}><span className={styles.eyebrow}>Cerca de ti</span><h2>Tu próxima pausa está en El Refugio.</h2><p>Consulta disponibilidad y los detalles de tu visita directamente con Aura Spa.</p></div>
    <article className={styles.zoneCard}><span>Zona</span><h3>{business.locationLabel}</h3></article>
  </section>;
}

function Reservation() {
  return <section className={styles.reservation}>
    <div><span className={styles.eyebrow}>Reserva</span><h2>Cuéntanos qué necesitas.</h2><p>Te ayudamos a elegir un tratamiento y consultar disponibilidad.</p></div>
    <a className={styles.lightButton} href={auraWhatsapp(business.whatsapp.generalMessage)} target="_blank" rel="noreferrer">Pedir orientación por WhatsApp <span aria-hidden="true">↗</span></a>
  </section>;
}

function FinalCTA() {
  return <section className={styles.finalCta} style={{ "--final-image": `url(${business.heroImage})` } as React.CSSProperties}>
    <div><span className={styles.eyebrow}>Tu momento</span><h2>¿Te regalarías una pausa para ti?</h2><p>Tu próxima experiencia de bienestar puede estar a unos minutos de casa.</p><a className={styles.lightButton} href={auraWhatsapp(business.whatsapp.generalMessage)} target="_blank" rel="noreferrer">Contactar por WhatsApp <span aria-hidden="true">↗</span></a></div>
  </section>;
}

function Footer() {
  return <><BusinessOwnerCTA /><footer className={styles.footer}>
    <div><a className={styles.auraMark} href="#inicio"><span>Aura</span><small>Spa</small></a><p>{business.category} · {business.zone}</p></div>
    <div className={styles.platformSignature}><small>Descubre más negocios en</small><img src={business.platformLogo} alt="A Dos Pasos — Descubre lo que tienes cerca de casa" /></div>
    <Link href="/directorio/">Volver al directorio</Link>
  </footer></>;
}

const sectionComponents = {
  hero: Hero,
  experience: Experience,
  treatments: Treatments,
  featuredTreatment: FeaturedTreatment,
  firstVisit: FirstVisit,
  gallery: Gallery,
  benefitPromotion: BenefitPromotion,
  trust: Trust,
  visit: Visit,
  reservation: Reservation,
  finalCTA: FinalCTA,
  footer: Footer
};

export function AuraSpaMicrosite() {
  return <main className={`business-site theme-serene-light ${styles.site}`} data-source={business.dataSource}>
    <a className={styles.skipLink} href="#experiencia">Saltar al contenido</a>
    {business.sectionOrder.map((section) => {
      const Section = sectionComponents[section];
      return <Section key={section} />;
    })}
  </main>;
}
