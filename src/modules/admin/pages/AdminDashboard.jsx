import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  DollarSign,
  Plus,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { orderRepository } from '../../../data/orderRepository';
import { formatCurrency, formatShortDate } from '../../../core/utils';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const AdminDashboard = ({ onNavigateToTab, onNewProduct }) => {
  const { products, categories } = useStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await orderRepository.getAll();
      setOrders(data || []);
    };
    loadOrders();
  }, []);

  // Metrics calculation from live data
  const publishedProducts = products.filter(p => p.status === 'published');
  const draftProducts = products.filter(p => p.status === 'draft');
  const lowStockProducts = products.filter(p => p.stock <= (p.minStockAlert || 1));
  const outOfStockProducts = products.filter(p => p.stock <= 0 || p.status === 'out_of_stock');

  // Real metrics calculated from live store data
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);
  const realCompletedRevenue = orders
    .filter(o => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrdersCount = orders.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome Banner */}
      <div
        className="admin-dashboard-hero"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--color-bg-card)',
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary)', fontWeight: 600 }}>
            Visão Geral do Negócio
          </span>
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2rem', color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
            Painel Executivo Atelier Nice
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Gerenciamento em tempo real do catálogo, estoque e consultas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onNewProduct}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <Plus size={18} />
            <span>Cadastrar Novo Vestido</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div
        className="admin-dashboard-kpis"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Card 1: Valor em Acervo */}
        <div
          className="admin-dashboard-kpi-card"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
            cursor: 'pointer'
          }}
          onClick={() => onNavigateToTab('stock')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Valor do Acervo (Estoque)</span>
            <div className="btn-icon" style={{ width: 36, height: 36, backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="admin-dashboard-kpi-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', fontFamily: 'var(--font-sans)' }}>
            {formatCurrency(totalInventoryValue)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
            {products.reduce((acc, p) => acc + (p.stock || 0), 0)} peças cadastradas
          </span>
        </div>

        {/* Card 2: Produtos Ativos */}
        <div
          className="admin-dashboard-kpi-card"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
            cursor: 'pointer'
          }}
          onClick={() => onNavigateToTab('products')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Vestidos Publicados</span>
            <div className="btn-icon" style={{ width: 36, height: 36, backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
              <Package size={18} />
            </div>
          </div>
          <div className="admin-dashboard-kpi-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', fontFamily: 'var(--font-sans)' }}>
            {publishedProducts.length} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>/ {products.length} total</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
            {draftProducts.length} em rascunho
          </span>
        </div>

        {/* Card 3: Pedidos & Atendimentos */}
        <div
          className="admin-dashboard-kpi-card"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
            cursor: 'pointer'
          }}
          onClick={() => onNavigateToTab('orders')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Atendimentos & Pedidos</span>
            <div className="btn-icon" style={{ width: 36, height: 36, backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="admin-dashboard-kpi-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', fontFamily: 'var(--font-sans)' }}>
            {totalOrdersCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
            {orders.filter(o => o.status === 'processing' || o.status === 'fitting').length} em andamento
          </span>
        </div>

        {/* Card 4: Alertas de Estoque */}
        <div
          className="admin-dashboard-kpi-card"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
            cursor: 'pointer'
          }}
          onClick={() => onNavigateToTab('stock')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Alertas de Estoque</span>
            <div className="btn-icon" style={{ width: 36, height: 36, backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="admin-dashboard-kpi-value" style={{ fontSize: '1.75rem', fontWeight: 700, color: lowStockProducts.length > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontFamily: 'var(--font-sans)' }}>
            {lowStockProducts.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
            {outOfStockProducts.length} esgotados
          </span>
        </div>
      </div>

      {/* 2-Column Layout: Recent Products & Categories Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}
      >
        {/* Recent Products Table Preview */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Últimos Vestidos Atualizados
            </h3>
            <button
              onClick={() => onNavigateToTab('products')}
              style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Ver todos ({products.length})
            </button>
          </div>

          <div style={{ padding: '0.5rem 1rem' }}>
            {products.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                Nenhum vestido cadastrado ainda.
              </div>
            ) : (
              products.slice(0, 5).map((p) => {
                const img = p.images?.[0]?.url;
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0.5rem',
                      borderBottom: '1px solid var(--color-border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      {img && !img.includes('unsplash') ? (
                        <img
                          src={img}
                          alt={p.name}
                          style={{ width: 42, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 42,
                            height: 56,
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--color-bg-subtle)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-primary)'
                          }}
                        >
                          <Sparkles size={16} />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          SKU: {p.sku || 'N/A'} • Estoque: {p.stock || 0}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <StatusBadge status={p.status} size="sm" />
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {formatCurrency(p.promotionalPrice || p.price)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Categories Distribution */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                Coleções & Categorias
              </h3>
              <button
                onClick={() => onNavigateToTab('categories')}
                style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Gerenciar
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categories.map((cat) => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                const percent = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{cat.name}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{count} vestidos ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: 6, backgroundColor: 'var(--color-bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: 'var(--color-primary)',
                          borderRadius: 3
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Patrimônio em Acervo: <strong style={{ color: 'var(--color-text-main)' }}>{formatCurrency(totalInventoryValue)}</strong>
            </div>
            <button
              onClick={() => onNavigateToTab('stock')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              Ver Inventário
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .admin-dashboard-hero {
            padding: 1.25rem 1rem !important;
          }
          .admin-dashboard-hero h2 {
            font-size: 1.5rem !important;
          }
          .admin-dashboard-kpis {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .admin-dashboard-kpi-card {
            padding: 1rem !important;
          }
          .admin-dashboard-kpi-value {
            font-size: 1.35rem !important;
          }
        }
        @media (max-width: 480px) {
          .admin-dashboard-kpis {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
