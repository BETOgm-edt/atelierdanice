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
  const [shippingCost, setShippingCost] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

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
      ? (product.rentalPrice || product.price * 0.35)
      : (product.promotionalPrice || product.price);

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
        originalPrice: product.price,
        modality, // 'buy' or 'rent'
        variant: selectedVariant || { size: 'Padrão', color: { name: 'Padrão', hex: '#B67068' } },
        quantity
      };
      setCart((prev) => [newItem, ...prev]);
    }

    showToast(`"${product.name}" adicionado à sua sacola!`, 'success');
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
      showToast(`"${item.name}" removido da sacola.`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'PRIMEIRACOMPRA' || clean === 'NICE10') {
      setAppliedCoupon({ code: clean, discountPercent: 10 });
      showToast('Cupom de 10% de desconto aplicado com sucesso!', 'success');
      return true;
    }
    showToast('Cupom inválido ou expirado.', 'error');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupom removido.', 'info');
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return (subtotal * appliedCoupon.discountPercent) / 100;
  }, [subtotal, appliedCoupon]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost);
  }, [subtotal, discountAmount, shippingCost]);

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
        discountAmount,
        shippingCost,
        setShippingCost,
        total,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon
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
