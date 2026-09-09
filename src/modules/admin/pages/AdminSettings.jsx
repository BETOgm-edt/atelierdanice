import React, { useState } from 'react';
import { Settings, Store, DollarSign, Globe, Save, MessageCircle } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { dataService } from '../../../data';
import { useToast } from '../../../context/ToastContext';

export const AdminSettings = () => {
  const { settings, refreshData } = useStore();
  const { showToast } = useToast();

  const [form, setForm] = useState(() => {
    return JSON.parse(JSON.stringify(settings || {}));
  });

  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'sales' | 'seo'

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dataService.settings.update(form);
      showToast('Configurações salvas com sucesso!', 'success');
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar configurações.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>
          Configurações da Loja
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
          Regras comerciais, canais de atendimento, integrações e parâmetros gerais do Atelier Nice.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
        {[
          { id: 'store', label: 'Dados do Atelier & Contato', icon: Store },
          { id: 'sales', label: 'Regras Comerciais & Aluguel', icon: DollarSign },
          { id: 'seo', label: 'SEO & Metadados Globais', icon: Globe }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form */}
      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '2rem',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        {activeTab === 'store' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Nome do Atelier</label>
              <input
                type="text"
                value={form.store?.name || ''}
                onChange={(e) => setForm({ ...form, store: { ...form.store, name: e.target.value } })}
                className="input-text"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slogan Oficial</label>
              <input
                type="text"
                value={form.store?.slogan || ''}
                onChange={(e) => setForm({ ...form, store: { ...form.store, slogan: e.target.value } })}
                className="input-text"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Número do WhatsApp (apenas números)</label>
                <input
                  type="text"
                  placeholder="5511999998888"
                  value={form.store?.whatsapp || ''}
                  onChange={(e) => setForm({ ...form, store: { ...form.store, whatsapp: e.target.value } })}
                  className="input-text"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefone Fixo / Recepção</label>
                <input
                  type="text"
                  placeholder="(11) 3456-7890"
                  value={form.store?.phone || ''}
                  onChange={(e) => setForm({ ...form, store: { ...form.store, phone: e.target.value } })}
                  className="input-text"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Instagram (@)</label>
                <input
                  type="text"
                  value={form.store?.instagram || ''}
                  onChange={(e) => setForm({ ...form, store: { ...form.store, instagram: e.target.value } })}
                  className="input-text"
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail de Contato</label>
                <input
                  type="email"
                  value={form.store?.email || ''}
                  onChange={(e) => setForm({ ...form, store: { ...form.store, email: e.target.value } })}
                  className="input-text"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Endereço Físico do Atelier</label>
              <input
                type="text"
                value={form.store?.address || ''}
                onChange={(e) => setForm({ ...form, store: { ...form.store, address: e.target.value } })}
                className="input-text"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horário de Atendimento</label>
              <input
                type="text"
                value={form.store?.businessHours || ''}
                onChange={(e) => setForm({ ...form, store: { ...form.store, businessHours: e.target.value } })}
                className="input-text"
              />
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.sales?.saleEnabled !== false}
                  onChange={(e) => setForm({ ...form, sales: { ...form.sales, saleEnabled: e.target.checked } })}
                  style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }}
                />
                <div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', display: 'block' }}>
                    Venda de Vestidos Habilitada
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Permite compra direta de modelos pelo site e sacola.
                  </span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.sales?.rentalEnabled !== false}
                  onChange={(e) => setForm({ ...form, sales: { ...form.sales, rentalEnabled: e.target.checked } })}
                  style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }}
                />
                <div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', display: 'block' }}>
                    Locação de Vestidos Habilitada
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Exibe opção e preços de aluguel nos vestidos compatíveis.
                  </span>
                </div>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Caução Padrão de Locação (%)</label>
                <input
                  type="number"
                  value={form.sales?.rentalDepositPercentage || 30}
                  onChange={(e) => setForm({ ...form, sales: { ...form.sales, rentalDepositPercentage: parseInt(e.target.value, 10) || 0 } })}
                  className="input-text"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor Mínimo para Pedido (R$)</label>
                <input
                  type="number"
                  value={form.sales?.minOrderValue || 200}
                  onChange={(e) => setForm({ ...form, sales: { ...form.sales, minOrderValue: parseFloat(e.target.value) || 0 } })}
                  className="input-text"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Título Global do Site (Tag Title)</label>
              <input
                type="text"
                value={form.seo?.siteTitle || ''}
                onChange={(e) => setForm({ ...form, seo: { ...form.seo, siteTitle: e.target.value } })}
                className="input-text"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meta Descrição Global</label>
              <textarea
                value={form.seo?.metaDescription || ''}
                onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })}
                className="textarea-luxury"
                style={{ minHeight: '90px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Palavras-chave Globais</label>
              <input
                type="text"
                value={form.seo?.keywords || ''}
                onChange={(e) => setForm({ ...form, seo: { ...form.seo, keywords: e.target.value } })}
                className="input-text"
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
