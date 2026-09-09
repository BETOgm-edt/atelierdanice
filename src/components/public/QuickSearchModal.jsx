import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../core/utils';

export const QuickSearchModal = ({ isOpen, onClose, onSelectProduct, onExploreAll }) => {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter only published/catalog products matching search term
  const catalogProducts = products.filter(p => p.status === 'published' || p.status === 'out_of_stock');
  const term = searchTerm.trim().toLowerCase();

  const results = term === ''
    ? []
    : catalogProducts.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(term);
        const skuMatch = p.sku?.toLowerCase().includes(term);
        const catMatch = p.categoryName?.toLowerCase().includes(term);
        const tagMatch = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(term));
        return nameMatch || skuMatch || catMatch || tagMatch;
      }).slice(0, 6);

  const popularTags = ['Zibeline', 'Madrinha', 'Rosé', 'Off-White', 'Civil', 'Formatura', 'Sereia', 'Veludo'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Search Bar Input */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Search size={22} color="var(--color-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por nome do vestido, SKU, tecido ou ocasião..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              fontSize: '1.05rem',
              color: 'var(--color-text-main)',
              fontFamily: 'var(--font-sans)',
              border: 'none',
              outline: 'none'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ color: 'var(--color-text-muted)', padding: '4px', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
          <button onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>ESC</span>
          </button>
        </div>

        {/* Results / Quick Suggestions */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1.5rem' }}>
          {searchTerm === '' ? (
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                Termos Mais Buscados no Atelier
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="badge badge-soft"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                  >
                    <Tag size={12} />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                Nenhum vestido encontrado para "<strong>{searchTerm}</strong>"
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Tente buscar por termos mais genéricos como "Zibeline", "Rosé" ou "Gala".
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                  {results.length} resultados encontrados
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onExploreAll(searchTerm);
                  }}
                  style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <span>Ver todos no catálogo</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {results.map((product) => {
                const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80';
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    className="search-item-hover"
                  >
                    <img
                      src={img}
                      alt={product.name}
                      style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {product.categoryName}
                      </span>
                      <h5 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.1rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </h5>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {formatCurrency(product.promotionalPrice || product.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .search-item-hover:hover {
          background-color: var(--color-bg-subtle);
        }
      `}</style>
    </div>
  );
};
