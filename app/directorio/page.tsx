import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";

export const metadata: Metadata = { title: "Directorio local" };

export default function DirectoryPage() {
  return <LegacyPage file="directorio/index.html" moduleSrc="/legacy/directory.js" />;
}
