/**
 * ATELIER NICE — PRODUCT REPOSITORY
 * Clean data abstraction for Products with variations, status lifecycle, and filters.
 */

import { storageAdapter } from './storageAdapter';
import { INITIAL_PRODUCTS } from './mockData';
import { generateSKU, generateSlug, calculateTotalStock } from '../core/utils';

const STORAGE_KEY = 'atelier_nice_products';

class ProductRepository {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    const existing = storageAdapter.getItem(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storageAdapter.setItem(STORAGE_KEY, INITIAL_PRODUCTS);
    }
  }

  async getAll(filter = {}) {
    this.ensureInitialized();
    let products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);

    // Filter by Catalog Mode (Public vs Admin)
    if (filter.onlyCatalog) {
      // In public catalog: only published items or out-of-stock items (with badge)
      products = products.filter(p => p.status === 'published' || p.status === 'out_of_stock');
    } else if (filter.status && filter.status !== 'all') {
      products = products.filter(p => p.status === filter.status);
    }

    // Filter by Category
    if (filter.categoryId && filter.categoryId !== 'all') {
      products = products.filter(p => p.categoryId === filter.categoryId);
    }

    // Filter by Modality ('sale', 'rent', 'both')
    if (filter.modality && filter.modality !== 'all') {
      if (filter.modality === 'sale') {
        products = products.filter(p => p.modality === 'sale' || p.modality === 'both');
      } else if (filter.modality === 'rent') {
        products = products.filter(p => p.modality === 'rent' || p.modality === 'both');
      }
    }

    // Filter by Size (variant)
    if (filter.size && filter.size !== 'all') {
      products = products.filter(p =>
        Array.isArray(p.variants) && p.variants.some(v => v.size === filter.size && (v.stock > 0 || !filter.onlyInStock))
      );
    }

    // Filter by Color (variant)
    if (filter.color && filter.color !== 'all') {
      products = products.filter(p =>
        Array.isArray(p.variants) && p.variants.some(v => v.color?.name === filter.color)
      );
    }

    // Filter by Price Range
    if (filter.minPrice !== undefined && filter.minPrice !== null && !isNaN(filter.minPrice)) {
      products = products.filter(p => {
        const effectivePrice = p.promotionalPrice || p.price;
        return effectivePrice >= parseFloat(filter.minPrice);
      });
    }

    if (filter.maxPrice !== undefined && filter.maxPrice !== null && !isNaN(filter.maxPrice)) {
      products = products.filter(p => {
        const effectivePrice = p.promotionalPrice || p.price;
        return effectivePrice <= parseFloat(filter.maxPrice);
      });
    }

    // Filter by Featured
    if (filter.featured === true) {
      products = products.filter(p => p.featured === true);
    }

    // Textual Search (by Name, SKU, Tag, Category)
    if (filter.search && filter.search.trim() !== '') {
      const term = filter.search.trim().toLowerCase();
      products = products.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(term);
        const skuMatch = p.sku?.toLowerCase().includes(term);
        const catMatch = p.categoryName?.toLowerCase().includes(term);
        const tagMatch = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(term));
        const descMatch = p.shortDescription?.toLowerCase().includes(term);
        return nameMatch || skuMatch || catMatch || tagMatch || descMatch;
      });
    }

    // Sorting
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price-asc':
          products.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
          break;
        case 'price-desc':
          products.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
          break;
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
          break;
        case 'name-desc':
          products.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
          break;
        case 'newest':
        default:
          products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
      }
    } else {
      // Default: Newest first
      products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return JSON.parse(JSON.stringify(products));
  }

  async getById(id) {
    this.ensureInitialized();
    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);
    const product = products.find(p => p.id === id);
    return product ? JSON.parse(JSON.stringify(product)) : null;
  }

  async getBySlug(slug) {
    this.ensureInitialized();
    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);
    const product = products.find(p => p.slug === slug || p.seo?.slug === slug);
    return product ? JSON.parse(JSON.stringify(product)) : null;
  }

  async create(productData) {
    this.ensureInitialized();
    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);

    const now = new Date().toISOString();
    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const slug = generateSlug(productData.name || 'novo-vestido');
    const sku = productData.sku?.trim() || generateSKU(productData.categoryName, productData.name);

    // Calculate total stock from variants or fallback
    const stock = calculateTotalStock(productData.variants) || parseInt(productData.stock, 10) || 0;

    // Build structured product object
    const newProduct = {
      id,
      name: productData.name?.trim() || 'Vestido Sem Título',
      slug,
      sku,
      categoryId: productData.categoryId || 'cat-festa-gala',
      categoryName: productData.categoryName || 'Vestidos de Festa & Gala',
      shortDescription: productData.shortDescription?.trim() || '',
      description: productData.description?.trim() || '',
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : [
            {
              id: `img-${Date.now()}`,
              url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
              alt: productData.name || 'Vestido Atelier Nice',
              isPrimary: true,
              order: 0
            }
          ],
      price: parseFloat(productData.price) || 0,
      promotionalPrice: productData.promotionalPrice ? parseFloat(productData.promotionalPrice) : null,
      rentalPrice: productData.rentalPrice ? parseFloat(productData.rentalPrice) : null,
      costPrice: productData.costPrice ? parseFloat(productData.costPrice) : null,
      modality: productData.modality || 'both',
      stock,
      minStockAlert: parseInt(productData.minStockAlert, 10) || 1,
      variants: Array.isArray(productData.variants) ? productData.variants : [],
      characteristics: productData.characteristics || {},
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      status: productData.status || 'draft',
      featured: Boolean(productData.featured),
      createdAt: now,
      updatedAt: now,
      seo: {
        title: productData.seo?.title || `${productData.name} | Atelier Nice`,
        description: productData.seo?.description || productData.shortDescription || '',
        keywords: productData.seo?.keywords || '',
        slug: productData.seo?.slug || slug,
        ogImage: productData.images?.[0]?.url || ''
      }
    };

    products.unshift(newProduct);
    storageAdapter.setItem(STORAGE_KEY, products);
    return JSON.parse(JSON.stringify(newProduct));
  }

  async update(id, updates) {
    this.ensureInitialized();
    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`Produto com ID "${id}" não encontrado.`);
    }

    const current = products[index];
    const updatedVariants = updates.variants !== undefined ? updates.variants : current.variants;
    const stock = calculateTotalStock(updatedVariants);

    const updatedProduct = {
      ...current,
      ...updates,
      id: current.id, // Preserve ID
      stock: stock > 0 ? stock : (updates.stock !== undefined ? updates.stock : current.stock),
      variants: updatedVariants,
      updatedAt: new Date().toISOString()
    };

    // Auto update slug if name changed and custom slug wasn't provided
    if (updates.name && (!updates.slug || updates.slug === current.slug)) {
      updatedProduct.slug = generateSlug(updates.name);
    }

    products[index] = updatedProduct;
    storageAdapter.setItem(STORAGE_KEY, products);
    return JSON.parse(JSON.stringify(updatedProduct));
  }

  async delete(id) {
    this.ensureInitialized();
    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);
    const filtered = products.filter(p => p.id !== id);
    storageAdapter.setItem(STORAGE_KEY, filtered);
    return true;
  }

  async duplicate(id) {
    this.ensureInitialized();
    const original = await this.getById(id);
    if (!original) throw new Error('Produto para duplicação não encontrado.');

    const now = new Date().toISOString();
    const copySuffix = Math.floor(100 + Math.random() * 900);
    const newId = `prod-${Date.now()}-${copySuffix}`;
    const newName = `${original.name} (Cópia)`;
    const newSlug = generateSlug(newName) + `-${copySuffix}`;
    const newSKU = `${original.sku}-COPY-${copySuffix}`;

    // Deep clone variants with new SKUs
    const clonedVariants = Array.isArray(original.variants)
      ? original.variants.map((v, i) => ({
          ...v,
          id: `var-${Date.now()}-${i}`,
          sku: `${v.sku || 'SKU'}-CP-${i}`
        }))
      : [];

    const clonedProduct = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      name: newName,
      slug: newSlug,
      sku: newSKU,
      status: 'draft', // Always draft initially per requirements
      variants: clonedVariants,
      createdAt: now,
      updatedAt: now,
      seo: {
        ...original.seo,
        title: `${newName} | Atelier Nice`,
        slug: newSlug
      }
    };

    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);
    products.unshift(clonedProduct);
    storageAdapter.setItem(STORAGE_KEY, products);
    return JSON.parse(JSON.stringify(clonedProduct));
  }

  async bulkUpdateStatus(ids = [], status) {
    this.ensureInitialized();
    if (!Array.isArray(ids) || ids.length === 0) return 0;

    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);
    let count = 0;

    const updated = products.map(p => {
      if (ids.includes(p.id)) {
        count++;
        return {
          ...p,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    storageAdapter.setItem(STORAGE_KEY, updated);
    return count;
  }

  async bulkDelete(ids = []) {
    this.ensureInitialized();
    if (!Array.isArray(ids) || ids.length === 0) return 0;

    const products = storageAdapter.getItem(STORAGE_KEY, INITIAL_PRODUCTS);
    const initialCount = products.length;
    const filtered = products.filter(p => !ids.includes(p.id));
    storageAdapter.setItem(STORAGE_KEY, filtered);
    return initialCount - filtered.length;
  }

  async decrementStock(productId, variantId, qty = 1) {
    this.ensureInitialized();
    const product = await this.getById(productId);
    if (!product) return false;

    if (Array.isArray(product.variants)) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        variant.stock = Math.max(0, variant.stock - qty);
      }
    }

    const updatedStock = calculateTotalStock(product.variants);
    const status = updatedStock === 0 ? 'out_of_stock' : product.status;

    await this.update(productId, {
      variants: product.variants,
      stock: updatedStock,
      status
    });

    return true;
  }

  subscribe(callback) {
    return storageAdapter.subscribe(STORAGE_KEY, callback);
  }
}

export const productRepository = new ProductRepository();
