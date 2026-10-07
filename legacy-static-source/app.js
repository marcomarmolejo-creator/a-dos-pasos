import { businesses, intentions, benefits, promotions, zones } from "./business-data.js";
import { resolveDirectoryCategory, directoryUrlFor } from "./directory-data.js";

const byId = (id) => businesses.find((business) => business.id === id);
const whatsappShare = "https://wa.me/?text=" + encodeURIComponent("Hola, quiero conocer cómo puede aparecer mi negocio en A Dos Pasos · El Refugio.");
let activePromotionCards = Array.isArray(window.__ACTIVE_BUSINESS_PROMOTIONS__) ? window.__ACTIVE_BUSINESS_PROMOTIONS__ : [];
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const promotionValidity = (item) => item.ends_at ? `Vigente hasta ${new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(item.ends_at))}` : "Consulta vigencia";

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

function CategoryResults() {
  return `<section class="section category-results" id="resultados" aria-live="polite" hidden><header class="section-heading"><span class="eyebrow">Resultados</span><h2 data-results-title></h2><p data-results-copy></p></header><div class="filter-results-grid" data-results-grid></div><p class="filter-empty" data-results-empty hidden></p></section>`;
}

function IntentionGrid() {
  return `<section class="section intentions" id="explorar"><header class="section-heading reveal"><span class="eyebrow">¿Qué quieres hacer?</span><h2>Encuentra rápido lo que buscas cerca de casa</h2><p>Menos directorio. Más respuestas para tu día.</p></header><div class="intentions-grid">${intentions.map((item,index)=>{const category=resolveDirectoryCategory(item.title);return `<a class="intention-card reveal" href="${directoryUrlFor(category,category ? "" : item.title)}" style="--delay:${index * 45}ms"><div class="intention-image"><img src="${item.image}" alt="" loading="lazy" /></div><div class="intention-copy"><i>${item.icon}</i><div><h3>${item.title}</h3><p>${item.subtitle}</p></div><span>↗</span></div></a>`}).join("")}</div></section>`;
}

function BusinessCard(business, index, reveal = true) {
  return `<article class="business-card business-card--${index + 1}${reveal ? " reveal" : ""}"><a class="business-image" href="${business.micrositeUrl}" target="_blank" rel="noreferrer"><img src="${business.image}" alt="${business.name}" loading="lazy" /><span class="business-status">${business.status}</span><span class="business-distance">${business.distance}</span></a><div class="business-copy"><div><small>${business.tag} · ${business.zone}</small><h3>${business.name}</h3><p>${business.category}</p></div><a href="${business.micrositeUrl}" target="_blank" rel="noreferrer">${business.id === "eleva-steam" ? "Ver servicio" : "Ver lugar"} <span>↗</span></a></div></article>`;
}

function CarouselControls(id, label) {
  return `<div class="carousel-controls" data-carousel-controls="${id}" aria-label="${label}"><button type="button" data-carousel-prev aria-label="Anterior" disabled>←</button><button type="button" data-carousel-next aria-label="Siguiente">→</button></div>`;
}

function FeaturedBusinesses() {
  return `<section class="section featured preview-section" id="cerca-de-ti"><header class="section-heading section-heading--split reveal"><div><span class="eyebrow">Cerca de ti</span><h2>Lugares y servicios que vale la pena conocer</h2></div><p>Una selección local para decidir mejor, sin perderte entre resultados repetidos.</p></header>${CarouselControls("business-carousel","Controles de lugares cercanos")}<div class="business-grid business-carousel" id="business-carousel">${businesses.map(BusinessCard).join("")}</div><a class="section-more" href="/directorio/">Ver más lugares <span>→</span></a></section>`;
}

function BenefitsSection() {
  const liveBenefits = activePromotionCards.filter((item) => item.type === "beneficio");
  const liveBusinessSlugs = new Set(liveBenefits.map((item) => item.businessSlug));
  const demoBenefits = benefits.filter((item) => !liveBusinessSlugs.has(item.businessId)).slice(0,Math.max(0,4-liveBenefits.length));
  const liveCards = liveBenefits.map((item,index)=>{const name=escapeHtml(item.businessName);const initials=name.split(" ").map(word=>word[0]).join("").slice(0,2);return `<article class="benefit-card reveal"><div class="benefit-media" aria-hidden="true"><img src="${escapeHtml(item.resolvedImage)}" alt="" loading="lazy" /></div><div class="benefit-brandmark" aria-label="Identidad de ${name}"><span>${initials}</span><strong>${name}</strong></div><div class="benefit-top"><span><b class="benefit-label-desktop">Beneficio local</b><b class="benefit-label-mobile">Beneficio local</b></span><b>A Dos Pasos</b></div><small>${name}</small><h3>${escapeHtml(item.title)}</h3><p class="benefit-description-desktop">${escapeHtml(item.description || "Beneficio disponible para la comunidad local.")}</p><p class="benefit-description-mobile">${escapeHtml(item.description || "Consulta los detalles del beneficio.")}</p><em class="benefit-meta">${escapeHtml(item.terms || item.short_label || promotionValidity(item))}</em><a href="${escapeHtml(item.resolvedCtaUrl)}">${escapeHtml(item.resolvedCtaLabel)} ↗</a><i>${String(index+1).padStart(2,"0")}</i></article>`}).join("");
  const demoCards = demoBenefits.map((benefit,index)=>{const business=byId(benefit.businessId);const initials=benefit.business.split(" ").map(word=>word[0]).join("").slice(0,2);return `<article class="benefit-card reveal"><div class="benefit-media" aria-hidden="true"><img src="${business.image}" alt="" loading="lazy" /></div><div class="benefit-brandmark" aria-label="Identidad de ${benefit.business}"><span>${initials}</span><strong>${benefit.business}</strong></div><div class="benefit-top"><span><b class="benefit-label-desktop">Beneficio local</b><b class="benefit-label-mobile">Beneficio local</b></span><b>A Dos Pasos</b></div><small>${benefit.business}</small><h3>${benefit.title}</h3><p class="benefit-description-desktop">${benefit.validity}</p><p class="benefit-description-mobile">${benefit.mobileDescription}</p><em class="benefit-meta">${benefit.meta}</em><a href="${business.micrositeUrl}">Ver beneficio ↗</a><i>${String(liveBenefits.length+index+1).padStart(2,"0")}</i></article>`}).join("");
  const cards = liveCards + demoCards;
  return `<section class="section benefits preview-section" id="beneficios"><header class="section-heading reveal"><span class="eyebrow">Beneficios locales</span><h2>Algo bueno por estar cerca</h2></header>${CarouselControls("benefits-carousel","Controles de beneficios locales")}<div class="benefits-track benefits-carousel" id="benefits-carousel">${cards}</div><button class="section-more" type="button" data-expand-section aria-expanded="false">Ver todos los beneficios <span>→</span></button></section>`;
}

function PromotionsSection() {
  const live = activePromotionCards.find((item) => item.type === "promocion");
  if (live) return `<section class="promotion reveal"><div class="promotion-intro"><span class="eyebrow">Promoción activa</span><h2>Una razón más para probar algo cerca.</h2><p>Promociones visuales para que los vecinos descubran, recuerden y actúen.</p></div><article class="promotion-cover"><img src="${escapeHtml(live.resolvedImage)}" alt="${escapeHtml(live.businessName)}" loading="lazy" /><div class="promotion-cover-content"><span class="promotion-label">${escapeHtml(live.short_label || "Promoción vigente")}</span><p class="promotion-business">${escapeHtml(live.businessName)}</p><h3>${escapeHtml(live.title)}</h3><p class="promotion-description">${escapeHtml(live.description || "Consulta los detalles directamente con el negocio.")}</p><small>${escapeHtml(promotionValidity(live))}</small><div class="promotion-actions"><a class="button button--yellow" href="${escapeHtml(live.resolvedCtaUrl)}" target="_blank" rel="noreferrer">${escapeHtml(live.resolvedCtaLabel)} ↗</a><a class="promotion-secondary" href="/negocio/${escapeHtml(live.businessSlug)}/">Ver negocio</a></div></div></article></section>`;
  const promotion = promotions[0]; const business = byId(promotion.businessId);
  return `<section class="promotion reveal"><div class="promotion-intro"><span class="eyebrow">Promoción activa</span><h2>Una razón más para probar algo cerca.</h2><p>Promociones visuales para que los vecinos descubran, recuerden y actúen.</p></div><article class="promotion-cover" data-commercial-note="Así se vería tu promoción dentro de A Dos Pasos. Este espacio está pensado para destacar beneficios, campañas o promociones especiales para que más vecinos conozcan tu negocio y se animen a visitarte."><img src="./assets/forno-locale.png" alt="Pizza artesanal de Forno Locale frente al horno" loading="lazy" /><div class="promotion-cover-content"><span class="promotion-label">Promoción de la semana</span><p class="promotion-business">${promotion.business}</p><h3>${promotion.title}</h3><p class="promotion-description">${promotion.description}</p><small>Disponible para residentes de El Refugio</small><div class="promotion-actions"><a class="button button--yellow" href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Consultar promoción ↗</a><a class="promotion-secondary" href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Ver negocio</a></div></div></article></section>`;
}

function NewInZone() {
  return `<section class="section new-zone preview-section" id="nuevo"><header class="section-heading section-heading--split reveal"><div><span class="eyebrow">Nuevo en la zona</span><h2>Descubre lo que acaba de llegar</h2></div><p>Nuevas aperturas, servicios y formas de disfrutar mejor tu zona.</p></header>${CarouselControls("new-carousel","Controles de novedades")}<div class="magazine-grid new-carousel" id="new-carousel"><a class="magazine-main reveal" href="${byId("forno-locale").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/forno-locale.png" alt="Forno Locale" loading="lazy" /><span>Nueva apertura · Comer</span><h3>Forno Locale enciende el horno en El Refugio</h3><p>Conoce el espacio, la carta y cómo llegar antes de tu primera visita.</p></a><a class="magazine-side magazine-side--top reveal" href="${byId("aura-spa").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/aura-ritual.jpg" alt="Ritual de bienestar en Aura Spa" loading="lazy" /><div><span>Nuevo servicio</span><h3>Un nuevo ritual en Aura Spa</h3></div></a><a class="magazine-side magazine-side--bottom reveal" href="${byId("eleva-steam").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/eleva-steam.jpg" alt="Servicio de Eleva Steam" loading="lazy" /><div><span>Nueva cobertura</span><h3>Eleva Steam va hasta tu casa</h3></div></a></div><button class="section-more" type="button" data-expand-section aria-expanded="false">Ver todo lo nuevo <span>→</span></button></section>`;
}

function EditorialStories() {
  const modules = [
    ["3 lugares para comer", "Para una comida sin cruzar la ciudad.", "forno-locale", ["./assets/forno-locale.png","./assets/forno-table.png","./assets/forno-locale.png"]],
    ["2 opciones para consentirte", "Una pausa, un corte o un ritual cerca.", "aura-spa", ["./assets/aura-spa.jpg","./assets/barberia-interior.png"]],
    ["Servicios para tu casa", "Expertos que llegan hasta donde estás.", "eleva-steam", ["./assets/eleva-steam.jpg","./assets/eleva-resultado.jpg"]],
    ["Promociones del fin de semana", "Beneficios que hacen mejor un plan cercano.", "forno-locale", ["./assets/forno-table.png","./assets/aura-ritual.jpg","./assets/barberia-clasica.png"]]
  ];
  return `<section class="section editorial preview-section" id="ideas"><header class="section-heading reveal"><span class="eyebrow">Ideas para hoy</span><h2>Cuando no sabes qué hacer, empieza por aquí</h2></header>${CarouselControls("ideas-carousel","Controles de ideas para hoy")}<div class="editorial-grid ideas-carousel" id="ideas-carousel">${modules.map(([title,copy,id,images])=>{const b=byId(id);return `<a class="editorial-card reveal" href="${b.micrositeUrl}" target="_blank" rel="noreferrer"><div class="editorial-images">${images.map((src,index)=>`<img src="${src}" alt="" loading="lazy" style="--image:${index}" />`).join("")}</div><div class="editorial-copy"><h3>${title}</h3><p>${copy}</p><b>Explorar selección ↗</b></div></a>`}).join("")}</div><button class="section-more" type="button" data-expand-section aria-expanded="false">Ver más ideas <span>→</span></button></section>`;
}

function NearbyNow() {
  return `<section class="nearby" id="ahora"><div class="nearby-title"><span class="eyebrow">Cerca de ti ahora</span><h2>Decide en un vistazo</h2></div><div class="nearby-content">${CarouselControls("now-carousel","Controles de lugares disponibles ahora")}<div class="nearby-track now-carousel" id="now-carousel">${businesses.map((b,index)=>`<a href="${b.micrositeUrl}" target="_blank" rel="noreferrer"><img src="${b.image}" alt="" loading="lazy" /><div><span>${index === 0 ? "Nuevo esta semana" : index === 1 ? "Abierto ahora" : index === 2 ? "A menos de 5 min" : "A domicilio"}</span><strong>${b.name}</strong><small>${b.category} · ${b.distance}</small><b>${b.id === "eleva-steam" ? "Ver servicio" : "Conocer"} ↗</b></div></a>`).join("")}</div><button class="section-more section-more--dark" type="button" data-scroll-more>Ver más cerca de ti <span>→</span></button></div></section>`;
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
  return `<aside class="business-access" id="para-negocios"><span>¿Tienes un negocio?</span><a href="/para-negocios/">Aparece en A Dos Pasos <b>→</b></a></aside>`;
}

function ResidentAccess() {
  return `<aside class="resident-access"><div><span>Para residentes</span><strong>Descubre más de El Refugio.</strong></div><a href="/unete/">Únete gratis <b>→</b></a></aside>`;
}

function Footer() {
  return `<footer class="footer"><div class="footer-brand"><img src="./assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" /><h2>Descubre lo que tienes cerca de casa.</h2><p>Una guía visual para una comunidad más conectada.</p></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Zonas <span>+</span></button><small>Zonas</small><div class="footer-group-content">${zones.map(zone=>`<span>${zone}</span>`).join("")}</div></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Explora <span>+</span></button><small>Explora</small><div class="footer-group-content"><a href="#que-hacer">Descubrir</a><a href="/directorio/">Directorio</a><a href="#ideas">Ideas para hoy</a><a href="/para-negocios/">Para negocios</a><a href="#inicio">Privacidad</a></div></div><div class="footer-bottom"><span>A Dos Pasos · El Refugio</span><span>Powered by Eleva Studio Lab</span></div></footer>`;
}

document.querySelector("#contenido").innerHTML = [HeroDiscovery(),ZoneSelector(),CategoryResults(),IntentionGrid(),FeaturedBusinesses(),BenefitsSection(),PromotionsSection(),NewInZone(),EditorialStories(),NearbyNow(),ResidentHowItWorks(),ResidentAccess(),BusinessAccess(),Footer()].join("");
window.addEventListener("a-dos-pasos:promotions",()=>{activePromotionCards=Array.isArray(window.__ACTIVE_BUSINESS_PROMOTIONS__)?window.__ACTIVE_BUSINESS_PROMOTIONS__:[];const benefitsSection=document.querySelector(".benefits");const promotionSection=document.querySelector(".promotion");if(benefitsSection)benefitsSection.outerHTML=BenefitsSection();if(promotionSection)promotionSection.outerHTML=PromotionsSection();initCarousel("#benefits-carousel")},{once:true});

const header=document.querySelector(".site-header"); const menuButton=document.querySelector(".menu-button");
const closeMenu=()=>{header.classList.remove("menu-open");document.body.classList.remove("menu-is-open");menuButton.setAttribute("aria-expanded","false")};
menuButton.addEventListener("click",()=>{const open=header.classList.toggle("menu-open");document.body.classList.toggle("menu-is-open",open);menuButton.setAttribute("aria-expanded",String(open))});
header.querySelectorAll("nav a").forEach(link=>link.addEventListener("click",closeMenu));

const zoneToggle=document.querySelector("[data-zone-toggle]"); const zoneOptions=document.querySelector(".zone-options");
zoneToggle.addEventListener("click",()=>{zoneOptions.hidden=!zoneOptions.hidden;zoneToggle.classList.toggle("active",!zoneOptions.hidden)});

document.querySelectorAll("[data-search]").forEach(form=>form.addEventListener("submit",event=>{
  event.preventDefault();const query=form.querySelector("input").value.trim();const feedback=form.querySelector(".search-feedback");
  if(!query){feedback.textContent="Escribe un negocio, categoría, servicio o intención.";return}
  const category=resolveDirectoryCategory(query);feedback.textContent="";
  window.location.href=directoryUrlFor(category,category ? "" : query);
}));
document.querySelectorAll("[data-quick-search]").forEach(button=>button.addEventListener("click",()=>{const category=resolveDirectoryCategory(button.dataset.quickSearch);window.location.href=directoryUrlFor(category)}));
document.querySelectorAll(".mobile-section-nav a").forEach(link=>link.addEventListener("click",()=>{document.querySelectorAll(".mobile-section-nav a").forEach(item=>item.classList.remove("is-active"));link.classList.add("is-active")}));
const desktopCarouselMedia=matchMedia("(min-width: 769px)");
const carouselApis=new Map();
function initCarousel(containerSelector) {
  const carousel=document.querySelector(containerSelector);if(!carousel)return;
  const controls=document.querySelector(`[data-carousel-controls="${carousel.id}"]`);
  const prev=controls?.querySelector("[data-carousel-prev]");const next=controls?.querySelector("[data-carousel-next]");
  const getStep=()=>{const card=carousel.firstElementChild;if(!card)return 0;const style=getComputedStyle(carousel);return card.getBoundingClientRect().width+(parseFloat(style.columnGap||style.gap)||0)};
  const updateButtons=()=>{if(!prev||!next)return;const enabled=desktopCarouselMedia.matches;const max=Math.max(0,carousel.scrollWidth-carousel.clientWidth);prev.disabled=!enabled||carousel.scrollLeft<=4;next.disabled=!enabled||carousel.scrollLeft>=max-4};
  const move=direction=>{if(!desktopCarouselMedia.matches)return;carousel.scrollBy({left:getStep()*direction,behavior:"smooth"})};
  prev?.addEventListener("click",()=>move(-1));next?.addEventListener("click",()=>move(1));carousel.addEventListener("scroll",updateButtons,{passive:true});window.addEventListener("resize",updateButtons);
  let dragging=false;let moved=false;let startX=0;let startScroll=0;
  carousel.addEventListener("pointerdown",event=>{if(!desktopCarouselMedia.matches||event.pointerType==="touch"||(carousel.id==="benefits-carousel"&&event.target.closest("a")))return;dragging=true;moved=false;startX=event.clientX;startScroll=carousel.scrollLeft;carousel.setPointerCapture?.(event.pointerId);carousel.classList.add("is-dragging")});
  carousel.addEventListener("pointermove",event=>{if(!dragging)return;const delta=event.clientX-startX;if(Math.abs(delta)>5)moved=true;carousel.scrollLeft=startScroll-delta});
  const stopDrag=event=>{if(!dragging)return;dragging=false;if(carousel.hasPointerCapture?.(event.pointerId))carousel.releasePointerCapture(event.pointerId);carousel.classList.remove("is-dragging");updateButtons();setTimeout(()=>{moved=false},0)};
  carousel.addEventListener("pointerup",stopDrag);carousel.addEventListener("pointercancel",stopDrag);if(carousel.id!=="benefits-carousel")carousel.addEventListener("click",event=>{if(!moved)return;moved=false;event.preventDefault();event.stopPropagation()},{capture:true});
  desktopCarouselMedia.addEventListener("change",event=>{if(!event.matches)carousel.scrollLeft=0;updateButtons()});carouselApis.set(carousel.id,{move,updateButtons});requestAnimationFrame(updateButtons);
}
["#business-carousel","#benefits-carousel","#new-carousel","#ideas-carousel","#now-carousel"].forEach(initCarousel);
document.querySelectorAll("[data-expand-section]").forEach(button=>{button.dataset.label=button.childNodes[0].nodeValue.trim();button.addEventListener("click",()=>{const section=button.closest(".preview-section");const rail=section.querySelector(".business-grid,.benefits-track,.magazine-grid,.editorial-grid");if(matchMedia("(max-width: 768px)").matches){rail?.scrollBy({left:rail.clientWidth*.82,behavior:"smooth"});return}if(rail?.id&&carouselApis.has(rail.id)){carouselApis.get(rail.id).move(1);return}const expanded=section.classList.toggle("is-expanded");button.setAttribute("aria-expanded",String(expanded));button.childNodes[0].nodeValue=(expanded?"Mostrar menos":button.dataset.label)+" "})});
document.querySelector("[data-scroll-more]")?.addEventListener("click",()=>{const track=document.querySelector(".nearby-track");track.scrollBy({left:track.clientWidth*.8,behavior:"smooth"})});
document.querySelectorAll(".footer-toggle").forEach(button=>button.addEventListener("click",()=>{const group=button.closest(".footer-group");const open=group.classList.toggle("is-open");button.setAttribute("aria-expanded",String(open));button.querySelector("span").textContent=open?"−":"+"}));
document.querySelector(".menu-close")?.addEventListener("click",closeMenu);
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&header.classList.contains("menu-open"))closeMenu()});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(element=>observer.observe(element));
