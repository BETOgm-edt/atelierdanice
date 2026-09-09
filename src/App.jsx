import React, { useState, useEffect } from 'react';
import { Header } from './components/public/Header';
import { Footer } from './components/public/Footer';
import { HomePage } from './pages/public/HomePage';
import { CatalogPage } from './pages/public/CatalogPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

import { CartDrawer } from './components/public/CartDrawer';
import { WishlistDrawer } from './components/public/WishlistDrawer';
import { QuickSearchModal } from './components/public/QuickSearchModal';
import { CheckoutModal } from './components/public/CheckoutModal';
import { WhatsAppFloatingButton } from './components/public/WhatsAppFloatingButton';

import { AdminLayout } from './modules/admin/AdminLayout';
import { AdminLogin } from './modules/admin/pages/AdminLogin';
import { AdminDashboard } from './modules/admin/pages/AdminDashboard';
import { AdminProductsList } from './modules/admin/pages/AdminProductsList';
import { AdminProductForm } from './modules/admin/pages/AdminProductForm';
import { AdminCategories } from './modules/admin/pages/AdminCategories';
import { AdminOrders } from './modules/admin/pages/AdminOrders';
import { AdminCustomers } from './modules/admin/pages/AdminCustomers';
import { AdminStock } from './modules/admin/pages/AdminStock';
import { AdminContent } from './modules/admin/pages/AdminContent';
import { AdminSettings } from './modules/admin/pages/AdminSettings';

import { useAuth } from './context/AuthContext';
import { useStore } from './context/StoreContext';

export function App() {
  const { isAuthenticated } = useAuth();
  const { products, categories, loading } = useStore();

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname || '/');
  const [activeProduct, setActiveProduct] = useState(null);
  const [initialCatalogCategory, setInitialCatalogCategory] = useState(null);
  const [initialCatalogSearch, setInitialCatalogSearch] = useState('');

  // Admin Navigation State
  const [adminTab, setAdminTab] = useState('dashboard');
  const [adminEditingProduct, setAdminEditingProduct] = useState(null);

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);

    if (route.startsWith('/produtos')) {
      const url = new URL(window.location.origin + route);
      const catParam = url.searchParams.get('categoria');
      const searchParam = url.searchParams.get('busca');
      setInitialCatalogCategory(catParam || 'all');
      setInitialCatalogSearch(searchParam || '');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setActiveProduct(product);
    navigate(`/vestidos/${product.slug || product.id}`);
  };

  const handleAdminEditProduct = (product) => {
    setAdminEditingProduct(product);
    setAdminTab('edit-product');
  };

  const handleAdminNewProduct = () => {
    setAdminEditingProduct(null);
    setAdminTab('new-product');
  };

  const handleAdminPreviewProduct = (product) => {
    setActiveProduct(product);
    navigate(`/vestidos/${product.slug || product.id}`);
  };

  // 1. ADMIN ROUTE RENDERING
  if (currentRoute.startsWith('/admin')) {
    if (!isAuthenticated) {
      return (
        <AdminLogin onReturnToStore={() => navigate('/')} />
      );
    }

    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={(tab) => {
          setAdminTab(tab);
          if (tab !== 'edit-product' && tab !== 'new-product') {
            setAdminEditingProduct(null);
          }
        }}
        onNavigateToStore={() => navigate('/')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateToTab={(tab) => setAdminTab(tab)}
            onNewProduct={handleAdminNewProduct}
          />
        )}

        {adminTab === 'products' && (
          <AdminProductsList
            onNewProduct={handleAdminNewProduct}
            onEditProduct={handleAdminEditProduct}
            onPreviewProduct={handleAdminPreviewProduct}
          />
        )}

        {(adminTab === 'new-product' || adminTab === 'edit-product') && (
          <AdminProductForm
            editingProduct={adminEditingProduct}
            onCancel={() => setAdminTab('products')}
            onSuccess={() => setAdminTab('products')}
            onPreview={handleAdminPreviewProduct}
          />
        )}

        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'stock' && <AdminStock />}
        {adminTab === 'content' && <AdminContent />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // 2. STOREFRONT PUBLIC ROUTE RENDERING
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Public Storefront Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Public Page Routing */}
      <main style={{ flex: 1 }}>
        {currentRoute === '/' && (
          <HomePage
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute.startsWith('/produtos') && (
          <CatalogPage
            initialCategory={initialCatalogCategory}
            initialSearch={initialCatalogSearch}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute.startsWith('/categorias') && (
          <CatalogPage
            initialCategory={null}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute.startsWith('/vestidos/') && activeProduct && (
          <ProductDetailPage
            product={activeProduct}
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute.startsWith('/vestidos/') && !activeProduct && (
          <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2rem', marginBottom: '1rem' }}>
              Vestido em Exibição
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Carregando detalhes da alta costura...
            </p>
            <button onClick={() => navigate('/produtos')} className="btn btn-primary">
              Voltar ao Catálogo
            </button>
          </div>
        )}

        {currentRoute === '/sobre' && (
          <AboutPage onNavigate={navigate} />
        )}

        {currentRoute === '/contato' && (
          <ContactPage />
        )}
      </main>

      {/* Public Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreCatalog={() => navigate('/produtos')}
      />

      <WishlistDrawer
        onSelectProduct={handleSelectProduct}
        onExploreCatalog={() => navigate('/produtos')}
      />

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        onExploreAll={(term) => navigate(`/produtos?busca=${encodeURIComponent(term)}`)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={(order) => {
          // Stay on order confirmation view inside modal
        }}
      />

      {/* Contextual WhatsApp Floating CTA */}
      <WhatsAppFloatingButton
        contextProductName={currentRoute.startsWith('/vestidos/') ? activeProduct?.name : null}
        contextProductSKU={currentRoute.startsWith('/vestidos/') ? activeProduct?.sku : null}
      />
    </div>
  );
}

export default App;
