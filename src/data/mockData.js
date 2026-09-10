/**
 * ATELIER NICE — OFFICIAL SEED CONFIGURATION & NEUTRAL STRUCTURE
 * Strict Rule: NADA FICTÍCIO NO SITE.
 * No mock dresses, no fake reviews, no fake customer orders, no Unsplash URLs.
 */

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-festa-gala',
    name: 'Vestidos de Festa & Gala',
    slug: 'festa-e-gala',
    description: 'Criações exclusivas para eventos de gala, bailes oficiais e noites inesquecíveis.',
    image: '',
    active: true,
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-madrinhas',
    name: 'Madrinhas de Casamento',
    slug: 'madrinhas',
    description: 'Paletas coordenadas pensadas para valorizar o altar com sofisticação.',
    image: '',
    active: true,
    order: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-noivas-civil',
    name: 'Noivas & Casamento Civil',
    slug: 'noivas-e-civil',
    description: 'Modelos refinados para cerimônias civis intimistas e noivas contemporâneas.',
    image: '',
    active: true,
    order: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-formatura',
    name: 'Formatura & Bailes',
    slug: 'formatura',
    description: 'Vestidos de alto impacto para celebrar sua conquista.',
    image: '',
    active: true,
    order: 4,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cat-debutantes',
    name: 'Debutantes & 15 Anos',
    slug: 'debutantes',
    description: 'Alta costura para celebrações inesquecíveis de 15 anos.',
    image: '',
    active: true,
    order: 5,
    createdAt: new Date().toISOString()
  }
];

// No fake products. Public catalog shows only published items from Supabase.
export const INITIAL_PRODUCTS = [];

// No fake orders.
export const INITIAL_ORDERS = [];

// No fake customers.
export const INITIAL_CUSTOMERS = [];

export const INITIAL_STORE_SETTINGS = {
  store: {
    name: 'Atelier Nice',
    slogan: 'Alta Costura, Vestidos de Festa & Sob Medida',
    description: 'Atelier autoral dedicado à confecção sob medida, ajustes finos e locação exclusiva de vestidos de festa, gala e noivas.',
    phone: '(12) 99127-9309',
    whatsapp: '12991279309',
    whatsappDefaultMessage: 'Olá! Gostaria de falar com uma consultora do Atelier Nice sobre vestidos.',
    instagram: '@ateliernice',
    email: '',
    address: 'Atendimento presencial com agendamento prévio',
    businessHours: 'Segunda a Sábado — com agendamento',
    logoUrl: '/Atelier Nice.svg'
  },
  sales: {
    saleEnabled: true,
    rentalEnabled: true,
    minOrderValue: 0,
    allowCustomTailoring: true,
    rentalDepositPercentage: 0,
    freeShippingThreshold: 0
  },
  seo: {
    siteTitle: 'Atelier Nice | Alta Costura e Vestidos Sob Medida',
    metaDescription: 'Vestidos de festa, gala, debutantes e madrinhas de alta costura com caimento sob medida no Atelier Nice.',
    keywords: 'atelier nice, vestidos de festa, vestidos de gala, alta costura, sob medida'
  }
};

export const INITIAL_BANNERS = [
  {
    id: 'banner-hero-1',
    title: 'A Nobreza da Alta Costura Feminina',
    subtitle: 'COLEÇÃO ATELIER NICE',
    description: 'Criações exclusivas em tecidos nobres e acabamento impecável. Peças autorais desenhadas para vestir sua essência nos momentos mais inesquecíveis.',
    ctaPrimaryText: 'Ver Catálogo',
    ctaPrimaryLink: '/produtos',
    ctaSecondaryText: 'Conheça o Atelier',
    ctaSecondaryLink: '/sobre',
    imageUrl: '',
    active: true,
    order: 1
  }
];
