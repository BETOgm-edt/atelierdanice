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
