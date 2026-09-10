import React, { useState } from 'react';
import { Layers, Image as ImageIcon, Save, Sparkles } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { dataService } from '../../../data';
import { useToast } from '../../../context/ToastContext';

export const AdminContent = () => {
  const { banners, refreshData } = useStore();
  const { showToast } = useToast();

  const [heroBanner, setHeroBanner] = useState(() => {
    return banners?.[0] || {
      id: 'banner-hero-1',
      title: 'A Nobreza da Alta Costura Feminina',
      subtitle: 'COLEÇÃO ATELIER NICE',
      description: 'Criações exclusivas em Zibeline, seda pura e rendas nobres. Peças autorais desenhadas para vestir sua essência nos momentos mais inesquecíveis.',
      imageUrl: ''
    };
  });

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      await dataService.content.updateBanner(heroBanner.id, heroBanner);
      showToast('Conteúdo da Homepage atualizado com sucesso!', 'success');
      refreshData();
    } catch (err) {
      console.error(err);
      showToast('Erro ao atualizar conteúdo.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', color: 'var(--color-text-main)' }}>
          Conteúdo & Destaques da Vitrine
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
          Altere os textos editoriais, fotos de capa e chamadas da homepage sem necessidade de alterar código.
        </p>
      </div>

      <form
        onSubmit={handleSaveBanner}
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '2rem',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <Sparkles size={20} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Banner Principal (Hero da Homepage)
          </h3>
        </div>

        <div className="form-group">
          <label className="form-label">Subtítulo / Tag de Coleção</label>
          <input
            type="text"
            value={heroBanner.subtitle}
            onChange={(e) => setHeroBanner({ ...heroBanner, subtitle: e.target.value })}
            className="input-text"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Título Principal de Impacto</label>
          <input
            type="text"
            value={heroBanner.title}
            onChange={(e) => setHeroBanner({ ...heroBanner, title: e.target.value })}
            className="input-text"
            style={{ fontSize: '1.1rem', fontWeight: 600 }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Texto de Apoio / Editorial</label>
          <textarea
            value={heroBanner.description}
            onChange={(e) => setHeroBanner({ ...heroBanner, description: e.target.value })}
            className="textarea-luxury"
            style={{ minHeight: '90px' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">URL da Fotografia Editorial do Hero</label>
          <input
            type="url"
            value={heroBanner.imageUrl}
            onChange={(e) => setHeroBanner({ ...heroBanner, imageUrl: e.target.value })}
            className="input-text"
          />
        </div>

        {/* Live Preview of Hero Image */}
        {heroBanner.imageUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Pré-visualização da Imagem
            </span>
            <img
              src={heroBanner.imageUrl}
              alt="Prévia Hero"
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Salvar Alterações de Conteúdo</span>
          </button>
        </div>
      </form>
    </div>
  );
};
