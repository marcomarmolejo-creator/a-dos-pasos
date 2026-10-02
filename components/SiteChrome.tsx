import Link from "next/link";

export function SiteHeader({ cta }: { cta?: { href: string; label: string } }) {
  return <header className="site-header" id="inicio">
    <Link className="brand" href="/" aria-label="A Dos Pasos, volver a inicio"><img src="/assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" /></Link>
    <nav aria-label="Navegación principal"><Link href="/">Descubrir</Link><Link href="/directorio/">Directorio</Link><Link href="/beneficios/">Beneficios</Link><Link href="/nuevo/">Nuevo</Link><Link href="/ideas/">Ideas</Link><Link href="/para-negocios/">Para negocios</Link></nav>
    {cta && <Link className="header-cta" href={cta.href}>{cta.label}</Link>}
  </header>;
}

export function GeneralContact({ compact = false }: { compact?: boolean }) {
  return <aside className={`general-contact${compact ? " general-contact--compact" : ""}`} aria-label="Contacto de A Dos Pasos">
    <div><span>Contacto</span><strong>¿Tienes dudas, comentarios o quieres recomendar un negocio?</strong></div>
    <div className="general-contact__links">
      <a href="https://wa.me/524424223487" target="_blank" rel="noreferrer"><small>WhatsApp</small>442 422 34 87</a>
      <a href="mailto:hola@adospasos.com.mx"><small>Correo</small>hola@adospasos.com.mx</a>
      {!compact && <a href="https://www.adospasos.com.mx" target="_blank" rel="noreferrer"><small>Web</small>www.adospasos.com.mx</a>}
    </div>
  </aside>;
}

export function SiteFooter() {
  return <footer className="footer"><div className="footer-brand"><img src="/assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" /><h2>Descubre lo que tienes cerca de casa.</h2><p>Una guía visual para una comunidad más conectada.</p></div><div className="footer-group"><small>Explora</small><div className="footer-group-content"><Link href="/directorio/">Directorio</Link><Link href="/ideas/">Ideas para hoy</Link><Link href="/para-negocios/">Para negocios</Link><Link href="/privacidad/">Privacidad</Link></div></div><GeneralContact /><div className="footer-bottom"><span>A Dos Pasos · El Refugio</span><span>Powered by Eleva Studio Lab</span></div></footer>;
}
