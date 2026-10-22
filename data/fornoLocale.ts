export type FornoSection =
  | "hero"
  | "featuredProduct"
  | "menu"
  | "editorialPicks"
  | "craft"
  | "gallery"
  | "benefit"
  | "promotion"
  | "visit"
  | "howToOrder"
  | "finalCTA"
  | "footer";

export type FornoMenuItem = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  price: string;
  image: string | null;
  imageValidated?: boolean;
  whatsappMessage: string;
  cta: string;
  priceValidated: boolean;
};

const asset = (name: string) => `/assets/forno-locale/${name}`;

export const fornoLocale = {
  dataSource: "local" as const,
  name: "Forno Locale",
  slug: "forno-locale",
  category: "Pizzería artesanal",
  zone: "El Refugio",
  locationLabel: "El Refugio · Querétaro",
  shortDescription: "Pizza artesanal, ingredientes honestos y una mesa cerca de casa.",
  hero: {
    image: "/assets/forno-locale.png",
    eyebrow: "Horno encendido · El Refugio"
  },
  platformLogo: "/assets/logo-a-dos-pasos-blanco.png",
  whatsapp: {
    baseReference: "https://wa.me/524421234567",
    phoneReference: "+52 442 123 4567",
    validated: false,
    generalMessage: "Hola, vi Forno Locale en A Dos Pasos y quisiera hacer un pedido."
  },
  featuredProduct: {
    id: "pizza-forno",
    name: "Pizza Forno",
    description: "La favorita de la casa: intensa, equilibrada y recién salida del horno.",
    ingredients: ["Mozzarella", "Pepperoni", "Champiñones", "Aceite de oliva", "Albahaca"],
    price: "$249 MXN",
    priceValidated: false,
    image: asset("pizza-forno.jpg"),
    whatsappMessage: "Hola, vi la Pizza Forno en A Dos Pasos y quisiera pedir una.",
    cta: "Quiero pedirla"
  },
  menu: [
    { id: "margarita", name: "Margarita", description: "Tomate, mozzarella y albahaca fresca.", ingredients: ["Tomate", "Mozzarella", "Albahaca fresca"], price: "$189", image: asset("menu-margarita.jpg"), whatsappMessage: "Hola, quisiera pedir una pizza Margarita.", cta: "Pedir", priceValidated: false },
    { id: "pepperoni", name: "Pepperoni", description: "Mozzarella y pepperoni crujiente.", ingredients: ["Mozzarella", "Pepperoni"], price: "$219", image: asset("menu-pepperoni.jpg"), whatsappMessage: "Hola, quisiera pedir una pizza de Pepperoni.", cta: "Pedir", priceValidated: false },
    { id: "cuatro-quesos", name: "Cuatro quesos", description: "Mozzarella, gorgonzola, parmesano y provolone.", ingredients: ["Mozzarella", "Gorgonzola", "Parmesano", "Provolone"], price: "$239", image: asset("menu-cuatro-quesos.jpg"), whatsappMessage: "Hola, quisiera pedir una pizza Cuatro quesos.", cta: "Pedir", priceValidated: false },
    { id: "prosciutto", name: "Prosciutto", description: "Prosciutto, arúgula y parmesano.", ingredients: ["Prosciutto", "Arúgula", "Parmesano"], price: "$249", image: asset("menu-prosciutto.jpg"), whatsappMessage: "Hola, quisiera pedir una pizza Prosciutto.", cta: "Pedir", priceValidated: false },
    { id: "vegetariana", name: "Vegetariana", description: "Vegetales asados y pesto de la casa.", ingredients: ["Vegetales asados", "Pesto de la casa"], price: "$219", image: asset("menu-vegetariana.jpg"), whatsappMessage: "Hola, quisiera pedir una pizza Vegetariana.", cta: "Pedir", priceValidated: false },
    { id: "pizza-forno", name: "Pizza Forno", description: "Pepperoni, champiñón y albahaca.", ingredients: ["Mozzarella", "Pepperoni", "Champiñón", "Aceite de oliva", "Albahaca"], price: "$249", image: asset("pizza-forno.jpg"), whatsappMessage: "Hola, vi la Pizza Forno en A Dos Pasos y quisiera pedir una.", cta: "Pedir", priceValidated: false },
    { id: "calzone", name: "Calzone", description: "Ricotta, mozzarella, jamón y tomate.", ingredients: ["Ricotta", "Mozzarella", "Jamón", "Tomate"], price: "$229", image: asset("menu-calzone.jpg"), whatsappMessage: "Hola, quisiera pedir un Calzone.", cta: "Pedir", priceValidated: false },
    { id: "tiramisu", name: "Tiramisú", description: "Café, mascarpone y cacao.", ingredients: ["Café", "Mascarpone", "Cacao"], price: "$119", image: null, imageValidated: false, whatsappMessage: "Hola, quisiera agregar un Tiramisú a mi pedido.", cta: "Pedir", priceValidated: false }
  ] satisfies FornoMenuItem[],
  editorialPicks: {
    title: "Si es tu primera vez, empieza por aquí.",
    intro: "Una ruta corta para conocer la casa.",
    recommendations: [
      { id: "pizza-forno", number: "01", name: "Pizza Forno", note: "La especialidad de la casa. Una forma directa de conocer el carácter del forno.", availabilityValidated: false, published: true },
      { id: "burrata", number: "02", name: "Burrata", note: "Referencia editorial anterior pendiente de confirmar.", availabilityValidated: false, published: false },
      { id: "tiramisu", number: "03", name: "Tiramisú", note: "Disponibilidad pendiente de confirmar.", availabilityValidated: false, published: false }
    ]
  },
  craft: {
    eyebrow: "El oficio del forno",
    title: "Tiempo, fuego y buenos ingredientes.",
    description: "Tres ideas documentadas que cuentan cómo se construye la experiencia de Forno Locale.",
    images: [
      { src: asset("forno-craft.jpg"), alt: "Preparación artesanal en Forno Locale" },
      { src: asset("forno-interior.jpg"), alt: "Interior y horno de Forno Locale" }
    ],
    steps: [
      { number: "01", title: "Fermentación lenta", text: "El tiempo también forma parte de la masa." },
      { number: "02", title: "Ingredientes frescos", text: "Una selección sencilla para dejar que cada sabor se reconozca." },
      { number: "03", title: "Horno encendido", text: "El punto de encuentro entre la masa, el calor y la mesa." }
    ]
  },
  gallery: [
    { src: "/assets/forno-locale.png", label: "Producto", position: "76% center" },
    { src: asset("forno-craft.jpg"), label: "Proceso", position: "50% 52%" },
    { src: asset("forno-interior.jpg"), label: "Interior", position: "center" },
    { src: "/assets/forno-table.png", label: "Ambiente", position: "76% 55%" }
  ],
  benefit: {
    id: "bebida-primera-visita",
    title: "Bebida de cortesía",
    description: "En tu primera visita al pedir una pizza grande.",
    terms: "Sujeto a vigencia y disponibilidad.",
    validated: false
  },
  promotion: {
    id: "martes-de-pizza",
    title: "Martes de pizza",
    description: "2 pizzas seleccionadas por $399",
    startDateReferences: ["2026-09-01"],
    endDateReferences: ["2026-11-30", "2026-12-15"],
    includedProductsValidated: false,
    priceValidated: false,
    datesValidated: false,
    validated: false,
    whatsappMessage: "Hola, quiero pedir la promoción Martes de pizza de Forno Locale."
  },
  schedule: {
    validated: false,
    reference: [
      { days: "Lunes", time: "Cerrado" },
      { days: "Martes a jueves", time: "13:00 – 22:00" },
      { days: "Viernes y sábado", time: "13:00 – 23:00" },
      { days: "Domingo", time: "13:00 – 21:00" }
    ]
  },
  location: {
    validated: false,
    label: "El Refugio · Querétaro",
    exactAddressReference: "Av. Paseo del Refugio 186, El Refugio, Querétaro",
    latitudeReference: 20.650715,
    longitudeReference: -100.351524,
    mapsUrlReference: "https://www.google.com/maps/search/?api=1&query=El+Refugio%2C+Quer%C3%A9taro"
  },
  socials: {
    instagram: null,
    facebook: null
  },
  orderModes: [
    { id: "dine-in", label: "Consumo en sitio", validated: false },
    { id: "pickup", label: "Recoger", validated: false },
    { id: "delivery", label: "Entrega a domicilio", validated: false }
  ],
  sectionOrder: ["hero", "featuredProduct", "menu", "editorialPicks", "craft", "gallery", "benefit", "promotion", "visit", "howToOrder", "finalCTA", "footer"] satisfies FornoSection[]
};
