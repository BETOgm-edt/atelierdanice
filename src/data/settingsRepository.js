/**
 * ATELIER NICE — SETTINGS REPOSITORY
 */

import { storageAdapter } from './storageAdapter';
import { INITIAL_STORE_SETTINGS } from './mockData';

const STORAGE_KEY = 'atelier_nice_settings';

class SettingsRepository {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    const existing = storageAdapter.getItem(STORAGE_KEY, null);
    if (!existing) {
      storageAdapter.setItem(STORAGE_KEY, INITIAL_STORE_SETTINGS);
    }
  }

  async get() {
    this.ensureInitialized();
    const settings = storageAdapter.getItem(STORAGE_KEY, INITIAL_STORE_SETTINGS);
    return JSON.parse(JSON.stringify(settings));
  }

  async update(patch) {
    this.ensureInitialized();
    const current = storageAdapter.getItem(STORAGE_KEY, INITIAL_STORE_SETTINGS);
    const updated = {
      ...current,
      ...patch,
      store: { ...current.store, ...(patch.store || {}) },
      sales: { ...current.sales, ...(patch.sales || {}) },
      seo: { ...current.seo, ...(patch.seo || {}) }
    };
    storageAdapter.setItem(STORAGE_KEY, updated);
    return JSON.parse(JSON.stringify(updated));
  }

  subscribe(callback) {
    return storageAdapter.subscribe(STORAGE_KEY, callback);
  }
}

export const settingsRepository = new SettingsRepository();
