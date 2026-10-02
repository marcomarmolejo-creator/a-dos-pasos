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
  return routeReplacements.reduce((html, [from, to]) => html.replaceAll(from, to), body)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");
}

export function LegacyPage({ file, moduleSrc, bodyClass }: { file: string; moduleSrc: string; bodyClass?: string }) {
  const html = getLegacyBody(file);
  return <><div className={bodyClass} dangerouslySetInnerHTML={{ __html: html }} /><LegacyModule src={moduleSrc} /></>;
}
