import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) throw new Error("Missing public Supabase environment variables.");

const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});
const bucket = "business-submissions";
const id = crypto.randomUUID();
const logoPath = `${id}/logo.png`;
const mainImagePath = `${id}/principal.jpg`;

async function upload(objectPath, filePath, contentType) {
  const { error } = await supabase.storage.from(bucket).upload(
    objectPath,
    fs.readFileSync(path.join(root, filePath)),
    { contentType, cacheControl: "3600", upsert: false }
  );
  if (error) throw new Error(`Upload failed for ${objectPath}: ${error.message}`);
}

await upload(logoPath, "public/assets/logo-a-dos-pasos-blanco.png", "image/png");
await upload(mainImagePath, "public/assets/eleva-steam.jpg", "image/jpeg");

const { error: insertError } = await supabase.from("businesses").insert({
  id,
  business_name: "Prueba técnica A Dos Pasos",
  slug: `prueba-tecnica-${id.slice(0, 8)}`,
  category: "Servicios",
  short_description: "Registro técnico de verificación de la fase 1 de Supabase.",
  zone: "El Refugio",
  address: "Registro técnico; no publicar",
  maps_url: null,
  business_hours: "Prueba técnica",
  home_service: true,
  whatsapp: "4424223487",
  phone: null,
  instagram: null,
  facebook: null,
  website: null,
  logo_url: logoPath,
  main_image_url: mainImagePath,
  contact_name: "Prueba técnica",
  contact_whatsapp: "4424223487",
  contact_email: null,
  promotion_title: null,
  promotion_description: null,
  information_confirmed: true,
  publication_authorized: true,
  editorial_review_accepted: true,
  source: "web"
});
if (insertError) throw new Error(`Business insert failed: ${insertError.message}`);

const invalidId = crypto.randomUUID();
const { error: invalidStatusError } = await supabase.from("businesses").insert({
  id: invalidId,
  status: "aprobado",
  business_name: "Prueba RLS; no debe insertarse",
  category: "Servicios",
  short_description: "Verificación de política RLS.",
  zone: "El Refugio",
  whatsapp: "4424223487",
  contact_name: "Prueba RLS",
  contact_whatsapp: "4424223487",
  information_confirmed: true,
  publication_authorized: true,
  editorial_review_accepted: true
});

const { error: selectError } = await supabase.from("businesses").select("id,status").eq("id", id);
const { error: privateDownloadError } = await supabase.storage.from(bucket).download(logoPath);
const publicObjectUrl = `${url}/storage/v1/object/public/${bucket}/${logoPath}`;
const publicResponse = await fetch(publicObjectUrl, { redirect: "manual" });

console.log(JSON.stringify({
  testRecordId: id,
  uploads: { logoPath, mainImagePath },
  insertSucceeded: true,
  statusConfirmedAsPendingByInsertPolicy: Boolean(invalidStatusError),
  publicTableReadBlocked: Boolean(selectError),
  privateStorageReadBlocked: Boolean(privateDownloadError),
  publicObjectHttpStatus: publicResponse.status,
  onlyPathsStored: !logoPath.startsWith("http") && !mainImagePath.startsWith("http")
}, null, 2));
