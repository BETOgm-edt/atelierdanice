/**
 * ATELIER NICE — STORAGE ADAPTER & EVENT BUS
 * Abstraction layer for data persistence (LocalStorage with reactive event dispatching).
 * Prepared for clean replacement with REST / GraphQL / Supabase / Firebase API.
 */

class StorageAdapter {
  constructor() {
    this.listeners = new Map();
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`[StorageAdapter] Error reading key "${key}":`, error);
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.emit(key, value);
      // Also broadcast global storage change
      window.dispatchEvent(new CustomEvent('atelier-storage-sync', { detail: { key, value } }));
      return true;
    } catch (error) {
      console.error(`[StorageAdapter] Error writing key "${key}":`, error);
      return false;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      this.emit(key, null);
      window.dispatchEvent(new CustomEvent('atelier-storage-sync', { detail: { key, value: null } }));
      return true;
    } catch (error) {
      console.error(`[StorageAdapter] Error removing key "${key}":`, error);
      return false;
    }
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  emit(key, data) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`[StorageAdapter] Error in listener callback for key "${key}":`, err);
        }
      });
    }
  }
}

export const storageAdapter = new StorageAdapter();
