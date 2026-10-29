import { CollectionPage } from "@/components/CollectionPage";
export const metadata = { title: "Ideas para hoy" };
export default function IdeasPage() { return <CollectionPage eyebrow="Ideas para hoy" title="Cuando no sabes qué hacer, empieza por aquí" description="Selecciones editoriales para decidir mejor sin alejarte de tu zona." items={[{label:"Para tu casa",title:"Servicios que llegan hasta ti",description:"Expertos locales para resolver necesidades del hogar.",image:"/assets/eleva-resultado.jpg",href:"/negocio/eleva-steam/",meta:"Eleva Steam"}]} />; }
