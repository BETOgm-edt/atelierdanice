/**
 * ATELIER NICE — CATEGORY REPOSITORY (SUPABASE + FALLBACK)
 * Manages haute-couture categories in Supabase Database with relational integrity.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { storageAdapter } from './storageAdapter';
import { generateSlug } from '../core/utils';

const STORAGE_KEY = 'atelier_nice_categories';

class CategoryRepository {
  constructor() {
    this.ensureLocalInitialized();
    this.listeners = new Set();
  }

  ensureLocalInitialized() {
    const existing = storageAdapter.getItem(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing)) {
      storageAdapter.setItem(STORAGE_KEY, []);
    }
  }

  notify() {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (err) {
        console.error('Category listener error:', err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  async getAll(onlyActive = false) {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (onlyActive) {
          query = query.eq('active', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (Array.isArray(data)) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase categories fetch fallback:', err.message);
      }
    }

    // Local fallback
    this.ensureLocalInitialized();
    let categories = storageAdapter.getItem(STORAGE_KEY, []);
    if (onlyActive) {
      categories = categories.filter((c) => c.active !== false);
    }
    return categories;
  }

  async getById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase category getById fallback:', err.message);
      }
    }

    const all = await this.getAll();
    return all.find((c) => c.id === id) || null;
  }

  async getBySlug(slug) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase category getBySlug fallback:', err.message);
      }
    }

    const all = await this.getAll();
    return all.find((c) => c.slug === slug) || null;
  }

  async create(categoryData) {
    const slug = categoryData.slug || generateSlug(categoryData.name);
    const payload = {
      name: categoryData.name.trim(),
      slug,
      description: categoryData.description || '',
      image: categoryData.image || '',
      active: categoryData.active !== undefined ? categoryData.active : true
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        this.notify();
        return data;
      } catch (err) {
        console.error('Supabase category create error:', err);
        throw err;
      }
    }

    // Local fallback
    const all = await this.getAll();
    const newCategory = {
      id: `cat-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString()
    };
    all.push(newCategory);
    storageAdapter.setItem(STORAGE_KEY, all);
    this.notify();
    return newCategory;
  }

  async update(id, updates) {
    const payload = { ...updates };
    if (updates.name && !updates.slug) {
      payload.slug = generateSlug(updates.name);
    }
    payload.updated_at = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        this.notify();
        return data;
      } catch (err) {
        console.error('Supabase category update error:', err);
        throw err;
      }
    }

    // Local fallback
    const all = await this.getAll();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Categoria não encontrada.');

    all[index] = { ...all[index], ...payload };
    storageAdapter.setItem(STORAGE_KEY, all);
    this.notify();
    return all[index];
  }

  async delete(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        if (error) throw error;
        this.notify();
        return true;
      } catch (err) {
        console.error('Supabase category delete error:', err);
        throw err;
      }
    }

    // Local fallback
    let all = await this.getAll();
    all = all.filter((c) => c.id !== id);
    storageAdapter.setItem(STORAGE_KEY, all);
    this.notify();
    return true;
  }
}

export const categoryRepository = new CategoryRepository();
export default categoryRepository;
