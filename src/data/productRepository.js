/**
 * ATELIER NICE — PRODUCT REPOSITORY (PURE SUPABASE DATABASE)
 * Strict Rule: NADA FICTÍCIO NO SITE.
 * Manages haute-couture products and relational images directly in Supabase Database.
 * No local mock data, no mock seeds.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { generateSKU, generateSlug, calculateTotalStock } from '../core/utils';
import { storageRepository } from './storageRepository';

// Helper to format Supabase product row into normalized frontend object
const formatProductFromDB = (row) => {
  if (!row) return null;

  // Format images array from relational product_images
  const rawImages = Array.isArray(row.product_images) ? row.product_images : [];
  rawImages.sort((a, b) => (a.position || 0) - (b.position || 0));

  const images = rawImages.map((img) => ({
    id: img.id,
    url: img.public_url,
    publicUrl: img.public_url,
    storagePath: img.storage_path,
    alt: img.alt_text || row.name,
    altText: img.alt_text || row.name,
    isPrimary: img.is_cover || false,
    isCover: img.is_cover || false,
    position: img.position || 0
  }));

  // If no image has isPrimary, make first one primary
  if (images.length > 0 && !images.some((i) => i.isPrimary)) {
    images[0].isPrimary = true;
    images[0].isCover = true;
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    categoryId: row.category_id,
    categoryName: row.categories?.name || 'Alta Costura',
    shortDescription: row.short_description || '',
    description: row.description || '',
    price: parseFloat(row.price || 0),
    promotionalPrice: row.promotional_price ? parseFloat(row.promotional_price) : null,
    rentalPrice: row.rental_price ? parseFloat(row.rental_price) : null,
    costPrice: row.cost_price ? parseFloat(row.cost_price) : null,
    modality: row.modality || 'both',
    stock: parseInt(row.stock || 0, 10),
    minStockAlert: parseInt(row.min_stock_alert || 1, 10),
    status: row.status || 'draft',
    featured: Boolean(row.featured),
    characteristics: row.characteristics || {},
    variants: Array.isArray(row.variants) ? row.variants : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    seo: row.seo || {},
    images: images,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

class ProductRepository {
  constructor() {
    this.listeners = new Set();
  }

  notify() {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (err) {
        console.error('Product listener error:', err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  async getAll(filter = {}) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (id, name, slug),
          product_images (*)
        `)
        .order('created_at', { ascending: false });

      // Filter: Public catalog vs Admin
      if (filter.onlyCatalog) {
        query = query.in('status', ['published', 'out_of_stock']);
      } else if (filter.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      // Filter: Category
      if (filter.categoryId && filter.categoryId !== 'all') {
        query = query.eq('category_id', filter.categoryId);
      }

      // Filter: Modality
      if (filter.modality && filter.modality !== 'all') {
        if (filter.modality === 'sale') {
          query = query.in('modality', ['sale', 'both']);
        } else if (filter.modality === 'rent') {
          query = query.in('modality', ['rent', 'both']);
        }
      }

      // Filter: Featured
      if (filter.featured === true) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase products fetch error:', error);
        return [];
      }

      if (!Array.isArray(data)) return [];

      let formatted = data.map(formatProductFromDB);

      // Client-side text search if provided
      if (filter.search && filter.search.trim() !== '') {
        const term = filter.search.trim().toLowerCase();
        formatted = formatted.filter((p) => {
          const nameMatch = p.name?.toLowerCase().includes(term);
          const skuMatch = p.sku?.toLowerCase().includes(term);
          const catMatch = p.categoryName?.toLowerCase().includes(term);
          const tagMatch = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(term));
          return nameMatch || skuMatch || catMatch || tagMatch;
        });
      }

      // Sorting
      if (filter.sortBy) {
        switch (filter.sortBy) {
          case 'price-asc':
            formatted.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
            break;
          case 'price-desc':
            formatted.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
            break;
          case 'name-asc':
            formatted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
            break;
          case 'name-desc':
            formatted.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
            break;
          case 'newest':
          default:
            formatted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            break;
        }
      }

      return formatted;
    } catch (err) {
      console.error('Supabase products fetch fatal error:', err);
      return [];
    }
  }

  async getById(id) {
    if (!id || !isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name, slug),
          product_images (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error || !data) return null;
      return formatProductFromDB(data);
    } catch (err) {
      console.error('Supabase product getById error:', err);
      return null;
    }
  }

  async getBySlug(slug) {
    if (!slug || !isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name, slug),
          product_images (*)
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) return null;
      return formatProductFromDB(data);
    } catch (err) {
      console.error('Supabase product getBySlug error:', err);
      return null;
    }
  }

  async create(productData) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não está configurado. Não é possível cadastrar produtos.');
    }

    const slug = productData.slug || generateSlug(productData.name);
    const sku = productData.sku || generateSKU(productData.name, productData.categoryName || 'ATELIER');
    const totalStock = calculateTotalStock(productData.variants) || parseInt(productData.stock || 0, 10);

    const productPayload = {
      name: productData.name.trim(),
      slug,
      sku,
      category_id: productData.categoryId || null,
      short_description: productData.shortDescription || '',
      description: productData.description || '',
      price: parseFloat(productData.price || 0),
      promotional_price: productData.promotionalPrice ? parseFloat(productData.promotionalPrice) : null,
      rental_price: productData.rentalPrice ? parseFloat(productData.rentalPrice) : null,
      cost_price: productData.costPrice ? parseFloat(productData.costPrice) : null,
      modality: productData.modality || 'both',
      stock: totalStock,
      min_stock_alert: parseInt(productData.minStockAlert || 1, 10),
      status: productData.status || 'draft',
      featured: Boolean(productData.featured),
      characteristics: productData.characteristics || {},
      variants: Array.isArray(productData.variants) ? productData.variants : [],
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      seo: productData.seo || {}
    };

    // 1. Insert product row
    const { data: createdProduct, error: prodError } = await supabase
      .from('products')
      .insert([productPayload])
      .select()
      .single();

    if (prodError) throw prodError;

    // 2. Insert image rows in product_images
    if (Array.isArray(productData.images) && productData.images.length > 0) {
      const imageRows = productData.images.map((img, index) => ({
        product_id: createdProduct.id,
        storage_path: img.storagePath || `products/${createdProduct.id}/img-${index}.webp`,
        public_url: img.publicUrl || img.url,
        alt_text: img.alt || img.altText || createdProduct.name,
        position: index,
        is_cover: Boolean(img.isPrimary || img.isCover || index === 0)
      }));

      const { error: imgError } = await supabase
        .from('product_images')
        .insert(imageRows);

      if (imgError) {
        console.warn('Erro ao inserir imagens relacionais:', imgError.message);
      }
    }

    this.notify();
    return await this.getById(createdProduct.id);
  }

  async update(id, updates) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não está configurado. Não é possível atualizar produtos.');
    }

    const productPayload = {};

    if (updates.name !== undefined) productPayload.name = updates.name.trim();
    if (updates.slug !== undefined) productPayload.slug = updates.slug;
    if (updates.sku !== undefined) productPayload.sku = updates.sku;
    if (updates.categoryId !== undefined) productPayload.category_id = updates.categoryId;
    if (updates.shortDescription !== undefined) productPayload.short_description = updates.shortDescription;
    if (updates.description !== undefined) productPayload.description = updates.description;
    if (updates.price !== undefined) productPayload.price = parseFloat(updates.price);
    if (updates.promotionalPrice !== undefined) productPayload.promotional_price = updates.promotionalPrice ? parseFloat(updates.promotionalPrice) : null;
    if (updates.rentalPrice !== undefined) productPayload.rental_price = updates.rentalPrice ? parseFloat(updates.rentalPrice) : null;
    if (updates.costPrice !== undefined) productPayload.cost_price = updates.costPrice ? parseFloat(updates.costPrice) : null;
    if (updates.modality !== undefined) productPayload.modality = updates.modality;
    if (updates.status !== undefined) productPayload.status = updates.status;
    if (updates.featured !== undefined) productPayload.featured = updates.featured;
    if (updates.characteristics !== undefined) productPayload.characteristics = updates.characteristics;
    if (updates.variants !== undefined) {
      productPayload.variants = updates.variants;
      productPayload.stock = calculateTotalStock(updates.variants);
    }
    if (updates.tags !== undefined) productPayload.tags = updates.tags;
    if (updates.seo !== undefined) productPayload.seo = updates.seo;

    // 1. Update product row
    const { error: prodError } = await supabase
      .from('products')
      .update(productPayload)
      .eq('id', id);

    if (prodError) throw prodError;

    // 2. Sync product images if updated
    if (Array.isArray(updates.images)) {
      // Delete old image references
      await supabase.from('product_images').delete().eq('product_id', id);

      // Re-insert updated gallery
      if (updates.images.length > 0) {
        const imageRows = updates.images.map((img, index) => ({
          product_id: id,
          storage_path: img.storagePath || `products/${id}/img-${index}.webp`,
          public_url: img.publicUrl || img.url,
          alt_text: img.alt || img.altText || updates.name || 'Foto Vestido',
          position: index,
          is_cover: Boolean(img.isPrimary || img.isCover || index === 0)
        }));

        await supabase.from('product_images').insert(imageRows);
      }
    }

    this.notify();
    return await this.getById(id);
  }

  async duplicate(id) {
    const original = await this.getById(id);
    if (!original) throw new Error('Vestido original não encontrado para duplicação.');

    const newName = `${original.name} (Cópia)`;
    const newSlug = generateSlug(`${original.slug}-copia-${Date.now().toString().slice(-4)}`);
    const newSku = `${original.sku || 'NICE'}-COPY`;

    const duplicatedData = {
      ...original,
      name: newName,
      slug: newSlug,
      sku: newSku,
      status: 'draft', // Never publish duplicated items automatically
      featured: false,
      images: original.images || []
    };

    delete duplicatedData.id;
    delete duplicatedData.createdAt;
    delete duplicatedData.updatedAt;

    return await this.create(duplicatedData);
  }

  async updateStatus(id, newStatus) {
    return await this.update(id, { status: newStatus });
  }

  async bulkUpdateStatus(ids, newStatus) {
    if (!Array.isArray(ids) || ids.length === 0) return 0;
    if (!isSupabaseConfigured()) throw new Error('Supabase não configurado.');

    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .in('id', ids);

    if (error) throw error;
    this.notify();
    return ids.length;
  }

  async delete(id) {
    if (!id) return false;
    if (!isSupabaseConfigured()) throw new Error('Supabase não configurado.');

    // Remove storage images first
    await storageRepository.deleteProductFolder(id);

    // Delete product from database (cascade deletes product_images)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    this.notify();
    return true;
  }

  async bulkDelete(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return 0;

    for (const id of ids) {
      await this.delete(id);
    }
    return ids.length;
  }

  async decrementStock(productId, variantId, quantity = 1) {
    const product = await this.getById(productId);
    if (!product) return;

    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const updatedVariants = product.variants.map((v) => {
        if (v.id === variantId || (!variantId && v.size === product.variants[0].size)) {
          return { ...v, stock: Math.max(0, (v.stock || 0) - quantity) };
        }
        return v;
      });
      await this.update(productId, { variants: updatedVariants });
    } else {
      const newStock = Math.max(0, (product.stock || 0) - quantity);
      await this.update(productId, {
        stock: newStock,
        status: newStock === 0 ? 'out_of_stock' : product.status
      });
    }
  }
}

export const productRepository = new ProductRepository();
export default productRepository;
