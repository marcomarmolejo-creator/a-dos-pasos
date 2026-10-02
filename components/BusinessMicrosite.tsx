import Link from "next/link";
import type { Business } from "@/data/businesses";

export function BusinessHero({ business }: { business: Business }) {
  return <section className="business-hero"><img src={business.heroImage} alt={business.name} /><div className="business-hero__shade" /><div className="business-hero__nav"><Link href="/">A Dos Pasos</Link><Link href="/directorio/">Volver al directorio</Link></div><div className="business-hero__copy"><span>{business.eyebrow}</span><h1>{business.name}</h1><p>{business.description}</p><a href={business.whatsapp} target="_blank" rel="noreferrer">Contactar por WhatsApp</a></div></section>;
}

export function BusinessAbout({ business }: { business: Business }) {
  return <section className="business-block business-about"><span>Conoce</span><h2>{business.description}</h2><p>Un negocio local seleccionado por A Dos Pasos para que puedas conocer mejor lo que ofrece antes de decidir.</p></section>;
}

export function BusinessServices({ business }: { business: Business }) {
  return <section className="business-block"><header><span>Servicios</span><h2>Lo que puedes encontrar aquí</h2></header><div className="business-service-grid">{business.services.map((service, index) => <article key={service.name}><small>0{index + 1}</small><h3>{service.name}</h3><p>{service.detail}</p></article>)}</div></section>;
}

export function BusinessGallery({ business }: { business: Business }) {
  return <section className="business-gallery" aria-label={`Galería de ${business.name}`}>{business.gallery.map((image, index) => <img src={image} alt={`${business.name} ${index + 1}`} key={image} />)}</section>;
}

export function BusinessVideo({ business }: { business: Business }) {
  if (!business.video) return null;
  return <section className="business-block"><header><span>Así trabajamos</span><h2>Conoce la experiencia</h2></header><video controls preload="metadata" src={business.video} /></section>;
}

export function BusinessBenefit({ business }: { business: Business }) {
  if (!business.benefit) return null;
  return <section className="business-feature"><span>Beneficio local</span><h2>{business.benefit.title}</h2><p>{business.benefit.description}</p><a href={business.whatsapp} target="_blank" rel="noreferrer">Consultar beneficio</a></section>;
}

export function BusinessPromotion({ business }: { business: Business }) {
  if (!business.promotion) return null;
  return <section className="business-feature business-feature--promotion"><span>Promoción activa</span><h2>{business.promotion.title}</h2><p>{business.promotion.description}</p><a href={business.whatsapp} target="_blank" rel="noreferrer">Consultar promoción</a></section>;
}

export function BusinessLocation({ business }: { business: Business }) {
  return <section className="business-block business-location"><div><span>Ubicación</span><h2>{business.zone}</h2><p>Consulta indicaciones y disponibilidad antes de tu visita.</p></div><a href={business.maps} target="_blank" rel="noreferrer">Abrir en Maps</a></section>;
}

export function BusinessCTA({ business }: { business: Business }) {
  return <section className="business-cta-final"><span>{business.category}</span><h2>¿Quieres conocer más?</h2><a href={business.whatsapp} target="_blank" rel="noreferrer">Escribir a {business.name}</a></section>;
}

export function BusinessFooter({ business }: { business: Business }) {
  return <footer className="business-footer-dynamic"><strong>{business.name}</strong><Link href="/directorio/">Explorar más negocios en A Dos Pasos</Link></footer>;
}

const blocks = { about: BusinessAbout, services: BusinessServices, gallery: BusinessGallery, video: BusinessVideo, benefit: BusinessBenefit, promotion: BusinessPromotion, location: BusinessLocation };

export function BusinessMicrosite({ business }: { business: Business }) {
  return <main className={`business-site theme-${business.theme}`}><BusinessHero business={business} />{business.sectionOrder.map((section) => { const Block = blocks[section]; return <Block business={business} key={section} />; })}<BusinessCTA business={business} /><BusinessFooter business={business} /></main>;
}
