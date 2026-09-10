import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, ChevronRight, Check, Shield, Scissors, Sparkles, ZoomIn } from 'lucide-react';
import { formatCurrency, calculateDiscount, buildProductWhatsAppMessage, buildWhatsAppLink } from '../../core/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/public/ProductCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { NeutralImagePlaceholder } from '../../components/common/NeutralImagePlaceholder';

export const ProductDetailPage = ({ product, onNavigate, onSelectProduct }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { products } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]?.size || '');
  const [selectedColor, setSelectedColor] = useState(product?.variants?.[0]?.color?.name || '');
  const [selectedModality, setSelectedModality] = useState(product?.modality === 'rent' ? 'rent' : 'buy');
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'specs' | 'sizes' | 'shipping'
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    if (product?.variants?.[0]) {
      setSelectedSize(product.variants[0].size || '');
      setSelectedColor(product.variants[0].color?.name || '');
    } else {
      setSelectedSize('');
      setSelectedColor('');
    }
    setSelectedModality(product?.modality === 'rent' ? 'rent' : 'buy');
  }, [product]);

  if (!product) return null;

  const isFavorited = isWishlisted(product.id);
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [];

  const currentImage = images[activeImageIndex] || images[0] || null;
  const discount = calculateDiscount(product.price, product.promotionalPrice);
  const isOutOfStock = product.status === 'out_of_stock' || (product.stock !== undefined && product.stock <= 0);

  // Selected variant finder
  const currentVariant = product.variants?.find(
    (v) => (selectedSize ? v.size === selectedSize : true) && (selectedColor ? (v.color?.name === selectedColor || !v.color) : true)
  ) || product.variants?.[0];

  const currentPrice = selectedModality === 'rent'
    ? product.rentalPrice
    : (product.promotionalPrice || product.price);

  // WhatsApp Dynamic Link with Real Product Data
  const waMessage = buildProductWhatsAppMessage({
    name: product.name,
    sku: currentVariant?.sku || product.sku,
    modality: product.modality === 'both' ? selectedModality : product.modality,
    size: selectedSize,
    color: selectedColor,
    price: currentPrice
  });

  const waUrl = buildWhatsAppLink(waMessage);

  // Related products
  const relatedProducts = products
    .filter((p) => (p.status === 'published' || p.status === 'out_of_stock') && p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      {/* Breadcrumbs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)',
          padding: '1.5rem 0'
        }}
      >
        <button onClick={() => onNavigate('/')} style={{ color: 'var(--color-text-muted)' }}>
          Início
        </button>
        <ChevronRight size={13} />
        <button onClick={() => onNavigate(`/produtos?categoria=${product.categoryId}`)} style={{ color: 'var(--color-text-muted)' }}>
          {product.categoryName || 'Vestidos'}
        </button>
        <ChevronRight size={13} />
        <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Product Layout: Gallery + Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'flex-start',
          marginBottom: '5rem'
        }}
      >
        {/* Gallery Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Photo with Zoom Lightbox Trigger */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '135%',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              backgroundColor: '#F8E5DF',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              cursor: currentImage?.url ? 'zoom-in' : 'default'
            }}
            onClick={() => currentImage?.url && setIsZoomOpen(true)}
          >
            {currentImage?.url ? (
              <>
                <img
                  src={currentImage.url}
                  alt={currentImage.alt || product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(255,253,252,0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <ZoomIn size={14} color="var(--color-primary)" />
                  <span>Ampliar Foto</span>
                </div>
              </>
            ) : (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <NeutralImagePlaceholder title={product.name} subtitle={product.categoryName || 'Alta Costura'} />
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: 76,
                    height: 100,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: `2px solid ${activeImageIndex === idx ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
                    boxShadow: activeImageIndex === idx ? '0 0 0 2px var(--color-primary-subtle)' : 'none',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `Miniatura ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information & Purchase Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header & Badges */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-soft">
                {product.categoryName}
              </span>
              {product.sku && (
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  SKU: <strong>{currentVariant?.sku || product.sku}</strong>
                </span>
              )}
              {product.featured && <span className="badge badge-gold">Exclusividade Atelier</span>}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 600,
                lineHeight: 1.15,
                color: 'var(--color-text-main)',
                marginBottom: '0.75rem'
              }}
            >
              {product.name}
            </h1>

            {product.shortDescription && (
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Pricing & Modality Selector */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Modality Toggle (If product offers both Buy & Rent) */}
            {product.modality === 'both' && (
              <div style={{ display: 'flex', backgroundColor: 'var(--color-bg-subtle)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                <button
                  onClick={() => setSelectedModality('buy')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedModality === 'buy' ? 'var(--color-primary)' : 'transparent',
                    color: selectedModality === 'buy' ? '#FFFFFF' : 'var(--color-text-main)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Comprar Peça
                </button>
                <button
                  onClick={() => setSelectedModality('rent')}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedModality === 'rent' ? 'var(--color-primary)' : 'transparent',
                    color: selectedModality === 'rent' ? '#FFFFFF' : 'var(--color-text-main)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Alugar p/ Evento
                </button>
              </div>
            )}

            {/* Price Display */}
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                {selectedModality === 'rent' ? 'Valor da Locação (com ajustes inclusos)' : 'Valor para Compra'}
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                {currentPrice && currentPrice > 0 ? (
                  <>
                    <span
                      style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-sans)'
                      }}
                    >
                      {formatCurrency(currentPrice)}
                    </span>

                    {selectedModality === 'buy' && discount.hasDiscount && (
                      <>
                        <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                          {formatCurrency(product.price)}
                        </span>
                        <span className="badge badge-danger" style={{ backgroundColor: 'var(--color-primary)' }}>
                          {discount.percentageFormatted}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    Sob Consulta no Atelier
                  </span>
                )}
              </div>
            </div>

            {/* Stock status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isOutOfStock ? 'var(--color-danger)' : 'var(--color-success)'
                }}
              />
              <span style={{ color: isOutOfStock ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 600 }}>
                {isOutOfStock ? 'Esgotado / Sob Encomenda' : 'Disponível no Atelier Nice'}
              </span>
            </div>
          </div>

          {/* Variations Matrix: Size Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                Tamanho da Peça: {selectedSize ? <strong>{selectedSize}</strong> : <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>Sob Medida</span>}
              </span>
              <button
                onClick={() => setActiveTab('sizes')}
                style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Guia de Medidas
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {product.variants && product.variants.length > 0 ? (
                Array.from(new Set(product.variants.map((v) => v.size))).map((size) => {
                  const isSelected = selectedSize === size;
                  const sizeVariant = product.variants?.find((v) => v.size === size);
                  const hasStock = sizeVariant ? sizeVariant.stock > 0 : true;

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!hasStock}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'var(--color-bg-card)',
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                        opacity: !hasStock ? 0.4 : 1,
                        cursor: !hasStock ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {size}
                    </button>
                  );
                })
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  Peça autoral com confecção e ajustes sob medida no Atelier.
                </div>
              )}
            </div>
          </div>

          {/* Variations Matrix: Color Swatches */}
          {product.variants && product.variants.some((v) => v.color) && (
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '0.6rem' }}>
                Cor da Peça: <strong>{selectedColor}</strong>
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {Array.from(
                  new Map(product.variants.filter((v) => v.color).map((v) => [v.color.name, v.color])).values()
                ).map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isSelected ? 'var(--color-bg-subtle)' : 'var(--color-bg-card)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          backgroundColor: color.hex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--color-text-main)' }}>
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action CTAs — Direct WhatsApp Conversion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{
                  flex: 1,
                  padding: '1.05rem',
                  backgroundColor: '#25D366',
                  borderColor: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.3)'
                }}
              >
                <MessageCircle size={20} />
                <span>Tenho Interesse via WhatsApp</span>
              </a>

              <button
                onClick={() => toggleWishlist(product)}
                className="btn-icon"
                style={{
                  width: '54px',
                  height: '54px',
                  backgroundColor: isFavorited ? 'var(--color-primary)' : 'var(--color-bg-card)',
                  color: isFavorited ? '#FFFFFF' : 'var(--color-text-main)',
                  borderColor: isFavorited ? 'var(--color-primary)' : 'var(--color-border)'
                }}
                title={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              >
                <Heart size={20} fill={isFavorited ? '#FFFFFF' : 'none'} />
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scissors size={16} color="var(--color-primary)" />
              <span>Ajustes de bainha e corpo inclusos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--color-primary)" />
              <span>Higienização profissional especializada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Technical Characteristics Section */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          marginBottom: '5rem'
        }}
      >
        {/* Tabs Bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-surface)',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'details', label: 'Descrição & Detalhes' },
            { id: 'specs', label: 'Ficha Técnica Estruturada' },
            { id: 'sizes', label: 'Tabela de Medidas & Prova' },
            { id: 'shipping', label: 'Envio & Política de Locação' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1.25rem 2rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.92rem',
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'transparent'}`,
                backgroundColor: activeTab === tab.id ? 'var(--color-bg-card)' : 'transparent',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2.5rem' }}>
          {activeTab === 'details' && (
            <div style={{ maxWidth: '800px', lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              <p style={{ marginBottom: '1.25rem' }}>{product.description}</p>
              {Array.isArray(product.tags) && product.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                  {product.tags.map((tag) => (
                    <span key={tag} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div style={{ maxWidth: '720px' }}>
              <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                Ficha Técnica da Alta Costura
              </h4>
              {product.characteristics && Object.values(product.characteristics).some(v => Boolean(v)) ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  {product.characteristics.fabric && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Tecido Principal</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                        {product.characteristics.fabric}
                      </strong>
                    </div>
                  )}

                  {product.characteristics.length && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Comprimento</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                        {product.characteristics.length}
                      </strong>
                    </div>
                  )}

                  {product.characteristics.neckline && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Decote</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                        {product.characteristics.neckline}
                      </strong>
                    </div>
                  )}

                  {product.characteristics.silhouette && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Modelagem</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                        {product.characteristics.silhouette}
                      </strong>
                    </div>
                  )}

                  {product.characteristics.occasion && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Ocasião Sugerida</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                        {product.characteristics.occasion}
                      </strong>
                    </div>
                  )}

                  {product.characteristics.style && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Estilo</span>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-text-main)', marginTop: '2px' }}>
                        {product.characteristics.style}
                      </strong>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  Peça autoral confeccionada sob medida. Consulte detalhes de modelagem, tecidos e caimento diretamente com nossa consultora no WhatsApp.
                </p>
              )}
            </div>
          )}

          {activeTab === 'sizes' && (
            <div style={{ maxWidth: '780px' }}>
              <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
                Guia de Medidas do Atelier Nice (cm)
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Nossas peças contam com margem interna de costura para ajustes personalizados. Caso tenha dúvidas, nossa estilista mede você pessoalmente.
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <thead style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem' }}>Tamanho</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem' }}>Busto</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem' }}>Cintura</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem' }}>Quadril</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.88rem' }}>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>PP (36)</td>
                      <td style={{ padding: '0.75rem 1rem' }}>82 - 86 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>64 - 68 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>90 - 94 cm</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>P (38)</td>
                      <td style={{ padding: '0.75rem 1rem' }}>86 - 90 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>68 - 72 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>94 - 98 cm</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>M (40)</td>
                      <td style={{ padding: '0.75rem 1rem' }}>90 - 96 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>72 - 78 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>98 - 104 cm</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>G (42)</td>
                      <td style={{ padding: '0.75rem 1rem' }}>96 - 102 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>78 - 84 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>104 - 110 cm</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>GG (44)</td>
                      <td style={{ padding: '0.75rem 1rem' }}>102 - 108 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>84 - 90 cm</td>
                      <td style={{ padding: '0.75rem 1rem' }}>110 - 116 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ maxWidth: '780px', fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
                Condições de Locação & Entrega
              </h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li>
                  <strong>Período Padrão de Locação:</strong> 4 dias (retirada 1 dia antes do evento e devolução 1 dia após).
                </li>
                <li>
                  <strong>Ajustes Inclusos:</strong> Bainha para a altura do salto e pequenos ajustes de busto/cintura são realizados por nossa equipe de costura sem custo adicional.
                </li>
                <li>
                  <strong>Higienização:</strong> A lavagem e desinfecção pós-evento são de inteira responsabilidade do Atelier Nice em lavanderia têxtil especializada.
                </li>
                <li>
                  <strong>Envio Nacional:</strong> Para noivas e madrinhas de outros estados, enviamos em bag protetora térmica via Sedex com seguro integral.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
              Complemente sua Escolha
            </span>
            <h2 className="heading-section" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Você Também Pode Amar
            </h2>
          </div>

          <div
            className="product-related-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Bar */}
      <div
        className="product-mobile-bottom-bar"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-bg-card)',
          borderTop: '1px solid var(--color-border)',
          padding: '0.75rem 1rem calc(0.75rem + var(--safe-area-bottom, 0px))',
          zIndex: 900,
          boxShadow: '0 -4px 20px rgba(41,22,19,0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          {currentPrice && currentPrice > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {selectedModality === 'rent' ? 'Locação' : 'Compra'}
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatCurrency(currentPrice)}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Sob Consulta
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flex: 1, justifyContent: 'flex-end' }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
              style={{
                backgroundColor: '#25D366',
                borderColor: '#25D366',
                color: '#FFFFFF',
                padding: '0 1.25rem',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                boxShadow: '0 2px 10px rgba(37,211,102,0.3)'
              }}
            >
              <MessageCircle size={18} />
              <span>Tenho Interesse</span>
            </a>
          </div>
        </div>
      </div>

      {/* Image Zoom Lightbox Modal */}
      {isZoomOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsZoomOpen(false)}
          style={{ backgroundColor: 'rgba(25,12,10,0.92)' }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="btn-icon"
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                backgroundColor: '#FFFFFF',
                color: '#291613'
              }}
              aria-label="Fechar zoom"
            >
              ✕
            </button>
            <img
              src={currentImage.url}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)'
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-mobile-bottom-bar {
            display: block !important;
          }
          .product-related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};
