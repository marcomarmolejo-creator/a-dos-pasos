import { CommercialClickTracking } from "@/components/CommercialClickTracking";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import styles from "./Contratar.module.css";

export const metadata = {
  title: "Contratar | A Dos Pasos",
  description: "Opciones comerciales de A Dos Pasos para negocios de El Refugio."
};

const WHATSAPP_BASE = "https://wa.me/524424223487";

const paymentProducts = [
  {
    id: "pay-micrositio",
    title: "Micrositio Fundador",
    label: "1 año",
    badge: null,
    price: "$1,290 MXN + IVA",
    total: "$1,496.40 MXN",
    features: [
      "Micrositio dentro de A Dos Pasos",
      "Información completa de tu negocio",
      "Fotos, ubicación y contacto",
      "WhatsApp y Google Maps",
      "Presencia durante 1 año"
    ],
    href: "https://pago.clip.mx/v3/346f4b1b-e74e-47d0-88c3-5c10f226cb39"
  },
  {
    id: "pay-video-local",
    title: "Video Local Básico",
    label: null,
    badge: null,
    price: "$1,490 MXN + IVA",
    total: "$1,728.40 MXN",
    features: [
      "Grabación breve en una ubicación",
      "Video vertical de 15–20 segundos",
      "Edición, música, logo y CTA",
      "1 ronda de ajustes",
      "Archivo final para tus propias redes",
      "Integración al micrositio cuando corresponda"
    ],
    href: "https://pago.clip.mx/v3/04697e24-4ce9-48b6-8585-e7ea6f10cc19"
  },
  {
    id: "pay-micrositio-video",
    title: "Micrositio + Video Local",
    label: null,
    badge: "Recomendado",
    price: "$2,490 MXN + IVA",
    total: "$2,888.40 MXN",
    features: [
      "Micrositio durante 1 año",
      "Video Local Básico",
      "Fotos e información del negocio",
      "WhatsApp y Google Maps",
      "Video integrado a tu presencia local",
      "Archivo del video para tus propias redes"
    ],
    href: "https://pago.clip.mx/v3/8ba9f556-ea94-4d70-ba61-5c1ef98d44ba"
  }
] as const;

const promotionProducts = [
  {
    id: "contact-beneficio-local",
    title: "Beneficio Local",
    duration: "7 días de publicación",
    price: "desde $299 MXN + IVA",
    description: "Ideal para una promoción, beneficio especial, lanzamiento o activación de corta duración.",
    message: "Hola, me interesa conocer más sobre Beneficio Local de A Dos Pasos."
  },
  {
    id: "contact-promocion-activa",
    title: "Promoción Activa",
    duration: "30 días de promoción",
    price: "desde $590 MXN + IVA",
    description: "Mantén una promoción visible durante todo el mes y genera mayor permanencia frente a la audiencia local.",
    message: "Hola, me interesa conocer más sobre Promoción Activa de A Dos Pasos."
  }
] as const;

const generalWhatsAppUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent("Hola, quiero conocer más sobre A Dos Pasos para mi negocio.")}`;

export default function ContractPage() {
  return <div className={styles.page}>
    <SiteHeader cta={{ href: "#productos", label: "Ver opciones" }} />
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>El Refugio · Etapa Fundadores</span>
          <h1>Haz que tu negocio sea más fácil de descubrir.</h1>
          <p>Elige la opción que mejor se adapte a tu negocio. Puedes comenzar con presencia local, crear contenido audiovisual o combinar ambas opciones.</p>
          <span className={styles.trust}>Pagos seguros procesados por Clip.</span>
        </div>
      </section>

      <section className={styles.products} id="productos" aria-labelledby="products-title">
        <header className={styles.sectionHeader}>
          <span>Elige cómo participar</span>
          <h2 id="products-title">Una opción clara para cada momento de tu negocio.</h2>
        </header>
        <div className={styles.productGrid}>
          {paymentProducts.map((product) => <article className={`${styles.productCard} ${product.badge ? styles.recommended : ""}`} key={product.id} id={product.id.replace("pay-", "")}>
            <div className={styles.cardTopline}>
              {product.label ? <span className={styles.duration}>{product.label}</span> : <span aria-hidden="true" />}
              {product.badge ? <span className={styles.recommendedBadge}>{product.badge}</span> : null}
            </div>
            <h3>{product.title}</h3>
            <strong className={styles.price}>{product.price}</strong>
            <p className={styles.total}><span>Total a pagar</span>{product.total}</p>
            <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <a
              className={styles.payButton}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              data-commercial-product={product.id}
              data-commercial-source="contratar"
              aria-label={`Contratar y pagar ${product.title} con Clip; abre en una pestaña nueva`}
            >Contratar y pagar <span aria-hidden="true">↗</span></a>
            <small className={styles.clipNote}>Pago procesado de forma segura por Clip</small>
          </article>)}
        </div>

        <aside className={styles.paymentInfo} aria-labelledby="clip-title">
          <div><span className={styles.clipMark} aria-hidden="true">C</span><h3 id="clip-title">Pago seguro con Clip</h3></div>
          <p>Tu pago se procesa directamente a través de Clip. Puedes pagar con tarjetas participantes y, cuando aplique, elegir hasta 3 meses sin intereses.</p>
          <small>Los meses sin intereses dependen de la tarjeta y condiciones aplicables mostradas por Clip al momento del pago.</small>
        </aside>
      </section>

      <section className={styles.promotions} aria-labelledby="promotions-title">
        <header className={styles.sectionHeader}>
          <span>Opciones de corta duración</span>
          <h2 id="promotions-title">¿Quieres darle visibilidad a una promoción?</h2>
          <p>También puedes activar promociones de corta duración sin contratar un micrositio o video.</p>
        </header>
        <div className={styles.promotionGrid}>
          {promotionProducts.map((product) => <article key={product.id}>
            <span>{product.duration}</span>
            <h3>{product.title}</h3>
            <strong>{product.price}</strong>
            <p>{product.description}</p>
            <a
              href={`${WHATSAPP_BASE}?text=${encodeURIComponent(product.message)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-commercial-product={product.id}
              data-commercial-source="contratar"
              aria-label={`Solicitar ${product.title} por WhatsApp; abre en una pestaña nueva`}
            >Solicitar por WhatsApp <span aria-hidden="true">↗</span></a>
          </article>)}
        </div>
      </section>

      <section className={styles.details}>
        <article>
          <span>Facturación</span>
          <h2>¿Necesitas factura?</h2>
          <p>Sí. Los precios mostrados son más IVA. Después de realizar tu pago te indicaremos cómo enviarnos tus datos fiscales para solicitar tu factura.</p>
        </article>
        <article>
          <span>Siguiente paso</span>
          <h2>¿Qué sucede después de pagar?</h2>
          <ol>
            <li><b>01</b><span>Realizas tu pago</span></li>
            <li><b>02</b><span>Confirmamos tu contratación</span></li>
            <li><b>03</b><span>Recibimos la información de tu negocio</span></li>
            <li><b>04</b><span>Comenzamos tu micrositio o video</span></li>
          </ol>
        </article>
      </section>

      <section className={styles.help}>
        <div><span>Ayuda antes de comprar</span><h2>¿No sabes cuál elegir?</h2><p>Escríbenos y te ayudamos a elegir la opción adecuada para tu negocio.</p></div>
        <a href={generalWhatsAppUrl} target="_blank" rel="noopener noreferrer" data-commercial-product="contact-ayuda" data-commercial-source="contratar">Hablar por WhatsApp <span aria-hidden="true">↗</span></a>
      </section>
    </main>
    <SiteFooter />
    <CommercialClickTracking />
  </div>;
}
