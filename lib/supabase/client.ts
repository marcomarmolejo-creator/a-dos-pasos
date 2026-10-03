import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function fetchWithoutPublishableBearer(publishableKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(init?.headers);
    if (headers.get("Authorization") === `Bearer ${publishableKey}`) {
      headers.delete("Authorization");
    }
    return fetch(input, { ...init, headers });
  };
}

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    console.error("[Supabase] Client configuration is incomplete", {
      urlConfigured: Boolean(url),
      publishableKeyConfigured: Boolean(publishableKey)
    });
    throw new Error("Supabase public environment variables are not configured.");
  }

  browserClient = createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchWithoutPublishableBearer(publishableKey) }
  });
  console.info("[Supabase] Browser client created");
  return browserClient;
}
