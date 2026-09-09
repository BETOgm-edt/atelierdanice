/**
 * ATELIER NICE — CATEGORY REPOSITORY
 */

import { storageAdapter } from './storageAdapter';
import { INITIAL_CATEGORIES } from './mockData';
import { generateSlug } from '../core/utils';

const STORAGE_KEY = 'atelier_nice_categories';

class CategoryRepository {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    const existing = storageAdapter.getItem(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storageAdapter.setItem(STORAGE_KEY, INITIAL_CATEGORIES);
    }
  }

  async getAll(onlyActive = false) {
    this.ensureInitialized();
    let categories = storageAdapter.getItem(STORAGE_KEY, INITIAL_CATEGORIES);
    if (onlyActive) {
      categories = categories.filter(c => c.active !== false);
    }
    categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    return JSON.parse(JSON.stringify(categories));
  }

  async getById(id) {
    this.ensureInitialized();
    const categories = storageAdapter.getItem(STORAGE_KEY, INITIAL_CATEGORIES);
    const cat = categories.find(c => c.id === id);
    return cat ? JSON.parse(JSON.stringify(cat)) : null;
  }

  async getBySlug(slug) {
    this.ensureInitialized();
    const categories = storageAdapter.getItem(STORAGE_KEY, INITIAL_CATEGORIES);
    const cat = categories.find(c => c.slug === slug);
    return cat ? JSON.parse(JSON.stringify(cat)) : null;
  }

  async create(data) {
    this.ensureInitialized();
    const categories = storageAdapter.getItem(STORAGE_KEY, INITIAL_CATEGORIES);
    const id = `cat-${Date.now()}`;
    const slug = generateSlug(data.name || 'nova-categoria');

    const newCategory = {
      id,
      name: data.name?.trim() || 'Nova Categoria',
      slug,
      description: data.description?.trim() || '',
      image: data.image || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      active: data.active !== undefined ? Boolean(data.active) : true,
      order: categories.length + 1,
      createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    storageAdapter.setItem(STORAGE_KEY, categories);
    return JSON.parse(JSON.stringify(newCategory));
  }

  async update(id, updates) {
    this.ensureInitialized();
    const categories = storageAdapter.getItem(STORAGE_KEY, INITIAL_CATEGORIES);
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      throw new Error(`Categoria "${id}" não encontrada.`);
    }

    const current = categories[index];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      updatedAt: new Date().toISOString()
    };

    if (updates.name && (!updates.slug || updates.slug === current.slug)) {
      updated.slug = generateSlug(updates.name);
    }

    categories[index] = updated;
    storageAdapter.setItem(STORAGE_KEY, categories);
    return JSON.parse(JSON.stringify(updated));
  }

  async delete(id) {
    this.ensureInitialized();
    const categories = storageAdapter.getItem(STORAGE_KEY, INITIAL_CATEGORIES);
    const filtered = categories.filter(c => c.id !== id);
    storageAdapter.setItem(STORAGE_KEY, filtered);
    return true;
  }

  subscribe(callback) {
    return storageAdapter.subscribe(STORAGE_KEY, callback);
  }
}

export const categoryRepository = new CategoryRepository();
