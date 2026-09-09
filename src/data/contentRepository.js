/**
 * ATELIER NICE — CONTENT REPOSITORY
 * Controls homepage banners, editorial headlines, and customizable brand blocks.
 */

import { storageAdapter } from './storageAdapter';
import { INITIAL_BANNERS } from './mockData';

const STORAGE_KEY = 'atelier_nice_banners';

class ContentRepository {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    const existing = storageAdapter.getItem(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storageAdapter.setItem(STORAGE_KEY, INITIAL_BANNERS);
    }
  }

  async getBanners(onlyActive = true) {
    this.ensureInitialized();
    let banners = storageAdapter.getItem(STORAGE_KEY, INITIAL_BANNERS);
    if (onlyActive) {
      banners = banners.filter(b => b.active !== false);
    }
    banners.sort((a, b) => (a.order || 0) - (b.order || 0));
    return JSON.parse(JSON.stringify(banners));
  }

  async updateBanner(id, updates) {
    this.ensureInitialized();
    const banners = storageAdapter.getItem(STORAGE_KEY, INITIAL_BANNERS);
    const index = banners.findIndex(b => b.id === id);

    if (index !== -1) {
      banners[index] = { ...banners[index], ...updates };
      storageAdapter.setItem(STORAGE_KEY, banners);
      return JSON.parse(JSON.stringify(banners[index]));
    }
    return null;
  }

  async createBanner(bannerData) {
    this.ensureInitialized();
    const banners = storageAdapter.getItem(STORAGE_KEY, INITIAL_BANNERS);
    const newBanner = {
      id: `banner-${Date.now()}`,
      ...bannerData,
      order: banners.length + 1,
      active: true
    };
    banners.push(newBanner);
    storageAdapter.setItem(STORAGE_KEY, banners);
    return JSON.parse(JSON.stringify(newBanner));
  }

  async deleteBanner(id) {
    this.ensureInitialized();
    const banners = storageAdapter.getItem(STORAGE_KEY, INITIAL_BANNERS);
    const filtered = banners.filter(b => b.id !== id);
    storageAdapter.setItem(STORAGE_KEY, filtered);
    return true;
  }

  subscribe(callback) {
    return storageAdapter.subscribe(STORAGE_KEY, callback);
  }
}

export const contentRepository = new ContentRepository();
