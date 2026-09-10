import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Scissors, Clock, Award, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/public/ProductCard';
import { NeutralImagePlaceholder } from '../../components/common/NeutralImagePlaceholder';
import { buildWhatsAppLink } from '../../core/utils';

export const HomePage = ({ onNavigate, onSelectProduct }) => {
  const { products, categories, banners } = useStore();

  const heroBanner = banners?.[0] || {
    title: 'A Nobreza da Alta Costura Feminina',
    subtitle: 'COLEÇÃO ATELIER NICE',
    description: 'Criações exclusivas em Zibeline, seda pura e rendas nobres. Peças autorais desenhadas para vestir sua essência nos momentos mais inesquecíveis.',
    imageUrl: ''
  };

  // Only published or out-of-stock items for public catalog
  const catalogProducts = products.filter(p => p.status === 'published' || p.status === 'out_of_stock');
  const featuredProducts = catalogProducts.filter(p => p.featured).slice(0, 4);
  const newArrivals = catalogProducts.slice(0, 4);

  return (
    <div className="homepage-container">
      {/* 1. HERO EDITORIAL */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--color-bg-primary)',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-grid">
            {/* Left Copy */}
            <div className="hero-copy">
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
                  marginBottom: '1rem'
                }}
              >
                <Sparkles size={14} />
                <span>{heroBanner.subtitle}</span>
              </div>

              <h1 className="heading-hero" style={{ marginBottom: '1rem' }}>
                {heroBanner.title}
              </h1>

              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {heroBanner.description}
              </p>

              <div className="hero-cta-group" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('/produtos')}
                  className="btn btn-primary btn-lg hero-cta-main"
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => onNavigate('/sobre')}
                  className="btn btn-secondary btn-lg hero-cta-sec"
                >
                  <span>Conheça o Atelier</span>
                </button>
              </div>
            </div>

            {/* Right Editorial Visual Composition */}
            <div className="hero-image-col" style={{ position: 'relative' }}>
              <div className="hero-image-wrapper">
                {heroBanner.imageUrl && !heroBanner.imageUrl.includes('unsplash') ? (
                  <img
                    src={heroBanner.imageUrl}
                    alt="Editorial de Moda Atelier Nice"
                    className="hero-image"
                  />
                ) : (
                  <div
                    style={{
                      height: '500px',
                      background: 'linear-gradient(135deg, #F8E5DF 0%, #F3D8CF 50%, #E8C8BE 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2.5rem',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        border: '2px solid #B67068',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        boxShadow: '0 8px 24px rgba(182, 112, 104, 0.2)'
                      }}
                    >
                      <Sparkles size={40} color="#B67068" />
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-editorial)',
                        fontSize: '2.2rem',
                        color: 'var(--color-text-main)',
                        fontWeight: 600,
                        lineHeight: 1.15,
                        marginBottom: '0.5rem'
                      }}
                    >
                      Atelier Nice
                    </span>

                    <span
                      style={{
                        fontSize: '0.85rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        marginBottom: '1.5rem'
                      }}
                    >
                      Alta Costura Feminina
                    </span>

                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '280px',
                        lineHeight: 1.5
                      }}
                    >
                      Exclusividade e sobriedade em cada costura.
                    </p>
                  </div>
                )}

                {/* Floating Badge on Banner */}
                <div className="hero-image-badge">
                  <div>
                    <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary)', fontWeight: 600, display: 'block' }}>
                      Atendimento Sob Medida
                    </span>
                    <strong style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                      Venda & Locação Exclusiva
                    </strong>
                  </div>

                  <button
                    onClick={() => onNavigate('/produtos')}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    Ver Peças
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR */}
      <section style={{ backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)', padding: '2rem 0' }}>
        <div className="container">
          <div className="value-props-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="btn-icon prop-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Scissors size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Alta Costura & Ajustes</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Caimento sob medida no corpo.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="btn-icon prop-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Venda & Locação</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Opções flexíveis para seu evento.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="btn-icon prop-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Award size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Tecidos Nobres</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Zibeline, seda e rendas selecionadas.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="btn-icon prop-icon" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Clock size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Atendimento Personalizado</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>Consultoria direta via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIAS */}
      {categories.filter(c => c.active !== false).length > 0 && (
        <section className="home-section">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
                Nossas Linhas
              </span>
              <h2 className="heading-section" style={{ marginBottom: '0.5rem' }}>
                Descubra por Ocasião
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Vestidos pensados para celebrações marcantes.
              </p>
            </div>

            <div className="home-cat-grid">
              {categories.filter(c => c.active !== false).slice(0, 4).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(`/produtos?categoria=${cat.slug}`)}
                  className="card-luxury home-cat-card"
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  {cat.image && !cat.image.includes('unsplash') ? (
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
                  ) : (
                    <NeutralImagePlaceholder
                      title={cat.name}
                      subtitle="Linha Exclusiva"
                      height="100%"
                    />
                  )}

                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(41,22,19,0.88) 0%, rgba(41,22,19,0.2) 60%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '1.5rem'
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-editorial)',
                        fontSize: '1.35rem',
                        color: '#FFFFFF',
                        marginBottom: '0.25rem',
                        fontWeight: 600
                      }}
                    >
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p style={{ fontSize: '0.78rem', color: '#F3D8CF', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                        {cat.description}
                      </p>
                    )}
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--color-primary-light)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        letterSpacing: '0.05em'
                      }}
                    >
                      <span>Ver Modelos</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. PRODUTOS EM DESTAQUE / CATÁLOGO */}
      <section className="home-section" style={{ backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
                Curadoria Autoral
              </span>
              <h2 className="heading-section">
                Destaques do Atelier
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/produtos')}
              className="btn btn-outline btn-sm"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {catalogProducts.length > 0 ? (
            <div className="home-products-grid">
              {(featuredProducts.length > 0 ? featuredProducts : catalogProducts.slice(0, 4)).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={onSelectProduct}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                border: '1px dashed var(--color-border)'
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(182, 112, 104, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: 'var(--color-primary)'
                }}
              >
                <Scissors size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                Coleção em Preparação no Atelier
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 1.75rem' }}>
                Novos modelos estão sendo catalogados. Entre em contato diretamente pelo WhatsApp para consultar peças sob encomenda ou agendar uma consultoria personalizada.
              </p>
              <a
                href={buildWhatsAppLink({ customText: 'Olá Atelier Nice! Gostaria de consultar modelos disponíveis e vestidos sob encomenda.' })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <MessageCircle size={18} />
                <span>Consultar no WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 5. NOVIDADES RECENTES (if more than 4 products) */}
      {catalogProducts.length > 4 && (
        <section className="home-section">
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
                Acervo
              </span>
              <h2 className="heading-section" style={{ marginBottom: '0.5rem' }}>
                Peças da Coleção
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Modelos desenvolvidos pelo Atelier Nice.
              </p>
            </div>

            <div className="home-products-grid">
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
      )}

      {/* 6. EDITORIAL SPOTLIGHT */}
      <section
        style={{
          backgroundColor: '#4E231F',
          color: '#FAF0EC',
          padding: '4.5rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div className="spotlight-grid">
            <div>
              <span
                style={{
                  color: 'var(--color-accent-gold)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.75rem'
                }}
              >
                A Experiência Atelier Nice
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-editorial)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  lineHeight: 1.18,
                  marginBottom: '1.25rem',
                  color: '#FFFFFF'
                }}
              >
                Mais que um vestido. Uma obra de arte feita para você.
              </h2>

              <p style={{ fontSize: '0.92rem', color: '#E8CEC5', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                No Atelier Nice, cada detalhe conta uma história. Oferecemos consultoria de imagem personalizada, ajustes de alta precisão e uma experiência acolhedora que transforma a escolha do seu vestido em um momento inesquecível.
              </p>

              <button
                onClick={() => onNavigate('/contato')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem' }}
              >
                Fale com o Atelier
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(243, 216, 207, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: '320px'
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    border: '1.5px solid var(--color-accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    color: 'var(--color-accent-gold)'
                  }}
                >
                  <Award size={32} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: '1.6rem',
                    color: '#FFFFFF',
                    marginBottom: '0.5rem'
                  }}
                >
                  Atelier Nice
                </h3>
                <p
                  style={{
                    color: '#E8CEC5',
                    fontSize: '0.85rem',
                    maxWidth: '300px',
                    lineHeight: 1.5
                  }}
                >
                  Atendimento com hora marcada, tecidos finos e modelagem sob medida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          min-height: 80vh;
          padding: 3.5rem 0;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          alignItems: center;
        }
        .hero-copy {
          max-width: 580px;
        }
        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 460px;
          margin: 0 auto;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-border);
          background-color: #F8E5DF;
        }
        .hero-image {
          width: 100%;
          height: 520px;
          object-fit: cover;
          display: block;
        }
        .hero-image-badge {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          right: 1.25rem;
          background: rgba(255, 253, 252, 0.94);
          backdrop-filter: blur(16px);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .value-props-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .home-section {
          padding: 5rem 0;
        }
        .home-cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .home-cat-card {
          height: 360px;
        }
        .home-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.75rem;
        }
        .spotlight-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 3.5rem;
          align-items: center;
        }
        .cat-img-zoom:hover {
          transform: scale(1.06);
        }

        /* Mobile Adjustments (<= 900px & <= 600px) */
        @media (max-width: 900px) {
          .hero-section {
            padding: 2rem 0;
            min-height: auto;
          }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2.25rem;
          }
          .hero-image {
            height: 380px;
          }
          .value-props-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
          .home-section {
            padding: 3rem 0;
          }
          .home-cat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .home-cat-card {
            height: 280px;
          }
          .home-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .spotlight-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-image {
            height: 320px;
          }
          .hero-cta-main, .hero-cta-sec {
            width: 100%;
          }
          .value-props-grid {
            grid-template-columns: 1fr;
            gap: 0.85rem;
          }
          .prop-icon {
            width: 36px !important;
            height: 36px !important;
          }
          .home-cat-grid {
            grid-template-columns: 1fr;
          }
          .home-cat-card {
            height: 240px;
          }
        }
      `}</style>
    </div>
  );
};
