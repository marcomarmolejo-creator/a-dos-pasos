const form = document.querySelector("#resident-form");
const interestInputs = [...form.querySelectorAll('input[name="interests"]')];
const interestError = document.querySelector("[data-interest-error]");
const success = document.querySelector("[data-success]");

/*
  PRINCIPIO INTERNO
  El residente no se registra para usar A Dos Pasos.
  Se registra para recibir una selección útil.

  REGLAS DE COMUNICACIÓN
  - 1–2 comunicaciones por semana máximo.
  - Selección editorial; no enviar cada promoción comprada por negocios.
  - No garantizar difusión por WhatsApp a anunciantes.
  - La base pertenece a A Dos Pasos.
  - El residente puede salir cuando quiera.
*/

function selectedInterests() {
  return interestInputs.filter((input) => input.checked).map((input) => input.value);
}

function validateInterests() {
  const valid = selectedInterests().length > 0;
  interestInputs[0].setCustomValidity(valid ? "" : "Selecciona al menos una opción.");
  interestError.hidden = valid;
  return valid;
}

interestInputs.forEach((input) => input.addEventListener("change", () => {
  if (input.value === "Todo" && input.checked) {
    interestInputs.filter((item) => item !== input).forEach((item) => { item.checked = false; });
  } else if (input.checked) {
    interestInputs.find((item) => item.value === "Todo").checked = false;
  }
  validateInterests();
}));

function buildResidentSignup() {
  const data = new FormData(form);
  return {
    name: data.get("name"),
    whatsapp: data.get("whatsapp"),
    email: data.get("email"),
    zone: data.get("zone"),
    neighborhood: data.get("neighborhood"),
    comments: data.get("comments"),
    interests: selectedInterests(),
    consent: data.get("consent") === "on",
    status: "active",
    source: "resident_signup"
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  validateInterests();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const signup = buildResidentSignup();
  form.dataset.prototypeStatus = signup.status;
  form.dataset.prototypeSource = signup.source;
  form.hidden = true;
  success.hidden = false;
  success.focus();
});

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const closeMenu = () => { header.classList.remove("menu-open"); document.body.classList.remove("menu-is-open"); menuButton.setAttribute("aria-expanded", "false"); };
menuButton.addEventListener("click", () => { const open = header.classList.toggle("menu-open"); document.body.classList.toggle("menu-is-open", open); menuButton.setAttribute("aria-expanded", String(open)); });
document.querySelector(".menu-close")?.addEventListener("click", closeMenu);
header.querySelectorAll("nav a").forEach((link) => link.addEventListener("click", closeMenu));
