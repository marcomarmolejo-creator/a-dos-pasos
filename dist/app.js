import { businesses, intentions, benefits, promotions, zones } from "./business-data.js";

const byId = (id) => businesses.find((business) => business.id === id);
const whatsappShare = "https://wa.me/?text=" + encodeURIComponent("Hola, quiero conocer cómo puede aparecer mi negocio en A Dos Pasos · El Refugio.");

function HeroDiscovery() {
  return `<section class="hero">
    <div class="hero-orbit hero-orbit--one"></div><div class="hero-orbit hero-orbit--two"></div>
    <div class="hero-copy reveal"><p class="kicker">A Dos Pasos · El Refugio</p><h1>Descubre lo que tienes <em>cerca de casa.</em></h1><p class="hero-sub">Negocios, lugares, servicios, promociones y nuevas aperturas de El Refugio en un solo lugar.</p><strong class="hero-emotion">Lo bueno también puede estar a unos minutos de ti.</strong><div class="hero-actions"><a class="button button--yellow" href="#explorar">Explorar cerca de mí <span>↘</span></a><a class="button button--outline" href="#para-negocios">Quiero aparecer con mi negocio <span>↗</span></a></div><div class="microbenefits"><span>Local</span><span>Confiable</span><span>Sin comisiones</span><span>Siempre cerca</span></div></div>
    <div class="hero-product reveal"><div class="phone phone--back"><img src="./assets/mockup-categorias.png" alt="Categorías locales en A Dos Pasos" /></div><div class="phone phone--main"><img src="./assets/mockup-home.png" alt="Inicio móvil de A Dos Pasos" /></div><div class="phone phone--side"><img src="./assets/mockup-ficha.png" alt="Ficha de un negocio local" /></div><span class="floating-chip chip--distance">⌖ A 3 min</span><span class="floating-chip chip--new">Nuevo</span><span class="floating-chip chip--open">● Abierto ahora</span><span class="floating-chip chip--promo">% Promo local</span></div>
  </section>`;
}

function ZoneSelector() {
  return `<section class="zone-bar"><div><i></i><span>Estás explorando:</span><strong>El Refugio</strong></div><button type="button" data-zone-toggle>Cambiar zona <span>⌄</span></button><div class="zone-options" hidden>${zones.map((zone,index)=>`<button type="button" ${index ? "disabled" : ""}>${zone}${index ? " · próximamente" : " · activa"}</button>`).join("")}</div></section>`;
}

function IntentionGrid() {
  return `<section class="section intentions" id="explorar"><header class="section-heading reveal"><span class="eyebrow">¿Qué quieres hacer?</span><h2>Encuentra rápido lo que buscas cerca de casa</h2><p>Menos directorio. Más respuestas para tu día.</p></header><div class="intentions-grid">${intentions.map((item,index)=>`<a class="intention-card reveal" href="#destacados" style="--delay:${index * 45}ms"><div class="intention-image"><img src="${item.image}" alt="" loading="lazy" /></div><div class="intention-copy"><i>${item.icon}</i><div><h3>${item.title}</h3><p>${item.subtitle}</p></div><span>↗</span></div></a>`).join("")}</div></section>`;
}

function BusinessCard(business, index) {
  return `<article class="business-card business-card--${index + 1} reveal"><a class="business-image" href="${business.micrositeUrl}" target="_blank" rel="noreferrer"><img src="${business.image}" alt="${business.name}" loading="lazy" /><span class="business-status">${business.status}</span><span class="business-distance">${business.distance}</span></a><div class="business-copy"><div><small>${business.tag} · ${business.zone}</small><h3>${business.name}</h3><p>${business.category}</p></div><a href="${business.micrositeUrl}" target="_blank" rel="noreferrer">${business.id === "eleva-steam" ? "Ver servicio" : "Ver lugar"} <span>↗</span></a></div></article>`;
}

function FeaturedBusinesses() {
  return `<section class="section featured" id="destacados"><header class="section-heading section-heading--split reveal"><div><span class="eyebrow">Cerca de ti</span><h2>Lugares y servicios que vale la pena conocer</h2></div><p>Una selección local para decidir mejor, sin perderte entre resultados repetidos.</p></header><div class="business-grid">${businesses.map(BusinessCard).join("")}</div></section>`;
}

function BenefitsSection() {
  return `<section class="section benefits"><header class="section-heading reveal"><span class="eyebrow">Beneficios locales</span><h2>Algo bueno por estar cerca</h2></header><div class="benefits-track">${benefits.map((benefit,index)=>{const business=byId(benefit.businessId);return `<article class="benefit-card reveal"><div class="benefit-top"><span>Beneficio</span><b>A Dos Pasos</b></div><small>${benefit.business}</small><h3>${benefit.title}</h3><p>${benefit.validity}</p><a href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Ver beneficio ↗</a><i>${String(index+1).padStart(2,"0")}</i></article>`}).join("")}</div></section>`;
}

function PromotionsSection() {
  const promotion = promotions[0]; const business = byId(promotion.businessId);
  return `<section class="promotion reveal"><div><span class="eyebrow">Promoción activa</span><h2>Una razón más para probar algo cerca.</h2></div><div class="promotion-offer"><small>${promotion.business}</small><strong>${promotion.title}</strong><p>${promotion.description}</p></div><a class="button button--yellow" href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Consultar promoción ↗</a></section>`;
}

function NewInZone() {
  return `<section class="section new-zone"><header class="section-heading section-heading--split reveal"><div><span class="eyebrow">Nuevo en la zona</span><h2>Descubre lo que acaba de llegar</h2></div><p>Nuevas aperturas, servicios y formas de disfrutar mejor tu zona.</p></header><div class="magazine-grid"><a class="magazine-main reveal" href="${byId("forno-locale").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/forno-locale.png" alt="Forno Locale" loading="lazy" /><span>Nueva apertura · Comer</span><h3>Forno Locale enciende el horno en El Refugio</h3><p>Conoce el espacio, la carta y cómo llegar antes de tu primera visita.</p></a><a class="magazine-side magazine-side--top reveal" href="${byId("aura-spa").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/aura-ritual.jpg" alt="Ritual de bienestar en Aura Spa" loading="lazy" /><div><span>Nuevo servicio</span><h3>Un nuevo ritual en Aura Spa</h3></div></a><a class="magazine-side magazine-side--bottom reveal" href="${byId("eleva-steam").micrositeUrl}" target="_blank" rel="noreferrer"><img src="./assets/eleva-steam.jpg" alt="Servicio de Eleva Steam" loading="lazy" /><div><span>Nueva cobertura</span><h3>Eleva Steam va hasta tu casa</h3></div></a></div></section>`;
}

function EditorialStories() {
  const modules = [
    ["3 lugares para comer", "Para una comida sin cruzar la ciudad.", "forno-locale", "01"],
    ["2 opciones para consentirte", "Una pausa, un corte o un ritual cerca.", "aura-spa", "02"],
    ["Servicios para tu casa", "Resuelve lo cotidiano con expertos de tu zona.", "eleva-steam", "03"],
    ["Promociones del fin de semana", "Beneficios que hacen mejor un plan cercano.", "barberia-clasica", "04"]
  ];
  return `<section class="section editorial" id="ideas"><header class="section-heading reveal"><span class="eyebrow">Ideas para hoy</span><h2>Cuando no sabes qué hacer, empieza por aquí</h2></header><div class="editorial-grid">${modules.map(([title,copy,id,n])=>{const b=byId(id);return `<a class="editorial-card reveal" href="${b.micrositeUrl}" target="_blank" rel="noreferrer"><span>${n}</span><div><h3>${title}</h3><p>${copy}</p></div><b>Explorar ↗</b></a>`}).join("")}</div></section>`;
}

function NearbyNow() {
  return `<section class="nearby"><div class="nearby-title"><span class="eyebrow">Cerca de ti ahora</span><h2>Decide en un vistazo</h2></div><div class="nearby-track">${businesses.map((b,index)=>`<a href="${b.micrositeUrl}" target="_blank" rel="noreferrer"><span>${index === 0 ? "Nuevo esta semana" : index === 1 ? "Abierto ahora" : index === 2 ? "A menos de 5 min" : "A domicilio"}</span><strong>${b.name}</strong><small>${b.category}</small><i>↗</i></a>`).join("")}</div></section>`;
}

function ResidentHowItWorks() {
  return `<section class="section how"><header class="section-heading reveal"><span class="eyebrow">Así de fácil</span><h2>Descubre. Decide. Ve.</h2></header><div class="steps">${[["01","Explora por intención","Empieza por lo que quieres hacer."],["02","Conoce antes de ir","Mira fotos, servicios y beneficios."],["03","Contacta o llega","WhatsApp y Maps en segundos."]].map(([n,t,p])=>`<article class="reveal"><span>${n}</span><h3>${t}</h3><p>${p}</p></article>`).join("")}</div></section>`;
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

function Footer() {
  return `<footer class="footer"><div class="footer-brand"><img src="./assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" /><h2>Descubre lo que tienes cerca de casa.</h2><p>Una guía visual para una comunidad más conectada.</p></div><div><small>Zonas</small>${zones.map(zone=>`<span>${zone}</span>`).join("")}</div><div><small>Explora</small><a href="#explorar">Descubrir</a><a href="#para-negocios">Para negocios</a><a href="${whatsappShare}" target="_blank" rel="noreferrer">WhatsApp</a><a href="#inicio">Instagram</a><a href="#inicio">Privacidad</a></div><div class="footer-bottom"><span>A Dos Pasos · El Refugio</span><span>Powered by Eleva Studio Lab</span></div></footer>`;
}

document.querySelector("#contenido").innerHTML = [HeroDiscovery(),ZoneSelector(),IntentionGrid(),FeaturedBusinesses(),BenefitsSection(),PromotionsSection(),NewInZone(),EditorialStories(),NearbyNow(),ResidentHowItWorks(),BusinessCTA(),MicrositeShowcase(),SearchExplore(),Footer()].join("");

const header=document.querySelector(".site-header"); const menuButton=document.querySelector(".menu-button");
menuButton.addEventListener("click",()=>{const open=header.classList.toggle("menu-open");menuButton.setAttribute("aria-expanded",String(open))});
header.querySelectorAll("nav a").forEach(link=>link.addEventListener("click",()=>{header.classList.remove("menu-open");menuButton.setAttribute("aria-expanded","false")}));

const zoneToggle=document.querySelector("[data-zone-toggle]"); const zoneOptions=document.querySelector(".zone-options");
zoneToggle.addEventListener("click",()=>{zoneOptions.hidden=!zoneOptions.hidden;zoneToggle.classList.toggle("active",!zoneOptions.hidden)});

document.querySelectorAll(".filter-chips button").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".filter-chips button").forEach(item=>item.classList.remove("active"));button.classList.add("active")}));
document.querySelector(".search-box").addEventListener("submit",event=>{event.preventDefault();const query=event.currentTarget.querySelector("input").value.trim();document.querySelector(".search-feedback").textContent=query?`La búsqueda de “${query}” estará disponible en la siguiente etapa.`:"Escribe un negocio, servicio o categoría para buscar."});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(element=>observer.observe(element));
