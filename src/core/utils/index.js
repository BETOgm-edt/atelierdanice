/**
 * ATELIER NICE — UTILITY FUNCTIONS & HELPERS
 */

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateDiscount = (originalPrice, promoPrice) => {
  const original = parseFloat(originalPrice) || 0;
  const promo = parseFloat(promoPrice) || 0;

  if (original <= 0 || promo <= 0 || promo >= original) {
    return { hasDiscount: false, percentage: 0, savings: 0 };
  }

  const savings = original - promo;
  const percentage = Math.round((savings / original) * 100);

  return {
    hasDiscount: true,
    percentage,
    savings,
    percentageFormatted: `-${percentage}%`
  };
};

export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const generateSKU = (categoryName = 'GEN', productName = 'PROD') => {
  const catPart = (categoryName || 'ATN')
    .slice(0, 3)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const namePart = (productName || 'PECA')
    .slice(0, 3)
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ATN-${catPart}-${namePart}-${randomSuffix}`;
};

export const calculateTotalStock = (variants = []) => {
  if (!Array.isArray(variants) || variants.length === 0) return 0;
  return variants.reduce((total, variant) => total + (parseInt(variant.stock, 10) || 0), 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * ATELIER NICE — WHATSAPP UTILITIES
 * Enforces official test number: 12991279309 (with Brazil country code 55 -> 5512991279309).
 */
export const getWhatsAppPhone = () => {
  const envPhone = import.meta.env.VITE_WHATSAPP_PHONE || '12991279309';
  const digits = envPhone.toString().replace(/\D/g, '');
  // If user provided without Brazil country code (+55), prepend 55
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits || '5512991279309';
};

export const getWhatsAppDisplayPhone = () => {
  const phone = getWhatsAppPhone();
  // Strip 55 prefix if present for clean Brazilian phone format
  const local = phone.startsWith('55') ? phone.slice(2) : phone;
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return '(12) 99127-9309';
};

export const buildWhatsAppLink = (messageOrConfig) => {
  const phone = getWhatsAppPhone();
  const messageText = typeof messageOrConfig === 'string'
    ? messageOrConfig
    : (messageOrConfig?.customText || messageOrConfig?.text || 'Olá! Gostaria de falar com o Atelier Nice.');
  const text = encodeURIComponent(messageText);
  return `https://wa.me/${phone}?text=${text}`;
};

/**
 * Builds dynamic WhatsApp message with strictly real data.
 * Does NOT invent SKU, price, modality or size if missing.
 */
export const buildProductWhatsAppMessage = ({ name, sku, modality, size, color, price }) => {
  const lines = ['Olá! Gostaria de saber mais sobre este vestido:'];

  if (name) {
    lines.push(`\nVestido: ${name}`);
  }
  if (sku) {
    lines.push(`SKU: ${sku}`);
  }
  if (modality) {
    const modalityMap = {
      buy: 'Compra',
      rent: 'Aluguel',
      both: 'Compra / Aluguel',
      sale: 'Compra'
    };
    lines.push(`Modalidade: ${modalityMap[modality] || modality}`);
  }
  if (size && size !== 'all') {
    lines.push(`Tamanho: ${size}`);
  }
  if (color && color !== 'all') {
    lines.push(`Cor: ${color}`);
  }
  if (price && !isNaN(price) && price > 0) {
    lines.push(`Valor: ${formatCurrency(price)}`);
  }

  lines.push('\nGostaria de verificar a disponibilidade.');

  return lines.join('\n');
};

/**
 * Builds dynamic WhatsApp message for cart consultation.
 */
export const buildCartWhatsAppMessage = (cartItems = []) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return 'Olá! Gostaria de agendar uma consultoria com a estilista no Atelier Nice.';
  }

  const lines = [
    'Olá! Tenho interesse nos seguintes vestidos do Atelier Nice e gostaria de verificar a disponibilidade para prova / atendimento:\n'
  ];

  cartItems.forEach((item, idx) => {
    const name = item.name || 'Vestido';
    const size = item.variant?.size ? ` (Tam: ${item.variant.size})` : '';
    const color = item.variant?.color?.name ? ` [Cor: ${item.variant.color.name}]` : '';
    const modality = item.modality === 'rent' ? ' • Aluguel' : item.modality === 'buy' ? ' • Compra' : '';
    const sku = item.variant?.sku || item.sku ? ` - Ref: ${item.variant?.sku || item.sku}` : '';
    lines.push(`${idx + 1}. ${name}${sku}${size}${color}${modality}`);
  });

  lines.push('\nPor favor, como podemos prosseguir com o agendamento?');
  return lines.join('\n');
};
