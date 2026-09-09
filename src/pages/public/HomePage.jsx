import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Scissors, Clock, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/public/ProductCard';

export const HomePage = ({ onNavigate, onSelectProduct }) => {
  const { products, categories, banners } = useStore();

  const heroBanner = banners?.[0] || {
    title: 'A Nobreza da Alta Costura Feminina',
    subtitle: 'COLEÇÃO GALA & NOIVAS 2026',
    description: 'Criações exclusivas em Zibeline, seda pura e rendas francesas. Peças autorais desenhadas para vestir sua essência nos momentos mais inesquecíveis.',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=90'
  };

  // Only published or out-of-stock items for public catalog
  const catalogProducts = products.filter(p => p.status === 'published' || p.status === 'out_of_stock');
  const featuredProducts = catalogProducts.filter(p => p.featured).slice(0, 4);
  const newArrivals = catalogProducts.slice(0, 4);

  return (
    <div className="homepage-container">
      {/* 1. HERO EDITORIAL */}
      <section
        style={{
          position: 'relative',
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-bg-primary)',
          overflow: 'hidden',
          padding: '3rem 0'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left Copy */}
            <div style={{ maxWidth: '580px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(182, 112, 104, 0.12)',
                  color: 'var(--color-primary)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem'
                }}
              >
                <Sparkles size={14} />
                <span>{heroBanner.subtitle}</span>
              </div>

              <h1 className="heading-hero" style={{ marginBottom: '1.25rem' }}>
                {heroBanner.title}
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {heroBanner.description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('/produtos')}
                  className="btn btn-primary btn-lg"
                >
                  <span>Ver Coleção Completa</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => onNavigate('/sobre')}
                  className="btn btn-secondary btn-lg"
                >
                  <span>Conheça o Atelier</span>
                </button>
              </div>
            </div>

            {/* Right Editorial Visual Composition */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '480px',
                  margin: '0 auto',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#F8E5DF'
                }}
              >
                <img
                  src={heroBanner.imageUrl}
                  alt="Editorial de Moda Atelier Nice"
                  style={{
                    width: '100%',
                    height: '580px',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Badge on Image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(255, 253, 252, 0.94)',
                    backdropFilter: 'blur(16px)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary)', fontWeight: 600, display: 'block' }}>
                      Criação Autoral
                    </span>
                    <strong style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.2rem', color: 'var(--color-text-main)' }}>
                      Vestido Aurora em Zibeline
                    </strong>
                  </div>

                  <button
                    onClick={() => onNavigate('/produtos')}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                  >
                    Ver Peça
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR */}
      <section style={{ backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)', padding: '2.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="btn-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)' }}>
                <Scissors size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Alta Costura & Ajustes</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Caimento sob medida para o seu corpo.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="btn-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Venda & Locação</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Flexibilidade para seu grande momento.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="btn-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)' }}>
                <Award size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Tecidos Nobres</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Zibeline, seda pura e rendas francesas.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="btn-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)' }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Prova Exclusiva VIP</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Atendimento privativo com estilista.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIAS DESTAQUE */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
            <span className="subtitle-editorial" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Nossas Coleções
            </span>
            <h2 className="heading-section" style={{ marginBottom: '0.75rem' }}>
              Descubra por Ocasião
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              Vestidos desenhados milimetricamente para cada celebração, com tecidos fluidos, estruturados e acabamento impecável.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {categories.filter(c => c.active !== false).slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate(`/produtos?categoria=${cat.slug}`)}
                className="card-luxury"
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '380px'
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="cat-img-zoom"
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(41,22,19,0.88) 0%, rgba(41,22,19,0.2) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem'
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-editorial)',
                      fontSize: '1.55rem',
                      color: '#FFFFFF',
                      marginBottom: '0.4rem',
                      fontWeight: 600
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#F3D8CF', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {cat.description}
                  </p>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--color-primary-light)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <span>Explorar Modelos</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUTOS EM DESTAQUE */}
      <section style={{ backgroundColor: 'var(--color-bg-card)', padding: '6rem 0', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="subtitle-editorial" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Curadoria Exclusiva
              </span>
              <h2 className="heading-section">
                Destaques do Atelier
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/produtos')}
              className="btn btn-outline"
            >
              <span>Ver Todo o Catálogo</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {(featuredProducts.length > 0 ? featuredProducts : catalogProducts.slice(0, 4)).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. NOVIDADES RECENTES */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
            <span className="subtitle-editorial" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Lançamentos Recentes
            </span>
            <h2 className="heading-section" style={{ marginBottom: '0.75rem' }}>
              Novidades da Temporada
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              Modelos recém-saídos da sala de corte do Atelier Nice, prontos para prova e locação.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL SPOTLIGHT / THE ATELIER EXPERIENCE */}
      <section
        style={{
          backgroundColor: '#4E231F',
          color: '#FAF0EC',
          padding: '6rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--color-accent-gold)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '1rem'
                }}
              >
                A Experiência Atelier Nice
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                  color: '#FFFFFF'
                }}
              >
                Mais que um vestido. Uma obra de arte feita para você.
              </h2>

              <p style={{ fontSize: '1rem', color: '#E8CEC5', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                No Atelier Nice, cada detalhe conta uma história. Nossas criações nascem do diálogo entre a tradição da alfaiataria fina e a sensibilidade contemporânea. Oferecemos consultoria de imagem personalizada, ajustes de alta precisão e uma experiência acolhedora que transforma a escolha do seu vestido em um momento memorável.
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                <button
                  onClick={() => onNavigate('/contato')}
                  className="btn btn-primary"
                  style={{ padding: '0.9rem 2rem' }}
                >
                  Agendar Sessão de Prova
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=85"
                alt="Atelier Nice Detalhes de Costura"
                style={{
                  width: '100%',
                  height: '480px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .cat-img-zoom:hover {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};
