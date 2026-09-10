import React from 'react';
import { X, Heart, Trash2, MessageCircle } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency, buildProductWhatsAppMessage, buildWhatsAppLink } from '../../core/utils';
import { NeutralImagePlaceholder } from '../common/NeutralImagePlaceholder';

export const WishlistDrawer = ({ onSelectProduct, onExploreCatalog }) => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();

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
                Salve suas criações prediletas para consultar disponibilidade ou provar no Atelier.
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
                const img = product.images?.[0]?.url || null;
                const effectivePrice = product.promotionalPrice || product.price;
                const waMsg = buildProductWhatsAppMessage({
                  name: product.name,
                  sku: product.sku,
                  modality: product.modality,
                  price: effectivePrice
                });
                const waUrl = buildWhatsAppLink(waMsg);

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
                    <div
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onSelectProduct(product);
                      }}
                      style={{
                        width: 72,
                        height: 96,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <NeutralImagePlaceholder title={product.name} height="100%" />
                      )}
                    </div>

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
                          marginBottom: '0.2rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {product.name}
                      </h4>

                      {effectivePrice && effectivePrice > 0 ? (
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '0.6rem' }}>
                          {formatCurrency(effectivePrice)}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>
                          Sob Consulta
                        </span>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.35rem 0.75rem',
                            backgroundColor: '#25D366',
                            color: '#FFFFFF',
                            borderColor: '#25D366',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </a>
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
