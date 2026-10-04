"use client";

import { type FormEvent, useEffect, useState } from "react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import styles from "./AdminBusinesses.module.css";

const MIN_PASSWORD_LENGTH = 12;

export function AdminResetPassword() {
  const [phase, setPhase] = useState<"loading" | "ready" | "invalid" | "success">("loading");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseAdminClient();
    let active = true;
    let recoveryDetected = false;
    const recoveryMarker = new URLSearchParams(window.location.search).has("code")
      || new URLSearchParams(window.location.hash.replace(/^#/, "")).get("type") === "recovery";

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" && session) {
        recoveryDetected = true;
        setPhase("ready");
        setError("");
      }
    });

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || recoveryDetected) return;
      if (!sessionError && data.session && recoveryMarker) setPhase("ready");
      else setPhase("invalid");
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    const supabase = getSupabaseAdminClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPassword("");
    setConfirmation("");
    if (updateError) {
      setError(updateError.message || "No fue posible actualizar la contraseña.");
      setSaving(false);
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    setPhase("success");
    setSaving(false);
  };

  return <main className={styles.page}>
    <div className={styles.topbar}><div className={styles.brand}><strong>A DOS PASOS</strong><span>Administración interna</span></div></div>
    <div className={styles.loginWrap}>
      {phase === "loading" ? <div className={styles.login}><h1>Validando enlace…</h1><p>Estamos verificando tu sesión de recuperación.</p></div> : null}
      {phase === "invalid" ? <div className={styles.login}>
        <h1>Enlace no válido</h1>
        <p>Este enlace de recuperación expiró, ya fue utilizado o no contiene una sesión válida.</p>
        <a className={styles.button} href="/admin/negocios/">Volver al acceso administrativo</a>
      </div> : null}
      {phase === "ready" ? <form className={styles.login} onSubmit={submit}>
        <h1>Nueva contraseña</h1>
        <p>Usa una contraseña exclusiva de al menos {MIN_PASSWORD_LENGTH} caracteres.</p>
        <label>Nueva contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} required /></label>
        <label>Confirmar contraseña<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH} required /></label>
        {error ? <div className={`${styles.notice} ${styles.error}`} role="alert">{error}</div> : null}
        <button type="submit" disabled={saving}>{saving ? "Actualizando…" : "Guardar nueva contraseña"}</button>
      </form> : null}
      {phase === "success" ? <div className={styles.login}>
        <h1>Contraseña actualizada</h1>
        <p>La contraseña se guardó correctamente. Inicia sesión nuevamente para continuar.</p>
        <a className={styles.button} href="/admin/negocios/">Volver al acceso administrativo</a>
      </div> : null}
    </div>
  </main>;
}
