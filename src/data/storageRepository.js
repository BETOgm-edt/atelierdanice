/**
 * ATELIER NICE — STORAGE REPOSITORY (SUPABASE STORAGE + OPTIMIZATION)
 * Manages product media upload to Supabase Storage with WebP compression.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { optimizeImage } from '../core/utils/imageOptimizer';

const BUCKET_NAME = 'products';

class StorageRepository {
  /**
   * Optimizes an image and uploads it to the Supabase Storage 'products' bucket.
   * @param {File|Blob} file 
   * @param {Object} metadata 
   * @returns {Promise<{ id: string, storagePath: string, publicUrl: string, url: string, altText: string, isPrimary: boolean, isCover: boolean, position: number }>}
   */
  async uploadImage(file, metadata = {}) {
    // 1. Client-Side Image Optimization (Canvas -> WebP compression)
    let optimized;
    try {
      optimized = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.84
      });
    } catch (optErr) {
      console.warn('Compressor de imagem avisou:', optErr.message);
      // If conversion fails (e.g. non-standard format), use raw file
      optimized = {
        file,
        previewUrl: URL.createObjectURL(file),
        optimizedSize: file.size
      };
    }

    const productId = metadata.productId || 'draft-uploads';
    const isCover = metadata.isPrimary || metadata.isCover || false;
    const prefix = isCover ? 'cover' : 'image';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const storagePath = `${productId}/${prefix}-${timestamp}-${randomSuffix}.webp`;

    // 2. Upload to Supabase Storage if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, optimized.file, {
            contentType: 'image/webp',
            cacheControl: '31536000', // 1 year immutable cache
            upsert: false
          });

        if (error) {
          console.error('Supabase storage upload error:', error);
          throw error;
        }

        const { data: publicData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(data.path);

        const publicUrl = publicData.publicUrl;

        return {
          id: `img-${timestamp}-${randomSuffix}`,
          storagePath: data.path,
          publicUrl,
          url: publicUrl, // Compatibility alias
          alt: metadata.alt || metadata.productName || 'Foto Vestido Atelier Nice',
          altText: metadata.alt || metadata.productName || 'Foto Vestido Atelier Nice',
          isPrimary: isCover,
          isCover,
          position: metadata.position || 0,
          sizeBytes: optimized.optimizedSize
        };
      } catch (uploadErr) {
        console.warn('Fallback para visualização local:', uploadErr.message);
      }
    }

    // Local Object URL fallback if offline or Supabase unconfigured
    return {
      id: `img-${timestamp}-${randomSuffix}`,
      storagePath,
      publicUrl: optimized.previewUrl,
      url: optimized.previewUrl,
      alt: metadata.alt || metadata.productName || 'Foto Vestido Atelier Nice',
      altText: metadata.alt || metadata.productName || 'Foto Vestido Atelier Nice',
      isPrimary: isCover,
      isCover,
      position: metadata.position || 0,
      sizeBytes: optimized.optimizedSize
    };
  }

  /**
   * Delete a single image file from Supabase Storage.
   * @param {string} storagePath 
   */
  async deleteFile(storagePath) {
    if (!storagePath) return true;

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([storagePath]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Erro ao remover imagem do storage:', err.message);
        return false;
      }
    }
    return true;
  }

  /**
   * Remove all images associated with a product folder to prevent orphaned files.
   * @param {string} productId 
   */
  async deleteProductFolder(productId) {
    if (!productId || !isSupabaseConfigured()) return true;

    try {
      const { data: list, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(productId);

      if (listError || !list || list.length === 0) return true;

      const pathsToRemove = list.map((file) => `${productId}/${file.name}`);
      const { error: removeError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(pathsToRemove);

      if (removeError) throw removeError;
      return true;
    } catch (err) {
      console.warn('Erro ao limpar pasta do produto no storage:', err.message);
      return false;
    }
  }

  /**
   * Sets an image as the primary cover in an array of images.
   */
  setPrimary(images, selectedId) {
    return images.map((img) => ({
      ...img,
      isPrimary: img.id === selectedId,
      isCover: img.id === selectedId
    }));
  }
}

export const storageRepository = new StorageRepository();
export default storageRepository;
