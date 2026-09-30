export const businesses = [
  {
    id: "forno-locale", name: "Forno Locale", slug: "forno-locale", category: "Pizzería artesanal", categories: ["comer", "promociones", "nuevos"], zone: "El Refugio", image: "./assets/forno-locale.png", logo: null,
    description: "Pizza artesanal, horno encendido y una mesa cerca de casa.", distance: "A 4 min", isOpen: true, isNew: true, isFeatured: true, hasPromotion: true,
    micrositeUrl: "https://forno-locale-a-dos-pasos.booker74.chatgpt.site", whatsappUrl: "https://wa.me/524421234567", mapsUrl: "https://maps.google.com/?q=El+Refugio+Queretaro", tag: "Comer", status: "Nuevo"
  },
  {
    id: "aura-spa", name: "Aura Spa", slug: "aura-spa", category: "Bienestar", categories: ["cuidarme", "promociones", "nuevos"], zone: "El Refugio", image: "./assets/aura-spa.jpg", logo: null,
    description: "Masajes, rituales y una pausa para volver a tu centro.", distance: "A 6 min", isOpen: true, isNew: false, isFeatured: true, hasPromotion: true,
    micrositeUrl: "https://aura-spa-a-dos-pasos.booker74.chatgpt.site", whatsappUrl: "https://wa.me/524421234567", mapsUrl: "https://maps.google.com/?q=El+Refugio+Queretaro", tag: "Cuidarme", status: "Abierto ahora"
  },
  {
    id: "barberia-clasica", name: "Barbería Clásica", slug: "barberia-clasica", category: "Barbería", categories: ["cuidarme", "servicios", "promociones"], zone: "El Refugio", image: "./assets/barberia-clasica.png", logo: null,
    description: "Corte, barba y atención cercana con oficio.", distance: "A 3 min", isOpen: true, isNew: false, isFeatured: true, hasPromotion: false,
    micrositeUrl: "https://barberia-clasica-a-dos-pasos.booker74.chatgpt.site", whatsappUrl: "https://wa.me/524421234567", mapsUrl: "https://maps.google.com/?q=El+Refugio+Queretaro", tag: "Servicio", status: "Destacado"
  },
  {
    id: "eleva-steam", name: "Eleva Steam", slug: "eleva-steam", category: "Lavado profesional a domicilio", categories: ["mi-casa", "servicios", "promociones", "nuevos"], zone: "Querétaro", image: "./assets/eleva-steam.jpg", logo: null,
    description: "Lavado profundo para salas, colchones y tapetes.", distance: "Va a tu casa", isOpen: true, isNew: false, isFeatured: true, hasPromotion: false,
    micrositeUrl: "https://eleva-steam-a-dos-pasos.booker74.chatgpt.site", whatsappUrl: "https://wa.me/524422742734", mapsUrl: "https://maps.google.com/?q=Queretaro", tag: "Mi casa", status: "A domicilio"
  }
];

export const intentions = [
  { icon: "◒", title: "Comer", subtitle: "Desayunos, comida y cena", image: "./assets/forno-locale.png" },
  { icon: "◡", title: "Tomar café", subtitle: "Tu próxima pausa favorita", image: "./assets/forno-table.png" },
  { icon: "✦", title: "Cuidarme", subtitle: "Spa, belleza y bienestar", image: "./assets/aura-ritual.jpg" },
  { icon: "⌂", title: "Mi casa", subtitle: "Servicios para tu hogar", image: "./assets/eleva-resultado.jpg" },
  { icon: "⌁", title: "Encontrar un servicio", subtitle: "Expertos de tu zona", image: "./assets/barberia-interior.png" },
  { icon: "%", title: "Promociones", subtitle: "Beneficios locales", image: "./assets/mockup-publicacion.png" },
  { icon: "+", title: "Descubrir algo nuevo", subtitle: "Lugares que no conocías", image: "./assets/mockup-categorias.png" },
  { icon: "↗", title: "Salir este fin", subtitle: "Planes a pocos minutos", image: "./assets/aura-spa.jpg" }
];

export const benefits = [
  { business: "Forno Locale", title: "Bebida de cortesía", validity: "Beneficio de bienvenida", mobileDescription: "En tu primera visita o promoción definida.", meta: "Consulta vigencia", businessId: "forno-locale" },
  { business: "Aura Spa", title: "15 min de aromaterapia sin costo", validity: "Al reservar tratamiento", mobileDescription: "Incluidos al reservar un tratamiento seleccionado.", meta: "Sujeto a disponibilidad", businessId: "aura-spa" },
  { business: "Eleva Steam", title: "Evaluación por WhatsApp", validity: "Envía una fotografía", mobileDescription: "Envía una foto y recibe una evaluación inicial.", meta: "Atención por WhatsApp", businessId: "eleva-steam" },
  { business: "Barbería Clásica", title: "Beneficio para primera visita", validity: "Pregunta al agendar", mobileDescription: "Pregunta por el beneficio disponible al agendar.", meta: "Primera visita", businessId: "barberia-clasica" }
];

export const promotions = [
  { business: "Forno Locale", title: "Martes de pizza", description: "Pregunta por la promoción activa de la semana.", start_date: "2026-09-01", end_date: "2026-12-15", businessId: "forno-locale" }
];

export const zones = ["El Refugio", "Zibatá", "Zakia", "La Pradera", "Juriquilla", "El Campanario"];
