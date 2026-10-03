import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
import { DirectoryBootstrap } from "@/components/DirectoryBootstrap";
import { getPublishedBusinesses } from "@/lib/businesses";

export const metadata: Metadata = { title: "Directorio local" };

export default async function DirectoryPage() {
  const publishedBusinesses = await getPublishedBusinesses();
  return <><LegacyPage file="directorio/index.html" /><DirectoryBootstrap initialBusinesses={publishedBusinesses} /></>;
}
