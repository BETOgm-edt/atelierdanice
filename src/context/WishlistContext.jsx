import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WISHLIST_STORAGE_KEY = 'atelier_nice_wishlist_state';
const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    if (!product) return;
    const exists = wishlist.some((item) => item.id === product.id);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`"${product.name}" removido dos favoritos.`, 'info');
    } else {
      setWishlist((prev) => [product, ...prev]);
      showToast(`"${product.name}" adicionado aos seus favoritos!`, 'success');
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist deve ser usado dentro de um WishlistProvider');
  }
  return context;
};
