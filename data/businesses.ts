export type BusinessTheme = "warm-editorial" | "serene-light" | "dark-classic" | "clean-service";

export type Business = {
  slug: string;
  name: string;
  zone: string;
  category: string;
  theme: BusinessTheme;
  heroImage: string;
  gallery: string[];
  description: string;
  eyebrow: string;
  whatsapp: string;
  maps: string;
  services: Array<{ name: string; detail: string }>;
  benefit?: { title: string; description: string };
  promotion?: { title: string; description: string };
  video?: string;
  sectionOrder: Array<"about" | "services" | "gallery" | "video" | "benefit" | "promotion" | "location">;
};

export const businesses: Business[] = [
  {
    slug: "forno-locale", name: "Forno Locale", zone: "El Refugio", category: "Pizzería artesanal", theme: "warm-editorial",
    heroImage: "/assets/forno-locale.png", gallery: ["/assets/forno-locale.png", "/assets/forno-table.png"],
    eyebrow: "Horno encendido · El Refugio", description: "Pizza artesanal, ingredientes honestos y una mesa cerca de casa.",
    whatsapp: "https://wa.me/524421234567", maps: "https://maps.google.com/?q=El+Refugio+Queretaro",
    services: [{ name: "Pizzas artesanales", detail: "Masa, horno e ingredientes seleccionados." }, { name: "Para compartir", detail: "Una mesa casual para comer cerca." }, { name: "Pedidos", detail: "Consulta disponibilidad directamente por WhatsApp." }],
    benefit: { title: "Bebida de cortesía", description: "Consulta el beneficio de bienvenida disponible en tu primera visita." },
    promotion: { title: "Martes de pizza", description: "Pregunta por la promoción activa de la semana y descubre qué incluye." },
    sectionOrder: ["about", "services", "promotion", "gallery", "benefit", "location"]
  },
  {
    slug: "aura-spa", name: "Aura Spa", zone: "El Refugio", category: "Bienestar", theme: "serene-light",
    heroImage: "/assets/aura-spa.jpg", gallery: ["/assets/aura-spa.jpg", "/assets/aura-ritual.jpg"],
    eyebrow: "Bienestar · El Refugio", description: "Masajes, rituales y una pausa para volver a tu centro.",
    whatsapp: "https://wa.me/524421234567", maps: "https://maps.google.com/?q=El+Refugio+Queretaro",
    services: [{ name: "Masajes", detail: "Sesiones para soltar tensión y recuperar calma." }, { name: "Rituales", detail: "Experiencias de cuidado seleccionadas." }, { name: "Bienestar", detail: "Una pausa personal a pocos minutos de casa." }],
    benefit: { title: "15 min de aromaterapia sin costo", description: "Incluidos al reservar un tratamiento seleccionado. Sujeto a disponibilidad." },
    sectionOrder: ["about", "benefit", "services", "gallery", "location"]
  },
  {
    slug: "barberia-clasica", name: "Barbería Clásica", zone: "El Refugio", category: "Barbería", theme: "dark-classic",
    heroImage: "/assets/barberia-clasica.png", gallery: ["/assets/barberia-clasica.png", "/assets/barberia-interior.png"],
    eyebrow: "Oficio clásico · El Refugio", description: "Corte, barba y atención cercana con oficio.",
    whatsapp: "https://wa.me/524421234567", maps: "https://maps.google.com/?q=El+Refugio+Queretaro",
    services: [{ name: "Corte", detail: "Clásico o contemporáneo, trabajado con detalle." }, { name: "Barba", detail: "Perfilado y cuidado personal." }, { name: "Experiencia", detail: "Atención directa en un espacio sobrio." }],
    benefit: { title: "Beneficio para primera visita", description: "Pregunta por el beneficio disponible al momento de agendar." },
    sectionOrder: ["about", "services", "gallery", "benefit", "location"]
  },
  {
    slug: "eleva-steam", name: "Eleva Steam", zone: "Querétaro", category: "Lavado profesional a domicilio", theme: "clean-service",
    heroImage: "/assets/eleva-steam.jpg", gallery: ["/assets/eleva-steam.jpg", "/assets/eleva-resultado.jpg"],
    eyebrow: "Servicio profesional a domicilio", description: "Lavado profundo para salas, colchones y tapetes con atención en tu hogar.",
    whatsapp: "https://wa.me/524422742734", maps: "https://maps.google.com/?q=Queretaro",
    services: [{ name: "Salas", detail: "Lavado profesional según piezas y características." }, { name: "Colchones", detail: "Lavado, aspirado y sanitizado con vapor." }, { name: "Tapetes y alfombras", detail: "Cotización según medidas y condición." }],
    benefit: { title: "Evaluación por WhatsApp", description: "Envía una fotografía y recibe una evaluación inicial." },
    sectionOrder: ["about", "gallery", "services", "benefit", "location"]
  }
];

export const getBusiness = (slug: string) => businesses.find((business) => business.slug === slug);
