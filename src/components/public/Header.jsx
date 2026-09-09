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
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            padding: '0.4rem 1rem',
            textAlign: 'center',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}
        >
          <Sparkles size={13} />
          <span>Atendimento exclusivo com prova sob medida em nosso Atelier. Venda e Locação de Alta Costura.</span>
        </div>

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--public-header-height)' }}>
          {/* Mobile Menu Button */}
          <button
            className="btn-ghost"
            style={{ display: 'none', padding: '0.5rem' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <div onClick={() => handleNavClick('/')} style={{ cursor: 'pointer', padding: '0.5rem 0' }}>
            <LuxuryLogo height={98} color="#B67068" />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="btn-icon"
              title="Buscar vestidos"
              aria-label="Buscar"
            >
              <Search size={19} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="btn-icon"
              title="Favoritos"
              aria-label="Ver favoritos"
              style={{ position: 'relative' }}
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
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
              className="btn-icon"
              title="Sacola de Compras"
              aria-label="Ver sacola"
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
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

            {/* Admin Direct Access */}
            <button
              onClick={() => onNavigate('/admin')}
              className="btn btn-outline btn-sm admin-pill-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                padding: '0.4rem 0.8rem',
                marginLeft: '0.5rem'
              }}
              title="Acessar Painel de Gestão"
            >
              <Shield size={14} />
              <span>Painel Admin</span>
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
            style={{ left: 0, right: 'auto', maxWidth: '300px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--color-border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <LuxuryLogo height={84} color="#B67068" />
              <button className="btn-ghost" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.route)}
                  style={{
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 500,
                    padding: '0.6rem 0',
                    color: currentRoute === item.route ? 'var(--color-primary)' : 'var(--color-text-main)',
                    borderBottom: '1px solid var(--color-bg-subtle)'
                  }}
                >
                  {item.label}
                </button>
              ))}

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.88rem' }}
                >
                  <Shield size={16} />
                  <span>Painel Administrativo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: 'calc(var(--public-header-height) + 32px)' }} />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          #mobile-menu-toggle { display: inline-flex !important; }
          .admin-pill-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};
