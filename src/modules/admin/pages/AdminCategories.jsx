import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, FolderTree, X } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { dataService } from '../../../data';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { useToast } from '../../../context/ToastContext';

export const AdminCategories = () => {
  const { categories, products, refreshData } = useStore();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    active: true
  });

  const handleOpenNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      active: cat.active !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        await dataService.categories.update(editingCategory.id, formData);
        showToast('Categoria atualizada com sucesso!', 'success');
      } else {
        await dataService.categories.create(formData);
        showToast('Nova categoria criada com sucesso!', 'success');
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar categoria.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await dataService.categories.delete(categoryToDelete.id);
      showToast(`Categoria "${categoryToDelete.name}" excluída.`, 'info');
      setCategoryToDelete(null);
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao excluir categoria.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>
            Categorias & Coleções
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            Gerencie as seções do site público, filtros e menus de navegação.
          </p>
        </div>

        <button onClick={handleOpenNew} className="btn btn-primary">
          <Plus size={18} />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {categories.map((cat) => {
          const productCount = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              style={{
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    display: 'flex',
                    gap: '0.35rem'
                  }}
                >
                  <span className={`badge ${cat.active !== false ? 'badge-success' : 'badge-neutral'}`}>
                    {cat.active !== false ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {cat.description || 'Sem descrição cadastrada.'}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {productCount} vestidos vinculados
                  </span>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="btn-icon"
                      style={{ width: 34, height: 34 }}
                      title="Editar categoria"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="btn-icon"
                      style={{ width: 34, height: 34, color: 'var(--color-danger)' }}
                      title="Excluir categoria"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nome da Categoria *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Noivas & Casamento Civil"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">URL da Imagem de Capa</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Descrição Editorial</label>
                  <textarea
                    placeholder="Pequeno texto de apoio que aparece no card da categoria..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="textarea-luxury"
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Exibir categoria ativa no site</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        title="Excluir Categoria"
        message={`Deseja realmente excluir a categoria "${categoryToDelete?.name}"? Os vestidos associados permanecerão no sistema.`}
        confirmText="Excluir Categoria"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
};
