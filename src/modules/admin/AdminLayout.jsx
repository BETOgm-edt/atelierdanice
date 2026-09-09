import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Sparkles,
  Shield,
  ChevronRight
} from 'lucide-react';
import { LuxuryLogo } from '../../components/common/LuxuryLogo';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export const AdminLayout = ({ activeTab, onSelectTab, onNavigateToStore, children }) => {
  const { adminUser, logout } = useAuth();
  const { products, settings } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const lowStockCount = products.filter(p => p.stock <= (p.minStockAlert || 1)).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos & Catálogo', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categorias', icon: FolderTree },
    { id: 'orders', label: 'Pedidos & Vendas', icon: ShoppingBag },
    { id: 'customers', label: 'Clientes (CRM)', icon: Users },
    { id: 'stock', label: 'Controle de Estoque', icon: Boxes, alert: lowStockCount > 0 ? lowStockCount : null },
    { id: 'content', label: 'Banners & Conteúdo', icon: Layers },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  const handleItemClick = (id) => {
    onSelectTab(id);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3D8CF' }}>
      {/* Sidebar Desktop & Mobile */}
      <aside
        style={{
          width: 'var(--admin-sidebar-width)',
          backgroundColor: '#4E231F',
          color: '#FAF0EC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 950,
          transition: 'transform var(--transition-normal)',
          borderRight: '1px solid rgba(243,216,207,0.15)'
        }}
        className={`admin-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}
      >
        <div>
          {/* Brand Logo in Admin */}
          <div
            style={{
              padding: '1.75rem 1.5rem',
              borderBottom: '1px solid rgba(243,216,207,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <LuxuryLogo height={72} color="#F3D8CF" />
            </div>
            <button
              className="btn-ghost mobile-close-btn"
              onClick={() => setIsMobileSidebarOpen(false)}
              style={{ color: '#FFFFFF', display: 'none' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Admin Role Tag */}
          <div
            style={{
              padding: '0.85rem 1.5rem',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--color-primary-light)'
            }}
          >
            <Shield size={14} />
            <span>PAINEL DE GESTÃO EXCLUSIVA</span>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#C7AFA7',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  className="admin-nav-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} color={isActive ? '#FFFFFF' : '#B67068'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                        color: '#FFFFFF'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.alert && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-danger)',
                        color: '#FFFFFF',
                        fontWeight: 700
                      }}
                    >
                      {item.alert} alerta
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onNavigateToStore}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              color: '#F4E3DC',
              backgroundColor: 'rgba(255,255,255,0.06)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={16} color="var(--color-primary-light)" />
            <span>Ver Loja Pública</span>
          </button>

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.84rem',
              color: 'var(--color-danger-border)',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: 'var(--admin-sidebar-width)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}
        className="admin-main-wrapper"
      >
        {/* Top Navbar */}
        <header
          style={{
            height: 'var(--admin-header-height)',
            backgroundColor: 'var(--color-bg-card)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 800
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="btn-ghost mobile-menu-btn"
              style={{ display: 'none', padding: '4px' }}
            >
              <Menu size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <span>Painel</span>
              <ChevronRight size={14} />
              <strong style={{ color: 'var(--color-text-main)', textTransform: 'capitalize' }}>
                {menuItems.find(m => m.id === activeTab)?.label || activeTab}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Store Switch */}
            <button
              onClick={onNavigateToStore}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.82rem' }}
            >
              <ExternalLink size={14} />
              <span>Acessar Loja</span>
            </button>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={adminUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Gestor"
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }} className="admin-user-details">
                <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                  {adminUser?.name || 'Nice — Diretora'}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  Administradora Master
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
          .mobile-close-btn {
            display: inline-flex !important;
          }
          .admin-user-details {
            display: none !important;
          }
        }
        .admin-nav-item:hover {
          background-color: rgba(255,255,255,0.08);
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
