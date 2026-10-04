import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function fetchWithoutPublishableBearer(publishableKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(init?.headers);
    if (headers.get("Authorization") === `Bearer ${publishableKey}`) {
      headers.delete("Authorization");
    }
    return fetch(input, { ...init, headers });
  };
}

export function getSupabaseAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  adminClient = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "a-dos-pasos-admin-auth"
    },
    global: { fetch: fetchWithoutPublishableBearer(publishableKey) }
  });

  return adminClient;
}
