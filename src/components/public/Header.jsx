import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Shield, Sparkles } from 'lucide-react';
import { LuxuryLogo } from '../common/LuxuryLogo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Header = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          transition: 'all var(--transition-normal)',
          backgroundColor: isScrolled ? 'rgba(243, 216, 207, 0.94)' : 'var(--color-bg-primary)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          boxShadow: isScrolled ? '0 4px 20px rgba(182, 112, 104, 0.12)' : 'none',
          borderBottom: `1px solid ${isScrolled ? 'rgba(232, 197, 185, 0.8)' : 'transparent'}`
        }}
      >
        {/* Top Mini Announcement Bar */}
        <div
          className="header-announcement-bar"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontSize: '0.74rem',
            padding: '0.35rem 0.75rem',
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
          <span>Atendimento com prova sob medida no Atelier • Venda e Locação</span>
        </div>

        <div className="container header-content-container">
          {/* Mobile Menu Button */}
          <button
            className="btn-icon mobile-menu-toggle-btn"
            style={{ display: 'none', width: 40, height: 40 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu de navegação"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Brand Logo */}
          <div onClick={() => handleNavClick('/')} className="header-logo-wrapper" style={{ cursor: 'pointer', padding: '0.25rem 0' }}>
            <div className="logo-desktop">
              <LuxuryLogo height={94} color="#B67068" />
            </div>
            <div className="logo-mobile" style={{ display: 'none' }}>
              <LuxuryLogo height={56} color="#B67068" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}
            className="desktop-nav"
          >
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

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="btn-icon header-action-btn"
              title="Buscar vestidos"
              aria-label="Buscar vestidos"
            >
              <Search size={18} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="btn-icon header-action-btn"
              title="Favoritos"
              aria-label="Ver favoritos"
              style={{ position: 'relative' }}
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn-icon header-action-btn"
              title="Sacola de Compras"
              aria-label="Ver sacola"
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
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
            className="drawer-panel"
            style={{ left: 0, right: 'auto', maxWidth: 'min(320px, 85vw)' }}
            onClick={(e) => e.stopPropagation()}
          >
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
              <LuxuryLogo height={64} color="#B67068" />
              <button
                className="btn-icon"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ width: 36, height: 36 }}
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', fontWeight: 600, padding: '0.25rem 0.5rem' }}>
                Navegação
              </span>

              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.route)}
                  style={{
                    textAlign: 'left',
                    fontSize: '0.98rem',
                    fontWeight: currentRoute === item.route ? 600 : 500,
                    padding: '0.75rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: currentRoute === item.route ? 'var(--color-bg-subtle)' : 'transparent',
                    color: currentRoute === item.route ? 'var(--color-primary)' : 'var(--color-text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '44px'
                  }}
                >
                  <span>{item.label}</span>
                  {currentRoute === item.route && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Spacer for fixed header */}
      <div className="header-fixed-spacer" />

      <style>{`
        .header-content-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--public-header-height);
        }
        .header-fixed-spacer {
          height: calc(var(--public-header-height) + 32px);
        }

        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle-btn { display: inline-flex !important; }
          .logo-desktop { display: none !important; }
          .logo-mobile { display: block !important; }
          .header-content-container {
            height: var(--public-header-height-mobile) !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .header-fixed-spacer {
            height: calc(var(--public-header-height-mobile) + 26px) !important;
          }
          .header-action-btn {
            width: 38px !important;
            height: 38px !important;
          }
        }
      `}</style>
    </>
  );
};
