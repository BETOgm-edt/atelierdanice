import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, DollarSign, ShoppingBag } from 'lucide-react';
import { dataService } from '../../../data';
import { formatCurrency, formatShortDate } from '../../../core/utils';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await dataService.customers.getAll(search);
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>
          Base de Clientes (CRM)
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
          Histórico de compras, preferências, contatos e valor investido no Atelier Nice.
        </p>
      </div>

      {/* Search Input */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, telefone ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-text"
            style={{ paddingLeft: '2.4rem', padding: '0.55rem 0.85rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden'
        }}
      >
        {/* Desktop Table View */}
        <div className="admin-desktop-customers" style={{ overflowX: 'auto' }}>
          <table>
            <thead style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Nome da Cliente
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Contato
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Localização
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Pedidos / Provas
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Total Investido
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Cadastro
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Nenhuma cliente encontrada.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }} className="admin-table-row">
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.92rem' }}>
                      {c.name}
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--color-text-main)' }}>{c.phone || 'Sem telefone'}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>{c.email || 'Sem e-mail'}</div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {c.city ? `${c.city} - ${c.state}` : '—'}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>
                      {c.ordersCount || 0}
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {formatCurrency(c.totalSpent || 0)}
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {formatShortDate(c.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="admin-mobile-customers" style={{ display: 'none', flexDirection: 'column' }}>
          {customers.length === 0 ? (
            <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Nenhuma cliente encontrada.
            </div>
          ) : (
            customers.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: '1.25rem 1rem',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '0.98rem', color: 'var(--color-text-main)', display: 'block' }}>
                      {c.name}
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Cadastrada em {formatShortDate(c.createdAt)}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {formatCurrency(c.totalSpent || 0)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      {c.ordersCount || 0} pedido(s)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  {c.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={13} color="var(--color-primary)" />
                      {c.phone}
                    </span>
                  )}
                  {c.email && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Mail size={13} color="var(--color-primary)" />
                      {c.email}
                    </span>
                  )}
                  {c.city && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} color="var(--color-primary)" />
                      {c.city} - {c.state}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-desktop-customers {
            display: none !important;
          }
          .admin-mobile-customers {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
