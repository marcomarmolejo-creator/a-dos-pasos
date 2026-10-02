import { directoryBusinesses, directoryCategories, findDirectoryAliasCategory, normalizeDirectorySearch } from "./directory-data.js";
import { zones } from "./business-data.js";

const params = new URLSearchParams(window.location.search);
const requestedCategory = params.get("categoria");
const requestedQuery = params.get("buscar")?.trim() || "";
const state = {
  activeCategory: directoryCategories[requestedCategory] ? requestedCategory : "todo",
  query: requestedQuery,
  activeFilters: {
    openNow: false,
    delivery: false,
    isNew: false,
    hasBenefit: false,
    hasMicrosite: false
  }
};

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const initials = (name) => name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
const badgeMarkup = (business) => business.badges.slice(0, 2).map((badge) => `<span>${escapeHtml(badge)}</span>`).join("");

function BusinessBrand(business) {
  const logo = business.logo ? `<img src="${business.logo}" alt="Logo de ${escapeHtml(business.name)}" />` : `<span aria-hidden="true">${initials(business.name)}</span>`;
  return `<div class="directory-card-brand"><div class="directory-logo">${logo}</div><div><p>${escapeHtml(business.category)} · ${escapeHtml(business.zone)}</p><h2>${escapeHtml(business.name)}</h2></div></div>`;
}

function FreeBusinessCard(business) {
  const contact = business.whatsapp ? `<a class="dir-button dir-button--primary" href="${business.whatsapp}" target="_blank" rel="noreferrer">Contactar</a>` : `<button type="button" class="dir-button dir-button--primary" data-demo-action="contactar" data-business="${escapeHtml(business.name)}">Contactar</button>`;
  const directions = business.maps ? `<a class="dir-button dir-button--secondary" href="${business.maps}" target="_blank" rel="noreferrer">Cómo llegar</a>` : `<button type="button" class="dir-button dir-button--secondary" data-demo-action="maps" data-business="${escapeHtml(business.name)}">Cómo llegar</button>`;
  return `<article class="free-business-card directory-card" data-listing-type="free" data-demo="${business.isDemo}"><div class="directory-card-media"><img src="${business.image}" alt="${escapeHtml(business.name)}" loading="lazy" /><div class="directory-card-badges">${badgeMarkup(business)}</div></div><div class="directory-card-body">${BusinessBrand(business)}<p class="directory-description">${escapeHtml(business.description)}</p><dl class="directory-details"><div><dt>Zona</dt><dd>${escapeHtml(business.zone)}</dd></div><div><dt>Horario</dt><dd>${escapeHtml(business.hours)}</dd></div></dl><div class="directory-card-actions">${contact}${directions}</div></div></article>`;
}

function MicrositeBusinessCard(business) {
  return `<article class="microsite-business-card directory-card" data-listing-type="microsite"><a class="directory-card-media" href="${business.micrositeUrl}" target="_blank" rel="noreferrer"><img src="${business.image}" alt="${escapeHtml(business.name)}" loading="lazy" /><div class="directory-card-badges">${badgeMarkup(business)}</div></a><div class="directory-card-body">${BusinessBrand(business)}<p class="directory-description">${escapeHtml(business.description)}</p><dl class="directory-details"><div><dt>Zona</dt><dd>${escapeHtml(business.zone)}</dd></div><div><dt>Horario</dt><dd>${escapeHtml(business.hours)}</dd></div></dl><div class="directory-depth" aria-label="Contenido disponible"><span>Fotos</span><span>Servicios</span><span>Beneficios</span></div><a class="dir-button dir-button--primary directory-experience" href="${business.micrositeUrl}" target="_blank" rel="noreferrer">Conocer negocio →</a></div></article>`;
}

function DirectoryFooter() {
  return `<footer class="footer directory-footer"><div class="footer-brand"><img src="/assets/logo-a-dos-pasos-blanco.png" alt="A Dos Pasos" /><h2>Descubre lo que tienes cerca de casa.</h2><p>Una guía visual para una comunidad más conectada.</p></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Zonas <span>+</span></button><small>Zonas</small><div class="footer-group-content">${zones.map((zone) => `<span>${zone}</span>`).join("")}</div></div><div class="footer-group"><button type="button" class="footer-toggle" aria-expanded="false">Explora <span>+</span></button><small>Explora</small><div class="footer-group-content"><a href="/#descubrir">Descubrir</a><a href="/directorio/">Directorio</a><a href="/#ideas">Ideas para hoy</a><a href="/para-negocios/">Para negocios</a></div></div><div class="footer-bottom"><span>A Dos Pasos · El Refugio</span><span>Powered by Eleva Studio Lab</span></div></footer>`;
}

function DirectoryShell() {
  const categoryButtons = Object.entries(directoryCategories).map(([key, config]) => `<button type="button" data-category="${key}">${config.label}</button>`).join("");
  const filters = [["openNow","Abierto ahora"],["delivery","A domicilio"],["isNew","Nuevo"],["hasBenefit","Con beneficio"],["hasMicrosite","Con micrositio"]];
  return `<section class="directory-hero"><div class="directory-hero-copy"><span class="eyebrow">A Dos Pasos · El Refugio</span><h1>Encuentra algo cerca de ti.</h1><p>Negocios, lugares y servicios locales para descubrir sin perderte entre resultados repetidos.</p><form class="directory-search" role="search" data-directory-search><label class="sr-only" for="directory-search-input">Buscar negocio, categoría o servicio</label><span aria-hidden="true">⌕</span><input id="directory-search-input" type="search" placeholder="¿Qué estás buscando cerca?" value="${escapeHtml(state.query)}" autocomplete="off" /><button type="submit">Buscar</button></form></div><div class="directory-summary"><span>Resultados en El Refugio</span><strong data-directory-count></strong><small data-directory-active></small><button type="button" data-change-category>Ver categorías</button></div></section><section class="directory-controls" aria-label="Filtros del directorio"><div class="directory-filter-group"><span>Categorías</span><div class="directory-category-chips" id="category-chips">${categoryButtons}</div></div><div class="directory-filter-group directory-filter-group--options"><span>Filtros rápidos</span><div class="directory-option-chips">${filters.map(([key,label]) => `<button type="button" data-filter="${key}" aria-pressed="false">${label}</button>`).join("")}</div></div><div class="directory-active-filters" data-active-filters hidden><span data-active-filter-count></span><button type="button" data-clear-filters>Limpiar</button><button type="button" data-view-all>Ver todos</button></div></section><section class="directory-results" id="directory-results" aria-live="polite"><div class="directory-grid" data-directory-grid></div><div class="directory-empty" data-directory-empty hidden><span aria-hidden="true">⌕</span><h2>Todavía no encontramos algo aquí.</h2><p>Estamos preparando nuevas recomendaciones para esta categoría.</p><div class="directory-empty-actions"><button type="button" data-explore-category>Explorar otra categoría</button><button type="button" class="directory-empty-clear" data-empty-clear hidden>Limpiar filtros</button></div></div></section><aside class="directory-business-cta"><div><span>¿Tienes un negocio en la zona?</span><a href="/para-negocios/">Aparece gratis en A Dos Pasos →</a></div></aside>${DirectoryFooter()}`;
}

document.querySelector("#directory-root").innerHTML = DirectoryShell();

function matchesFilters(business) {
  return Object.entries(state.activeFilters).every(([property, active]) => !active || business[property] === true);
}

export function filterBusinesses() {
  const normalizedQuery = normalizeDirectorySearch(state.query);
  const directMatches = normalizedQuery ? directoryBusinesses.filter((business) => normalizeDirectorySearch([business.name, business.category, business.description].join(" ")).includes(normalizedQuery)) : [];
  const aliasCategory = normalizedQuery && !directMatches.length ? findDirectoryAliasCategory(normalizedQuery) : null;
  const matches = directoryBusinesses.filter((business) => {
    const categoryMatch = state.activeCategory === "todo" || business.categories.includes(state.activeCategory);
    const queryMatch = !normalizedQuery || (directMatches.length ? directMatches.includes(business) : aliasCategory ? business.categories.includes(aliasCategory) : false);
    return categoryMatch && queryMatch && matchesFilters(business);
  });
  if (state.activeCategory === "servicios") {
    const order = ["eleva-steam", "barberia-clasica", "vet-cerca-demo"];
    matches.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }
  return matches;
}

function resultCount(matches) {
  const amount = matches.length;
  if (state.query) return `${amount} ${amount === 1 ? "resultado" : "resultados"} para “${state.query}”`;
  if (state.activeCategory === "comer") return `${amount} ${amount === 1 ? "lugar" : "lugares"} para comer`;
  if (state.activeCategory === "servicios") return `${amount} ${amount === 1 ? "servicio" : "servicios"} cerca de ti`;
  if (state.activeCategory === "todo") return `${amount} ${amount === 1 ? "lugar encontrado" : "lugares encontrados"}`;
  return `${amount} ${amount === 1 ? "lugar" : "lugares"} en ${directoryCategories[state.activeCategory].label}`;
}

function updateUrl() {
  const next = new URL(window.location.href);
  if (state.activeCategory !== "todo") next.searchParams.set("categoria", state.activeCategory); else next.searchParams.delete("categoria");
  if (state.query) next.searchParams.set("buscar", state.query); else next.searchParams.delete("buscar");
  history.replaceState({}, "", next);
}

function renderDirectory({ scroll = false } = {}) {
  const matches = filterBusinesses();
  const filterCount = Object.values(state.activeFilters).filter(Boolean).length;
  document.querySelector("[data-directory-count]").textContent = resultCount(matches);
  document.querySelector("[data-directory-active]").textContent = state.query ? "Búsqueda en todo el directorio" : `Categoría: ${directoryCategories[state.activeCategory].label}`;
  document.querySelectorAll("[data-category]").forEach((button) => button.classList.toggle("is-active", button.dataset.category === state.activeCategory));
  document.querySelectorAll("[data-filter]").forEach((button) => { const active = state.activeFilters[button.dataset.filter]; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
  document.querySelector("[data-active-filters]").hidden = filterCount === 0;
  document.querySelector("[data-active-filter-count]").textContent = `${filterCount} ${filterCount === 1 ? "filtro activo" : "filtros activos"}`;
  document.querySelector("[data-directory-grid]").innerHTML = matches.map((business) => business.listingType === "free" ? FreeBusinessCard(business) : MicrositeBusinessCard(business)).join("");
  document.querySelector("[data-directory-empty]").hidden = matches.length > 0;
  document.querySelector("[data-empty-clear]").hidden = filterCount === 0;
  updateUrl();
  if (scroll) document.querySelector("#directory-results").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => { state.activeCategory = button.dataset.category; state.query = ""; document.querySelector("#directory-search-input").value = ""; renderDirectory({ scroll: true }); }));
const toggleQuickFilter = (button) => { const key = button.dataset.filter; state.activeFilters[key] = !state.activeFilters[key]; renderDirectory({ scroll: true }); };
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => toggleQuickFilter(button)));
document.querySelector("[data-directory-search]").addEventListener("submit", (event) => { event.preventDefault(); const query = event.currentTarget.querySelector("input").value.trim(); const aliasCategory = findDirectoryAliasCategory(query); const isCategoryName = aliasCategory && normalizeDirectorySearch(directoryCategories[aliasCategory].label) === normalizeDirectorySearch(query); state.activeCategory = isCategoryName ? aliasCategory : "todo"; state.query = isCategoryName ? "" : query; renderDirectory({ scroll: true }); });
document.querySelector("[data-change-category]").addEventListener("click", () => { document.querySelector("#category-chips").scrollIntoView({ behavior: "smooth", block: "center" }); document.querySelector("[data-category]")?.focus({ preventScroll: true }); });
const clearQuickFilters = () => { Object.keys(state.activeFilters).forEach((key) => { state.activeFilters[key] = false; }); renderDirectory(); };
document.querySelector("[data-clear-filters]").addEventListener("click", clearQuickFilters);
document.querySelector("[data-empty-clear]").addEventListener("click", clearQuickFilters);
document.querySelector("[data-view-all]").addEventListener("click", () => { state.activeCategory = "todo"; state.query = ""; Object.keys(state.activeFilters).forEach((key) => { state.activeFilters[key] = false; }); document.querySelector("#directory-search-input").value = ""; renderDirectory(); });
document.querySelector("[data-explore-category]").addEventListener("click", () => { state.activeCategory = "todo"; state.query = ""; Object.keys(state.activeFilters).forEach((key) => { state.activeFilters[key] = false; }); document.querySelector("#directory-search-input").value = ""; renderDirectory(); document.querySelector("#category-chips").scrollIntoView({ behavior: "smooth", block: "center" }); });

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
