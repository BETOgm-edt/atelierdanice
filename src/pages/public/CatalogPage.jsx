import React, { useState, useMemo } from 'react';
import { Filter, Search, RotateCcw, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/public/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';
import { STANDARD_SIZES, STANDARD_COLORS } from '../../core/constants';
import { formatCurrency } from '../../core/utils';

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

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      {/* Header Title Section */}
      <div style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
        <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
          Coleção Exclusiva
        </span>
        <h1 className="heading-section" style={{ marginBottom: '0.5rem' }}>
          Vestidos de Alta Costura
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Modelos exclusivos para compra e locação sob medida. Filtre por ocasião, tamanho ou tonalidade.
        </p>
      </div>

      {/* Search & Top Action Bar */}
      <div
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
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Pesquisar por nome, SKU, tecido ou detalhe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-text"
            style={{ paddingLeft: '2.6rem' }}
          />
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
            className="btn btn-secondary btn-sm mobile-filter-btn"
          >
            <Filter size={15} />
            <span>Filtros {hasActiveFilters && '(Ativos)'}</span>
          </button>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-luxury"
              style={{ width: 'auto', padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
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
        {/* Sidebar Filters Desktop */}
        <aside
          className={`catalog-sidebar ${isFilterMobileOpen ? 'mobile-open' : ''}`}
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
                  padding: '0.35rem 0.5rem',
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
                    padding: '0.35rem 0.5rem',
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
                  padding: '0.35rem 0.5rem',
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
                  padding: '0.35rem 0.5rem',
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
                  padding: '0.35rem 0.5rem',
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
                style={{ cursor: 'pointer', padding: '0.35rem 0.6rem' }}
              >
                Todos
              </button>
              {STANDARD_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`badge ${selectedSize === size ? 'badge-primary' : 'badge-neutral'}`}
                  style={{ cursor: 'pointer', padding: '0.35rem 0.6rem' }}
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
                      width: 26,
                      height: 26,
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
                    {isSelected && <Check size={12} color={c.hex === '#FAF7F2' || c.hex === '#F3D8CF' ? '#291613' : '#FFFFFF'} />}
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
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
          </div>

          {/* In Stock Only Toggle */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--color-text-main)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }}
              />
              <span>Apenas vestidos em estoque</span>
            </label>
          </div>
        </aside>

        {/* Products Grid Area */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Mostrando <strong>{filteredProducts.length}</strong> vestidos
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState
              title="Nenhum vestido encontrado"
              description="Nenhum modelo corresponde aos critérios de busca selecionados. Tente ajustar os filtros de categoria, tamanho ou preço."
              actionText="Limpar Todos os Filtros"
              onAction={resetFilters}
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '2rem'
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

      <style>{`
        @media (max-width: 900px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
          .catalog-sidebar {
            display: none !important;
          }
          .catalog-sidebar.mobile-open {
            display: flex !important;
            margin-bottom: 1.5rem;
          }
        }
        @media (min-width: 901px) {
          .mobile-filter-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
