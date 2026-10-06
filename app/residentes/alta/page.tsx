import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
import { ResidentSignupController } from "@/components/ResidentSignupController";
export const metadata: Metadata = { title: "Alta gratuita de residentes" };
export default function ResidentSignupPage(){return <><LegacyPage file="unete/index.html" bodyClass="resident-page resident-alta-only"/><ResidentSignupController /></>}
