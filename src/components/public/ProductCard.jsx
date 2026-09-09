import React from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../../core/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../common/StatusBadge';

export const ProductCard = ({ product, onClick }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const isFavorited = isWishlisted(product.id);
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0] || {
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    alt: product.name
  };

  const discount = calculateDiscount(product.price, product.promotionalPrice);
  const isOutOfStock = product.status === 'out_of_stock' || product.stock <= 0;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultVariant = product.variants?.[0] || null;
    addToCart(product, defaultVariant, product.modality === 'rent' ? 'rent' : 'buy', 1);
  };

  return (
    <div
      className="card-luxury product-card"
      onClick={() => onClick(product)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%'
      }}
    >
      {/* Image Media Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '135%', // 3:4 Luxury fashion portrait aspect ratio
          overflow: 'hidden',
          backgroundColor: '#F8E5DF'
        }}
      >
        <img
          src={primaryImage.url}
          alt={primaryImage.alt || product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="product-card-img"
        />

        {/* Top Badges Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            zIndex: 2
          }}
        >
          {product.featured && (
            <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
              Destaque
            </span>
          )}
          {discount.hasDiscount && (
            <span className="badge badge-danger" style={{ fontSize: '0.68rem', backgroundColor: 'var(--color-primary)' }}>
              {discount.percentageFormatted} OFF
            </span>
          )}
          {product.modality && product.modality !== 'both' && (
            <StatusBadge status={product.modality} type="modality" size="sm" />
          )}
          {isOutOfStock && (
            <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>
              Esgotado
            </span>
          )}
        </div>

        {/* Favorite Button Overlay */}
        <button
          onClick={handleFavoriteClick}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: '36px',
            height: '36px',
            zIndex: 2,
            backgroundColor: isFavorited ? 'var(--color-primary)' : 'rgba(255,253,252,0.85)',
            borderColor: isFavorited ? 'var(--color-primary)' : 'var(--color-border)',
            color: isFavorited ? '#FFFFFF' : 'var(--color-text-main)',
            backdropFilter: 'blur(8px)'
          }}
          aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={16} fill={isFavorited ? '#FFFFFF' : 'none'} />
        </button>

        {/* Quick Action Overlay on Hover */}
        <div
          className="product-card-hover-actions"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0.75rem',
            background: 'linear-gradient(to top, rgba(41,22,19,0.75) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'all var(--transition-normal)',
            zIndex: 2
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(product);
            }}
            className="btn btn-dark btn-sm"
            style={{ width: '100%', fontSize: '0.78rem', padding: '0.5rem 0.8rem' }}
          >
            <Eye size={14} />
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div
        style={{
          padding: '1.25rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          background: 'var(--color-bg-card)'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--color-primary)',
              fontWeight: 600,
              display: 'block',
              marginBottom: '0.35rem'
            }}
          >
            {product.categoryName || 'Alta Costura'}
          </span>

          <h3
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              lineHeight: 1.25,
              marginBottom: '0.6rem'
            }}
          >
            {product.name}
          </h3>
        </div>

        <div>
          {/* Price Layout */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            {discount.hasDiscount ? (
              <>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {formatCurrency(product.promotionalPrice)}
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'line-through'
                  }}
                >
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Rental Price Subtitle if available */}
          {product.rentalPrice && (
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Ou aluguel por:</span>
              <strong style={{ color: 'var(--color-text-main)' }}>{formatCurrency(product.rentalPrice)}</strong>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .product-card:hover .product-card-img {
          transform: scale(1.05);
        }
        .product-card:hover .product-card-hover-actions {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};
