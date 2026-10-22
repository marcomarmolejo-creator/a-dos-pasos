import Link from "next/link";
import { BusinessOwnerCTA } from "@/components/BusinessMicrosite";
import { fornoLocale as business, type FornoMenuItem } from "@/data/fornoLocale";
import styles from "./FornoLocaleMicrosite.module.css";

function PendingAction({ label, tone = "dark" }: { label: string; tone?: "dark" | "light" }) {
  return <span className={`${styles.action} ${tone === "light" ? styles.actionLight : ""}`} aria-disabled="true">
    {label}
  </span>;
}

function Hero() {
  return <section className="business-hero" id="inicio">
    <img src={business.hero.image} alt={business.name} />
    <div className="business-hero__shade" />
    <nav className="business-hero__nav" aria-label="Navegación del micrositio">
      <Link href="/">A Dos Pasos</Link>
      <Link href="/directorio/">Volver al directorio</Link>
    </nav>
    <div className="business-hero__copy">
      <span>{business.category} · {business.zone}</span>
      <h1>{business.name}</h1>
      <p>{business.shortDescription}</p>
      <div className={styles.heroActions}>
        <PendingAction label="Pedir por WhatsApp" />
        <PendingAction label="Cómo llegar" tone="light" />
      </div>
    </div>
  </section>;
}

function FeaturedProduct() {
  const product = business.featuredProduct;
  return <section className={`${styles.section} ${styles.featured}`} data-product-id={product.id}>
    <figure className={styles.featuredImage}><img src={product.image} alt={`${product.name}, especialidad de Forno Locale`} /></figure>
    <div className={styles.featuredCopy}>
      <span className={styles.eyebrow}>La especialidad de la casa</span>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <ul>{product.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
      <div className={styles.productAction}>
        {product.priceValidated ? <strong>{product.price}</strong> : null}
        <PendingAction label={product.cta} />
      </div>
    </div>
  </section>;
}

function Menu() {
  const visibleMenu = business.menu.filter((item) => item.id !== "tiramisu" || (Boolean(item.image) && (item as FornoMenuItem).imageValidated === true));
  return <section className={`${styles.section} ${styles.menu}`} id="menu">
    <header className={styles.sectionHeading}>
      <div><span className={styles.eyebrow}>Una selección del forno</span><h2>Elige tu próxima favorita.</h2></div>
    </header>
    <div className={styles.menuGrid}>{visibleMenu.map((item) => {
      if (!item.image) return null;
      return <article className={styles.menuCard} data-product-id={item.id} key={item.id}>
        <div className={styles.menuImage}><img src={item.image} alt={item.name} loading="lazy" decoding="async" />{item.id === business.featuredProduct.id ? <span>Especialidad</span> : null}</div>
        <div className={styles.menuCopy}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className={styles.menuMeta}>{item.priceValidated ? <strong>{item.price}</strong> : null}<PendingAction label={item.cta} /></div>
        </div>
      </article>;
    })}</div>
  </section>;
}

function EditorialPicks() {
  const picks = business.editorialPicks.recommendations.filter((item) => item.published);
  return <section className={`${styles.section} ${styles.picks}`}>
    <div className={styles.picksIntro}><span className={styles.eyebrow}>Qué pedimos</span><h2>{business.editorialPicks.title}</h2><p>{business.editorialPicks.intro}</p><small>Una recomendación editorial de A Dos Pasos.</small></div>
    <div className={styles.pickList}>{picks.map((item) => <article key={item.id}><span>{item.number}</span><div><h3>{item.name}</h3><p>{item.note}</p></div></article>)}</div>
  </section>;
}

function Craft() {
  return <section className={`${styles.section} ${styles.craft}`} id="oficio">
    <div className={styles.craftImages}>{business.craft.images.map((image, index) => <figure key={image.src} className={index === 0 ? styles.craftPortrait : styles.craftWide}><img src={image.src} alt={image.alt} loading="lazy" decoding="async" /></figure>)}</div>
    <div className={styles.craftCopy}><span className={styles.eyebrow}>{business.craft.eyebrow}</span><h2>{business.craft.title}</h2><p>{business.craft.description}</p><div className={styles.craftSteps}>{business.craft.steps.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></div>
  </section>;
}

function Gallery() {
  return <section className={`${styles.section} ${styles.gallery}`} id="galeria">
    <header className={styles.sectionHeading}><div><span className={styles.eyebrow}>Dentro de Forno</span><h2>Producto, oficio y mesa.</h2></div><p>Una mirada compacta al sabor, al proceso y al ambiente que rodea cada visita.</p></header>
    <div className={styles.galleryGrid}>{business.gallery.map((photo) => <figure key={photo.label}><img src={photo.src} style={{ objectPosition: photo.position }} alt={`${photo.label} en Forno Locale`} loading="lazy" decoding="async" /><figcaption>{photo.label}</figcaption></figure>)}</div>
  </section>;
}

function Benefit() {
  if (!business.benefit.validated) return null;
  return <section className={`${styles.section} ${styles.offer}`}><span className={styles.eyebrow}>Beneficio A Dos Pasos</span><h2>{business.benefit.title}</h2><p>{business.benefit.description}</p><small>{business.benefit.terms}</small></section>;
}

function Promotion() {
  if (!business.promotion.validated) return null;
  return <section className={`${styles.section} ${styles.promotion}`}><span className={styles.eyebrow}>Promoción vigente</span><h2>{business.promotion.title}</h2><p>{business.promotion.description}</p></section>;
}

function Visit() {
  return <section className={`${styles.section} ${styles.visit}`} id="ubicacion">
    <div><span className={styles.eyebrow}>Cerca de ti</span><h2>El forno está en tu zona.</h2></div>
    <article><span>Zona</span><h3>{business.location.label}</h3></article>
  </section>;
}

function HowToOrder() {
  return <section className={`${styles.section} ${styles.howToOrder}`} id="pedir">
    <div><span className={styles.eyebrow}>Cómo pedir</span><h2>Del forno a tu mesa.</h2><p>Consulta disponibilidad y forma de pedido por WhatsApp.</p><PendingAction label="Pedir por WhatsApp" tone="light" /></div>
  </section>;
}

function FinalCTA() {
  return <section className={styles.finalCta} style={{ "--final-image": `url(${business.hero.image})` } as React.CSSProperties}>
    <div><span className={styles.eyebrow}>Recién hecha sabe mejor</span><h2>¿Se te antojó?</h2><p>Tu próxima pizza puede estar a unos minutos de casa.</p><div className={styles.finalActions}><PendingAction label="Pedir por WhatsApp" /><PendingAction label="Cómo llegar" tone="light" /></div></div>
  </section>;
}

function Footer() {
  return <><BusinessOwnerCTA /><footer className={styles.footer}>
    <div><a className={styles.fornoMark} href="#inicio"><span>Forno</span><small>Locale</small></a><p>{business.category} · {business.zone}</p></div>
    <div className={styles.platformSignature}><small>Descubre más negocios en</small><img src={business.platformLogo} alt="A Dos Pasos — Descubre lo que tienes cerca de casa" /></div>
    <Link href="/directorio/">Volver al directorio</Link>
  </footer></>;
}

const sectionComponents = {
  hero: Hero,
  featuredProduct: FeaturedProduct,
  menu: Menu,
  editorialPicks: EditorialPicks,
  craft: Craft,
  gallery: Gallery,
  benefit: Benefit,
  promotion: Promotion,
  visit: Visit,
  howToOrder: HowToOrder,
  finalCTA: FinalCTA,
  footer: Footer
};

export function FornoLocaleMicrosite() {
  return <main className={`business-site theme-warm-editorial ${styles.site}`} data-source={business.dataSource}>
    <a className={styles.skipLink} href="#menu">Saltar al menú</a>
    {business.sectionOrder.map((section) => {
      const Section = sectionComponents[section];
      return <Section key={section} />;
    })}
  </main>;
}
