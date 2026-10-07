"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import styles from "./AdminBusinesses.module.css";
import recoveryStyles from "./AdminRecovery.module.css";
import commercialStyles from "./CommercialTracking.module.css";
import residentStyles from "./AdminResidents.module.css";

type BusinessStatus = "pendiente" | "aprobado" | "publicado" | "rechazado";

type AdminBusiness = {
  id: string;
  created_at: string;
  updated_at: string;
  status: BusinessStatus;
  business_name: string;
  slug: string | null;
  category: string;
  short_description: string;
  zone: string;
  address: string | null;
  maps_url: string | null;
  business_hours: string | null;
  home_service: boolean;
  whatsapp: string;
  phone: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  logo_url: string | null;
  main_image_url: string | null;
  contact_name: string;
  contact_whatsapp: string;
  contact_email: string | null;
  promotion_title: string | null;
  promotion_description: string | null;
  information_confirmed: boolean;
  publication_authorized: boolean;
  editorial_review_accepted: boolean;
  source: string;
  listing_type: "ficha" | "micrositio";
  theme: string | null;
  commercial_interest: string | null;
  sales_status: string;
  sales_notes: string | null;
};

const STATUSES: BusinessStatus[] = ["pendiente", "aprobado", "publicado", "rechazado"];
const PRIVATE_BUCKET = "business-submissions";
const PUBLIC_BUCKET = "business-public";
const COMMERCIAL_INTERESTS = [
  ["", "Sin producto definido"],
  ["micrositio", "Micrositio"],
  ["video-local", "Video Local"],
  ["promocion-activa", "Promoción Activa"],
  ["beneficio-local", "Beneficio Local"],
  ["paquete-micrositio-video", "Micrositio + Video Local"]
] as const;
const SALES_STATUSES = [
  ["sin-contacto", "Sin contacto"],
  ["interesado", "Interesado"],
  ["cotizacion-enviada", "Cotización enviada"],
  ["contratado", "Contratado"],
  ["no-interesado", "No interesado"]
] as const;

function errorMessage(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) return "No fue posible completar la operación.";
  return String(error.message).replace(/sb_(?:publishable|secret)_[A-Za-z0-9_-]+/g, "[clave protegida]");
}

function fileExtension(path: string) {
  const extension = path.split(".").pop()?.toLowerCase();
  return extension && ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : "jpg";
}

function safeLink(value: string | null) {
  return value && /^https?:\/\//i.test(value) ? value : null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function AdminBusinesses() {
  const [phase, setPhase] = useState<"loading" | "login" | "admin">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [status, setStatus] = useState<BusinessStatus>("pendiente");
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [operationError, setOperationError] = useState("");
  const [commercialInterest, setCommercialInterest] = useState("");
  const [salesStatus, setSalesStatus] = useState("sin-contacto");
  const [salesNotes, setSalesNotes] = useState("");

  const selected = businesses.find((business) => business.id === selectedId) ?? businesses[0] ?? null;

  const authorize = useCallback(async (session: Session | null) => {
    if (!session) {
      setAdminEmail("");
      setPhase("login");
      return false;
    }
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.rpc("is_admin");
    if (error || data !== true) {
      setAuthError("La sesión existe, pero este usuario no está autorizado como administrador.");
      await supabase.auth.signOut();
      setPhase("login");
      return false;
    }
    setAuthError("");
    setAdminEmail(session.user.email ?? "Administrador");
    setPhase("admin");
    return true;
  }, []);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) void authorize(data.session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "SIGNED_OUT") {
        setPhase("login");
        setAdminEmail("");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        void authorize(session);
      }
    });
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [authorize]);

  const loadBusinesses = useCallback(async () => {
    setLoadingList(true);
    setOperationError("");
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    if (error) {
      setOperationError(errorMessage(error));
      setBusinesses([]);
    } else {
      const rows = (data ?? []) as AdminBusiness[];
      setBusinesses(rows);
      setSelectedId((current) => rows.some((row) => row.id === current) ? current : rows[0]?.id ?? null);
    }
    setLoadingList(false);
  }, [status]);

  useEffect(() => {
    if (phase === "admin") void loadBusinesses();
  }, [phase, loadBusinesses]);

  useEffect(() => {
    let active = true;
    const loadImages = async () => {
      setLogoUrl(null);
      setMainImageUrl(null);
      if (!selected) return;
      const supabase = getSupabaseAdminClient();
      if (selected.status === "publicado") {
        if (selected.logo_url) setLogoUrl(supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(selected.logo_url).data.publicUrl);
        if (selected.main_image_url) setMainImageUrl(supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(selected.main_image_url).data.publicUrl);
        return;
      }
      const [logo, main] = await Promise.all([
        selected.logo_url ? supabase.storage.from(PRIVATE_BUCKET).createSignedUrl(selected.logo_url, 600) : null,
        selected.main_image_url ? supabase.storage.from(PRIVATE_BUCKET).createSignedUrl(selected.main_image_url, 600) : null
      ]);
      if (!active) return;
      if (logo?.data?.signedUrl) setLogoUrl(logo.data.signedUrl);
      if (main?.data?.signedUrl) setMainImageUrl(main.data.signedUrl);
      const imageError = logo?.error ?? main?.error;
      if (imageError) setOperationError(`No fue posible cargar una imagen privada: ${errorMessage(imageError)}`);
    };
    void loadImages();
    return () => { active = false; };
  }, [selected]);

  useEffect(() => {
    setCommercialInterest(selected?.commercial_interest ?? "");
    setSalesStatus(selected?.sales_status ?? "sin-contacto");
    setSalesNotes(selected?.sales_notes ?? "");
  }, [selected?.id, selected?.commercial_interest, selected?.sales_status, selected?.sales_notes]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setAuthError("");
    try {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      const allowed = await authorize(data.session);
      if (allowed) setPassword("");
    } catch (error) {
      setAuthError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const requestPasswordRecovery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setAuthError("");
    setRecoverySent(false);
    try {
      const supabase = getSupabaseAdminClient();
      const redirectTo = `${window.location.origin}/admin/reset-password/`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (error) throw error;
      setRecoverySent(true);
    } catch (error) {
      setAuthError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    await getSupabaseAdminClient().auth.signOut();
    setBusinesses([]);
    setSelectedId(null);
    setBusy(false);
  };

  const changeStatus = async (nextStatus: "aprobado" | "rechazado") => {
    if (!selected) return;
    setBusy(true);
    setNotice("");
    setOperationError("");
    const supabase = getSupabaseAdminClient();
    const rpcName = nextStatus === "aprobado" ? "admin_approve_business" : "admin_reject_business";
    const { error } = await supabase.rpc(rpcName, { p_business_id: selected.id });
    if (error) setOperationError(errorMessage(error));
    else {
      setNotice(nextStatus === "aprobado" ? "Solicitud aprobada." : "Solicitud rechazada.");
      await loadBusinesses();
    }
    setBusy(false);
  };

  const saveCommercialTracking = async () => {
    if (!selected) return;
    setBusy(true);
    setNotice("");
    setOperationError("");
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.rpc("admin_update_commercial_tracking", {
      p_business_id: selected.id,
      p_commercial_interest: commercialInterest || null,
      p_sales_status: salesStatus,
      p_sales_notes: salesNotes
    });
    if (error) setOperationError(errorMessage(error));
    else {
      const updated = data as AdminBusiness;
      setBusinesses((current) => current.map((business) => business.id === updated.id ? updated : business));
      setNotice("Seguimiento comercial actualizado.");
    }
    setBusy(false);
  };

  const publish = async () => {
    if (!selected || selected.status !== "aprobado" || !selected.logo_url || !selected.main_image_url) return;
    setBusy(true);
    setNotice("");
    setOperationError("");
    try {
      const supabase = getSupabaseAdminClient();
      const publicationId = crypto.randomUUID();
      const basePath = `businesses/${selected.id}/${publicationId}`;
      const publicLogoPath = `${basePath}-logo.${fileExtension(selected.logo_url)}`;
      const publicMainPath = `${basePath}-principal.${fileExtension(selected.main_image_url)}`;

      const { error: logoCopyError } = await supabase.storage
        .from(PRIVATE_BUCKET)
        .copy(selected.logo_url, publicLogoPath, { destinationBucket: PUBLIC_BUCKET });
      if (logoCopyError) throw logoCopyError;

      const { error: mainCopyError } = await supabase.storage
        .from(PRIVATE_BUCKET)
        .copy(selected.main_image_url, publicMainPath, { destinationBucket: PUBLIC_BUCKET });
      if (mainCopyError) throw mainCopyError;

      const { error: publishError } = await supabase.rpc("admin_publish_business", {
        p_business_id: selected.id,
        p_logo_path: publicLogoPath,
        p_main_image_path: publicMainPath
      });
      if (publishError) throw publishError;

      const { data: published, error: verificationError } = await supabase
        .from("published_businesses")
        .select("id,slug,listing_type")
        .eq("id", selected.id)
        .single();
      if (verificationError || !published) throw verificationError ?? new Error("El negocio no apareció en la vista pública.");

      const directoryResponse = await fetch("/directorio/", { method: "HEAD", cache: "no-store" });
      if (!directoryResponse.ok) throw new Error("El directorio público no está disponible.");

      setNotice(
        published.listing_type === "micrositio"
          ? "Negocio publicado y visible para el directorio. Requiere redeploy manual para generar su micrositio."
          : "Negocio publicado y disponible para el directorio."
      );
      await loadBusinesses();
    } catch (error) {
      setOperationError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (phase === "loading") {
    return <main className={styles.page}><div className={styles.loading}>Validando sesión administrativa…</div></main>;
  }

  if (phase === "login") {
    return <main className={styles.page}>
      <div className={styles.topbar}><div className={styles.brand}><strong>A DOS PASOS</strong><span>Administración interna</span></div></div>
      <div className={styles.loginWrap}>
        {recoveryMode ? <form className={styles.login} onSubmit={requestPasswordRecovery}>
          <h1>Recuperar acceso</h1>
          <p>Escribe el correo de tu usuario administrativo. Supabase enviará un enlace para establecer una nueva contraseña.</p>
          <label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          {recoverySent ? <div className={styles.notice} role="status">Si el correo corresponde a un usuario válido, recibirás las instrucciones de recuperación.</div> : null}
          {authError ? <div className={`${styles.notice} ${styles.error}`} role="alert">{authError}</div> : null}
          <button type="submit" disabled={busy || recoverySent}>{busy ? "Enviando…" : recoverySent ? "Correo enviado" : "Enviar enlace de recuperación"}</button>
          <button className={recoveryStyles.textButton} type="button" onClick={() => { setRecoveryMode(false); setRecoverySent(false); setAuthError(""); }} disabled={busy}>Volver a iniciar sesión</button>
        </form> : <form className={styles.login} onSubmit={signIn}>
          <h1>Acceso administrativo</h1>
          <p>Inicia sesión con el usuario autorizado en Supabase Auth.</p>
          <label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
          <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {authError ? <div className={`${styles.notice} ${styles.error}`} role="alert">{authError}</div> : null}
          <button type="submit" disabled={busy}>{busy ? "Validando…" : "Iniciar sesión"}</button>
          <button className={recoveryStyles.textButton} type="button" onClick={() => { setRecoveryMode(true); setRecoverySent(false); setAuthError(""); }}>¿Olvidaste tu contraseña?</button>
        </form>}
      </div>
    </main>;
  }

  return <main className={styles.page}>
    <header className={styles.topbar}>
      <div className={styles.brand}><strong>A DOS PASOS</strong><span>Administración de negocios</span></div>
      <div className={residentStyles.adminNav}><span>{adminEmail}</span><a href="/admin/residentes/">Residentes</a><a href="/admin/promociones/">Promociones</a><button type="button" onClick={signOut} disabled={busy}>Cerrar sesión</button></div>
    </header>
    <div className={styles.main}>
      <div className={styles.workspace}>
        <div className={styles.heading}><div><h1>Solicitudes de negocios</h1><p>Revisa, aprueba y publica contenido local.</p></div></div>
        <nav className={styles.filters} aria-label="Filtrar por estado">
          {STATUSES.map((item) => <button key={item} type="button" className={`${styles.filter} ${status === item ? styles.filterActive : ""}`} onClick={() => setStatus(item)}>{item}</button>)}
        </nav>
        {notice ? <div className={styles.notice} role="status">{notice}</div> : null}
        {operationError ? <div className={`${styles.notice} ${styles.error}`} role="alert">{operationError}</div> : null}
        <div className={styles.layout}>
          <section className={styles.list} aria-label={`Negocios con estado ${status}`}>
            {loadingList ? <div className={styles.empty}>Cargando solicitudes…</div> : null}
            {!loadingList && !businesses.length ? <div className={styles.empty}>No hay solicitudes en este estado.</div> : null}
            {businesses.map((business) => <button key={business.id} type="button" className={`${styles.listItem} ${selected?.id === business.id ? styles.listItemActive : ""}`} onClick={() => setSelectedId(business.id)}>
              <div><h2>{business.business_name}</h2><p>{business.category} · {business.zone}</p><time>{formatDate(business.created_at)}</time></div>
              <span className={styles.status}>{business.status}</span>
            </button>)}
          </section>
          {selected ? <article className={styles.detail}>
            <header className={styles.detailHeader}><h2>{selected.business_name}</h2><p>{selected.category} · {selected.zone} · Recibido {formatDate(selected.created_at)}</p></header>
            <div className={styles.media}>
              <div className={styles.imageBox}>{logoUrl ? <img src={logoUrl} alt={`Logo de ${selected.business_name}`} /> : "Logo no disponible"}</div>
              <div className={styles.imageBox}>{mainImageUrl ? <img src={mainImageUrl} alt={`Imagen principal de ${selected.business_name}`} /> : "Imagen no disponible"}</div>
            </div>
            <div className={styles.sections}>
              <DetailSection title="Datos comerciales" rows={[
                ["Descripción", selected.short_description], ["Dirección", selected.address], ["Horario", selected.business_hours],
                ["A domicilio", selected.home_service ? "Sí" : "No"], ["Tipo", selected.listing_type], ["Slug", selected.slug]
              ]} />
              <DetailSection title="Contacto responsable · Privado" rows={[
                ["Nombre", selected.contact_name], ["WhatsApp", selected.contact_whatsapp], ["Correo", selected.contact_email]
              ]} />
              <DetailSection title="Contacto público" rows={[
                ["WhatsApp", selected.whatsapp], ["Teléfono", selected.phone], ["Sitio", selected.website],
                ["Instagram", selected.instagram], ["Facebook", selected.facebook], ["Mapa", selected.maps_url]
              ]} links />
              <DetailSection title="Consentimientos" rows={[
                ["Información confirmada", selected.information_confirmed ? "Sí" : "No"],
                ["Publicación autorizada", selected.publication_authorized ? "Sí" : "No"],
                ["Revisión aceptada", selected.editorial_review_accepted ? "Sí" : "No"]
              ]} consent />
            </div>
            <section className={commercialStyles.panel} aria-labelledby="commercial-tracking-title">
              <div><span>Interno</span><h3 id="commercial-tracking-title">Seguimiento comercial</h3><p>Estos datos son privados y no aparecen en la ficha pública.</p></div>
              <div className={commercialStyles.fields}>
                <label>Producto de interés<select value={commercialInterest} onChange={(event) => setCommercialInterest(event.target.value)}>{COMMERCIAL_INTERESTS.map(([value,label])=><option value={value} key={value || "none"}>{label}</option>)}</select></label>
                <label>Estado comercial<select value={salesStatus} onChange={(event) => setSalesStatus(event.target.value)}>{SALES_STATUSES.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
                <label className={commercialStyles.notes}>Notas<textarea value={salesNotes} onChange={(event) => setSalesNotes(event.target.value)} rows={4} maxLength={2000} placeholder="Acuerdos, seguimiento o siguiente paso" /></label>
              </div>
              <button className={commercialStyles.save} type="button" onClick={saveCommercialTracking} disabled={busy}>Guardar seguimiento</button>
            </section>
            <section className={styles.preview} aria-label="Vista previa de ficha">
              {mainImageUrl ? <img src={mainImageUrl} alt="" /> : <div />}
              <div><small>Vista previa de ficha</small><h3>{selected.business_name}</h3><p>{selected.short_description}</p><strong>{selected.category} · {selected.zone}</strong></div>
            </section>
            <footer className={styles.actions}>
              {selected.status !== "publicado" ? <button className={`${styles.button} ${styles.approve}`} type="button" onClick={() => changeStatus("aprobado")} disabled={busy || selected.status === "aprobado"}>Aprobar</button> : null}
              {selected.status !== "publicado" ? <button className={`${styles.button} ${styles.reject}`} type="button" onClick={() => changeStatus("rechazado")} disabled={busy || selected.status === "rechazado"}>Rechazar</button> : null}
              {selected.status === "aprobado" ? <button className={`${styles.button} ${styles.publish}`} type="button" onClick={publish} disabled={busy}>Publicar</button> : null}
              {selected.status === "publicado" ? <a className={`${styles.button} ${styles.secondary}`} href="/directorio/" target="_blank">Abrir directorio</a> : null}
              {selected.status === "publicado" && selected.listing_type === "micrositio" && selected.slug ? <a className={`${styles.button} ${styles.secondary}`} href={`/negocio/${selected.slug}/`} target="_blank">Abrir micrositio</a> : null}
              {selected.listing_type === "micrositio" ? <p className={styles.actionNote}>Después de publicar, realiza un redeploy manual para generar la ruta estática del micrositio.</p> : null}
            </footer>
          </article> : <div className={styles.empty}>Selecciona una solicitud para revisar el detalle.</div>}
        </div>
      </div>
    </div>
  </main>;
}

function DetailSection({ title, rows, links = false, consent = false }: {
  title: string;
  rows: Array<[string, string | null]>;
  links?: boolean;
  consent?: boolean;
}) {
  return <section className={styles.section}><h3>{title}</h3><dl>{rows.map(([label, value]) => {
    const link = links ? safeLink(value) : null;
    return <div key={label} style={{ display: "contents" }}><dt>{label}</dt><dd className={consent ? (value === "Sí" ? styles.consent : styles.consentOff) : undefined}>{link ? <a href={link} target="_blank" rel="noreferrer">{value}</a> : value || "—"}</dd></div>;
  })}</dl></section>;
}
