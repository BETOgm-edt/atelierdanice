import React from 'react';
import { Scissors, Sparkles, Heart, Award, ShieldCheck, MapPin } from 'lucide-react';
import { LuxuryLogo } from '../../components/common/LuxuryLogo';

export const AboutPage = ({ onNavigate }) => {
  return (
    <div className="container" style={{ padding: '3rem 0 6rem' }}>
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 4rem' }}>
        <span className="subtitle-editorial" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Tradição, Moda & Elegância
        </span>
        <h1 className="heading-section" style={{ marginBottom: '1rem' }}>
          O Atelier Nice
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          Criamos vestidos autorais que celebram momentos inesquecíveis. Uma união entre o rigor artesanal da alta costura e a sensibilidade do vestir contemporâneo.
        </p>
      </div>

      {/* Story & Image 2-Col */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
          marginBottom: '6rem'
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: '2.2rem',
              color: 'var(--color-text-main)',
              marginBottom: '1.25rem',
              lineHeight: 1.2
            }}
          >
            A História da Marca
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.96rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            <p>
              Fundado com o propósito de oferecer às mulheres brasileiras uma experiência de vestir personalizada e memorável, o <strong>Atelier Nice</strong> consolidou-se como referência no segmento de alta costura, gala e noivas civis.
            </p>
            <p>
              Cada modelo nasce de croquis exclusivos, passa por uma rigorosa seleção de matérias-primas importadas — como sedas puras, crepes estruturados e rendas francesas — e é lapidado pelas mãos experientes de nossas mestres costureiras.
            </p>
            <p>
              Acreditamos que um vestido de festa deve não apenas vestir perfeitamente o corpo, mas também transmitir confiança, nobreza e delicadeza em cada passo.
            </p>
          </div>
        </div>

        <div>
          <div
            style={{
              width: '100%',
              minHeight: '420px',
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'linear-gradient(145deg, #FAF7F2 0%, #F3D8CF 55%, #E8C8BE 100%)'
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '2px solid #B67068',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 24px rgba(182, 112, 104, 0.15)'
              }}
            >
              <Sparkles size={36} color="#B67068" />
            </div>

            <span
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: '2rem',
                color: 'var(--color-text-main)',
                fontWeight: 600,
                marginBottom: '0.4rem'
              }}
            >
              Atelier Nice
            </span>

            <span
              style={{
                fontSize: '0.82rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                fontWeight: 600,
                marginBottom: '1.5rem'
              }}
            >
              Alta Costura & Elegância
            </span>

            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                maxWidth: '320px',
                lineHeight: 1.6
              }}
            >
              Cada criação celebra a beleza autêntica e a singularidade feminina com tecidos nobres e acabamento impecável.
            </p>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '4rem 3rem',
          marginBottom: '6rem'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
          <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
            Nossos Valores
          </span>
          <h3 className="heading-section">
            Os Pilares do Atelier Nice
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <Scissors size={26} />
            </div>
            <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
              Modelagem e Caimento
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Ajustes de alta precisão que abraçam a silhueta com extremo conforto e elegância.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <Award size={26} />
            </div>
            <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
              Tecidos Nobres
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Zibeline, seda pura, tules finos e rendas selecionadas com caimento impecável.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <Heart size={26} />
            </div>
            <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.35rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
              Atendimento Dedicado
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Consultoria individual e personalizada para você encontrar o vestido perfeito para seu evento.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div
        style={{
          backgroundColor: '#4E231F',
          color: '#FAF0EC',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <Sparkles size={32} color="var(--color-accent-gold)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '2.2rem', marginBottom: '0.75rem', color: '#FFFFFF' }}>
          Venha Viver a Experiência Atelier Nice
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#D5BEB7', maxWidth: '520px', margin: '0 auto 2rem' }}>
          Agende um horário para conhecer nossas peças e realizar sua prova personalizada com nossa equipe.
        </p>
        <button onClick={() => onNavigate('/contato')} className="btn btn-primary btn-lg">
          Agendar Minha Visita
        </button>
      </div>
    </div>
  );
};
