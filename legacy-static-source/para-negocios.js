const form = document.querySelector("#business-form");
const description = form.elements.description;
const promotionFields = document.querySelector("[data-promotion-fields]");
const imageError = document.querySelector("[data-image-error]");
const objectUrls = new Map();
const maxImageBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

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

function imageValidationMessage(file) {
  if (file.size > maxImageBytes) return "La imagen supera el tamaño máximo permitido de 5 MB.";
  if (!allowedImageTypes.has(file.type)) return "Formato no compatible. Usa JPG, PNG o WebP.";
  return "";
}

function validateImageInputs() {
  let firstError = "";
  [form.elements.logo, form.elements.mainImage].forEach((input) => {
    const file = input.files?.[0];
    const message = file ? imageValidationMessage(file) : "";
    input.setCustomValidity(message);
    if (!firstError && message) firstError = message;
  });
  imageError.textContent = firstError;
  imageError.hidden = !firstError;
  return !firstError;
}

function previewFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  const message = imageValidationMessage(file);
  validateImageInputs();
  if (message) return;
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

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const closeMenu = () => { header.classList.remove("menu-open"); document.body.classList.remove("menu-is-open"); menuButton.setAttribute("aria-expanded", "false"); };
menuButton.addEventListener("click", () => { const open = header.classList.toggle("menu-open"); document.body.classList.toggle("menu-is-open", open); menuButton.setAttribute("aria-expanded", String(open)); });
document.querySelector(".menu-close")?.addEventListener("click", closeMenu);
header.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("beforeunload", () => objectUrls.forEach((url) => URL.revokeObjectURL(url)));

updatePreview();
