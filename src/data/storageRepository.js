/**
 * ATELIER NICE — IMAGE & MEDIA STORAGE SERVICE ABSTRACTION
 * Decouples image uploading, ordering, and deletion from the UI.
 * Ready for drop-in replacement with AWS S3, Supabase Storage, Cloudinary, or Firebase.
 */

class StorageRepository {
  /**
   * Upload an image file (File object or Data URL / Remote URL)
   * @param {File|string} fileOrUrl
   * @returns {Promise<{id: string, url: string, alt: string, isPrimary: boolean, order: number}>}
   */
  async uploadImage(fileOrUrl, customAlt = '') {
    if (typeof fileOrUrl === 'string') {
      // Remote or direct URL
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        url: fileOrUrl,
        alt: customAlt || 'Foto Vestido Atelier Nice',
        isPrimary: false,
        order: 0
      };
    }

    if (fileOrUrl instanceof File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            url: e.target.result,
            alt: customAlt || fileOrUrl.name.replace(/\.[^/.]+$/, ''),
            isPrimary: false,
            order: 0,
            size: fileOrUrl.size,
            mimeType: fileOrUrl.type
          });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(fileOrUrl);
      });
    }

    throw new Error('Formato de arquivo ou URL inválido.');
  }

  /**
   * Mark a specific image as primary
   */
  setPrimary(images = [], imageId) {
    if (!Array.isArray(images)) return [];
    return images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
  }

  /**
   * Reorder image positions
   */
  reorder(images = [], fromIndex, toIndex) {
    if (!Array.isArray(images)) return [];
    const result = Array.from(images);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result.map((img, idx) => ({ ...img, order: idx }));
  }

  /**
   * Remove image from list
   */
  remove(images = [], imageId) {
    if (!Array.isArray(images)) return [];
    const filtered = images.filter(img => img.id !== imageId);
    // If removed was primary and items still remain, set first as primary
    if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    return filtered.map((img, idx) => ({ ...img, order: idx }));
  }
}

export const storageRepository = new StorageRepository();
