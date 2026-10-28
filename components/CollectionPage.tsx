import Link from "next/link";
import { SiteFooter, SiteHeader } from "./SiteChrome";

export type CollectionItem = { label: string; title: string; description: string; image: string; href: string; meta?: string };

export function CollectionPage({ eyebrow, title, description, items, status }: { eyebrow: string; title: string; description: string; items: CollectionItem[]; status?: string }) {
  return <div className="route-shell"><SiteHeader /><main className="route-main"><header className="route-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></header>{status ? <div className="legal-card" role="status"><p>{status}</p></div> : <div className="route-grid">{items.map((item) => <Link className="route-card" href={item.href} key={`${item.title}-${item.href}`}><img src={item.image} alt="" /><div><span>{item.label}</span><h2>{item.title}</h2><p>{item.description}</p>{item.meta && <small>{item.meta}</small>}</div></Link>)}</div>}</main><SiteFooter /></div>;
}
