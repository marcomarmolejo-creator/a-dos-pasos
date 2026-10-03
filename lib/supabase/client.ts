import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publicKey) {
    console.error("[Supabase] Client configuration is incomplete", {
      urlConfigured: Boolean(url),
      publicKeyConfigured: Boolean(publicKey)
    });
    throw new Error("Supabase public environment variables are not configured.");
  }

  browserClient = createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  console.info("[Supabase] Browser client created", {
    keyType: publicKey.startsWith("sb_publishable_") ? "publishable" : "legacy-anon"
  });
  return browserClient;
}
