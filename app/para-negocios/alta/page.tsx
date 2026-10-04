import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
import { BusinessSubmissionController } from "@/components/BusinessSubmissionController";
import { CommercialClickTracking } from "@/components/CommercialClickTracking";
export const metadata: Metadata = { title: "Alta gratuita de negocio" };
export default function BusinessSignupPage(){return <><LegacyPage file="para-negocios/index.html" moduleSrc="/legacy/para-negocios.js" bodyClass="business-page alta-only"/><BusinessSubmissionController /><CommercialClickTracking /></>}
