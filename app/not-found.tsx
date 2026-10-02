import Link from "next/link";

export default function NotFound() {
  return <main className="route-shell"><div className="route-main"><section className="legal-card"><span className="eyebrow">A Dos Pasos</span><h1>Este negocio todavía no está disponible.</h1><p>Puede que su espacio se encuentre en preparación.</p><Link className="button button--blue" href="/directorio/">Volver al directorio</Link></section></div></main>;
}
