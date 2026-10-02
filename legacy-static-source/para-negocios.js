const form = document.querySelector("#business-form");
const description = form.elements.description;
const promotionFields = document.querySelector("[data-promotion-fields]");
const imageError = document.querySelector("[data-image-error]");
const success = document.querySelector("[data-success]");
const objectUrls = new Map();

/*
  PRINCIPIO INTERNO DE PRODUCTO
  La ficha gratuita demuestra utilidad.
  El micrositio demuestra profundidad.
*/

const preview = {
  name: document.querySelector("[data-preview-name]"),
  category: document.querySelector("[data-preview-category]"),
  description: document.querySelector("[data-preview-description]"),
  zone: document.querySelector("[data-preview-zone]"),
  zoneDetail: document.querySelector("[data-preview-zone-detail]"),
  address: document.querySelector("[data-preview-address]"),
  hours: document.querySelector("[data-preview-hours]"),
  initials: document.querySelector("[data-preview-initials]"),
  logo: document.querySelector("[data-preview-logo]"),
  main: document.querySelector("[data-preview-main]"),
  mainPlaceholder: document.querySelector(".preview-image-placeholder")
};

const initialsFor = (value) => (value.trim() || "Tu negocio").split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
const valueOr = (name, fallback) => form.elements[name].value.trim() || fallback;

function updatePreview() {
  const name = valueOr("businessName", "Tu negocio");
  preview.name.textContent = name;
  preview.category.textContent = valueOr("category", "Tu categoría");
  preview.description.textContent = valueOr("description", "Una descripción breve ayudará a tus vecinos a entender lo que haces.");
  const zone = valueOr("zone", "El Refugio");
  preview.zone.textContent = zone;
  preview.zoneDetail.textContent = zone;
  preview.address.textContent = valueOr("address", "Tu dirección");
  preview.hours.textContent = valueOr("hours", "Tu horario");
  preview.initials.textContent = initialsFor(name);
  document.querySelector("[data-character-count]").textContent = `${description.value.length} / 180`;
}

function previewFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    input.setCustomValidity("Selecciona una imagen JPG, PNG o WEBP.");
    imageError.textContent = "Las imágenes deben estar en formato JPG, PNG o WEBP.";
    imageError.hidden = false;
    return;
  }
  input.setCustomValidity("");
  imageError.hidden = true;
  if (objectUrls.has(input.name)) URL.revokeObjectURL(objectUrls.get(input.name));
  const url = URL.createObjectURL(file);
  objectUrls.set(input.name, url);
  const uploadCard = input.closest(".upload-card");
  uploadCard.classList.add("has-image");
  uploadCard.querySelector(".upload-preview img")?.remove();
  const uploadImage = document.createElement("img");
  uploadImage.src = url;
  uploadImage.alt = "Vista previa del archivo seleccionado";
  uploadCard.querySelector(".upload-preview").prepend(uploadImage);
  if (input.name === "logo") {
    preview.logo.src = url;
    preview.logo.hidden = false;
    preview.initials.hidden = true;
  } else {
    preview.main.src = url;
    preview.main.hidden = false;
    preview.mainPlaceholder.hidden = true;
  }
}

function buildSubmission() {
  const data = new FormData(form);
  return {
    businessName: data.get("businessName"),
    category: data.get("category"),
    description: data.get("description"),
    zone: data.get("zone"),
    address: data.get("address"),
    mapsUrl: data.get("mapsUrl"),
    delivery: data.get("delivery") === "yes",
    hours: data.get("hours"),
    whatsapp: data.get("whatsapp"),
    phone: data.get("phone"),
    instagram: data.get("instagram"),
    facebook: data.get("facebook"),
    website: data.get("website"),
    logo: data.get("logo"),
    mainImage: data.get("mainImage"),
    contactName: data.get("contactName"),
    contactPhone: data.get("contactPhone"),
    contactEmail: data.get("contactEmail"),
    promotionTitle: data.get("promotionTitle"),
    promotionDescription: data.get("promotionDescription"),
    promotionExpiration: data.get("promotionExpiration"),
    status: "pending_review"
  };
}

form.addEventListener("input", (event) => {
  if (event.target.matches('input[type="file"]')) previewFile(event.target);
  updatePreview();
});
form.addEventListener("change", (event) => {
  if (event.target.name === "hasPromotion") {
    const show = event.target.value === "yes";
    promotionFields.hidden = !show;
    promotionFields.querySelectorAll("input,textarea").forEach((field) => { field.required = show; });
  }
  updatePreview();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const submission = buildSubmission();
  form.dataset.prototypeStatus = submission.status;
  form.hidden = true;
  success.hidden = false;
  success.focus();
});

document.querySelector("[data-edit-submission]").addEventListener("click", () => {
  success.hidden = true;
  form.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
});

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const closeMenu = () => { header.classList.remove("menu-open"); document.body.classList.remove("menu-is-open"); menuButton.setAttribute("aria-expanded", "false"); };
menuButton.addEventListener("click", () => { const open = header.classList.toggle("menu-open"); document.body.classList.toggle("menu-is-open", open); menuButton.setAttribute("aria-expanded", String(open)); });
document.querySelector(".menu-close")?.addEventListener("click", closeMenu);
header.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("beforeunload", () => objectUrls.forEach((url) => URL.revokeObjectURL(url)));

updatePreview();
