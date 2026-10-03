"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "business-submissions";
const SUBMIT_LABEL = "Enviar mi negocio para revisión";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function imageValidationMessage(file: File) {
  if (file.size > MAX_IMAGE_BYTES) return "La imagen supera el tamaño máximo permitido de 5 MB.";
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return "Formato no compatible. Usa JPG, PNG o WebP.";
  return "";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function optional(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function fileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) return fromName;
  return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}

export function BusinessSubmissionController() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("#business-form");
    const success = document.querySelector<HTMLElement>("[data-success]");
    const errorBox = document.querySelector<HTMLElement>("[data-submit-error]");
    const imageError = document.querySelector<HTMLElement>("[data-image-error]");
    const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!form || !success || !errorBox || !imageError || !submitButton) return;

    let submitting = false;

    const setError = (visible: boolean) => {
      errorBox.hidden = !visible;
      if (visible) errorBox.focus();
    };

    const onSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      if (submitting) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const logo = formData.get("logo");
      const mainImage = formData.get("mainImage");
      if (!(logo instanceof File) || !logo.size || !(mainImage instanceof File) || !mainImage.size) {
        form.reportValidity();
        return;
      }

      const logoInput = form.elements.namedItem("logo") as HTMLInputElement;
      const mainImageInput = form.elements.namedItem("mainImage") as HTMLInputElement;
      const files = [
        { file: logo, input: logoInput },
        { file: mainImage, input: mainImageInput }
      ];
      let firstFileError = "";
      let firstInvalidInput: HTMLInputElement | null = null;
      for (const { file, input } of files) {
        const message = imageValidationMessage(file);
        input.setCustomValidity(message);
        if (!firstFileError && message) {
          firstFileError = message;
          firstInvalidInput = input;
        }
      }
      if (firstFileError) {
        imageError.textContent = firstFileError;
        imageError.hidden = false;
        if (firstInvalidInput) firstInvalidInput.focus();
        form.reportValidity();
        return;
      }
      imageError.hidden = true;

      submitting = true;
      setError(false);
      submitButton.disabled = true;
      submitButton.textContent = "Enviando…";

      try {
        const supabase = getSupabaseBrowserClient();
        const id = crypto.randomUUID();
        const logoPath = `${id}/logo.${fileExtension(logo)}`;
        const mainImagePath = `${id}/principal.${fileExtension(mainImage)}`;

        const { error: logoError } = await supabase.storage.from(BUCKET).upload(logoPath, logo, {
          cacheControl: "3600",
          contentType: logo.type,
          upsert: false
        });
        if (logoError) throw logoError;

        const { error: mainImageError } = await supabase.storage.from(BUCKET).upload(mainImagePath, mainImage, {
          cacheControl: "3600",
          contentType: mainImage.type,
          upsert: false
        });
        if (mainImageError) throw mainImageError;

        const businessName = String(formData.get("businessName") ?? "").trim();
        const hasPromotion = formData.get("hasPromotion") === "yes";
        const { error: insertError } = await supabase.from("businesses").insert({
          id,
          business_name: businessName,
          slug: slugify(businessName) || null,
          category: String(formData.get("category") ?? "").trim(),
          short_description: String(formData.get("description") ?? "").trim(),
          zone: String(formData.get("zone") ?? "").trim(),
          address: optional(formData, "address"),
          maps_url: optional(formData, "mapsUrl"),
          business_hours: optional(formData, "hours"),
          home_service: formData.get("delivery") === "yes",
          whatsapp: String(formData.get("whatsapp") ?? "").trim(),
          phone: optional(formData, "phone"),
          instagram: optional(formData, "instagram"),
          facebook: optional(formData, "facebook"),
          website: optional(formData, "website"),
          logo_url: logoPath,
          main_image_url: mainImagePath,
          contact_name: String(formData.get("contactName") ?? "").trim(),
          contact_whatsapp: String(formData.get("contactPhone") ?? "").trim(),
          contact_email: optional(formData, "contactEmail"),
          promotion_title: hasPromotion ? optional(formData, "promotionTitle") : null,
          promotion_description: hasPromotion ? optional(formData, "promotionDescription") : null,
          information_confirmed: formData.get("confirmAccuracy") === "on",
          publication_authorized: formData.get("authorizePublication") === "on",
          editorial_review_accepted: formData.get("acceptReview") === "on",
          source: "web"
        });
        if (insertError) throw insertError;

        form.hidden = true;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error("Business submission failed", error);
        setError(true);
      } finally {
        submitting = false;
        submitButton.disabled = false;
        submitButton.textContent = SUBMIT_LABEL;
      }
    };

    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, []);

  return null;
}
