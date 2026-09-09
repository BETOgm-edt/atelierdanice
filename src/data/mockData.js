/**
 * ATELIER NICE — INITIAL SEED DATA
 * Curated luxury gowns, categories, orders, customers, and store configuration.
 */

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-festa-gala',
    name: 'Vestidos de Festa & Gala',
    slug: 'festa-e-gala',
    description: 'Criações exclusivas para eventos de gala, bailes oficiais e noites inesquecíveis com tecidos nobres e caimento impecável.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 1,
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'cat-madrinhas',
    name: 'Madrinhas de Casamento',
    slug: 'madrinhas',
    description: 'Paletas coordenadas em tons sofisticados como Rosé, Marsala e Champagne, pensadas para valorizar o altar.',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 2,
    createdAt: '2026-01-11T10:00:00.000Z'
  },
  {
    id: 'cat-noivas-civil',
    name: 'Noivas & Casamento Civil',
    slug: 'noivas-e-civil',
    description: 'Peças em crepe estruturado, rendas francesas e seda para cerimônias civis intimistas e noivas modernas.',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 3,
    createdAt: '2026-01-12T10:00:00.000Z'
  },
  {
    id: 'cat-formatura',
    name: 'Formatura & Bailes',
    slug: 'formatura',
    description: 'Vestidos impactantes com fendas estruturadas, decotes elegantes e bordados pontuais para celebrar sua conquista.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 4,
    createdAt: '2026-01-13T10:00:00.000Z'
  },
  {
    id: 'cat-debutantes',
    name: 'Debutantes & 15 Anos',
    slug: 'debutantes',
    description: 'O conto de fadas traduzido em alta costura: tules bordados, corpetes delicados e saias fluidas.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 5,
    createdAt: '2026-01-14T10:00:00.000Z'
  },
  {
    id: 'cat-minimalista',
    name: 'Minimalista & Cocktail',
    slug: 'minimalista-cocktail',
    description: 'Linhas puras, alfaiataria fina feminina e cetins nobres para jantares especiais e celebrações contemporâneas.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 6,
    createdAt: '2026-01-15T10:00:00.000Z'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-aurora-rose',
    name: 'Vestido Aurora em Zibeline Rosé',
    slug: 'vestido-aurora-em-zibeline-rose',
    sku: 'ATN-FES-AUR-1001',
    categoryId: 'cat-festa-gala',
    categoryName: 'Vestidos de Festa & Gala',
    shortDescription: 'Alta costura em Zibeline nobre com decote ombro a ombro estruturado e saia evasê com fenda discreta.',
    description: 'O Vestido Aurora traduz a essência da mulher Atelier Nice: romântica, imponente e sofisticada. Confeccionado em Zibeline de Seda pura na cor Rosé Exclusiva da marca (#B67068), a peça conta com corpete entretelado com barbatanas para sustentação impecável, decote ombro a ombro escultural e saia evasê fluida com forro em cetim toque de pluma.',
    images: [
      {
        id: 'img-aur-1',
        url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Aurora Zibeline Rosé Frente Editorial',
        isPrimary: true,
        order: 0
      },
      {
        id: 'img-aur-2',
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Aurora Detalhe Corpete e Caimento',
        isPrimary: false,
        order: 1
      },
      {
        id: 'img-aur-3',
        url: '/assets/editorial-dress.jpeg',
        alt: 'Vestido Aurora Prova Atelier',
        isPrimary: false,
        order: 2
      }
    ],
    price: 3490.00,
    promotionalPrice: 2990.00,
    rentalPrice: 1190.00,
    costPrice: 1100.00,
    modality: 'both', // 'sale' | 'rent' | 'both'
    stock: 7,
    minStockAlert: 2,
    variants: [
      {
        id: 'var-aur-1',
        sku: 'ATN-AUR-ROS-PP',
        size: 'PP (36)',
        color: { name: 'Rosé Atelier', hex: '#B67068' },
        stock: 2,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-aur-2',
        sku: 'ATN-AUR-ROS-P',
        size: 'P (38)',
        color: { name: 'Rosé Atelier', hex: '#B67068' },
        stock: 2,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-aur-3',
        sku: 'ATN-AUR-ROS-M',
        size: 'M (40)',
        color: { name: 'Rosé Atelier', hex: '#B67068' },
        stock: 2,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-aur-4',
        sku: 'ATN-AUR-ROS-G',
        size: 'G (42)',
        color: { name: 'Rosé Atelier', hex: '#B67068' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      }
    ],
    characteristics: {
      fabric: 'Zibeline de Seda',
      length: 'Longo Gala',
      neckline: 'Ombro a Ombro',
      sleeve: 'Sem Manga / Alça Fina',
      silhouette: 'Evasê Fluido',
      occasion: 'Gala & Black Tie',
      style: 'Alta Costura Clássica'
    },
    tags: ['Zibeline', 'Rosé', 'Gala', 'Madrinha', 'Exclusivo', 'Ombro a Ombro'],
    status: 'published',
    featured: true,
    createdAt: '2026-01-20T14:30:00.000Z',
    updatedAt: '2026-02-15T18:00:00.000Z',
    seo: {
      title: 'Vestido Aurora em Zibeline Rosé | Atelier Nice Alta Costura',
      description: 'Vestido longo de gala em Zibeline de Seda Rosé com decote ombro a ombro estruturado. Conheça para compra ou aluguel no Atelier Nice.',
      keywords: 'vestido festa rose, vestido zibeline, vestido gala ombro a ombro, atelier nice',
      slug: 'vestido-aurora-em-zibeline-rose',
      ogImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'prod-celeste-marsala',
    name: 'Vestido Celeste Plissado Marsala',
    slug: 'vestido-celeste-plissado-marsala',
    sku: 'ATN-MAD-CEL-1002',
    categoryId: 'cat-madrinhas',
    categoryName: 'Madrinhas de Casamento',
    shortDescription: 'Fluidez em Chiffon de Seda com corpo plissado artesanalmente e decote V profundo com tule ilusion.',
    description: 'O modelo Celeste foi criado especialmente para madrinhas e mães de noivos que buscam imponência sem abrir mão do conforto. Seu plissado soleil manual confere movimento etéreo ao caminhar, enquanto a cintura marcada por faixa de microdrapeados valoriza a silhueta com extrema elegância.',
    images: [
      {
        id: 'img-cel-1',
        url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Celeste Plissado Marsala',
        isPrimary: true,
        order: 0
      },
      {
        id: 'img-cel-2',
        url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Celeste Detalhes Plissado',
        isPrimary: false,
        order: 1
      }
    ],
    price: 2890.00,
    promotionalPrice: null,
    rentalPrice: 950.00,
    costPrice: 850.00,
    modality: 'both',
    stock: 5,
    minStockAlert: 2,
    variants: [
      {
        id: 'var-cel-1',
        sku: 'ATN-CEL-MAR-P',
        size: 'P (38)',
        color: { name: 'Marsala Real', hex: '#681D24' },
        stock: 2,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-cel-2',
        sku: 'ATN-CEL-MAR-M',
        size: 'M (40)',
        color: { name: 'Marsala Real', hex: '#681D24' },
        stock: 2,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-cel-3',
        sku: 'ATN-CEL-MAR-G',
        size: 'G (42)',
        color: { name: 'Marsala Real', hex: '#681D24' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      }
    ],
    characteristics: {
      fabric: 'Chiffon Fluido',
      length: 'Longo Gala',
      neckline: 'Decote V Profundo',
      sleeve: 'Sem Manga / Alça Fina',
      silhouette: 'Evasê Fluido',
      occasion: 'Casamento / Madrinha',
      style: 'Romântico & Delicado'
    },
    tags: ['Madrinha', 'Marsala', 'Plissado', 'Chiffon', 'Casamento'],
    status: 'published',
    featured: true,
    createdAt: '2026-01-22T11:00:00.000Z',
    updatedAt: '2026-02-18T10:00:00.000Z',
    seo: {
      title: 'Vestido Celeste Plissado Marsala | Madrinhas Atelier Nice',
      description: 'Vestido de festa longo plissado em Chiffon Marsala. Ideal para madrinhas de casamento sofisticadas.',
      keywords: 'vestido madrinha marsala, vestido plissado longo, casamento noite',
      slug: 'vestido-celeste-plissado-marsala',
      ogImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'prod-helena-civil',
    name: 'Vestido Helena em Crepe Paris Off-White',
    slug: 'vestido-helena-em-crepe-paris-off-white',
    sku: 'ATN-NOI-HEL-1003',
    categoryId: 'cat-noivas-civil',
    categoryName: 'Noivas & Casamento Civil',
    shortDescription: 'Design minimalista escultural com capa embutida nos ombros e fenda frontal fluida.',
    description: 'O Vestido Helena é a definição do luxo contemporâneo para noivas civis e celebrações intimistas. Confeccionado em Crepe Paris encorpado com elastano premium, possui decote canoa refinado, capa fluida estruturada que substitui o véu com extrema elegância e botões forrados nas costas.',
    images: [
      {
        id: 'img-hel-1',
        url: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Helena Noiva Civil Off-White',
        isPrimary: true,
        order: 0
      },
      {
        id: 'img-hel-2',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Helena Costas e Capa',
        isPrimary: false,
        order: 1
      }
    ],
    price: 3890.00,
    promotionalPrice: 3450.00,
    rentalPrice: 1450.00,
    costPrice: 1300.00,
    modality: 'both',
    stock: 4,
    minStockAlert: 1,
    variants: [
      {
        id: 'var-hel-1',
        sku: 'ATN-HEL-OFF-PP',
        size: 'PP (36)',
        color: { name: 'Off White Seda', hex: '#FAF7F2' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-hel-2',
        sku: 'ATN-HEL-OFF-P',
        size: 'P (38)',
        color: { name: 'Off White Seda', hex: '#FAF7F2' },
        stock: 2,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-hel-3',
        sku: 'ATN-HEL-OFF-M',
        size: 'M (40)',
        color: { name: 'Off White Seda', hex: '#FAF7F2' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      }
    ],
    characteristics: {
      fabric: 'Crepe Georgette',
      length: 'Longo com Fenda',
      neckline: 'Gola Alta Vitoriana',
      sleeve: 'Manga Capa',
      silhouette: 'Reto Minimalista',
      occasion: 'Noiva / Casamento Civil',
      style: 'Minimalista Contemporâneo'
    },
    tags: ['Noiva', 'Casamento Civil', 'Off White', 'Crepe', 'Capa', 'Minimalista'],
    status: 'published',
    featured: true,
    createdAt: '2026-01-25T16:00:00.000Z',
    updatedAt: '2026-02-20T09:30:00.000Z',
    seo: {
      title: 'Vestido Helena Casamento Civil Off-White | Atelier Nice',
      description: 'Vestido de noiva para casamento civil em crepe nobre com capa embutida. Sofisticação e alta costura.',
      keywords: 'vestido noiva civil, casamento civil off white, vestido com capa',
      slug: 'vestido-helena-em-crepe-paris-off-white',
      ogImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'prod-isadora-emerald',
    name: 'Vestido Isadora Sereia em Veludo Esmeralda',
    slug: 'vestido-isadora-sereia-em-veludo-esmeralda',
    sku: 'ATN-FOR-ISA-1004',
    categoryId: 'cat-formatura',
    categoryName: 'Formatura & Bailes',
    shortDescription: 'Corte sereia impecável em Veludo Alemão com fenda lateral dramática e alças finas bordadas.',
    description: 'Desenhado para quem deseja brilhar com autoridade e sensualidade discreta. O Vestido Isadora molda as curvas com perfeição milimétrica graças à estrutura interna em corselet e tecido com brilho suave acetinado nobre.',
    images: [
      {
        id: 'img-isa-1',
        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Isadora Veludo Esmeralda',
        isPrimary: true,
        order: 0
      }
    ],
    price: 3190.00,
    promotionalPrice: null,
    rentalPrice: 1090.00,
    costPrice: 950.00,
    modality: 'both',
    stock: 3,
    minStockAlert: 1,
    variants: [
      {
        id: 'var-isa-1',
        sku: 'ATN-ISA-ESM-P',
        size: 'P (38)',
        color: { name: 'Verde Esmeralda', hex: '#1E4D3B' },
        stock: 2,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-isa-2',
        sku: 'ATN-ISA-ESM-M',
        size: 'M (40)',
        color: { name: 'Verde Esmeralda', hex: '#1E4D3B' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      }
    ],
    characteristics: {
      fabric: 'Veludo Alemão',
      length: 'Longo com Fenda',
      neckline: 'Decote Coração',
      sleeve: 'Sem Manga / Alça Fina',
      silhouette: 'Sereia Ajustado',
      occasion: 'Formatura',
      style: 'Glamour & Brilho'
    },
    tags: ['Formatura', 'Esmeralda', 'Veludo', 'Sereia', 'Festa'],
    status: 'published',
    featured: false,
    createdAt: '2026-02-01T15:00:00.000Z',
    updatedAt: '2026-02-21T14:00:00.000Z',
    seo: {
      title: 'Vestido Isadora Sereia Veludo Esmeralda | Atelier Nice',
      description: 'Vestido de formatura corte sereia em Veludo Alemão Esmeralda. Alta costura para sua grande noite.',
      keywords: 'vestido formatura esmeralda, vestido sereia veludo, baile de gala',
      slug: 'vestido-isadora-sereia-em-veludo-esmeralda',
      ogImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'prod-valentina-debut',
    name: 'Vestido Valentina Princesa em Tule Bordado',
    slug: 'vestido-valentina-princesa-em-tule-bordado',
    sku: 'ATN-DEB-VAL-1005',
    categoryId: 'cat-debutantes',
    categoryName: 'Debutantes & 15 Anos',
    shortDescription: 'O clássico vestido de debutante com corpete cravejado de cristais Swarovski e saia com camadas de tule francês.',
    description: 'Um verdadeiro sonho de alta costura. O modelo Valentina une a doçura do tom Nude Blush (#F3D8CF) ao brilho inigualável de cristais aplicados manualmente ponto a ponto.',
    images: [
      {
        id: 'img-val-1',
        url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Valentina Debutante Tule',
        isPrimary: true,
        order: 0
      }
    ],
    price: 4690.00,
    promotionalPrice: 3990.00,
    rentalPrice: 1750.00,
    costPrice: 1600.00,
    modality: 'rent', // Only Rent to demonstrate modality filter
    stock: 2,
    minStockAlert: 1,
    variants: [
      {
        id: 'var-val-1',
        sku: 'ATN-VAL-BLU-PP',
        size: 'PP (36)',
        color: { name: 'Nude Blush', hex: '#F3D8CF' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      },
      {
        id: 'var-val-2',
        sku: 'ATN-VAL-BLU-P',
        size: 'P (38)',
        color: { name: 'Nude Blush', hex: '#F3D8CF' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      }
    ],
    characteristics: {
      fabric: 'Tule Bordado com Cristais',
      length: 'Longo Gala',
      neckline: 'Decote Coração',
      sleeve: 'Sem Manga / Alça Fina',
      silhouette: 'Princesa Romântico',
      occasion: 'Debutante / 15 Anos',
      style: 'Glamour & Brilho'
    },
    tags: ['Debutante', '15 Anos', 'Princesa', 'Tule', 'Cristais'],
    status: 'published',
    featured: false,
    createdAt: '2026-02-05T12:00:00.000Z',
    updatedAt: '2026-02-22T17:00:00.000Z',
    seo: {
      title: 'Vestido Valentina Princesa Debutante | Atelier Nice',
      description: 'Vestido de 15 anos dos sonhos com saia princesa em tule e cristais bordados.',
      keywords: 'vestido debutante 15 anos, vestido princesa tule, aluguel vestido 15 anos',
      slug: 'vestido-valentina-princesa-em-tule-bordado',
      ogImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    id: 'prod-rascunho-demo',
    name: 'Vestido Gaia em Seda Pura Champanhe (Protótipo em Rascunho)',
    slug: 'vestido-gaia-em-seda-pura-champanhe',
    sku: 'ATN-FES-GAI-9999',
    categoryId: 'cat-festa-gala',
    categoryName: 'Vestidos de Festa & Gala',
    shortDescription: 'Peça piloto da nova coleção cápsula de verão ainda em confecção no Atelier.',
    description: 'Rascunho de ficha técnica para validação de tecidos e modelagem. Não deve aparecer no catálogo público até a publicação oficial.',
    images: [
      {
        id: 'img-gai-1',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
        alt: 'Vestido Gaia Protótipo',
        isPrimary: true,
        order: 0
      }
    ],
    price: 3200.00,
    promotionalPrice: null,
    rentalPrice: 1100.00,
    costPrice: 900.00,
    modality: 'both',
    stock: 1,
    minStockAlert: 1,
    variants: [
      {
        id: 'var-gai-1',
        sku: 'ATN-GAI-CHA-M',
        size: 'M (40)',
        color: { name: 'Champagne Gold', hex: '#E2C799' },
        stock: 1,
        priceAdjustment: 0,
        available: true
      }
    ],
    characteristics: {
      fabric: 'Cetim Duchese',
      length: 'Longo Gala',
      neckline: 'Decote Quadrado',
      sleeve: 'Manga Bufante',
      silhouette: 'Evasê Fluido',
      occasion: 'Gala & Black Tie',
      style: 'Minimalista Contemporâneo'
    },
    tags: ['Rascunho', 'Piloto', 'Seda'],
    status: 'draft', // Testing status behavior
    featured: false,
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-02-28T10:00:00.000Z',
    seo: {
      title: 'Vestido Gaia em Seda | Atelier Nice',
      description: 'Vestido piloto em seda pura.',
      keywords: 'vestido seda',
      slug: 'vestido-gaia-em-seda-pura-champanhe'
    }
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-10024',
    orderNumber: '#ATN-10024',
    customer: {
      name: 'Mariana Drummond Silveira',
      email: 'mariana.drummond@example.com',
      phone: '(11) 98765-4321',
      document: '123.456.789-00'
    },
    items: [
      {
        productId: 'prod-aurora-rose',
        variantId: 'var-aur-2',
        name: 'Vestido Aurora em Zibeline Rosé',
        sku: 'ATN-AUR-ROS-P',
        size: 'P (38)',
        color: 'Rosé Atelier',
        modality: 'buy',
        price: 2990.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80'
      }
    ],
    status: 'in_preparation',
    subtotal: 2990.00,
    discount: 0,
    shipping: 0, // Retirada no Atelier
    total: 2990.00,
    shippingMethod: 'Retirada e Prova Presencial no Atelier Nice',
    paymentMethod: 'PIX Direto (Sinal 50% + 50% na Prova)',
    notes: 'Cliente solicitou ajuste de bainha para salto 10cm no dia da prova.',
    createdAt: '2026-02-24T14:20:00.000Z',
    updatedAt: '2026-02-25T09:00:00.000Z'
  },
  {
    id: 'ord-10023',
    orderNumber: '#ATN-10023',
    customer: {
      name: 'Beatriz Albuquerque',
      email: 'beatriz.albuquerque@example.com',
      phone: '(21) 99123-8877',
      document: '234.567.890-11'
    },
    items: [
      {
        productId: 'prod-celeste-marsala',
        variantId: 'var-cel-2',
        name: 'Vestido Celeste Plissado Marsala',
        sku: 'ATN-CEL-MAR-M',
        size: 'M (40)',
        color: 'Marsala Real',
        modality: 'rent',
        price: 950.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80'
      }
    ],
    status: 'payment_approved',
    subtotal: 950.00,
    discount: 50.00,
    shipping: 45.00,
    total: 945.00,
    shippingMethod: 'Sedex Especial Moda Festa com Seguro',
    paymentMethod: 'Cartão de Crédito (3x sem juros)',
    notes: 'Evento no dia 15/04. Devolução agendada para 17/04.',
    createdAt: '2026-02-22T19:40:00.000Z',
    updatedAt: '2026-02-23T08:15:00.000Z'
  },
  {
    id: 'ord-10022',
    orderNumber: '#ATN-10022',
    customer: {
      name: 'Camila Vasconcelos',
      email: 'camila.vasconcelos@example.com',
      phone: '(31) 99888-2233',
      document: '345.678.901-22'
    },
    items: [
      {
        productId: 'prod-helena-civil',
        variantId: 'var-hel-2',
        name: 'Vestido Helena em Crepe Paris Off-White',
        sku: 'ATN-HEL-OFF-P',
        size: 'P (38)',
        color: 'Off White Seda',
        modality: 'buy',
        price: 3450.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80'
      }
    ],
    status: 'completed',
    subtotal: 3450.00,
    discount: 0,
    shipping: 0,
    total: 3450.00,
    shippingMethod: 'Retirada no Atelier com Champanhe',
    paymentMethod: 'PIX à Vista com 5% de desconto',
    notes: 'Noiva satisfeita. Enviar cartão de felicitações.',
    createdAt: '2026-02-15T11:10:00.000Z',
    updatedAt: '2026-02-20T17:30:00.000Z'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Mariana Drummond Silveira',
    email: 'mariana.drummond@example.com',
    phone: '(11) 98765-4321',
    ordersCount: 2,
    totalSpent: 4840.00,
    city: 'São Paulo',
    state: 'SP',
    createdAt: '2025-11-10T10:00:00.000Z'
  },
  {
    id: 'cust-2',
    name: 'Beatriz Albuquerque',
    email: 'beatriz.albuquerque@example.com',
    phone: '(21) 99123-8877',
    ordersCount: 1,
    totalSpent: 945.00,
    city: 'Rio de Janeiro',
    state: 'RJ',
    createdAt: '2026-01-05T14:00:00.000Z'
  },
  {
    id: 'cust-3',
    name: 'Camila Vasconcelos',
    email: 'camila.vasconcelos@example.com',
    phone: '(31) 99888-2233',
    ordersCount: 1,
    totalSpent: 3450.00,
    city: 'Belo Horizonte',
    state: 'MG',
    createdAt: '2026-01-18T16:00:00.000Z'
  },
  {
    id: 'cust-4',
    name: 'Fernanda Castanheira',
    email: 'fernanda.castanheira@example.com',
    phone: '(41) 99777-6655',
    ordersCount: 3,
    totalSpent: 7200.00,
    city: 'Curitiba',
    state: 'PR',
    createdAt: '2025-08-12T09:00:00.000Z'
  }
];

export const INITIAL_STORE_SETTINGS = {
  store: {
    name: 'Atelier Nice',
    slogan: 'Alta Costura, Vestidos de Festa & Noivas Sob Medida',
    description: 'Espaço exclusivo dedicado à confecção artesanal e locação de alta costura feminina, com peças autorais pensadas para valorizar a elegância em seus momentos mais memoráveis.',
    phone: '(11) 3456-7890',
    whatsapp: '5511999998888',
    whatsappDefaultMessage: 'Olá! Gostaria de falar com uma consultora do Atelier Nice sobre disponibilidade e prova de vestidos.',
    instagram: '@ateliernice',
    email: 'contato@ateliernice.com.br',
    address: 'Alameda das Magnólias, 480 — Jardins, São Paulo - SP',
    businessHours: 'Segunda a Sexta: 09h às 19h | Sábados: 09h às 16h (Atendimento com hora marcada)',
    logoUrl: '/Atelier Nice.svg'
  },
  sales: {
    saleEnabled: true,
    rentalEnabled: true,
    minOrderValue: 200.00,
    allowCustomTailoring: true,
    rentalDepositPercentage: 30, // 30% caução
    freeShippingThreshold: 2000.00
  },
  seo: {
    siteTitle: 'Atelier Nice | Alta Costura, Vestidos de Festa e Noivas',
    metaDescription: 'Vestidos de festa, gala, debutantes, noivas e madrinhas de alta costura. Compre ou alugue modelos exclusivos com caimento perfeito no Atelier Nice.',
    keywords: 'atelier nice, vestidos de festa, vestidos de gala, vestidos de noiva civil, alta costura sp, aluguel de vestidos de festa'
  }
};

export const INITIAL_BANNERS = [
  {
    id: 'banner-hero-1',
    title: 'A Nobreza da Alta Costura Feminina',
    subtitle: 'COLEÇÃO GALA & NOIVAS 2026',
    description: 'Criações exclusivas em Zibeline, seda pura e rendas francesas. Peças autorais desenhadas para vestir sua essência nos momentos mais inesquecíveis.',
    ctaPrimaryText: 'Ver Coleção Completa',
    ctaPrimaryLink: '/produtos',
    ctaSecondaryText: 'Agendar Prova no Atelier',
    ctaSecondaryLink: '/sobre',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=90',
    active: true,
    order: 1
  }
];
