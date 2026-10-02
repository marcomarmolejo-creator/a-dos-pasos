import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
export const metadata: Metadata = { title: "Alta gratuita de negocio" };
export default function BusinessSignupPage(){return <LegacyPage file="para-negocios/index.html" moduleSrc="/legacy/para-negocios.js" bodyClass="business-page alta-only"/>}
