export type CommercialProductId = "micrositio" | "video-local" | "promocion-activa";

export const commercialProducts = [
  {
    id: "micrositio" as const,
    name: "Micrositio",
    description: "Quiero tener una presencia más completa de mi negocio dentro de A Dos Pasos.",
    features: ["Presencia más completa", "Contenido visual", "Información ampliada"],
    cta: "Quiero conocer el Micrositio",
    message: "Hola, tengo mi negocio en A Dos Pasos y me interesa conocer la opción de Micrositio para mi negocio."
  },
  {
    id: "video-local" as const,
    name: "Video Local",
    description: "Quiero un video profesional para mi negocio que también pueda usar en mis propias redes.",
    features: ["Video vertical profesional", "Archivo entregable", "Uso orgánico en tus redes"],
    cta: "Quiero un Video Local",
    message: "Hola, tengo mi negocio en A Dos Pasos y me interesa crear un Video Local que también pueda usar en mis propias redes."
  },
  {
    id: "promocion-activa" as const,
    name: "Promoción Activa",
    description: "Quiero promover una oferta, beneficio o campaña de mi negocio dentro de A Dos Pasos.",
    features: ["30 días de visibilidad", "Beneficio claro", "Mayor visibilidad local"],
    cta: "Quiero promover mi negocio",
    message: "Hola, tengo mi negocio en A Dos Pasos y quiero conocer las opciones para promover una oferta o beneficio."
  }
];

export const commercialPrices = [
  ["Micrositio Fundador / 1 año", null, "$1,290 MXN", "+ IVA"],
  ["Video Local Básico", null, "$1,490 MXN", "+ IVA"],
  ["Micrositio + Video Local", null, "$2,490 MXN", "+ IVA"],
  ["Beneficio Local", "7 días", "desde $299 MXN", "+ IVA"],
  ["Promoción Activa", "30 días", "desde $590 MXN", "+ IVA"]
] as const;

export function commercialWhatsAppUrl(productId: CommercialProductId) {
  const product = commercialProducts.find((item) => item.id === productId);
  return `https://wa.me/524424223487?text=${encodeURIComponent(product?.message ?? "")}`;
}
