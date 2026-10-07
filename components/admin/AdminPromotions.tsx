"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { PromotionStatus, PromotionType } from "@/lib/promotions";
import styles from "./AdminBusinesses.module.css";
import promoStyles from "./AdminPromotions.module.css";

type AdminBusinessOption = { id: string; business_name: string; whatsapp: string; status: string; category: string; zone: string };
type AdminPromotion = {
  id: string; created_at: string; updated_at: string; business_id: string;
  type: PromotionType; status: PromotionStatus; title: string; description: string | null;
  short_label: string | null; cta_label: string | null; cta_url: string | null;
  starts_at: string | null; ends_at: string | null; featured: boolean;
  image_url: string | null; terms: string | null; internal_notes: string | null;
};

type PromotionForm = Omit<AdminPromotion, "id" | "created_at" | "updated_at">;
const EMPTY_FORM: PromotionForm = { business_id: "", type: "beneficio", status: "borrador", title: "", description: "", short_label: "", cta_label: "", cta_url: "", starts_at: "", ends_at: "", featured: false, image_url: "", terms: "", internal_notes: "" };
const FILTERS = ["todos", "beneficios", "promociones", "activos", "pausados", "finalizados"] as const;
const AUTH_TIMEOUT_MS = 8000;
const PROMOTION_BUCKET = "business-public";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const IMAGE_FORMAT_ERROR = "Formato no compatible. Usa JPG, PNG o WebP.";
const IMAGE_SIZE_ERROR = "La imagen supera el tamaño máximo permitido de 5 MB.";
const IMAGE_URL_ERROR = "Usa una URL pública https:// o sube una imagen.";

function safeError(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) return "No fue posible completar la operación.";
  return String(error.message).replace(/sb_(?:publishable|secret)_[A-Za-z0-9_-]+/g, "[clave protegida]").replace(/Bearer\s+\S+/gi, "Bearer [protegido]");
}
function withTimeout<T>(promise: PromiseLike<T>, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(message)), AUTH_TIMEOUT_MS);
    Promise.resolve(promise).then(
      (value) => { window.clearTimeout(timeout); resolve(value); },
      (error) => { window.clearTimeout(timeout); reject(error); }
    );
  });
}
function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Sin fecha"; }
function inputDate(value: string | null) { if (!value) return ""; const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
function isoDate(value: string | null) { return value ? new Date(value).toISOString() : null; }
function isPublicImageUrl(value: string | null | undefined) { return Boolean(value?.trim() && /^https:\/\//i.test(value.trim())); }
function validateImage(file: File) {
  if (file.size > MAX_IMAGE_BYTES) return IMAGE_SIZE_ERROR;
  if (!IMAGE_EXTENSIONS[file.type]) return IMAGE_FORMAT_ERROR;
  return null;
}
function whatsappLink(phone: string, type: PromotionType, name: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.length === 10 ? `52${digits}` : digits;
  const message = type === "beneficio" ? `Hola, vi este beneficio de ${name} en A Dos Pasos y me interesa conocer los detalles.` : `Hola, vi esta promoción de ${name} en A Dos Pasos y me interesa aprovecharla.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function AdminPromotions() {
  const [phase, setPhase] = useState<"loading" | "login" | "unauthorized" | "admin">("loading");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [adminEmail, setAdminEmail] = useState("");
  const [authError, setAuthError] = useState(""); const [operationError, setOperationError] = useState(""); const [notice, setNotice] = useState("");
  const [businesses, setBusinesses] = useState<AdminBusinessOption[]>([]); const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null); const [form, setForm] = useState<PromotionForm>(EMPTY_FORM);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("todos"); const [busy, setBusy] = useState(false); const [loadingList, setLoadingList] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); const [imagePreview, setImagePreview] = useState<string | null>(null); const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);

  const authorize = useCallback(async (session: Session | null) => {
    if (!session) { setPhase("login"); setAdminEmail(""); return false; }
    const supabase = getSupabaseAdminClient();
    try {
      const { data, error } = await withTimeout(supabase.rpc("is_admin"), "La validación de permisos tardó demasiado.");
      if (error) throw error;
      if (data !== true) {
        setAdminEmail(session.user.email ?? "Administrador");
        setAuthError("La sesión es válida, pero este usuario no está autorizado como administrador.");
        setPhase("unauthorized");
        return false;
      }
      setAuthError(""); setAdminEmail(session.user.email ?? "Administrador"); setPhase("admin"); return true;
    } catch (error) {
      console.error("[Admin promotions] Permission validation failed", safeError(error));
      setAuthError("No fue posible validar los permisos administrativos. Intenta iniciar sesión nuevamente.");
      setPhase("login");
      return false;
    }
  }, []);

  useEffect(() => {
    const supabase = getSupabaseAdminClient(); let active = true;
    const validateInitialSession = async () => {
      try {
        const { data, error } = await withTimeout(supabase.auth.getSession(), "La lectura de la sesión tardó demasiado.");
        if (error) throw error;
        if (active) await authorize(data.session);
      } catch (error) {
        if (!active) return;
        console.error("[Admin promotions] Session validation failed", safeError(error));
        setAuthError("No fue posible validar la sesión administrativa. Inicia sesión nuevamente.");
        setPhase("login");
      }
    };
    void validateInitialSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "SIGNED_OUT") { setPhase("login"); setAdminEmail(""); return; }
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        window.setTimeout(() => { if (active) void authorize(session); }, 0);
      }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [authorize]);

  const loadData = useCallback(async () => {
    setLoadingList(true); setOperationError(""); const supabase = getSupabaseAdminClient();
    const [businessResult, promotionResult] = await Promise.all([
      supabase.from("businesses").select("id,business_name,whatsapp,status,category,zone").order("business_name"),
      supabase.from("business_promotions").select("*").order("created_at", { ascending: false })
    ]);
    if (businessResult.error || promotionResult.error) setOperationError(safeError(businessResult.error || promotionResult.error));
    else { setBusinesses((businessResult.data ?? []) as AdminBusinessOption[]); setPromotions((promotionResult.data ?? []) as AdminPromotion[]); }
    setLoadingList(false);
  }, []);
  useEffect(() => { if (phase === "admin") void loadData(); }, [phase, loadData]);

  const filtered = useMemo(() => promotions.filter((item) => filter === "todos" || (filter === "beneficios" && item.type === "beneficio") || (filter === "promociones" && item.type === "promocion") || (filter === "activos" && item.status === "activo") || (filter === "pausados" && item.status === "pausado") || (filter === "finalizados" && item.status === "finalizado")), [filter, promotions]);
  const selectedBusiness = businesses.find((business) => business.id === form.business_id);

  const clearSelectedImage = () => { setImageFile(null); setFileInputKey((current) => current + 1); };
  const newPromotion = () => { setSelectedId(null); setForm({ ...EMPTY_FORM, business_id: businesses.find((business) => business.status === "publicado")?.id ?? businesses[0]?.id ?? "" }); clearSelectedImage(); setNotice(""); setOperationError(""); };
  const editPromotion = (item: AdminPromotion) => { setSelectedId(item.id); setForm({ business_id: item.business_id, type: item.type, status: item.status, title: item.title, description: item.description ?? "", short_label: item.short_label ?? "", cta_label: item.cta_label ?? "", cta_url: item.cta_url ?? "", starts_at: inputDate(item.starts_at), ends_at: inputDate(item.ends_at), featured: item.featured, image_url: item.image_url ?? "", terms: item.terms ?? "", internal_notes: item.internal_notes ?? "" }); clearSelectedImage(); setNotice(""); setOperationError(""); };
  const field = <K extends keyof PromotionForm>(key: K, value: PromotionForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const selectImage = (file: File | null) => {
    setOperationError("");
    if (!file) { clearSelectedImage(); return; }
    const validationError = validateImage(file);
    if (validationError) { clearSelectedImage(); setOperationError(validationError); return; }
    setImageFile(file);
  };

  const signIn = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setBusy(true); setAuthError(""); try { const { data, error } = await withTimeout(getSupabaseAdminClient().auth.signInWithPassword({ email: email.trim(), password }), "El inicio de sesión tardó demasiado."); if (error) throw error; await authorize(data.session); setPassword(""); } catch (error) { console.error("[Admin promotions] Sign in failed", safeError(error)); setAuthError("No fue posible iniciar sesión. Revisa tus datos e inténtalo nuevamente."); } finally { setBusy(false); } };
  const signOut = async () => { setBusy(true); try { await withTimeout(getSupabaseAdminClient().auth.signOut(), "El cierre de sesión tardó demasiado."); } catch (error) { console.error("[Admin promotions] Sign out failed", safeError(error)); setAuthError("No fue posible cerrar la sesión correctamente."); setPhase("login"); } finally { setBusy(false); } };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setOperationError(""); setNotice("");
    if (form.type === "promocion" && form.status === "activo" && !form.ends_at) { setOperationError("Una Promoción Activa necesita fecha final antes de activarse."); return; }
    if (imageFile) {
      const validationError = validateImage(imageFile);
      if (validationError) { setOperationError(validationError); return; }
    } else if (form.image_url?.trim() && !isPublicImageUrl(form.image_url)) {
      setOperationError(IMAGE_URL_ERROR); return;
    }
    setBusy(true);
    const wasEditing = Boolean(selectedId);
    let uploadedNewImage = false;
    try {
      const supabase = getSupabaseAdminClient();
      let imageUrl = form.image_url?.trim() || null;
      if (imageFile) {
        const extension = IMAGE_EXTENSIONS[imageFile.type];
        const objectPath = `promotions/${crypto.randomUUID()}/imagen.${extension}`;
        const { error: uploadError } = await supabase.storage.from(PROMOTION_BUCKET).upload(objectPath, imageFile, { cacheControl: "3600", contentType: imageFile.type, upsert: false });
        if (uploadError) throw uploadError;
        uploadedNewImage = true;
        const { data: publicData } = supabase.storage.from(PROMOTION_BUCKET).getPublicUrl(objectPath);
        if (!isPublicImageUrl(publicData.publicUrl)) throw new Error("Storage no devolvió una URL pública válida.");
        imageUrl = publicData.publicUrl;
      }
      const { data, error } = await supabase.rpc("admin_save_business_promotion", { p_id: selectedId, p_business_id: form.business_id, p_type: form.type, p_status: form.status, p_title: form.title.trim(), p_description: form.description, p_short_label: form.short_label, p_cta_label: form.cta_label, p_cta_url: form.cta_url, p_starts_at: isoDate(form.starts_at), p_ends_at: isoDate(form.ends_at), p_featured: form.featured, p_image_url: imageUrl, p_terms: form.terms, p_internal_notes: form.internal_notes });
      if (error) throw error;
      const saved = data as AdminPromotion;
      setPromotions((current) => wasEditing ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      editPromotion(saved);
      setNotice(wasEditing ? "Cambios guardados." : "Beneficio o promoción creado.");
    } catch (error) {
      console.error("[Admin promotions] Save failed", safeError(error));
      setOperationError(uploadedNewImage ? "La imagen se subió, pero no fue posible guardar el registro. El archivo puede requerir limpieza administrativa." : safeError(error));
    } finally {
      setBusy(false);
    }
  };
  const changeStatus = async (status: PromotionStatus) => {
    if (!selectedId) return; setOperationError(""); setNotice("");
    if (form.type === "promocion" && status === "activo" && !form.ends_at) { setOperationError("Agrega y guarda una fecha final antes de activar esta promoción."); return; }
    setBusy(true); const { data, error } = await getSupabaseAdminClient().rpc("admin_set_business_promotion_status", { p_id: selectedId, p_status: status });
    if (error) setOperationError(safeError(error)); else { const updated = data as AdminPromotion; setPromotions((current) => current.map((item) => item.id === updated.id ? updated : item)); setForm((current) => ({ ...current, status })); setNotice(`Estado actualizado a ${status}.`); }
    setBusy(false);
  };

  if (phase === "loading") return <main className={styles.page}><div className={styles.loading}>Validando sesión administrativa…</div></main>;
  if (phase === "unauthorized") return <main className={styles.page}><div className={styles.topbar}><div className={styles.brand}><strong>A DOS PASOS</strong><span>Administración interna</span></div></div><div className={styles.loginWrap}><section className={styles.login}><h1>Acceso no autorizado</h1><p>{authError}</p><button type="button" onClick={signOut} disabled={busy}>{busy ? "Cerrando…" : "Cerrar sesión"}</button><a className={styles.button} href="/admin/negocios/">Volver al Admin de negocios</a></section></div></main>;
  if (phase === "login") return <main className={styles.page}><div className={styles.topbar}><div className={styles.brand}><strong>A DOS PASOS</strong><span>Administración interna</span></div></div><div className={styles.loginWrap}><form className={styles.login} onSubmit={signIn}><h1>Acceso administrativo</h1><p>Usa el mismo acceso autorizado de los otros módulos administrativos.</p><label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{authError ? <div className={`${styles.notice} ${styles.error}`}>{authError}</div> : null}<button disabled={busy}>{busy ? "Validando…" : "Iniciar sesión"}</button><a className={styles.button} href="/admin/negocios/">Volver al Admin de negocios</a></form></div></main>;

  return <main className={styles.page}><header className={styles.topbar}><div className={styles.brand}><strong>A DOS PASOS</strong><span>Beneficios y promociones</span></div><nav className={promoStyles.adminNav}><span>{adminEmail}</span><a href="/admin/negocios/">Negocios</a><a href="/admin/residentes/">Residentes</a><button onClick={signOut} disabled={busy}>Cerrar sesión</button></nav></header><div className={styles.main}><div className={styles.workspace}>
    <div className={styles.heading}><div><h1>Beneficios y promociones</h1><p>Administra contenido comercial vigente sin editar el sitio.</p></div><button className={styles.button} type="button" onClick={newPromotion}>Crear nuevo</button></div>
    <div className={styles.filters}>{FILTERS.map((item) => <button className={`${styles.filter} ${filter === item ? styles.filterActive : ""}`} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div>
    {notice ? <div className={styles.notice}>{notice}</div> : null}{operationError ? <div className={`${styles.notice} ${styles.error}`}>{operationError}</div> : null}
    <div className={styles.layout}><section className={styles.list}>{loadingList ? <div className={styles.empty}>Cargando…</div> : null}{!loadingList && !filtered.length ? <div className={styles.empty}>No hay beneficios o promociones registrados.</div> : null}{filtered.map((item) => { const business = businesses.find((option) => option.id === item.business_id); return <button className={`${styles.listItem} ${selectedId === item.id ? styles.listItemActive : ""}`} key={item.id} onClick={() => editPromotion(item)}><div><h2>{item.title}</h2><p>{business?.business_name ?? "Negocio"} · {item.type}</p><p>{formatDate(item.starts_at)} → {formatDate(item.ends_at)}</p><time>Creado {formatDate(item.created_at)}</time></div><span className={styles.status}>{item.status}{item.featured ? " · Destacado" : ""}</span></button>; })}</section>
      <form className={`${styles.detail} ${promoStyles.form}`} onSubmit={save}><header className={styles.detailHeader}><span>{selectedId ? "Editar registro" : "Nuevo registro"}</span><h2>{form.title || "Beneficio o promoción"}</h2><p>Los campos internos nunca se publican.</p></header><div className={promoStyles.fields}>
        <label>Negocio<select value={form.business_id} onChange={(event) => field("business_id", event.target.value)} required><option value="">Selecciona</option>{businesses.map((business) => <option value={business.id} key={business.id}>{business.business_name} · {business.status}</option>)}</select></label>
        <label>Tipo<select value={form.type} onChange={(event) => field("type", event.target.value as PromotionType)}><option value="beneficio">Beneficio Local</option><option value="promocion">Promoción Activa</option></select></label>
        <label>Estado<select value={form.status} onChange={(event) => field("status", event.target.value as PromotionStatus)}><option value="borrador">Borrador</option><option value="activo">Activo</option><option value="pausado">Pausado</option><option value="finalizado">Finalizado</option></select></label>
        <label className={promoStyles.wide}>Título<input value={form.title} onChange={(event) => field("title", event.target.value)} maxLength={120} required /></label>
        <label className={promoStyles.wide}>Descripción<textarea value={form.description ?? ""} onChange={(event) => field("description", event.target.value)} maxLength={500} /></label>
        <label>Etiqueta corta<input value={form.short_label ?? ""} onChange={(event) => field("short_label", event.target.value)} maxLength={60} placeholder="10% menos" /></label>
        <label>Texto CTA<input value={form.cta_label ?? ""} onChange={(event) => field("cta_label", event.target.value)} maxLength={60} placeholder={form.type === "beneficio" ? "Ver beneficio" : "Ver promoción"} /></label>
        <label className={promoStyles.wide}>URL CTA<input type="url" value={form.cta_url ?? ""} onChange={(event) => field("cta_url", event.target.value)} placeholder="Se genera con el WhatsApp público si queda vacío" /><button className={promoStyles.inlineButton} type="button" disabled={!selectedBusiness} onClick={() => selectedBusiness && field("cta_url", whatsappLink(selectedBusiness.whatsapp, form.type, selectedBusiness.business_name))}>Generar enlace WhatsApp</button></label>
        <label>Fecha inicio<input type="datetime-local" value={form.starts_at ?? ""} onChange={(event) => field("starts_at", event.target.value)} /></label>
        <label>Fecha fin {form.type === "promocion" ? <small>Requerida para activar</small> : null}<input type="datetime-local" value={form.ends_at ?? ""} onChange={(event) => field("ends_at", event.target.value)} /></label>
        <label className={promoStyles.checkbox}><input type="checkbox" checked={form.featured} onChange={(event) => field("featured", event.target.checked)} /> Destacado</label>
        <div className={`${promoStyles.wide} ${promoStyles.imageField}`}><label>{isPublicImageUrl(form.image_url) ? "Cambiar imagen promocional" : "Subir imagen promocional"}<input key={fileInputKey} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => selectImage(event.target.files?.[0] ?? null)} /></label><small>JPG, PNG o WebP · máximo 5 MB. Si no eliges una nueva, se conserva la imagen actual.</small>{imagePreview || isPublicImageUrl(form.image_url) ? <img src={imagePreview ?? form.image_url!} alt="Vista previa de la imagen promocional" /> : null}</div>
        <label className={promoStyles.wide}>URL pública avanzada<input type="text" inputMode="url" value={form.image_url ?? ""} onChange={(event) => field("image_url", event.target.value)} placeholder="https://… (si queda vacío usa la imagen principal)" /><small>Solo URL pública https://. Una imagen seleccionada reemplaza este valor al guardar.</small></label>
        <label className={promoStyles.wide}>Términos / condiciones<textarea value={form.terms ?? ""} onChange={(event) => field("terms", event.target.value)} maxLength={500} /></label>
        <label className={promoStyles.wide}>Notas internas<textarea value={form.internal_notes ?? ""} onChange={(event) => field("internal_notes", event.target.value)} maxLength={2000} /></label>
      </div><footer className={styles.actions}><button className={`${styles.button} ${styles.approve}`} disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button>{selectedId ? <><button className={`${styles.button} ${styles.publish}`} type="button" disabled={busy || form.status === "activo"} onClick={() => changeStatus("activo")}>Activar</button><button className={`${styles.button} ${styles.secondary}`} type="button" disabled={busy || form.status === "pausado"} onClick={() => changeStatus("pausado")}>Pausar</button><button className={`${styles.button} ${styles.reject}`} type="button" disabled={busy || form.status === "finalizado"} onClick={() => changeStatus("finalizado")}>Finalizar</button></> : null}</footer></form>
    </div></div></div></main>;
}
