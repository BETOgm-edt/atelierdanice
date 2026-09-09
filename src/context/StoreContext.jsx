import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dataService } from '../data';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [allProducts, allCategories, storeSettings, allBanners] = await Promise.all([
        dataService.products.getAll(),
        dataService.categories.getAll(),
        dataService.settings.get(),
        dataService.content.getBanners(false)
      ]);

      setProducts(allProducts);
      setCategories(allCategories);
      setSettings(storeSettings);
      setBanners(allBanners);
    } catch (err) {
      console.error('[StoreContext] Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();

    // Subscribe to reactive storage updates
    const unsubProducts = dataService.products.subscribe(() => {
      loadAllData();
    });
    const unsubCategories = dataService.categories.subscribe(() => {
      loadAllData();
    });
    const unsubSettings = dataService.settings.subscribe(() => {
      loadAllData();
    });
    const unsubContent = dataService.content.subscribe(() => {
      loadAllData();
    });

    const handleGlobalSync = () => {
      loadAllData();
    };

    window.addEventListener('atelier-storage-sync', handleGlobalSync);

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
      unsubContent();
      window.removeEventListener('atelier-storage-sync', handleGlobalSync);
    };
  }, [loadAllData]);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        banners,
        loading,
        refreshData: loadAllData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return context;
};
