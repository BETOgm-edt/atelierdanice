import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CART_STORAGE_KEY = 'atelier_nice_cart_state';
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  const addToCart = (product, selectedVariant = null, modality = 'buy', quantity = 1) => {
    if (!product) return;

    const unitPrice = modality === 'rent'
      ? (product.rentalPrice || 0)
      : (product.promotionalPrice || product.price || 0);

    const variantKey = selectedVariant ? `${selectedVariant.size}-${selectedVariant.color?.name || ''}` : 'default';
    const cartItemId = `${product.id}-${variantKey}-${modality}`;

    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem = {
        cartItemId,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        sku: selectedVariant?.sku || product.sku,
        image: product.images?.[0]?.url || '',
        price: unitPrice,
        originalPrice: product.price || 0,
        modality, // 'buy' or 'rent'
        variant: selectedVariant || { size: 'Padrão', color: { name: 'Padrão', hex: '#B67068' } },
        quantity
      };
      setCart((prev) => [newItem, ...prev]);
    }

    showToast(`"${product.name}" adicionado à sua seleção!`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId) => {
    const item = cart.find((i) => i.cartItemId === cartItemId);
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (item) {
      showToast(`"${item.name}" removido da seleção.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  }, [cart]);

  const total = useMemo(() => {
    return subtotal;
  }, [subtotal]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        total,
        cartCount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
