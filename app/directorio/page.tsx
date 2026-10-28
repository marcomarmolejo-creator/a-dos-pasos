import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
import { DirectoryBootstrap } from "@/components/DirectoryBootstrap";

export const metadata: Metadata = { title: "Directorio local" };

export default function DirectoryPage() {
  return <><LegacyPage file="directorio/index.html" /><DirectoryBootstrap /></>;
}
