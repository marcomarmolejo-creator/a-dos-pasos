import { directoryBusinesses, directoryCategories, normalizeDirectorySearch, resolveDirectoryCategory } from "./directory-data.js";
import { zones } from "./business-data.js";

const params = new URLSearchParams(window.location.search);
const requestedCategory = params.get("categoria");
const requestedQuery = params.get("buscar")?.trim() || "";
const state = {
  category: directoryCategories[requestedCategory] ? requestedCategory : (requestedQuery ? null : "comer"),
  query: requestedQuery,
  filters: new Set()
};

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const initials = (name) => name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

function FreeBusinessCard(business) {
  const logo = business.logo ? `<img src="${business.logo}" alt="Logo de ${escapeHtml(business.name)}" />` : `<span aria-hidden="true">${initials(business.name)}</span>`;
  const contact = business.whatsappUrl ? `<a class="dir-button dir-button--primary" href="${business.whatsappUrl}" target="_blank" rel="noreferrer">Contactar</a>` : `<button type="button" class="dir-button dir-button--primary" data-demo-action="contactar" data-business="${escapeHtml(business.name)}">Contactar</button>`;
  const directions = business.mapsUrl ? `<a class="dir-button dir-button--secondary" href="${business.mapsUrl}" target="_blank" rel="noreferrer">Cómo llegar</a>` : `<button type="button" class="dir-button dir-button--secondary" data-demo-action="maps" data-business="${escapeHtml(business.name)}">Cómo llegar</button>`;
  const optionalContact = [business.phone ? `<a href="tel:${business.phone}">Teléfono</a>` : "", business.instagramUrl ? `<a href="${business.instagramUrl}" target="_blank" rel="noreferrer">Instagram</a>` : "", business.facebookUrl ? `<a href="${business.facebookUrl}" target="_blank" rel="noreferrer">Facebook</a>` : ""].filter(Boolean).join("");
  return `<article class="free-business-card directory-card" data-listing-type="free" data-demo="${business.demo ? "true" : "false"}"><div class="directory-card-media"><img src="${business.image}" alt="${escapeHtml(business.name)}" loading="lazy" /><span>${escapeHtml(business.distance)}</span></div><div class="directory-card-body"><div class="directory-card-brand"><div class="directory-logo">${logo}</div><div><p>${escapeHtml(business.category)}</p><h2>${escapeHtml(business.name)}</h2></div></div><p class="directory-description">${escapeHtml(business.description)}</p><dl class="directory-details"><div><dt>Zona</dt><dd>${escapeHtml(business.zone)}</dd></div><div><dt>Dirección</dt><dd>${escapeHtml(business.address)}</dd></div><div><dt>Horario</dt><dd>${escapeHtml(business.schedule)}</dd></div></dl>${optionalContact ? `<div class="directory-contact-links">${optionalContact}</div>` : ""}<div class="directory-card-actions">${contact}${directions}</div></div></article>`;
}

function MicrositeBusinessCard(business) {
  return `<article class="microsite-business-card directory-card" data-listing-type="microsite"><a class="directory-card-media" href="${business.micrositeUrl}" target="_blank" rel="noreferrer"><img src="${business.image}" alt="${escapeHtml(business.name)}" loading="lazy" /><span>${escapeHtml(business.distance)}</span><b>${escapeHtml(business.depthSignal)}</b></a><div class="directory-card-body"><p class="directory-card-category">${escapeHtml(business.directoryCategory)} · ${escapeHtml(business.zone)}</p><h2>${escapeHtml(business.name)}</h2><p class="directory-description">${escapeHtml(business.description)}</p><div class="directory-depth"><span>Galería</span><span>Servicios</span><span>Beneficios</span></div><a class="dir-button dir-button--primary" href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Conocer negocio →</a></div></article>`;
}

function DirectoryFooter() {
  return `<footer class="footer directory-footer"><div class="footer-brand"><img src="./assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" /><h2>Descubre lo que tienes cerca de casa.</h2><p>Una guía visual para una comunidad más conectada.</p></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Zonas <span>+</span></button><small>Zonas</small><div class="footer-group-content">${zones.map((zone) => `<span>${zone}</span>`).join("")}</div></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Explora <span>+</span></button><small>Explora</small><div class="footer-group-content"><a href="./index.html#que-hacer">Descubrir</a><a href="./index.html#cerca-de-ti">Lugares</a><a href="./index.html#ideas">Ideas para hoy</a><a href="/para-negocios/">Para negocios</a><a href="./index.html#inicio">Privacidad</a></div></div><div class="footer-bottom"><span>A Dos Pasos · El Refugio</span><span>Powered by Eleva Studio Lab</span></div></footer>`;
}

function DirectoryShell() {
  return `<section class="directory-hero"><div class="directory-hero-copy"><span class="eyebrow">A Dos Pasos · El Refugio</span><h1 data-directory-title></h1><p>Una selección local para encontrar opciones que vale la pena conocer.</p><form class="directory-search" role="search" data-directory-search><label class="sr-only" for="directory-search-input">Buscar negocio, categoría o servicio</label><span aria-hidden="true">⌕</span><input id="directory-search-input" type="search" placeholder="¿Qué estás buscando cerca?" value="${escapeHtml(state.query)}" autocomplete="off" /><button type="submit">Buscar</button></form></div><div class="directory-summary"><strong data-directory-count></strong><span data-directory-active></span><button type="button" data-change-category>Cambiar categoría</button></div></section><section class="directory-controls" aria-label="Filtros del directorio"><div class="directory-filter-group"><span>Categoría</span><div class="directory-category-chips" id="category-chips">${Object.entries(directoryCategories).map(([key, config]) => `<button type="button" data-category="${key}">${config.label}</button>`).join("")}</div></div><div class="directory-filter-group directory-filter-group--options"><span>Filtrar por</span><div class="directory-option-chips">${[["open","Abierto ahora"],["delivery","A domicilio"],["new","Nuevo"],["benefit","Con beneficio"]].map(([key,label]) => `<button type="button" data-filter="${key}" aria-pressed="false">${label}</button>`).join("")}</div></div></section><section class="directory-results" id="directory-results" aria-live="polite"><div class="directory-grid" data-directory-grid></div><div class="directory-empty" data-directory-empty hidden><span aria-hidden="true">⌕</span><h2>Estamos preparando más recomendaciones para esta categoría.</h2><button type="button" data-explore-category>Explorar otra categoría</button></div></section>${DirectoryFooter()}`;
}

document.querySelector("#directory-root").innerHTML = DirectoryShell();

function matchesFilters(business) {
  if (state.filters.has("open") && !business.isOpen) return false;
  if (state.filters.has("delivery") && !business.isDelivery) return false;
  if (state.filters.has("new") && !business.isNew) return false;
  if (state.filters.has("benefit") && !business.hasPromotion) return false;
  return true;
}

export function filterBusinesses(category = state.category) {
  const normalizedQuery = normalizeDirectorySearch(state.query);
  const matches = directoryBusinesses.filter((business) => {
    const categoryMatch = !category || business.categories.includes(category);
    const haystack = normalizeDirectorySearch([business.name, business.category, business.description, business.zone].join(" "));
    const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
    return categoryMatch && queryMatch && matchesFilters(business);
  });
  if (category === "servicios") {
    const order = ["eleva-steam", "barberia-clasica", "vet-cerca-demo"];
    matches.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }
  return matches;
}

function updateUrl() {
  const next = new URL(window.location.href);
  if (state.category) next.searchParams.set("categoria", state.category); else next.searchParams.delete("categoria");
  if (state.query) next.searchParams.set("buscar", state.query); else next.searchParams.delete("buscar");
  history.replaceState({}, "", next);
}

function renderDirectory({ scroll = false } = {}) {
  const matches = filterBusinesses();
  const config = state.category ? directoryCategories[state.category] : null;
  const title = config?.title || (state.query ? `Resultados para “${state.query}”` : "Explora lo que tienes cerca");
  document.querySelector("[data-directory-title]").textContent = title;
  document.title = `${title} · A Dos Pasos`;
  document.querySelector("[data-directory-count]").textContent = `${matches.length} ${matches.length === 1 ? "lugar encontrado" : "lugares encontrados"}`;
  document.querySelector("[data-directory-active]").textContent = config ? `Categoría activa: ${config.label}` : "Búsqueda personalizada";
  document.querySelectorAll("[data-category]").forEach((button) => button.classList.toggle("is-active", button.dataset.category === state.category));
  document.querySelectorAll("[data-filter]").forEach((button) => { const active = state.filters.has(button.dataset.filter); button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
  const grid = document.querySelector("[data-directory-grid]");
  grid.innerHTML = matches.map((business) => business.listingType === "free" ? FreeBusinessCard(business) : MicrositeBusinessCard(business)).join("");
  const empty = document.querySelector("[data-directory-empty]");
  empty.hidden = matches.length > 0;
  updateUrl();
  if (scroll) document.querySelector("#directory-results").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => { state.category = button.dataset.category; state.query = ""; document.querySelector("#directory-search-input").value = ""; renderDirectory({ scroll: true }); }));
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => { const key = button.dataset.filter; state.filters.has(key) ? state.filters.delete(key) : state.filters.add(key); renderDirectory({ scroll: true }); }));
document.querySelector("[data-directory-search]").addEventListener("submit", (event) => { event.preventDefault(); state.query = event.currentTarget.querySelector("input").value.trim(); const resolved = resolveDirectoryCategory(state.query); if (resolved) { state.category = resolved; state.query = ""; event.currentTarget.querySelector("input").value = directoryCategories[resolved].label; } else { state.category = null; } renderDirectory({ scroll: true }); });
document.querySelector("[data-change-category]").addEventListener("click", () => { document.querySelector("#category-chips").scrollIntoView({ behavior: "smooth", block: "center" }); document.querySelector("[data-category]")?.focus({ preventScroll: true }); });
document.querySelector("[data-explore-category]").addEventListener("click", () => { state.category = "comer"; state.query = ""; state.filters.clear(); document.querySelector("#directory-search-input").value = ""; renderDirectory(); document.querySelector("#category-chips").scrollIntoView({ behavior: "smooth", block: "center" }); });

const toast = document.querySelector(".directory-toast");
let toastTimer;
document.addEventListener("click", (event) => { const action = event.target.closest("[data-demo-action]"); if (!action) return; toast.textContent = `${action.dataset.business} es una ficha demostrativa. Los datos de ${action.dataset.demoAction === "maps" ? "ubicación" : "contacto"} se activarán al publicar el negocio.`; toast.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 4200); });

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const closeMenu = () => { header.classList.remove("menu-open"); document.body.classList.remove("menu-is-open"); menuButton.setAttribute("aria-expanded", "false"); };
menuButton.addEventListener("click", () => { const open = header.classList.toggle("menu-open"); document.body.classList.toggle("menu-is-open", open); menuButton.setAttribute("aria-expanded", String(open)); });
document.querySelector(".menu-close")?.addEventListener("click", closeMenu);
header.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", closeMenu));
document.querySelectorAll(".footer-toggle").forEach((button) => button.addEventListener("click", () => { const group = button.closest(".footer-group"); const open = group.classList.toggle("is-open"); button.setAttribute("aria-expanded", String(open)); button.querySelector("span").textContent = open ? "−" : "+"; }));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

renderDirectory();
