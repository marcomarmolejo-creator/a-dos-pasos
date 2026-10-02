import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
export const metadata: Metadata = { title: "Alta gratuita de residentes" };
export default function ResidentSignupPage(){return <LegacyPage file="unete/index.html" moduleSrc="/legacy/unete.js" bodyClass="resident-page resident-alta-only"/>}
