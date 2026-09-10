import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import { LuxuryLogo } from '../common/LuxuryLogo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { buildWhatsAppLink } from '../../core/utils';

export const Header = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Início', route: '/' },
    { id: 'catalog', label: 'Vestidos & Coleção', route: '/produtos' },
    { id: 'categories', label: 'Categorias', route: '/categorias' },
    { id: 'new', label: 'Novidades', route: '/produtos?filtro=novidades' },
    { id: 'about', label: 'O Atelier', route: '/sobre' },
    { id: 'contact', label: 'Contato & Prova', route: '/contato' }
  ];

  const handleNavClick = (route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`main-header ${isScrolled ? 'header-scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          transition: 'all var(--transition-normal)',
          backgroundColor: isScrolled ? 'rgba(243, 216, 207, 0.96)' : 'var(--color-bg-primary)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isScrolled ? '0 4px 20px rgba(182, 112, 104, 0.12)' : 'none',
          borderBottom: `1px solid ${isScrolled ? 'rgba(232, 197, 185, 0.8)' : 'transparent'}`
        }}
      >
        {/* Top Announcement Bar */}
        <div
          className="header-announcement-bar"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            padding: '0.35rem 1rem',
            textAlign: 'center',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <Sparkles size={12} style={{ flexShrink: 0 }} />
          <span>Atelier Nice • Alta Costura Sob Medida, Venda e Locação</span>
        </div>

        <div className="container header-container">
          {/* ============================================================
              MOBILE HEADER (<= 900px):
              - Left: Menu Hamburger
              - Center: Logo Centralizada
              - Right: Carrinho de Compras
             ============================================================ */}
          <div className="mobile-header-bar">
            {/* Left: Menu Trigger */}
            <button
              className="mobile-header-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menu de navegação"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={24} color="var(--color-text-main)" /> : <Menu size={24} color="var(--color-text-main)" />}
            </button>

            {/* Center: Centered Brand Logo */}
            <div
              className="mobile-header-logo-center"
              onClick={() => handleNavClick('/')}
            >
              <LuxuryLogo height={52} color="#B67068" />
            </div>

            {/* Right: Cart Button */}
            <button
              className="mobile-header-btn mobile-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver sacola de compras"
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={24} color="var(--color-text-main)" />
              {cartCount > 0 && (
                <span className="header-cart-badge">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* ============================================================
              DESKTOP HEADER (> 900px):
              - Left: Logo
              - Center: Menu links
              - Right: Search + Wishlist + Cart
             ============================================================ */}
          <div className="desktop-header-bar">
            {/* Brand Logo */}
            <div onClick={() => handleNavClick('/')} className="desktop-header-logo" style={{ cursor: 'pointer', padding: '0.25rem 0' }}>
              <LuxuryLogo height={94} color="#B67068" />
            </div>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              {navItems.map((item) => {
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.route)}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                      letterSpacing: '0.04em',
                      position: 'relative',
                      padding: '0.4rem 0',
                      transition: 'color var(--transition-fast)'
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: 'var(--color-primary)',
                          borderRadius: '2px'
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Action Icons */}
            <div className="desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Search */}
              <button
                onClick={onOpenSearch}
                className="btn-icon header-action-btn"
                title="Buscar vestidos"
                aria-label="Buscar vestidos"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="btn-icon header-action-btn"
                title="Favoritos"
                aria-label="Ver favoritos"
                style={{ position: 'relative' }}
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="header-cart-badge">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn-icon header-action-btn"
                title="Sacola de Compras"
                aria-label="Ver sacola"
                style={{ position: 'relative' }}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="header-cart-badge">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ zIndex: 1100 }}
        >
          <div
            className="drawer-panel mobile-drawer-panel"
            style={{ left: 0, right: 'auto', maxWidth: 'min(340px, 88vw)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--color-bg-surface)'
              }}
            >
              <LuxuryLogo height={58} color="#B67068" />
              <button
                className="btn-icon"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ width: 36, height: 36 }}
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions inside Drawer: Search & Wishlist */}
            <div style={{ padding: '1rem 1.25rem 0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, minHeight: '40px', fontSize: '0.82rem', gap: '0.4rem', justifyContent: 'center' }}
              >
                <Search size={15} color="var(--color-primary)" />
                <span>Buscar</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, minHeight: '40px', fontSize: '0.82rem', gap: '0.4rem', justifyContent: 'center', position: 'relative' }}
              >
                <Heart size={15} color="var(--color-primary)" />
                <span>Favoritos {wishlistCount > 0 && `(${wishlistCount})`}</span>
              </button>
            </div>

            {/* Navigation links */}
            <div style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, overflowY: 'auto' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-text-muted)', fontWeight: 600, padding: '0.25rem 0.5rem' }}>
                Navegação Principal
              </span>

              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.route)}
                  style={{
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: currentRoute === item.route ? 600 : 500,
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: currentRoute === item.route ? 'var(--color-bg-subtle)' : 'transparent',
                    color: currentRoute === item.route ? 'var(--color-primary)' : 'var(--color-text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '46px'
                  }}
                >
                  <span>{item.label}</span>
                  {currentRoute === item.route && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />}
                </button>
              ))}
            </div>

            {/* Drawer Footer CTA */}
            <div style={{ padding: '1rem 1.25rem calc(1rem + var(--safe-area-bottom))', borderTop: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-subtle)' }}>
              <a
                href={buildWhatsAppLink({ customText: 'Olá Atelier Nice! Gostaria de atendimento para consultoria e prova de vestidos.' })}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', minHeight: '44px', fontSize: '0.88rem', gap: '0.5rem' }}
              >
                <MessageCircle size={16} />
                <span>Atendimento WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="header-fixed-spacer" />

      <style>{`
        .header-container {
          position: relative;
        }

        /* Desktop Mode (> 900px) */
        .desktop-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--public-header-height);
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .mobile-header-bar {
          display: none;
        }
        .header-fixed-spacer {
          height: calc(var(--public-header-height) + 32px);
        }

        .header-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--color-primary);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        }

        /* Mobile Mode (<= 900px) */
        @media (max-width: 900px) {
          .desktop-header-bar {
            display: none !important;
          }
          .mobile-header-bar {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            height: 64px;
            position: relative;
            width: 100%;
          }
          .mobile-header-btn {
            width: 44px;
            height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            color: var(--color-text-main);
            border-radius: var(--radius-sm);
            transition: background var(--transition-fast);
          }
          .mobile-header-btn:active {
            background-color: rgba(182, 112, 104, 0.12);
          }
          .mobile-header-logo-center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            z-index: 10;
          }
          .header-fixed-spacer {
            height: calc(64px + 28px) !important;
          }
          .header-announcement-bar {
            font-size: 0.68rem !important;
            padding: 0.3rem 0.5rem !important;
          }
        }
      `}</style>
    </>
  );
};
