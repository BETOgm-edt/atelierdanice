import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  DollarSign,
  Boxes,
  Palette,
  FileText,
  Search,
  Globe,
  Save,
  Eye,
  AlertCircle,
  Plus,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { dataService } from '../../../data';
import {
  generateSKU,
  generateSlug,
  calculateDiscount,
  formatCurrency,
  calculateTotalStock
} from '../../../core/utils';
import {
  STANDARD_SIZES,
  STANDARD_COLORS,
  CHARACTERISTICS_OPTIONS
} from '../../../core/constants';
import { useToast } from '../../../context/ToastContext';

export const AdminProductForm = ({ editingProduct = null, onCancel, onSuccess, onPreview }) => {
  const { categories, refreshData } = useStore();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Initial State Setup
  const [formData, setFormData] = useState(() => {
    if (editingProduct) {
      return JSON.parse(JSON.stringify(editingProduct));
    }
    return {
      name: '',
      slug: '',
      sku: '',
      categoryId: categories[0]?.id || 'cat-festa-gala',
      categoryName: categories[0]?.name || 'Vestidos de Festa & Gala',
      shortDescription: '',
      description: '',
      images: [
        {
          id: 'img-seed-1',
          url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
          alt: 'Foto Principal',
          isPrimary: true,
          order: 0
        }
      ],
      price: '',
      promotionalPrice: '',
      rentalPrice: '',
      costPrice: '',
      modality: 'both', // 'sale' | 'rent' | 'both'
      stock: 4,
      minStockAlert: 1,
      variants: [
        {
          id: 'var-1',
          sku: '',
          size: 'P (38)',
          color: { name: 'Rosé Atelier', hex: '#B67068' },
          stock: 2,
          priceAdjustment: 0,
          available: true
        },
        {
          id: 'var-2',
          sku: '',
          size: 'M (40)',
          color: { name: 'Rosé Atelier', hex: '#B67068' },
          stock: 2,
          priceAdjustment: 0,
          available: true
        }
      ],
      characteristics: {
        fabric: 'Zibeline de Seda',
        length: 'Longo Gala',
        neckline: 'Ombro a Ombro',
        sleeve: 'Sem Manga / Alça Fina',
        silhouette: 'Evasê Fluido',
        occasion: 'Gala & Black Tie',
        style: 'Alta Costura Clássica'
      },
      tags: ['Zibeline', 'Rosé', 'Gala', 'Alta Costura'],
      status: 'draft',
      featured: false,
      seo: {
        title: '',
        description: '',
        keywords: '',
        slug: ''
      }
    };
  });

  // Auto-generate SKU & Slug when name changes (if new product)
  const handleNameChange = (e) => {
    const name = e.target.value;
    const cat = categories.find(c => c.id === formData.categoryId);
    const updates = { name };

    if (!editingProduct) {
      updates.slug = generateSlug(name);
      if (!formData.sku || formData.sku.startsWith('ATN-')) {
        updates.sku = generateSKU(cat?.name, name);
      }
      updates.seo = {
        ...formData.seo,
        title: `${name} | Atelier Nice`,
        slug: generateSlug(name)
      };
    }

    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Image Upload Handling
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    const newImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      url: imageUrlInput.trim(),
      alt: formData.name || 'Foto Vestido',
      isPrimary: formData.images.length === 0,
      order: formData.images.length
    };
    setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }));
    setImageUrlInput('');
    showToast('Imagem adicionada com sucesso!', 'success');
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      try {
        const uploaded = await dataService.storage.uploadImage(file, formData.name);
        setFormData(prev => {
          const isPrimary = prev.images.length === 0;
          return {
            ...prev,
            images: [...prev.images, { ...uploaded, isPrimary, order: prev.images.length }]
          };
        });
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
    showToast(`${files.length} foto(s) carregada(s)!`, 'success');
  };

  const handleSetPrimaryImage = (imgId) => {
    setFormData(prev => ({
      ...prev,
      images: dataService.storage.setPrimary(prev.images, imgId)
    }));
  };

  const handleRemoveImage = (imgId) => {
    setFormData(prev => ({
      ...prev,
      images: dataService.storage.remove(prev.images, imgId)
    }));
  };

  // Pricing calculations
  const discountCalc = calculateDiscount(formData.price, formData.promotionalPrice);
  const cost = parseFloat(formData.costPrice) || 0;
  const sellPrice = parseFloat(formData.promotionalPrice || formData.price) || 0;
  const grossMargin = sellPrice > 0 && cost > 0 ? Math.round(((sellPrice - cost) / sellPrice) * 100) : null;

  // Variants matrix management
  const handleAddVariant = () => {
    const newVar = {
      id: `var-${Date.now()}`,
      sku: `${formData.sku || 'ATN'}-V${formData.variants.length + 1}`,
      size: 'M (40)',
      color: { name: 'Rosé Atelier', hex: '#B67068' },
      stock: 1,
      priceAdjustment: 0,
      available: true
    };
    setFormData(prev => ({ ...prev, variants: [...prev.variants, newVar] }));
  };

  const handleRemoveVariant = (varId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== varId)
    }));
  };

  const handleVariantChange = (varId, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => (v.id === varId ? { ...v, [field]: value } : v))
    }));
  };

  // Submit and Save
  const handleSave = async (finalStatus = null) => {
    if (!formData.name.trim()) {
      showToast('Por favor, informe o nome do vestido na Etapa 1.', 'warning');
      setCurrentStep(1);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast('Por favor, informe o preço do vestido na Etapa 3.', 'warning');
      setCurrentStep(3);
      return;
    }

    try {
      setIsSubmitting(true);
      const cat = categories.find(c => c.id === formData.categoryId);

      const payload = {
        ...formData,
        categoryName: cat?.name || formData.categoryName,
        status: finalStatus || formData.status || 'draft',
        stock: calculateTotalStock(formData.variants)
      };

      if (editingProduct) {
        await dataService.products.update(editingProduct.id, payload);
        showToast('Vestido atualizado com sucesso!', 'success');
      } else {
        await dataService.products.create(payload);
        showToast('Novo vestido cadastrado com sucesso!', 'success');
      }

      refreshData();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar produto.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Wizard Steps Configuration
  const steps = [
    { num: 1, title: 'Informações Básicas', icon: FileText },
    { num: 2, title: 'Fotos & Mídia', icon: ImageIcon },
    { num: 3, title: 'Preços & Oferta', icon: DollarSign },
    { num: 4, title: 'Estoque & SKU', icon: Boxes },
    { num: 5, title: 'Variações', icon: Palette },
    { num: 6, title: 'Ficha Técnica', icon: Check },
    { num: 7, title: 'SEO & Google', icon: Globe },
    { num: 8, title: 'Revisão & Publicar', icon: Star }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Top Breadcrumb & Return */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.88rem',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Voltar para Lista de Produtos</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
            className="btn btn-secondary btn-sm"
          >
            <Save size={14} />
            <span>Salvar como Rascunho</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSubmitting}
            className="btn btn-primary btn-sm"
          >
            <Check size={14} />
            <span>{editingProduct ? 'Salvar & Publicar' : 'Publicar Produto'}</span>
          </button>
        </div>
      </div>

      {/* 8-Step Wizard Progress Bar */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '0.5rem',
            alignItems: 'center'
          }}
          className="wizard-steps-grid"
        >
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            const Icon = step.icon;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setCurrentStep(step.num)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isCurrent ? 'var(--color-bg-subtle)' : 'transparent',
                  border: isCurrent ? '1.5px solid var(--color-primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? 'var(--color-primary)' : isDone ? 'var(--color-success-bg)' : 'var(--color-bg-surface)',
                    color: isCurrent ? '#FFFFFF' : isDone ? 'var(--color-success)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  {isDone ? <Check size={14} /> : step.num}
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Form Box */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          padding: '2.5rem'
        }}
      >
        {/* =========================================================================
            ETAPA 1 — INFORMAÇÕES BÁSICAS
           ========================================================================= */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              Etapa 1 — Informações Principais da Peça
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Defina o nome editorial, categoria e textos de apresentação do vestido.
            </p>

            <div className="form-group">
              <label className="form-label">
                <span>Nome do Vestido / Título do Produto</span>
                <span className="required">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Vestido Aurora em Zibeline Rosé"
                value={formData.name}
                onChange={handleNameChange}
                className="input-text"
                style={{ fontSize: '1.05rem', fontWeight: 600 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Código / SKU Principal</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: ATN-FES-AUR-1001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="input-text"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Categoria Principal</span>
                  <span className="required">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => {
                    const cat = categories.find(c => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      categoryId: e.target.value,
                      categoryName: cat?.name || formData.categoryName
                    });
                  }}
                  className="select-luxury"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição Curta (Destaque da Vitrine)</label>
              <input
                type="text"
                placeholder="Ex: Alta costura em Zibeline nobre com decote ombro a ombro estruturado e saia evasê."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="input-text"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrição Completa & Editorial</label>
              <textarea
                placeholder="Detalhe a história da peça, caimento, tecidos, bordados e ocasiões de uso..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="textarea-luxury"
                style={{ minHeight: '140px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags & Palavras-chave (Separadas por vírgula)</label>
              <input
                type="text"
                placeholder="Zibeline, Rosé, Madrinha, Ombro a Ombro, Gala"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                className="input-text"
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            ETAPA 2 — FOTOS & MÍDIA
           ========================================================================= */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              Etapa 2 — Galeria de Fotos & Mídia
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Adicione fotos profissionais de alta resolução. Escolha qual será a foto principal do catálogo.
            </p>

            {/* Upload Area */}
            <div
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--color-bg-surface)',
                marginBottom: '1.5rem'
              }}
            >
              <Upload size={36} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
                Arraste suas fotos aqui ou clique para selecionar
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Suporta PNG, JPG, JPEG e WebP de alta resolução.
              </p>

              <label className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <span>Escolher Arquivos do Computador</span>
              </label>
            </div>

            {/* Quick URL Input */}
            <form onSubmit={handleAddImageUrl} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
              <input
                type="url"
                placeholder="Ou cole a URL direta de uma imagem na web (https://...)"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="input-text"
              />
              <button type="submit" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} />
                <span>Adicionar Link</span>
              </button>
            </form>

            {/* Image List / Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
              {formData.images.map((img, idx) => (
                <div
                  key={img.id}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: `2px solid ${img.isPrimary ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: 'var(--color-bg-subtle)'
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `Foto ${idx + 1}`}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />

                  {/* Primary Badge */}
                  {img.isPrimary && (
                    <span
                      className="badge badge-primary"
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        fontSize: '0.65rem'
                      }}
                    >
                      Foto Principal
                    </span>
                  )}

                  {/* Controls */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '0.4rem',
                      backgroundColor: 'rgba(41,22,19,0.75)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {!img.isPrimary ? (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(img.id)}
                        style={{ fontSize: '0.72rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
                      >
                        <Star size={12} />
                        <span>Definir Principal</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-accent-gold)' }}>★ Principal</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      style={{ color: '#FF9999', padding: '2px', cursor: 'pointer' }}
                      title="Excluir foto"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            ETAPA 3 — PREÇOS & MODALIDADE
           ========================================================================= */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              Etapa 3 — Precificação & Modalidades de Oferta
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Defina preços de venda e locação com cálculo automático de descontos e margens.
            </p>

            {/* Modality Selector */}
            <div className="form-group">
              <label className="form-label">Modalidade de Comercialização</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { id: 'sale', label: 'Somente Venda', desc: 'Disponível apenas para aquisição definitiva' },
                  { id: 'rent', label: 'Somente Aluguel', desc: 'Disponível apenas para locação por evento' },
                  { id: 'both', label: 'Venda & Aluguel', desc: 'Cliente pode optar por comprar ou alugar' }
                ].map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, modality: mod.id })}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      border: `1.5px solid ${formData.modality === mod.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: formData.modality === mod.id ? 'var(--color-bg-subtle)' : 'var(--color-bg-card)',
                      cursor: 'pointer'
                    }}
                  >
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', display: 'block' }}>{mod.label}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{mod.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Preço Normal de Venda (R$)</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="3490.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-text"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preço Promocional (Opcional)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="2990.00"
                  value={formData.promotionalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                  className="input-text"
                />
                {discountCalc.hasDiscount && (
                  <span className="form-hint" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                    ✨ Desconto de {discountCalc.percentageFormatted} (Economia de {formatCurrency(discountCalc.savings)})
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Preço de Aluguel por Evento (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1190.00"
                  value={formData.rentalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                  className="input-text"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Custo Interno de Confecção / Peça (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1100.00"
                  value={formData.costPrice || ''}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="input-text"
                />
                {grossMargin !== null && (
                  <span className="form-hint" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    Margem Bruta Estimada: {grossMargin}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ETAPA 4 — ESTOQUE & SKU
           ========================================================================= */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              Etapa 4 — Controle de Estoque & Disponibilidade
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Configure o estoque total consolidado e limites de alerta para reposição ou confecção.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Estoque Total da Peça</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={calculateTotalStock(formData.variants) || formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                  className="input-text"
                />
                <span className="form-hint">
                  Calculado automaticamente a partir da soma das variações de tamanho.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Alerta de Estoque Mínimo</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStockAlert}
                  onChange={(e) => setFormData({ ...formData, minStockAlert: parseInt(e.target.value, 10) || 1 })}
                  className="input-text"
                />
                <span className="form-hint">
                  Quando o estoque atingir esse número, aparecerá aviso no painel.
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }}
                />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  Exibir como "Destaque" na vitrine principal da loja
                </span>
              </label>
            </div>
          </div>
        )}

        {/* =========================================================================
            ETAPA 5 — VARIAÇÕES (TAMANHOS E CORES)
           ========================================================================= */}
        {currentStep === 5 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                  Etapa 5 — Matriz de Variações (Tamanhos e Cores)
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  Cadastre o estoque de cada tamanho e tonalidade para controle milimétrico do Atelier.
                </p>
              </div>

              <button type="button" onClick={handleAddVariant} className="btn btn-secondary btn-sm">
                <Plus size={16} />
                <span>Adicionar Variação</span>
              </button>
            </div>

            {formData.variants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Nenhuma variação adicionada.
                </p>
                <button type="button" onClick={handleAddVariant} className="btn btn-primary btn-sm">
                  Adicionar Primeira Variação
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {formData.variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 180px 1fr 100px 40px',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: 'var(--color-bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {/* Size Select */}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Tamanho</span>
                      <select
                        value={variant.size}
                        onChange={(e) => handleVariantChange(variant.id, 'size', e.target.value)}
                        className="select-luxury"
                        style={{ padding: '0.45rem' }}
                      >
                        {STANDARD_SIZES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Color Select */}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Cor</span>
                      <select
                        value={variant.color?.name || ''}
                        onChange={(e) => {
                          const chosen = STANDARD_COLORS.find(c => c.name === e.target.value) || { name: e.target.value, hex: '#B67068' };
                          handleVariantChange(variant.id, 'color', chosen);
                        }}
                        className="select-luxury"
                        style={{ padding: '0.45rem' }}
                      >
                        {STANDARD_COLORS.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* SKU Specific */}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>SKU Variação</span>
                      <input
                        type="text"
                        placeholder="SKU-VAR"
                        value={variant.sku || `${formData.sku}-${variant.size.split(' ')[0]}`}
                        onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                        className="input-text"
                        style={{ padding: '0.45rem 0.6rem' }}
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Estoque</span>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(variant.id, 'stock', parseInt(e.target.value, 10) || 0)}
                        className="input-text"
                        style={{ padding: '0.45rem 0.6rem', textAlign: 'center' }}
                      />
                    </div>

                    {/* Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16px' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(variant.id)}
                        style={{ color: 'var(--color-danger)', cursor: 'pointer', padding: 4 }}
                        title="Remover variação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            ETAPA 6 — FICHA TÉCNICA
           ========================================================================= */}
        {currentStep === 6 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              Etapa 6 — Ficha Técnica Estruturada
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Características padronizadas de alta costura que aparecem na aba técnica do vestido.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Tecido Principal</label>
                <select
                  value={formData.characteristics?.fabric || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    characteristics: { ...formData.characteristics, fabric: e.target.value }
                  })}
                  className="select-luxury"
                >
                  {CHARACTERISTICS_OPTIONS.fabrics.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Comprimento</label>
                <select
                  value={formData.characteristics?.length || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    characteristics: { ...formData.characteristics, length: e.target.value }
                  })}
                  className="select-luxury"
                >
                  {CHARACTERISTICS_OPTIONS.lengths.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Decote</label>
                <select
                  value={formData.characteristics?.neckline || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    characteristics: { ...formData.characteristics, neckline: e.target.value }
                  })}
                  className="select-luxury"
                >
                  {CHARACTERISTICS_OPTIONS.necklines.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Modelagem / Caimento</label>
                <select
                  value={formData.characteristics?.silhouette || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    characteristics: { ...formData.characteristics, silhouette: e.target.value }
                  })}
                  className="select-luxury"
                >
                  {CHARACTERISTICS_OPTIONS.silhouettes.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ocasião Principal</label>
                <select
                  value={formData.characteristics?.occasion || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    characteristics: { ...formData.characteristics, occasion: e.target.value }
                  })}
                  className="select-luxury"
                >
                  {CHARACTERISTICS_OPTIONS.occasions.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estilo</label>
                <select
                  value={formData.characteristics?.style || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    characteristics: { ...formData.characteristics, style: e.target.value }
                  })}
                  className="select-luxury"
                >
                  {CHARACTERISTICS_OPTIONS.styles.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ETAPA 7 — SEO & GOOGLE PREVIEW
           ========================================================================= */}
        {currentStep === 7 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              Etapa 7 — Otimização SEO & Compartilhamento
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Configure títulos, meta descrição e slug para indexação nos buscadores e prévia nas redes sociais.
            </p>

            <div className="form-group">
              <label className="form-label">Título SEO (Page Title)</label>
              <input
                type="text"
                placeholder="Ex: Vestido Aurora em Zibeline Rosé | Atelier Nice Alta Costura"
                value={formData.seo?.title || `${formData.name} | Atelier Nice`}
                onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
                className="input-text"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug Amigável da URL</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>https://ateliernice.com.br/vestidos/</span>
                <input
                  type="text"
                  placeholder="vestido-aurora-em-zibeline-rose"
                  value={formData.slug || generateSlug(formData.name)}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value, seo: { ...formData.seo, slug: e.target.value } })}
                  className="input-text"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Meta Descrição (Snippet do Google)</label>
              <textarea
                placeholder="Descrição concisa de até 160 caracteres que aparecerá nos resultados de busca do Google."
                value={formData.seo?.description || formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })}
                className="textarea-luxury"
                style={{ minHeight: '90px' }}
              />
            </div>

            {/* Google SERP Live Snippet Preview */}
            <div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#F8F9FA',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #DFE1E5'
              }}
            >
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#70757A', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                Prévia do Resultado de Busca no Google
              </span>

              <div style={{ fontSize: '0.8rem', color: '#202124', marginBottom: '2px' }}>
                ateliernice.com.br › vestidos › {formData.slug || 'vestido'}
              </div>
              <h4 style={{ fontSize: '1.15rem', color: '#1A0DAB', textDecoration: 'underline', marginBottom: '4px', cursor: 'pointer' }}>
                {formData.seo?.title || `${formData.name || 'Vestido'} | Atelier Nice Alta Costura`}
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#4D5156', lineHeight: 1.4 }}>
                {formData.seo?.description || formData.shortDescription || 'Criações exclusivas de alta costura e vestidos de festa sob medida no Atelier Nice.'}
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            ETAPA 8 — REVISÃO & PUBLICAÇÃO
           ========================================================================= */}
        {currentStep === 8 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              Etapa 8 — Revisão Final & Publicação
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
              Confira todos os dados cadastrados antes de publicar na vitrine do Atelier.
            </p>

            {/* Summary Review Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                gap: '2rem',
                padding: '1.75rem',
                backgroundColor: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: '2rem'
              }}
            >
              <img
                src={formData.images?.[0]?.url || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80'}
                alt={formData.name}
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span className="badge badge-soft" style={{ marginBottom: '0.35rem' }}>{formData.categoryName}</span>
                  <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)' }}>
                    {formData.name || 'Vestido Sem Nome'}
                  </h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    SKU: <strong>{formData.sku}</strong> • {formData.variants?.length || 0} variações cadastradas
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Preço Venda</span>
                    <strong style={{ fontSize: '1.3rem', color: 'var(--color-primary)' }}>
                      {formatCurrency(formData.promotionalPrice || formData.price)}
                    </strong>
                  </div>

                  {formData.rentalPrice && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Preço Aluguel</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
                        {formatCurrency(formData.rentalPrice)}
                      </strong>
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Estoque Total</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
                      {calculateTotalStock(formData.variants) || formData.stock} unidades
                    </strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Tecido: <strong>{formData.characteristics?.fabric}</strong> • Decote: <strong>{formData.characteristics?.neckline}</strong>
                </div>
              </div>
            </div>

            {/* Publishing Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={isSubmitting}
                className="btn btn-secondary"
              >
                <Save size={16} />
                <span>Salvar como Rascunho</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
              >
                <Check size={18} />
                <span>{editingProduct ? 'Salvar & Publicar' : 'Publicar Produto Imediatamente'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Bottom Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-border-subtle)'
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="btn btn-ghost"
          >
            ← Voltar Etapa
          </button>

          <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            Etapa {currentStep} de 8
          </span>

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(8, currentStep + 1))}
              className="btn btn-primary btn-sm"
            >
              <span>Avançar Etapa</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="btn btn-primary btn-sm"
            >
              <span>Concluir Cadastro</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .wizard-steps-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
