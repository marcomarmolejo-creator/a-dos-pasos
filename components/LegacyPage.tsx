import fs from "node:fs";
import path from "node:path";
import { LegacyModule } from "./LegacyModule";

const routeReplacements: Array<[string, string]> = [
  ["./assets/", "/assets/"],
  ['href="#beneficios"', 'href="/beneficios/"'],
  ['href="#nuevo"', 'href="/nuevo/"'],
  ['href="#ideas"', 'href="/ideas/"'],
  ['href="/#beneficios"', 'href="/beneficios/"'],
  ['href="/unete/"', 'href="/residentes/"'],
  ['href="#aviso-privacidad"', 'href="/privacidad/"'],
  ['href="#reglas-comerciales"', 'href="/reglas-comerciales/"']
];

export function getLegacyBody(file: string) {
  const source = fs.readFileSync(path.join(process.cwd(), "legacy-static-source", file), "utf8");
  const body = source.match(/<body[^>]*>([\s\S]*?)<script[^>]*>[\s\S]*?<\/script>\s*<\/body>/)?.[1]
    ?? source.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1]
    ?? "";
  let html = routeReplacements.reduce((value, [from, to]) => value.replaceAll(from, to), body)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");
  if (file === "para-negocios/index.html" || file === "unete/index.html") {
    const compact = file === "para-negocios/index.html" ? " general-contact--compact" : "";
    const contact = `<aside class="general-contact${compact}" aria-label="Contacto de A Dos Pasos"><div><span>Contacto</span><strong>¿Tienes dudas, comentarios o quieres recomendar un negocio?</strong></div><div class="general-contact__links"><a href="https://wa.me/524424223487" target="_blank" rel="noreferrer"><small>WhatsApp</small>442 422 34 87</a><a href="mailto:hola@adospasos.com.mx"><small>Correo</small>hola@adospasos.com.mx</a>${compact ? "" : '<a href="https://www.adospasos.com.mx" target="_blank" rel="noreferrer"><small>Web</small>www.adospasos.com.mx</a>'}</div></aside>`;
    html = html.replace(/(<footer class="footer[^"]*">)/, `$1${contact}`);
  }
  return html;
}

export function LegacyPage({ file, moduleSrc, bodyClass }: { file: string; moduleSrc?: string; bodyClass?: string }) {
  const html = getLegacyBody(file);
  return <><div className={bodyClass} dangerouslySetInnerHTML={{ __html: html }} />{moduleSrc ? <LegacyModule src={moduleSrc} /> : null}</>;
}
