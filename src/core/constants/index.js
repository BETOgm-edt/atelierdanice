/**
 * ATELIER NICE — CORE CONSTANTS & DOMAIN ENUMS
 */

export const PRODUCT_STATUS = {
  PUBLISHED: {
    id: 'published',
    label: 'Publicado',
    color: 'success',
    description: 'Visível no catálogo público e disponível para compra/aluguel.',
    isVisibleInCatalog: true,
    canPurchase: true,
  },
  DRAFT: {
    id: 'draft',
    label: 'Rascunho',
    color: 'warning',
    description: 'Em edição. Não aparece no site público.',
    isVisibleInCatalog: false,
    canPurchase: false,
  },
  HIDDEN: {
    id: 'hidden',
    label: 'Oculto',
    color: 'neutral',
    description: 'Permanece cadastrado mas oculto do catálogo e busca.',
    isVisibleInCatalog: false,
    canPurchase: false,
  },
  ARCHIVED: {
    id: 'archived',
    label: 'Arquivado',
    color: 'danger',
    description: 'Fora de linha. Fica separado da listagem principal.',
    isVisibleInCatalog: false,
    canPurchase: false,
  },
  OUT_OF_STOCK: {
    id: 'out_of_stock',
    label: 'Sem Estoque / Esgotado',
    color: 'danger',
    description: 'Visível na vitrine com selo de esgotado, compras desabilitadas.',
    isVisibleInCatalog: true,
    canPurchase: false,
  },
};

export const PRODUCT_MODALITY = {
  SALE: { id: 'sale', label: 'Somente Venda', badge: 'Venda' },
  RENT: { id: 'rent', label: 'Somente Aluguel', badge: 'Aluguel' },
  BOTH: { id: 'both', label: 'Venda e Aluguel', badge: 'Venda & Aluguel' },
};

export const ORDER_STATUS = {
  PENDING_PAYMENT: { id: 'pending_payment', label: 'Aguardando Pagamento', color: 'warning' },
  PAYMENT_APPROVED: { id: 'payment_approved', label: 'Pagamento Aprovado', color: 'success' },
  IN_PREPARATION: { id: 'in_preparation', label: 'Em Preparação / Ajuste', color: 'info' },
  SHIPPED: { id: 'shipped', label: 'Enviado / Retirada Pronta', color: 'primary' },
  COMPLETED: { id: 'completed', label: 'Concluído', color: 'success' },
  CANCELLED: { id: 'cancelled', label: 'Cancelado', color: 'danger' },
};

export const STANDARD_SIZES = ['PP (36)', 'P (38)', 'M (40)', 'G (42)', 'GG (44)', 'XG (46)', 'Sob Medida'];

export const STANDARD_COLORS = [
  { name: 'Rosé Atelier', hex: '#B67068' },
  { name: 'Nude Blush', hex: '#F3D8CF' },
  { name: 'Marsala Real', hex: '#681D24' },
  { name: 'Champagne Gold', hex: '#E2C799' },
  { name: 'Verde Esmeralda', hex: '#1E4D3B' },
  { name: 'Azul Serenity', hex: '#A3B8CC' },
  { name: 'Off White Seda', hex: '#FAF7F2' },
  { name: 'Preto Imperial', hex: '#1A1818' },
  { name: 'Lavanda Imperial', hex: '#9C8BB4' },
  { name: 'Terracota Suave', hex: '#C27B66' }
];

export const CHARACTERISTICS_OPTIONS = {
  fabrics: ['Zibeline de Seda', 'Crepe Georgette', 'Renda Francesa', 'Tule Bordado com Cristais', 'Cetim Duchese', 'Chiffon Fluido', 'Veludo Alemão', 'Tafetá'],
  lengths: ['Longo Gala', 'Midi Elegante', 'Curto Cocktail', 'Mullet com Cauda', 'Longo com Fenda'],
  necklines: ['Decote V Profundo', 'Ombro a Ombro', 'Tomara que Caia', 'Gola Alta Vitoriana', 'Frente Única', 'Decote Coração', 'Decote Quadrado'],
  sleeves: ['Sem Manga / Alça Fina', 'Manga Longa Transparente', 'Manga Bufante', 'Manga Capa', 'Manga Sino', 'Manga 3/4'],
  silhouettes: ['Evasê Fluido', 'Sereia Ajustado', 'Princesa Romântico', 'Reto Minimalista', 'Império', 'Godê com Volume'],
  occasions: ['Casamento / Madrinha', 'Gala & Black Tie', 'Formatura', 'Noiva / Casamento Civil', 'Debutante / 15 Anos', 'Cocktail & Jantar Especial'],
  styles: ['Alta Costura Clássica', 'Romântico & Delicado', 'Glamour & Brilho', 'Minimalista Contemporâneo', 'Boho Chic Nobre']
};
