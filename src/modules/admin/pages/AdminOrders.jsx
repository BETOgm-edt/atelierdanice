import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Search, Eye, Filter, CheckCircle2, Clock, Truck, XCircle, X } from 'lucide-react';
import { dataService } from '../../../data';
import { formatCurrency, formatDate } from '../../../core/utils';
import { ORDER_STATUS } from '../../../core/constants';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useToast } from '../../../context/ToastContext';

export const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await dataService.orders.getAll();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const unsub = dataService.orders.subscribe(() => fetchOrders());
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updated = await dataService.orders.updateStatus(orderId, newStatus);
      showToast(`Status do pedido ${updated.orderNumber} alterado com sucesso!`, 'success');
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast('Erro ao atualizar status do pedido.', 'error');
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(o =>
        o.orderNumber?.toLowerCase().includes(term) ||
        o.customer?.name?.toLowerCase().includes(term) ||
        o.customer?.phone?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [orders, statusFilter, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>
            Gestão de Pedidos & Provas
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Acompanhe pagamentos, locações, agendamentos de ajustes e envio de vestidos.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por número do pedido, cliente ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-text"
            style={{ paddingLeft: '2.4rem', padding: '0.55rem 0.85rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-luxury"
          style={{ width: 'auto', padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
        >
          <option value="all">Todos os Status ({orders.length})</option>
          {Object.keys(ORDER_STATUS).map((key) => {
            const st = ORDER_STATUS[key];
            const count = orders.filter(o => o.status === st.id).length;
            return (
              <option key={st.id} value={st.id}>{st.label} ({count})</option>
            );
          })}
        </select>
      </div>

      {/* Orders Container: Desktop Table + Mobile Cards */}
      <div
        className="admin-orders-container"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden'
        }}
      >
        {/* Desktop Table View */}
        <div className="admin-desktop-orders" style={{ overflowX: 'auto' }}>
          <table>
            <thead style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Pedido
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Cliente / Contato
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Itens
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Valor Total
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Data
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Ação
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                    className="admin-table-row"
                  >
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                      {order.orderNumber}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', display: 'block' }}>
                        {order.customer?.name}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {order.customer?.phone}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {order.items?.length} item(ns)
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {formatCurrency(order.total)}
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {formatDate(order.createdAt)}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={order.status} type="order" />
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                      >
                        <Eye size={14} />
                        <span>Ver Detalhes</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (<= 768px) */}
        <div className="admin-mobile-orders" style={{ display: 'none', flexDirection: 'column' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Nenhum pedido encontrado.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                    {order.orderNumber}
                  </strong>
                  <StatusBadge status={order.status} type="order" size="sm" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)', display: 'block' }}>
                      {order.customer?.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {order.customer?.phone} • {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {formatCurrency(order.total)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      {order.items?.length} item(ns)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', minHeight: '38px', justifyContent: 'center', marginTop: '0.25rem' }}
                >
                  <Eye size={14} />
                  <span>Ver Detalhes do Pedido</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 600 }}>
                  Detalhamento do Pedido
                </span>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-editorial)', color: 'var(--color-text-main)' }}>
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="btn-ghost" style={{ padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Quick Status Changer */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  Alterar Status do Pedido:
                </span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="select-luxury"
                  style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                >
                  {Object.keys(ORDER_STATUS).map((key) => {
                    const st = ORDER_STATUS[key];
                    return <option key={st.id} value={st.id}>{st.label}</option>;
                  })}
                </select>
              </div>

              {/* Customer Box */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Cliente</span>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-text-main)' }}>{selectedOrder.customer.name}</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', display: 'block' }}>{selectedOrder.customer.email || 'Sem e-mail'}</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', display: 'block' }}>{selectedOrder.customer.phone}</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Entrega / Prova</span>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--color-text-main)' }}>{selectedOrder.shippingMethod}</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '4px' }}>
                    Forma: {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
                  Itens do Pedido ({selectedOrder.items?.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} />
                        )}
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Tam: {item.size} • Cor: {item.color} • Qtd: {item.quantity} • ({item.modality === 'rent' ? 'Aluguel' : 'Compra'})
                          </span>
                        </div>
                      </div>

                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', fontSize: '0.84rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Observações da Cliente: </span>
                  <span style={{ color: 'var(--color-text-main)' }}>{selectedOrder.notes}</span>
                </div>
              )}

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-success)' }}>
                    <span>Desconto</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedOrder(null)} className="btn btn-primary btn-sm">
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-desktop-orders {
            display: none !important;
          }
          .admin-mobile-orders {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
