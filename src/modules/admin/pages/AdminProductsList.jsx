import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Copy,
  Edit2,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
  Filter,
  Layers,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { dataService } from '../../../data';
import { formatCurrency, formatShortDate } from '../../../core/utils';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { useToast } from '../../../context/ToastContext';

export const AdminProductsList = ({ onNewProduct, onEditProduct, onPreviewProduct }) => {
  const { products, categories, refreshData } = useStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedStatusTab !== 'all') {
      result = result.filter(p => p.status === selectedStatusTab);
    }

    if (selectedCategoryId !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategoryId);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [products, selectedStatusTab, selectedCategoryId, searchTerm]);

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Duplicate Product Action
  const handleDuplicate = async (productId) => {
    try {
      const cloned = await dataService.products.duplicate(productId);
      showToast(`Vestido duplicado com sucesso como "${cloned.name}" (Status: Rascunho)`, 'success');
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao duplicar vestido.', 'error');
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await dataService.products.delete(productToDelete.id);
      showToast(`Vestido "${productToDelete.name}" excluído.`, 'info');
      setProductToDelete(null);
      setSelectedIds(selectedIds.filter(id => id !== productToDelete.id));
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao excluir produto.', 'error');
    }
  };

  // Bulk Actions
  const handleBulkStatus = async (status) => {
    try {
      const count = await dataService.products.bulkUpdateStatus(selectedIds, status);
      showToast(`${count} vestidos atualizados para status "${status}".`, 'success');
      setSelectedIds([]);
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao atualizar status em massa.', 'error');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      const count = await dataService.products.bulkDelete(selectedIds);
      showToast(`${count} vestidos excluídos permanentemente.`, 'info');
      setSelectedIds([]);
      setIsBulkDeleteOpen(false);
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao excluir produtos em massa.', 'error');
    }
  };

  const statusTabs = [
    { id: 'all', label: 'Todos', count: products.length },
    { id: 'published', label: 'Publicados', count: products.filter(p => p.status === 'published').length },
    { id: 'draft', label: 'Rascunhos', count: products.filter(p => p.status === 'draft').length },
    { id: 'hidden', label: 'Ocultos', count: products.filter(p => p.status === 'hidden').length },
    { id: 'out_of_stock', label: 'Sem Estoque', count: products.filter(p => p.status === 'out_of_stock' || p.stock <= 0).length },
    { id: 'archived', label: 'Arquivados', count: products.filter(p => p.status === 'archived').length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>
            Gerenciador de Vestidos
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Cadastro completo, precificação, variações de tamanho/cor e controle de visibilidade.
          </p>
        </div>

        <button onClick={onNewProduct} className="btn btn-primary">
          <Plus size={18} />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}
      >
        {statusTabs.map((tab) => {
          const isActive = selectedStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)'
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Bulk Action Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Buscar por nome, SKU ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-text"
              style={{ paddingLeft: '2.4rem', padding: '0.55rem 0.85rem 0.55rem 2.4rem', fontSize: '0.88rem' }}
            />
          </div>

          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="select-luxury"
            style={{ width: 'auto', padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Bulk Action Buttons (when items selected) */}
        {selectedIds.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-bg-subtle)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {selectedIds.length} selecionados:
            </span>

            <button
              onClick={() => handleBulkStatus('published')}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
            >
              Publicar
            </button>
            <button
              onClick={() => handleBulkStatus('hidden')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
            >
              Ocultar
            </button>
            <button
              onClick={() => handleBulkStatus('archived')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
            >
              Arquivar
            </button>
            <button
              onClick={() => setIsBulkDeleteOpen(true)}
              className="btn btn-sm"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', backgroundColor: 'var(--color-danger)', color: '#FFFFFF' }}
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Main Data Table */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xs)',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead style={{ backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ width: 44, padding: '1rem 1.25rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={handleSelectAll}
                    style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Produto / SKU
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Categoria
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Preço Venda
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Aluguel
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Estoque
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                    Nenhum vestido encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=150&q=80';
                  const isChecked = selectedIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid var(--color-border-subtle)',
                        backgroundColor: isChecked ? 'var(--color-bg-subtle)' : 'transparent',
                        transition: 'background var(--transition-fast)'
                      }}
                      className="admin-table-row"
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(p.id)}
                          style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                        />
                      </td>

                      {/* Product details */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={img}
                            alt={p.name}
                            style={{
                              width: 48,
                              height: 64,
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: 'var(--color-bg-subtle)',
                              border: '1px solid var(--color-border-subtle)'
                            }}
                          />
                          <div>
                            <strong
                              style={{
                                fontSize: '0.92rem',
                                color: 'var(--color-text-main)',
                                display: 'block',
                                cursor: 'pointer'
                              }}
                              onClick={() => onEditProduct(p)}
                            >
                              {p.name}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              SKU: {p.sku} {p.featured && '• ⭐ Destaque'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                        {p.categoryName}
                      </td>

                      {/* Sale Price */}
                      <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                        {formatCurrency(p.promotionalPrice || p.price)}
                        {p.promotionalPrice && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                            {formatCurrency(p.price)}
                          </span>
                        )}
                      </td>

                      {/* Rent Price */}
                      <td style={{ padding: '1rem', fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                        {p.rentalPrice ? formatCurrency(p.rentalPrice) : '—'}
                      </td>

                      {/* Total Stock */}
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: p.stock <= (p.minStockAlert || 1) ? 'var(--color-danger)' : 'var(--color-text-main)'
                          }}
                        >
                          {p.stock}
                        </span>
                        {p.stock <= (p.minStockAlert || 1) && (
                          <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                            Estoque Baixo
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '1rem' }}>
                        <StatusBadge status={p.status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            onClick={() => onEditProduct(p)}
                            className="btn-icon"
                            style={{ width: 32, height: 32 }}
                            title="Editar Vestido"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => onPreviewProduct(p)}
                            className="btn-icon"
                            style={{ width: 32, height: 32 }}
                            title="Ver na Loja Pública"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => handleDuplicate(p.id)}
                            className="btn-icon"
                            style={{ width: 32, height: 32 }}
                            title="Duplicar Vestido"
                          >
                            <Copy size={14} />
                          </button>

                          <button
                            onClick={() => setProductToDelete(p)}
                            className="btn-icon"
                            style={{ width: 32, height: 32, color: 'var(--color-danger)' }}
                            title="Excluir Vestido"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Excluir Vestido"
        message={`Deseja realmente excluir permanentemente "${productToDelete?.name}"? Esta ação removerá o produto do catálogo e do estoque.`}
        confirmText="Excluir Permanentemente"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />

      {/* Bulk Delete Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        title="Excluir Produtos Selecionados"
        message={`Deseja realmente excluir permanentemente os ${selectedIds.length} vestidos selecionados? Esta ação não poderá ser desfeita.`}
        confirmText={`Excluir ${selectedIds.length} Itens`}
        isDanger={true}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setIsBulkDeleteOpen(false)}
      />

      <style>{`
        .admin-table-row:hover {
          background-color: var(--color-bg-surface) !important;
        }
      `}</style>
    </div>
  );
};
