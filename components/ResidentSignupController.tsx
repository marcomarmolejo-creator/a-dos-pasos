"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ResidentEvent =
  | "resident_signup_view"
  | "resident_signup_submit"
  | "resident_signup_success"
  | "resident_signup_duplicate"
  | "resident_signup_error";

const EVENT_STORAGE_KEY = "adp:resident-signup-events";
const SUBMIT_LABEL = "Unirme a A Dos Pasos";

function track(event: ResidentEvent) {
  try {
    const current = JSON.parse(sessionStorage.getItem(EVENT_STORAGE_KEY) ?? "[]") as unknown[];
    current.push({ event, at: new Date().toISOString() });
    sessionStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(current.slice(-100)));
    window.dispatchEvent(new CustomEvent("adp:resident-signup-event", { detail: { event } }));
  } catch {
    // El tracking local nunca debe impedir el registro.
  }
}

function normalizeMexicoWhatsApp(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("521")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("52")) digits = digits.slice(2);
  if (digits.length !== 10) return null;
  return `+52${digits}`;
}

function optional(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function isDuplicateConflict(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const value = error as { code?: unknown; status?: unknown; statusCode?: unknown };
  return value.code === "23505" || value.status === 409 || value.statusCode === 409;
}

function safeErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") return { message: "Unknown error" };
  const value = error as { message?: unknown; code?: unknown; status?: unknown; statusCode?: unknown };
  const message = typeof value.message === "string"
    ? value.message
      .replace(/sb_(?:publishable|secret)_[A-Za-z0-9_-]+/g, "[redacted-key]")
      .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    : "Unknown error";
  return {
    message,
    code: typeof value.code === "string" ? value.code : undefined,
    status: typeof value.status === "number" ? value.status : value.statusCode
  };
}

export function ResidentSignupController() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("#resident-form");
    const success = document.querySelector<HTMLElement>("[data-success]");
    const errorBox = document.querySelector<HTMLElement>("[data-resident-error]");
    const duplicateError = document.querySelector<HTMLElement>("[data-resident-duplicate]");
    const genericError = document.querySelector<HTMLElement>("[data-resident-generic]");
    const interestError = document.querySelector<HTMLElement>("[data-interest-error]");
    const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
    const interestInputs = form
      ? [...form.querySelectorAll<HTMLInputElement>('input[name="interests"]')]
      : [];
    if (!form || !success || !errorBox || !duplicateError || !genericError || !interestError || !submitButton) return;

    let submitting = false;
    track("resident_signup_view");

    const selectedInterests = () => interestInputs.filter((input) => input.checked).map((input) => input.value);
    const validateInterests = () => {
      const valid = selectedInterests().length > 0;
      interestInputs[0]?.setCustomValidity(valid ? "" : "Selecciona al menos una opción.");
      interestError.hidden = valid;
      return valid;
    };
    const setError = (type: "none" | "duplicate" | "generic") => {
      errorBox.hidden = type === "none";
      duplicateError.hidden = type !== "duplicate";
      genericError.hidden = type !== "generic";
      if (type !== "none") errorBox.focus();
    };

    const onInterestChange = (event: Event) => {
      const input = event.currentTarget as HTMLInputElement;
      if (input.value === "Todo" && input.checked) {
        interestInputs.filter((item) => item !== input).forEach((item) => { item.checked = false; });
      } else if (input.checked) {
        const all = interestInputs.find((item) => item.value === "Todo");
        if (all) all.checked = false;
      }
      validateInterests();
    };
    interestInputs.forEach((input) => input.addEventListener("change", onInterestChange));

    const whatsappInput = form.elements.namedItem("whatsapp") as HTMLInputElement;
    const onWhatsAppInput = () => whatsappInput.setCustomValidity("");
    whatsappInput.addEventListener("input", onWhatsAppInput);

    const onSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      if (submitting) return;

      validateInterests();
      const normalizedWhatsApp = normalizeMexicoWhatsApp(whatsappInput.value);
      whatsappInput.setCustomValidity(normalizedWhatsApp ? "" : "Escribe un número de WhatsApp de México con 10 dígitos.");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitting = true;
      track("resident_signup_submit");
      setError("none");
      submitButton.disabled = true;
      submitButton.textContent = "Registrando…";

      try {
        const formData = new FormData(form);
        console.info("[Resident signup] Database insert started");
        const { error } = await getSupabaseBrowserClient().from("residents").insert({
          name: String(formData.get("name") ?? "").trim(),
          whatsapp: normalizedWhatsApp,
          email: optional(formData, "email"),
          zone: "El Refugio",
          neighborhood: optional(formData, "neighborhood"),
          interests: selectedInterests(),
          comments: optional(formData, "comments"),
          consent: formData.get("consent") === "on",
          consent_at: new Date().toISOString()
        });
        if (error) throw error;

        console.info("[Resident signup] Database insert completed");
        track("resident_signup_success");
        form.hidden = true;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        console.error("[Resident signup] Database insert failed", safeErrorDetails(error));
        if (isDuplicateConflict(error)) {
          track("resident_signup_duplicate");
          setError("duplicate");
          return;
        }
        track("resident_signup_error");
        setError("generic");
      } finally {
        submitting = false;
        submitButton.disabled = false;
        submitButton.textContent = SUBMIT_LABEL;
      }
    };

    form.addEventListener("submit", onSubmit);

    const header = document.querySelector<HTMLElement>(".resident-page .site-header");
    const menuButton = header?.querySelector<HTMLButtonElement>(".menu-button");
    const closeButton = header?.querySelector<HTMLButtonElement>(".menu-close");
    const closeMenu = () => {
      header?.classList.remove("menu-open");
      document.body.classList.remove("menu-is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    };
    const openMenu = () => {
      const open = header?.classList.toggle("menu-open") ?? false;
      document.body.classList.toggle("menu-is-open", open);
      menuButton?.setAttribute("aria-expanded", String(open));
    };
    menuButton?.addEventListener("click", openMenu);
    closeButton?.addEventListener("click", closeMenu);
    const navLinks = header ? [...header.querySelectorAll<HTMLAnchorElement>("nav a")] : [];
    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      form.removeEventListener("submit", onSubmit);
      interestInputs.forEach((input) => input.removeEventListener("change", onInterestChange));
      whatsappInput.removeEventListener("input", onWhatsAppInput);
      menuButton?.removeEventListener("click", openMenu);
      closeButton?.removeEventListener("click", closeMenu);
      navLinks.forEach((link) => link.removeEventListener("click", closeMenu));
    };
  }, []);

  return null;
}
