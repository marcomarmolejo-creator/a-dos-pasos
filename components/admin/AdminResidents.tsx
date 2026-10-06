"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import styles from "./AdminBusinesses.module.css";
import residentStyles from "./AdminResidents.module.css";

type ResidentStatus = "activo" | "inactivo";

type AdminResident = {
  id: string;
  created_at: string;
  updated_at: string;
  status: ResidentStatus;
  name: string;
  whatsapp: string;
  email: string | null;
  zone: string;
  neighborhood: string | null;
  interests: string[];
  comments: string | null;
  consent: boolean;
  consent_at: string | null;
  source: string;
};

const INTEREST_FILTERS = ["Comer", "Café", "Cuidarme", "Mi casa", "Mascotas", "Servicios", "Promociones", "Nuevos lugares", "Ideas para hoy"];

function errorMessage(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) return "No fue posible completar la operación.";
  return String(error.message)
    .replace(/sb_(?:publishable|secret)_[A-Za-z0-9_-]+/g, "[clave protegida]")
    .replace(/Bearer\s+\S+/gi, "Bearer [protegido]");
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function AdminResidents() {
  const [phase, setPhase] = useState<"loading" | "login" | "admin">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [residents, setResidents] = useState<AdminResident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"todos" | ResidentStatus>("activo");
  const [zoneFilter, setZoneFilter] = useState("todas");
  const [interestFilter, setInterestFilter] = useState("todos");
  const [loadingList, setLoadingList] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [operationError, setOperationError] = useState("");

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

  const loadResidents = useCallback(async () => {
    setLoadingList(true);
    setOperationError("");
    const { data, error } = await getSupabaseAdminClient()
      .from("residents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setOperationError(errorMessage(error));
      setResidents([]);
    } else {
      setResidents((data ?? []) as AdminResident[]);
    }
    setLoadingList(false);
  }, []);

  useEffect(() => {
    if (phase === "admin") void loadResidents();
  }, [phase, loadResidents]);

  const filtered = useMemo(() => residents.filter((resident) =>
    (statusFilter === "todos" || resident.status === statusFilter)
    && (zoneFilter === "todas" || resident.zone === zoneFilter)
    && (interestFilter === "todos" || resident.interests.includes(interestFilter))
  ), [residents, statusFilter, zoneFilter, interestFilter]);

  useEffect(() => {
    setSelectedId((current) => filtered.some((resident) => resident.id === current) ? current : filtered[0]?.id ?? null);
  }, [filtered]);

  const selected = filtered.find((resident) => resident.id === selectedId) ?? filtered[0] ?? null;
  const metrics = useMemo(() => {
    const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const counts = new Map<string, number>();
    residents.forEach((resident) => resident.interests.forEach((interest) => counts.set(interest, (counts.get(interest) ?? 0) + 1)));
    const mostSelected = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return {
      total: residents.length,
      active: residents.filter((resident) => resident.status === "activo").length,
      recent: residents.filter((resident) => new Date(resident.created_at).getTime() >= threshold).length,
      mostSelected
    };
  }, [residents]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setAuthError("");
    try {
      const { data, error } = await getSupabaseAdminClient().auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      if (await authorize(data.session)) setPassword("");
    } catch (error) {
      setAuthError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    await getSupabaseAdminClient().auth.signOut();
    setResidents([]);
    setSelectedId(null);
    setBusy(false);
  };

  const changeStatus = async (status: ResidentStatus) => {
    if (!selected) return;
    setBusy(true);
    setNotice("");
    setOperationError("");
    const { data, error } = await getSupabaseAdminClient().rpc("admin_set_resident_status", {
      p_resident_id: selected.id,
      p_status: status
    });
    if (error) {
      setOperationError(errorMessage(error));
    } else {
      const updated = data as AdminResident;
      setResidents((current) => current.map((resident) => resident.id === updated.id ? updated : resident));
      setNotice(status === "activo" ? "Residente marcado como activo." : "Residente marcado como inactivo.");
    }
    setBusy(false);
  };

  if (phase === "loading") {
    return <main className={styles.page}><div className={styles.loading}>Validando sesión administrativa…</div></main>;
  }

  if (phase === "login") {
    return <main className={styles.page}>
      <div className={styles.topbar}><div className={styles.brand}><strong>A DOS PASOS</strong><span>Administración interna</span></div></div>
      <div className={styles.loginWrap}>
        <form className={styles.login} onSubmit={signIn}>
          <h1>Acceso administrativo</h1>
          <p>Inicia sesión con el mismo usuario autorizado del Admin de negocios.</p>
          <label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
          <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {authError ? <div className={`${styles.notice} ${styles.error}`} role="alert">{authError}</div> : null}
          <button type="submit" disabled={busy}>{busy ? "Validando…" : "Iniciar sesión"}</button>
          <a className={styles.button} href="/admin/negocios/">Volver al Admin de negocios</a>
        </form>
      </div>
    </main>;
  }

  return <main className={styles.page}>
    <header className={styles.topbar}>
      <div className={styles.brand}><strong>A DOS PASOS</strong><span>Administración de residentes</span></div>
      <div className={residentStyles.adminNav}><span>{adminEmail}</span><a href="/admin/negocios/">Negocios</a><button type="button" onClick={signOut} disabled={busy}>Cerrar sesión</button></div>
    </header>
    <div className={styles.main}>
      <div className={styles.workspace}>
        <div className={styles.heading}><div><h1>Residentes</h1><p>Consulta altas y administra su estado sin exponer datos personales.</p></div></div>
        <section className={residentStyles.metrics} aria-label="Métricas de residentes">
          <Metric label="Total registrados" value={String(metrics.total)} />
          <Metric label="Activos" value={String(metrics.active)} />
          <Metric label="Altas últimos 30 días" value={String(metrics.recent)} />
          <Metric label="Interés más seleccionado" value={metrics.mostSelected} />
        </section>
        <div className={residentStyles.filterBar}>
          <div className={residentStyles.chips} aria-label="Filtrar por estado">
            {(["todos", "activo", "inactivo"] as const).map((status) => <button key={status} type="button" className={`${styles.filter} ${statusFilter === status ? styles.filterActive : ""}`} onClick={() => setStatusFilter(status)}>{status}</button>)}
          </div>
          <label>Zona<select value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value)}><option value="todas">Todas</option><option value="El Refugio">El Refugio</option></select></label>
          <label>Interés<select value={interestFilter} onChange={(event) => setInterestFilter(event.target.value)}><option value="todos">Todos</option>{INTEREST_FILTERS.map((interest) => <option key={interest}>{interest}</option>)}</select></label>
          <button className={`${styles.button} ${styles.secondary} ${residentStyles.refresh}`} type="button" onClick={loadResidents} disabled={loadingList}>Actualizar</button>
        </div>
        {notice ? <div className={styles.notice} role="status">{notice}</div> : null}
        {operationError ? <div className={`${styles.notice} ${styles.error}`} role="alert">{operationError}</div> : null}
        <div className={styles.layout}>
          <section className={styles.list} aria-label="Listado privado de residentes">
            {loadingList ? <div className={styles.empty}>Cargando residentes…</div> : null}
            {!loadingList && !filtered.length ? <div className={styles.empty}>No hay residentes para estos filtros.</div> : null}
            {filtered.map((resident) => <button key={resident.id} type="button" className={`${styles.listItem} ${selected?.id === resident.id ? styles.listItemActive : ""}`} onClick={() => setSelectedId(resident.id)}>
              <div>
                <h2>{resident.name}</h2>
                <p>{resident.whatsapp}{resident.email ? ` · ${resident.email}` : ""}</p>
                <p>{resident.zone}{resident.neighborhood ? ` · ${resident.neighborhood}` : ""}</p>
                <div className={residentStyles.listInterests}>{resident.interests.map((interest) => <span key={interest}>{interest}</span>)}</div>
                <time>{formatDate(resident.created_at)}</time>
              </div>
              <span className={styles.status}>{resident.status}</span>
            </button>)}
          </section>
          {selected ? <article className={styles.detail}>
            <header className={styles.detailHeader}><span className={residentStyles.privateLabel}>Internos · Privados</span><h2>{selected.name}</h2><p>{selected.zone} · Alta {formatDate(selected.created_at)}</p></header>
            <div className={styles.sections}>
              <ResidentDetail title="Contacto privado" rows={[["WhatsApp", selected.whatsapp], ["Email", selected.email], ["Zona", selected.zone], ["Colonia / privada", selected.neighborhood]]} />
              <ResidentDetail title="Registro" rows={[["Estado", selected.status], ["Fecha de alta", formatDate(selected.created_at)], ["Consentimiento", selected.consent ? "Sí" : "No"], ["Fecha de consentimiento", formatDate(selected.consent_at)], ["Fuente", selected.source]]} />
              <section className={`${styles.section} ${residentStyles.detailWide}`}><h3>Intereses</h3><div className={residentStyles.interests}>{selected.interests.map((interest) => <span className={residentStyles.interest} key={interest}>{interest}</span>)}</div></section>
              <section className={`${styles.section} ${residentStyles.detailWide}`}><h3>Comentarios</h3><p className={residentStyles.detailComment}>{selected.comments || "Sin comentarios."}</p></section>
            </div>
            <footer className={styles.actions}>
              <button className={`${styles.button} ${styles.approve}`} type="button" onClick={() => changeStatus("activo")} disabled={busy || selected.status === "activo"}>Marcar activo</button>
              <button className={`${styles.button} ${styles.reject}`} type="button" onClick={() => changeStatus("inactivo")} disabled={busy || selected.status === "inactivo"}>Marcar inactivo</button>
              <p className={residentStyles.actionsText}>Los residentes no se eliminan físicamente desde esta interfaz.</p>
            </footer>
          </article> : <div className={styles.empty}>Selecciona un residente para revisar el detalle.</div>}
        </div>
      </div>
    </div>
  </main>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className={residentStyles.metric}><span>{label}</span><strong>{value}</strong></article>;
}

function ResidentDetail({ title, rows }: { title: string; rows: Array<[string, string | null]> }) {
  return <section className={styles.section}><h3>{title}</h3><dl>{rows.map(([label, value]) => <div key={label} style={{ display: "contents" }}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl></section>;
}
