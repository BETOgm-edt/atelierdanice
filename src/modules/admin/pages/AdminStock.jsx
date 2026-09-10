import React, { useState } from 'react';
import { Boxes, AlertTriangle, Plus, Minus, CheckCircle, Search, RefreshCw } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { dataService } from '../../../data';
import { formatCurrency } from '../../../core/utils';
import { useToast } from '../../../context/ToastContext';

export const AdminStock = () => {
  const { products, refreshData } = useStore();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  const handleAdjustStock = async (product, variantId, delta) => {
    try {
      const updatedVariants = Array.isArray(product.variants)
        ? product.variants.map((v) => {
            if (v.id === variantId) {
              const newStock = Math.max(0, (v.stock || 0) + delta);
              return { ...v, stock: newStock };
            }
            return v;
          })
        : [];

      await dataService.products.update(product.id, {
        variants: updatedVariants
      });

      showToast(`Estoque de "${product.name}" atualizado!`, 'success');
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao atualizar estoque.', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const isLow = p.stock <= (p.minStockAlert || 1);
    return matchSearch && (!filterLowStock || isLow);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>
            Controle Central de Estoque
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Monitoramento de unidades disponíveis por grade de tamanho e alertas de reposição.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Filtrar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-text"
            style={{ paddingLeft: '2.4rem', padding: '0.55rem 0.85rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.checked)}
            style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }}
          />
          <span>Exibir apenas itens com estoque crítico</span>
        </label>
      </div>

      {/* Grid of Product Stock Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--color-text-muted)'
            }}
          >
            Nenhum vestido encontrado no controle de estoque.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isCritical = p.stock <= (p.minStockAlert || 1);
            const img = p.images?.[0]?.url;

            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${isCritical ? 'var(--color-warning-border)' : 'var(--color-border)'}`,
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                {/* Product Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {img && !img.includes('unsplash') ? (
                      <img
                        src={img}
                        alt={p.name}
                        style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 60,
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-bg-subtle)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary)'
                        }}
                      >
                        <Boxes size={20} />
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                        {p.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        SKU: {p.sku || 'N/A'} • Categoria: {p.categoryName} • Alerta em ≤ {p.minStockAlert || 1} un.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Saldo Total</span>
                      <strong style={{ fontSize: '1.2rem', color: isCritical ? 'var(--color-danger)' : 'var(--color-text-main)' }}>
                        {p.stock} unidades
                      </strong>
                    </div>

                    {isCritical && (
                      <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} />
                        <span>Atenção</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Variants Matrix Table */}
                {Array.isArray(p.variants) && p.variants.length > 0 && (
                  <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '0.75rem'
                      }}
                    >
                    {p.variants.map((v) => (
                      <div
                        key={v.id}
                        style={{
                          backgroundColor: 'var(--color-bg-card)',
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', display: 'block' }}>
                            Tam: {v.size}
                          </strong>
                          {v.color && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              {v.color.name}
                            </span>
                          )}
                        </div>

                        {/* Quick stock +/- adjustment */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <button
                            onClick={() => handleAdjustStock(p, v.id, -1)}
                            className="btn-icon"
                            style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)' }}
                            title="Diminuir 1 unidade"
                            aria-label="Diminuir estoque"
                          >
                            <Minus size={14} />
                          </button>

                          <span style={{ fontSize: '0.95rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                            {v.stock}
                          </span>

                          <button
                            onClick={() => handleAdjustStock(p, v.id, 1)}
                            className="btn-icon"
                            style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)' }}
                            title="Aumentar 1 unidade"
                            aria-label="Aumentar estoque"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }))}
      </div>
    </div>
  );
};
