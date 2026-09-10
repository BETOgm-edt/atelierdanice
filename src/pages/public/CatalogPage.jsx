import React, { useState, useMemo, useEffect } from 'react';
import { Filter, Search, RotateCcw, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/public/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';
import { STANDARD_SIZES, STANDARD_COLORS } from '../../core/constants';
import { formatCurrency, buildWhatsAppLink } from '../../core/utils';

export const CatalogPage = ({ initialCategory = null, initialSearch = '', onSelectProduct }) => {
  const { products, categories } = useStore();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedModality, setSelectedModality] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isFilterMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterMobileOpen]);

  // Filter products: Only published or out-of-stock items in public catalog
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.status === 'published' || p.status === 'out_of_stock');

    if (search.trim() !== '') {
      const term = search.trim().toLowerCase();
      result = result.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(term);
        const skuMatch = p.sku?.toLowerCase().includes(term);
        const catMatch = p.categoryName?.toLowerCase().includes(term);
        const tagMatch = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(term));
        return nameMatch || skuMatch || catMatch || tagMatch;
      });
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory || p.categorySlug === selectedCategory);
    }

    if (selectedModality !== 'all') {
      if (selectedModality === 'sale') {
        result = result.filter(p => p.modality === 'sale' || p.modality === 'both');
      } else if (selectedModality === 'rent') {
        result = result.filter(p => p.modality === 'rent' || p.modality === 'both');
      }
    }

    if (selectedSize !== 'all') {
      result = result.filter(p =>
        Array.isArray(p.variants) && p.variants.some(v => v.size === selectedSize && (v.stock > 0 || !onlyInStock))
      );
    }

    if (selectedColor !== 'all') {
      result = result.filter(p =>
        Array.isArray(p.variants) && p.variants.some(v => v.color?.name === selectedColor)
      );
    }

    if (onlyInStock) {
      result = result.filter(p => p.stock > 0 && p.status !== 'out_of_stock');
    }

    result = result.filter(p => {
      const effectivePrice = p.promotionalPrice || p.price;
      return effectivePrice <= maxPrice;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return result;
  }, [products, search, selectedCategory, selectedSize, selectedColor, selectedModality, onlyInStock, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setSelectedModality('all');
    setOnlyInStock(false);
    setMaxPrice(6000);
    setSortBy('newest');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    selectedModality !== 'all' ||
    onlyInStock ||
    maxPrice < 6000;

  // Filter content component reused in both desktop sidebar and mobile drawer
  const FilterControls = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Category Filter */}
      <div>
        <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
          Categoria
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              textAlign: 'left',
              fontSize: '0.88rem',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedCategory === 'all' ? 'var(--color-bg-subtle)' : 'transparent',
              color: selectedCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-main)',
              fontWeight: selectedCategory === 'all' ? 600 : 400
            }}
          >
            Todas as Categorias
          </button>
          {categories.filter(c => c.active !== false).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                textAlign: 'left',
                fontSize: '0.88rem',
                padding: '0.45rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: selectedCategory === cat.id ? 'var(--color-bg-subtle)' : 'transparent',
                color: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                fontWeight: selectedCategory === cat.id ? 600 : 400
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Modality Filter */}
      <div>
        <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
          Modalidade
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button
            onClick={() => setSelectedModality('all')}
            style={{
              textAlign: 'left',
              fontSize: '0.88rem',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedModality === 'all' ? 'var(--color-bg-subtle)' : 'transparent',
              color: selectedModality === 'all' ? 'var(--color-primary)' : 'var(--color-text-main)',
              fontWeight: selectedModality === 'all' ? 600 : 400
            }}
          >
            Venda & Aluguel (Todos)
          </button>
          <button
            onClick={() => setSelectedModality('sale')}
            style={{
              textAlign: 'left',
              fontSize: '0.88rem',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedModality === 'sale' ? 'var(--color-bg-subtle)' : 'transparent',
              color: selectedModality === 'sale' ? 'var(--color-primary)' : 'var(--color-text-main)',
              fontWeight: selectedModality === 'sale' ? 600 : 400
            }}
          >
            Disponível para Venda
          </button>
          <button
            onClick={() => setSelectedModality('rent')}
            style={{
              textAlign: 'left',
              fontSize: '0.88rem',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedModality === 'rent' ? 'var(--color-bg-subtle)' : 'transparent',
              color: selectedModality === 'rent' ? 'var(--color-primary)' : 'var(--color-text-main)',
              fontWeight: selectedModality === 'rent' ? 600 : 400
            }}
          >
            Disponível para Aluguel
          </button>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
          Tamanho
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          <button
            onClick={() => setSelectedSize('all')}
            className={`badge ${selectedSize === 'all' ? 'badge-primary' : 'badge-neutral'}`}
            style={{ cursor: 'pointer', padding: '0.4rem 0.7rem' }}
          >
            Todos
          </button>
          {STANDARD_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`badge ${selectedSize === size ? 'badge-primary' : 'badge-neutral'}`}
              style={{ cursor: 'pointer', padding: '0.4rem 0.7rem' }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
          Cor Principal
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {STANDARD_COLORS.map((c) => {
            const isSelected = selectedColor === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedColor(isSelected ? 'all' : c.name)}
                title={c.name}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: isSelected ? '2px solid var(--color-text-main)' : '1px solid var(--color-border)',
                  boxShadow: isSelected ? '0 0 0 2px var(--color-primary)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isSelected && <Check size={14} color={c.hex === '#FAF7F2' || c.hex === '#F3D8CF' ? '#291613' : '#FFFFFF'} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
          <span>Preço Máximo</span>
          <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={500}
          max={6000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-primary)', height: '6px' }}
        />
      </div>

      {/* In Stock Only Toggle */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--color-text-main)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }}
          />
          <span>Apenas vestidos em estoque</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="container catalog-container" style={{ paddingBottom: '6rem' }}>
      {/* Header Title Section */}
      <div className="catalog-header-hero" style={{ textAlign: 'center', padding: '2.5rem 0 1.75rem' }}>
        <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
          Coleção Exclusiva
        </span>
        <h1 className="heading-section catalog-title" style={{ marginBottom: '0.5rem' }}>
          Vestidos de Alta Costura
        </h1>
        <p className="catalog-subtitle" style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Modelos exclusivos para compra e locação sob medida. Filtre por ocasião, tamanho ou tonalidade.
        </p>
      </div>

      {/* Search & Top Action Bar */}
      <div
        className="catalog-search-bar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 280px', width: '100%' }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Pesquisar por modelo, SKU ou detalhe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-text"
            style={{ paddingLeft: '2.6rem', width: '100%' }}
          />
        </div>

        {/* Right side controls */}
        <div className="catalog-controls-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsFilterMobileOpen(true)}
            className="btn btn-secondary btn-sm mobile-filter-btn"
            style={{ display: 'none', alignItems: 'center', gap: '0.4rem', minHeight: '42px', padding: '0 1rem' }}
          >
            <Filter size={16} />
            <span>Filtros {hasActiveFilters && '(Ativos)'}</span>
          </button>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-luxury"
              style={{ width: 'auto', flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.85rem', minHeight: '42px' }}
            >
              <option value="newest">Mais Recentes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name-asc">Nome (A - Z)</option>
              <option value="name-desc">Nome (Z - A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2.5rem', alignItems: 'flex-start' }} className="catalog-layout">
        {/* Sidebar Filters Desktop (Hidden on Mobile) */}
        <aside
          className="catalog-sidebar-desktop"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SlidersHorizontal size={16} color="var(--color-primary)" />
              <span>Filtros</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer' }}
              >
                <RotateCcw size={12} />
                <span>Limpar</span>
              </button>
            )}
          </div>

          <FilterControls />
        </aside>

        {/* Products Grid Area */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Mostrando <strong>{filteredProducts.length}</strong> vestidos
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mobile-clear-btn"
                style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            products.length === 0 ? (
              <EmptyState
                title="Coleção em Preparação"
                description="Novas peças de alta costura estão sendo confeccionadas e catalogadas. Entre em contato diretamente com o Atelier para atendimento personalizado e encomendas sob medida."
                actionText="Falar com o Atelier no WhatsApp"
                onAction={() => {
                  window.open(buildWhatsAppLink({ customText: 'Olá! Gostaria de consultar vestidos sob medida e peças do Atelier Nice.' }), '_blank');
                }}
              />
            ) : (
              <EmptyState
                title="Nenhum vestido encontrado"
                description="Nenhum modelo corresponde aos critérios de busca selecionados. Tente ajustar os filtros de categoria, tamanho ou preço."
                actionText="Limpar Todos os Filtros"
                onAction={resetFilters}
              />
            )
          ) : (
            <div
              className="catalog-products-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-in Bottom Sheet / Drawer */}
      {isFilterMobileOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsFilterMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(41, 22, 19, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div
            className="mobile-filter-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-bg-card)',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '85dvh',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
              animation: 'slideUpDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden'
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={18} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  Filtros de Coleção
                </h3>
              </div>
              <button
                onClick={() => setIsFilterMobileOpen(false)}
                className="btn-icon"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                aria-label="Fechar filtros"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body Scrollable */}
            <div
              style={{
                padding: '1.5rem',
                overflowY: 'auto',
                flex: 1
              }}
            >
              <FilterControls />
            </div>

            {/* Drawer Sticky Footer */}
            <div
              style={{
                padding: '1rem 1.5rem calc(1rem + var(--safe-area-bottom, 0px))',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex',
                gap: '0.75rem',
                flexShrink: 0
              }}
            >
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="btn btn-secondary"
                  style={{ flex: 1, minHeight: '46px', fontSize: '0.88rem' }}
                >
                  <RotateCcw size={15} />
                  <span>Limpar</span>
                </button>
              )}
              <button
                onClick={() => setIsFilterMobileOpen(false)}
                className="btn btn-primary"
                style={{ flex: hasActiveFilters ? 2 : 1, minHeight: '46px', fontSize: '0.88rem' }}
              >
                <span>Ver {filteredProducts.length} Vestidos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpDrawer {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @media (max-width: 900px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .catalog-sidebar-desktop {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .catalog-search-bar {
            padding: 0.85rem !important;
            gap: 0.75rem !important;
            margin-bottom: 1.5rem !important;
          }
          .catalog-controls-right {
            width: 100%;
            justify-content: space-between;
          }
        }
        @media (max-width: 640px) {
          .catalog-header-hero {
            padding: 1.5rem 0 1rem !important;
          }
          .catalog-title {
            font-size: 1.65rem !important;
          }
          .catalog-subtitle {
            font-size: 0.85rem !important;
          }
          .catalog-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};
