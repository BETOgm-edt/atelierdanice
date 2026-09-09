import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../core/utils';

export const WishlistDrawer = ({ onSelectProduct, onExploreCatalog }) => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div
        className="drawer-panel"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Heart size={20} color="var(--color-primary)" fill="var(--color-primary)" />
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Vestidos Favoritos ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="btn-ghost"
            style={{ padding: 4 }}
            aria-label="Fechar favoritos"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg-subtle)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <Heart size={28} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                Nenhum vestido salvo
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Salve suas criações prediletas para comparar ou provar no Atelier.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsWishlistOpen(false);
                  onExploreCatalog?.();
                }}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {wishlist.map((product) => {
                const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80';
                return (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      paddingBottom: '1.25rem',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={img}
                      alt={product.name}
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onSelectProduct(product);
                      }}
                      style={{
                        width: 72,
                        height: 96,
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(product);
                        }}
                        style={{
                          fontFamily: 'var(--font-editorial)',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: 'var(--color-text-main)',
                          cursor: 'pointer',
                          marginBottom: '0.2rem'
                        }}
                      >
                        {product.name}
                      </h4>

                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '0.6rem' }}>
                        {formatCurrency(product.promotionalPrice || product.price)}
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => {
                            addToCart(product, product.variants?.[0] || null, product.modality === 'rent' ? 'rent' : 'buy', 1);
                            setIsWishlistOpen(false);
                          }}
                          className="btn btn-dark btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                        >
                          <ShoppingBag size={13} />
                          <span>Mover p/ Sacola</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          style={{ color: 'var(--color-text-muted)', padding: '4px', cursor: 'pointer' }}
                          title="Remover dos favoritos"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
