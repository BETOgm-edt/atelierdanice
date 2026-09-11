/**
 * ATELIER NICE — CATEGORY REPOSITORY (PURE SUPABASE DATABASE)
 * Strict Rule: NADA FICTÍCIO NO SITE.
 * Manages haute-couture categories directly in Supabase Database.
 * No local mock data, no mock seeds.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { generateSlug } from '../core/utils';

class CategoryRepository {
  constructor() {
    this.listeners = new Set();
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
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (onlyActive) {
        query = query.eq('active', true);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase categories fetch error:', error);
        return [];
      }

      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Supabase categories fetch fatal error:', err);
      return [];
    }
  }

  async getById(id) {
    if (!id || !isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) return null;
      return data;
    } catch (err) {
      console.error('Supabase category getById error:', err);
      return null;
    }
  }

  async getBySlug(slug) {
    if (!slug || !isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) return null;
      return data;
    } catch (err) {
      console.error('Supabase category getBySlug error:', err);
      return null;
    }
  }

  async create(categoryData) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase não configurado. Não é possível criar categorias.');
    }

    const slug = categoryData.slug || generateSlug(categoryData.name);
    const payload = {
      name: categoryData.name.trim(),
      slug,
      description: categoryData.description || '',
      image: categoryData.image || '',
      active: categoryData.active !== undefined ? categoryData.active : true
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    this.notify();
    return data;
  }

  async update(id, updates) {
    if (!id || !isSupabaseConfigured()) {
      throw new Error('Supabase não configurado. Não é possível atualizar categorias.');
    }

    const payload = { ...updates };
    if (updates.name && !updates.slug) {
      payload.slug = generateSlug(updates.name);
    }
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    this.notify();
    return data;
  }

  async delete(id) {
    if (!id || !isSupabaseConfigured()) {
      throw new Error('Supabase não configurado. Não é possível remover categorias.');
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    this.notify();
    return true;
  }
}

export const categoryRepository = new CategoryRepository();
export default categoryRepository;
