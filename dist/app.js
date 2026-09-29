import { businesses, intentions, benefits, promotions, zones } from "./business-data.js";

const byId = (id) => businesses.find((business) => business.id === id);
const whatsappShare = "https://wa.me/?text=" + encodeURIComponent("Hola, quiero conocer cómo puede aparecer mi negocio en A Dos Pasos · El Refugio.");

function HeroDiscovery() {
  const sectionLinks = [["Qué hacer","#que-hacer"],["Cerca de ti","#cerca-de-ti"],["Beneficios","#beneficios"],["Nuevo","#nuevo"],["Ideas para hoy","#ideas"],["Ahora","#ahora"]];
  const categoryLinks = [["◒","Comer"],["◡","Café"],["✦","Cuidarme"],["⌂","Mi casa"],["⌁","Servicios"],["%","Promociones"],["+","Nuevos"]];
  return `<section class="hero" id="descubrir">
    <div class="hero-orbit hero-orbit--one"></div><div class="hero-orbit hero-orbit--two"></div>
    <div class="hero-copy reveal"><p class="kicker">A Dos Pasos · El Refugio</p><h1>Descubre lo que tienes <em>cerca de casa.</em></h1><p class="hero-sub">Negocios, lugares, servicios, promociones y nuevas aperturas de El Refugio.</p>${DiscoverySearch("hero-search")}<nav class="mobile-section-nav" aria-label="Explora las secciones de A Dos Pasos"><strong>Explora A Dos Pasos</strong><div>${sectionLinks.map(([label,href])=>`<a href="${href}">${label}</a>`).join("")}</div></nav><div class="hero-quick" id="que-hacer" aria-label="Categorías"><div class="hero-quick-heading"><strong>¿Qué quieres hacer?</strong><span>Elige una categoría</span></div><div class="hero-category-track">${categoryLinks.map(([icon,item])=>`<button type="button" data-quick-search="${item}"><i>${icon}</i>${item}</button>`).join("")}</div></div></div>
    <div class="hero-editorial reveal" aria-label="Descubrimientos destacados"><a class="hero-tile hero-tile--forno" href="${byId("forno-locale").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/forno-locale.png" alt="Forno Locale" /><span>Nuevo</span><strong>Forno Locale</strong><small>Pizzería artesanal · A 5 min</small></a><a class="hero-tile hero-tile--aura" href="${byId("aura-spa").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/aura-ritual.jpg" alt="Aura Spa" /><span>● Abierto ahora</span><strong>Aura Spa</strong></a><a class="hero-tile hero-tile--barber" href="${byId("barberia-clasica").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/barberia-clasica.png" alt="Barbería Clásica" /><span>Beneficio</span><strong>Barbería Clásica</strong></a><a class="hero-tile hero-tile--eleva" href="${byId("eleva-steam").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/eleva-steam.jpg" alt="Eleva Steam" /><span>A domicilio</span><strong>Eleva Steam</strong></a><b class="floating-chip chip--distance">⌖ A 3 min</b></div>
  </section>`;
}

function DiscoverySearch(id) {
  return `<form class="search-box search-box--hero" role="search" data-search><label class="sr-only" for="${id}">Busca por negocio, categoría, servicio o intención</label><div><span>⌕</span><input id="${id}" type="search" placeholder="¿Qué estás buscando cerca?" autocomplete="off" /><button type="submit">Explorar</button></div><p class="search-feedback" aria-live="polite"></p></form>`;
}

function ZoneSelector() {
  return `<section class="zone-bar"><div><i></i><span>Estás explorando:</span><strong>El Refugio</strong></div><button type="button" data-zone-toggle>Cambiar zona <span>⌄</span></button><div class="zone-options" hidden>${zones.map((zone,index)=>`<button type="button" ${index ? "disabled" : ""}>${zone}${index ? " · próximamente" : " · activa"}</button>`).join("")}</div></section>`;
}

function IntentionGrid() {
  return `<section class="section intentions" id="explorar"><header class="section-heading reveal"><span class="eyebrow">¿Qué quieres hacer?</span><h2>Encuentra rápido lo que buscas cerca de casa</h2><p>Menos directorio. Más respuestas para tu día.</p></header><div class="intentions-grid">${intentions.map((item,index)=>`<a class="intention-card reveal" href="#cerca-de-ti" style="--delay:${index * 45}ms"><div class="intention-image"><img src="${item.image}" alt="" loading="lazy" /></div><div class="intention-copy"><i>${item.icon}</i><div><h3>${item.title}</h3><p>${item.subtitle}</p></div><span>↗</span></div></a>`).join("")}</div></section>`;
}

function BusinessCard(business, index) {
  return `<article class="business-card business-card--${index + 1} reveal"><a class="business-image" href="${business.micrositeUrl}" target="_blank" rel="noreferrer"><img src="${business.image}" alt="${business.name}" loading="lazy" /><span class="business-status">${business.status}</span><span class="business-distance">${business.distance}</span></a><div class="business-copy"><div><small>${business.tag} · ${business.zone}</small><h3>${business.name}</h3><p>${business.category}</p></div><a href="${business.micrositeUrl}" target="_blank" rel="noreferrer">${business.id === "eleva-steam" ? "Ver servicio" : "Ver lugar"} <span>↗</span></a></div></article>`;
}

function FeaturedBusinesses() {
  return `<section class="section featured preview-section" id="cerca-de-ti"><header class="section-heading section-heading--split reveal"><div><span class="eyebrow">Cerca de ti</span><h2>Lugares y servicios que vale la pena conocer</h2></div><p>Una selección local para decidir mejor, sin perderte entre resultados repetidos.</p></header><div class="business-grid">${businesses.map(BusinessCard).join("")}</div><button class="section-more" type="button" data-expand-section aria-expanded="false">Ver más lugares <span>→</span></button></section>`;
}

function BenefitsSection() {
  return `<section class="section benefits preview-section" id="beneficios"><header class="section-heading reveal"><span class="eyebrow">Beneficios locales</span><h2>Algo bueno por estar cerca</h2></header><div class="benefits-track">${benefits.map((benefit,index)=>{const business=byId(benefit.businessId);const initials=benefit.business.split(" ").map(word=>word[0]).join("").slice(0,2);return `<article class="benefit-card reveal"><div class="benefit-media" aria-hidden="true"><img src="${business.image}" alt="" loading="lazy" /></div><div class="benefit-brandmark" aria-label="Identidad de ${benefit.business}"><span>${initials}</span><strong>${benefit.business}</strong></div><div class="benefit-top"><span><b class="benefit-label-desktop">Beneficio</b><b class="benefit-label-mobile">Beneficio local</b></span><b>A Dos Pasos</b></div><small>${benefit.business}</small><h3>${benefit.title}</h3><p class="benefit-description-desktop">${benefit.validity}</p><p class="benefit-description-mobile">${benefit.mobileDescription}</p><em class="benefit-meta">${benefit.meta}</em><a href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Ver beneficio ↗</a><i>${String(index+1).padStart(2,"0")}</i></article>`}).join("")}</div><button class="section-more" type="button" data-expand-section aria-expanded="false">Ver todos los beneficios <span>→</span></button></section>`;
}

function PromotionsSection() {
  const promotion = promotions[0]; const business = byId(promotion.businessId);
  return `<section class="promotion reveal"><div><span class="eyebrow">Promoción activa</span><h2>Una razón más para probar algo cerca.</h2></div><div class="promotion-offer"><small>${promotion.business}</small><strong>${promotion.title}</strong><p>${promotion.description}</p></div><a class="button button--yellow" href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Consultar promoción ↗</a></section>`;
}

function NewInZone() {
  return `<section class="section new-zone preview-section" id="nuevo"><header class="section-heading section-heading--split reveal"><div><span class="eyebrow">Nuevo en la zona</span><h2>Descubre lo que acaba de llegar</h2></div><p>Nuevas aperturas, servicios y formas de disfrutar mejor tu zona.</p></header><div class="magazine-grid"><a class="magazine-main reveal" href="${byId("forno-locale").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/forno-locale.png" alt="Forno Locale" loading="lazy" /><span>Nueva apertura · Comer</span><h3>Forno Locale enciende el horno en El Refugio</h3><p>Conoce el espacio, la carta y cómo llegar antes de tu primera visita.</p></a><a class="magazine-side magazine-side--top reveal" href="${byId("aura-spa").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/aura-ritual.jpg" alt="Ritual de bienestar en Aura Spa" loading="lazy" /><div><span>Nuevo servicio</span><h3>Un nuevo ritual en Aura Spa</h3></div></a><a class="magazine-side magazine-side--bottom reveal" href="${byId("eleva-steam").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/eleva-steam.jpg" alt="Servicio de Eleva Steam" loading="lazy" /><div><span>Nueva cobertura</span><h3>Eleva Steam va hasta tu casa</h3></div></a></div><button class="section-more" type="button" data-expand-section aria-expanded="false">Ver todo lo nuevo <span>→</span></button></section>`;
}

function EditorialStories() {
  const modules = [
    ["3 lugares para comer", "Para una comida sin cruzar la ciudad.", "forno-locale", ["./assets/forno-locale.png","./assets/forno-table.png","./assets/forno-locale.png"]],
    ["2 opciones para consentirte", "Una pausa, un corte o un ritual cerca.", "aura-spa", ["./assets/aura-spa.jpg","./assets/barberia-interior.png"]],
    ["Servicios para tu casa", "Expertos que llegan hasta donde estás.", "eleva-steam", ["./assets/eleva-steam.jpg","./assets/eleva-resultado.jpg"]],
    ["Promociones del fin de semana", "Beneficios que hacen mejor un plan cercano.", "forno-locale", ["./assets/forno-table.png","./assets/aura-ritual.jpg","./assets/barberia-clasica.png"]]
  ];
  return `<section class="section editorial preview-section" id="ideas"><header class="section-heading reveal"><span class="eyebrow">Ideas para hoy</span><h2>Cuando no sabes qué hacer, empieza por aquí</h2></header><div class="editorial-grid">${modules.map(([title,copy,id,images])=>{const b=byId(id);return `<a class="editorial-card reveal" href="${b.micrositeUrl}" target="_blank" rel="noreferrer"><div class="editorial-images">${images.map((src,index)=>`<img src="${src}" alt="" loading="lazy" style="--image:${index}" />`).join("")}</div><div class="editorial-copy"><h3>${title}</h3><p>${copy}</p><b>Explorar selección ↗</b></div></a>`}).join("")}</div><button class="section-more" type="button" data-expand-section aria-expanded="false">Ver más ideas <span>→</span></button></section>`;
}

function NearbyNow() {
  return `<section class="nearby" id="ahora"><div class="nearby-title"><span class="eyebrow">Cerca de ti ahora</span><h2>Decide en un vistazo</h2></div><div class="nearby-content"><div class="nearby-track">${businesses.map((b,index)=>`<a href="${b.micrositeUrl}" target="_blank" rel="noreferrer"><img src="${b.image}" alt="" loading="lazy" /><div><span>${index === 0 ? "Nuevo esta semana" : index === 1 ? "Abierto ahora" : index === 2 ? "A menos de 5 min" : "A domicilio"}</span><strong>${b.name}</strong><small>${b.category} · ${b.distance}</small><b>${b.id === "eleva-steam" ? "Ver servicio" : "Conocer"} ↗</b></div></a>`).join("")}</div><button class="section-more section-more--dark" type="button" data-scroll-more>Ver más cerca de ti <span>→</span></button></div></section>`;
}

function ResidentHowItWorks() {
  return `<section class="how"><span class="eyebrow">Así de fácil</span><div class="steps">${[["Descubre","Explora según lo que quieres hacer."],["Conoce","Mira cada lugar antes de decidir."],["Contacta","Escribe o llega en unos pasos."]].map(([t,p],index)=>`<article class="reveal"><span>0${index+1}</span><div><h3>${t}</h3><p>${p}</p></div>${index<2?"<i>→</i>":""}</article>`).join("")}</div></section>`;
}

function BusinessCTA() {
  return `<section class="business-cta" id="para-negocios"><div class="business-cta-copy reveal"><span class="eyebrow">Para negocios locales</span><h2>Haz que más vecinos sepan que estás aquí</h2><p>Crea tu ficha, construye tu micrositio audiovisual y muestra mejor lo que haces.</p><div class="business-actions"><a class="button button--yellow" href="${whatsappShare}" target="_blank" rel="noreferrer">Quiero aparecer ↗</a><a class="button button--outline" href="#micrositios">Ver cómo funciona ↓</a></div></div><div class="levels reveal">${[["Entrar","Ficha gratuita","Hazte visible en la zona."],["Crear","Contenido profesional","Cuenta mejor lo que haces."],["Impulsar","Mayor visibilidad","Destaca cuando importa."]].map(([n,t,p],i)=>`<article><span>0${i+1}</span><small>${n}</small><h3>${t}</h3><p>${p}</p></article>`).join("")}</div></section>`;
}

function MicrositeShowcase() {
  return `<section class="section showcase" id="micrositios"><header class="section-heading section-heading--split reveal"><div><span class="eyebrow">Más que una ficha</span><h2>Tu negocio puede tener su propio espacio</h2></div><p>Fotos, videos, servicios, promociones, WhatsApp, Maps y contenido que puede crecer con el tiempo.</p></header><div class="showcase-stage">${businesses.map((b,index)=>`<a class="site-preview site-preview--${index+1}" href="${b.micrositeUrl}" target="_blank" rel="noreferrer"><div class="browser-bar"><i></i><i></i><i></i><span>${b.slug}</span></div><img src="${b.image}" alt="Micrositio de ${b.name}" loading="lazy" /><div><small>${b.category}</small><strong>${b.name}</strong><span>Ver micrositio ↗</span></div></a>`).join("")}</div><a class="button button--blue showcase-cta" href="#destacados">Conoce los micrositios ↗</a></section>`;
}

function SearchExplore() {
  return `<section class="section search-explore"><header class="section-heading reveal"><span class="eyebrow">Explora por negocio</span><h2>¿Ya sabes qué necesitas?</h2></header><form class="search-box" role="search"><label for="search">Busca un lugar, servicio o categoría</label><div><span>⌕</span><input id="search" type="search" placeholder="Ej. pizza, spa, lavado de salas…" /><button type="submit">Buscar</button></div><p class="search-feedback" aria-live="polite"></p></form><div class="filter-chips" aria-label="Filtros de ejemplo">${["Comer","Cuidarme","Mi casa","Servicios","Promociones","Nuevo"].map((item,index)=>`<button type="button" class="${index===0?"active":""}">${item}</button>`).join("")}</div></section>`;
}

function BusinessAccess() {
  return `<aside class="business-access" id="para-negocios"><span>¿Tienes un negocio?</span><a href="/negocios">Aparece en A Dos Pasos <b>→</b></a></aside>`;
}

function Footer() {
  return `<footer class="footer"><div class="footer-brand"><img src="./assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" /><h2>Descubre lo que tienes cerca de casa.</h2><p>Una guía visual para una comunidad más conectada.</p></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Zonas <span>+</span></button><small>Zonas</small><div class="footer-group-content">${zones.map(zone=>`<span>${zone}</span>`).join("")}</div></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Explora <span>+</span></button><small>Explora</small><div class="footer-group-content"><a href="#que-hacer">Descubrir</a><a href="#cerca-de-ti">Lugares</a><a href="#ideas">Ideas para hoy</a><a href="#para-negocios">Para negocios</a><a href="#inicio">Privacidad</a></div></div><div class="footer-bottom"><span>A Dos Pasos · El Refugio</span><span>Powered by Eleva Studio Lab</span></div></footer>`;
}

document.querySelector("#contenido").innerHTML = [HeroDiscovery(),ZoneSelector(),IntentionGrid(),FeaturedBusinesses(),BenefitsSection(),PromotionsSection(),NewInZone(),EditorialStories(),NearbyNow(),ResidentHowItWorks(),BusinessAccess(),Footer()].join("");

const header=document.querySelector(".site-header"); const menuButton=document.querySelector(".menu-button");
const closeMenu=()=>{header.classList.remove("menu-open");document.body.classList.remove("menu-is-open");menuButton.setAttribute("aria-expanded","false")};
menuButton.addEventListener("click",()=>{const open=header.classList.toggle("menu-open");document.body.classList.toggle("menu-is-open",open);menuButton.setAttribute("aria-expanded",String(open))});
header.querySelectorAll("nav a").forEach(link=>link.addEventListener("click",closeMenu));

const zoneToggle=document.querySelector("[data-zone-toggle]"); const zoneOptions=document.querySelector(".zone-options");
zoneToggle.addEventListener("click",()=>{zoneOptions.hidden=!zoneOptions.hidden;zoneToggle.classList.toggle("active",!zoneOptions.hidden)});

document.querySelectorAll("[data-search]").forEach(form=>form.addEventListener("submit",event=>{event.preventDefault();const query=form.querySelector("input").value.trim();form.querySelector(".search-feedback").textContent=query?`Explorando “${query}” en El Refugio · pronto podrás filtrar todos los resultados.`:"Escribe un negocio, categoría, servicio o intención."}));
document.querySelectorAll("[data-quick-search]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-quick-search]").forEach(item=>item.classList.remove("is-active"));button.classList.add("is-active");const form=document.querySelector("[data-search]");form.querySelector("input").value=button.dataset.quickSearch;form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}))}));
document.querySelectorAll(".mobile-section-nav a").forEach(link=>link.addEventListener("click",()=>{document.querySelectorAll(".mobile-section-nav a").forEach(item=>item.classList.remove("is-active"));link.classList.add("is-active")}));
document.querySelectorAll("[data-expand-section]").forEach(button=>{button.dataset.label=button.childNodes[0].nodeValue.trim();button.addEventListener("click",()=>{const section=button.closest(".preview-section");if(matchMedia("(max-width: 768px)").matches){const rail=section.querySelector(".business-grid,.benefits-track,.magazine-grid,.editorial-grid");rail?.scrollBy({left:rail.clientWidth*.82,behavior:"smooth"});return}const expanded=section.classList.toggle("is-expanded");button.setAttribute("aria-expanded",String(expanded));button.childNodes[0].nodeValue=(expanded?"Mostrar menos":button.dataset.label)+" "})});
document.querySelector("[data-scroll-more]")?.addEventListener("click",()=>{const track=document.querySelector(".nearby-track");track.scrollBy({left:track.clientWidth*.8,behavior:"smooth"})});
document.querySelectorAll(".footer-toggle").forEach(button=>button.addEventListener("click",()=>{const group=button.closest(".footer-group");const open=group.classList.toggle("is-open");button.setAttribute("aria-expanded",String(open));button.querySelector("span").textContent=open?"−":"+"}));
document.querySelector(".menu-close")?.addEventListener("click",closeMenu);
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&header.classList.contains("menu-open"))closeMenu()});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(element=>observer.observe(element));
