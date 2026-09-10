import React from 'react';
import { LuxuryLogo } from '../common/LuxuryLogo';
import { Phone, MapPin, Clock, MessageCircle, Shield, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../common/Icons';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink, getWhatsAppDisplayPhone } from '../../core/utils';

export const Footer = ({ onNavigate }) => {
  const { settings, categories } = useStore();
  const store = settings?.store || {};

  return (
    <footer
      className="public-footer"
      style={{
        backgroundColor: '#4E231F', // Rich luxury velvet rose background (strict pink/rose foundation)
        color: '#FBF0EB',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        borderTop: '2px solid var(--color-border)',
        marginTop: '5rem'
      }}
    >
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <LuxuryLogo height={80} color="#F3D8CF" showSlogan={true} />
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: '#E8CEC5',
                marginBottom: '1.25rem'
              }}
            >
              Alta costura autoral com identidade feminina, elegância e rigor artesanal. Vestidos sob medida para compra e locação exclusiva.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={`https://instagram.com/${store.instagram?.replace('@', '') || 'ateliernice'}`}
                target="_blank"
                rel="noreferrer"
                className="btn-icon"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF'
                }}
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={buildWhatsAppLink('Olá! Gostaria de falar com uma consultora do Atelier Nice.')}
                target="_blank"
                rel="noreferrer"
                className="btn-icon"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF'
                }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-primary-light)',
                marginBottom: '1.25rem',
                fontWeight: 600
              }}
            >
              Coleções & Vestidos
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              {categories && categories.filter(c => c.active !== false).length > 0 ? (
                categories.filter(c => c.active !== false).slice(0, 5).map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => onNavigate(`/produtos?categoria=${cat.slug || cat.id}`)}
                      style={{ color: '#C7AFA7', transition: 'color var(--transition-fast)' }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))
              ) : (
                <li>
                  <button
                    onClick={() => onNavigate('/produtos')}
                    style={{ color: '#C7AFA7', transition: 'color var(--transition-fast)' }}
                  >
                    Ver Catálogo Completo
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Atelier Experience */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-primary-light)',
                marginBottom: '1.25rem',
                fontWeight: 600
              }}
            >
              Atendimento & Prova
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#C7AFA7' }}>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{store.address || 'Atendimento exclusivo com agendamento prévio'}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <Clock size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{store.businessHours || 'Segunda a Sábado com horário marcado'}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <MessageCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <a
                  href={buildWhatsAppLink('Olá! Gostaria de agendar um horário no Atelier.')}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#F3D8CF', textDecoration: 'underline' }}
                >
                  WhatsApp: {getWhatsAppDisplayPhone()}
                </a>
              </li>
            </ul>
          </div>

          {/* Exclusive Experience Box */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--color-accent-gold)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}
              >
                <Sparkles size={14} /> Atendimento Personalizado
              </span>
              <h5 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Agende sua Prova Exclusiva
              </h5>
              <p style={{ fontSize: '0.82rem', color: '#C7AFA7', lineHeight: 1.4 }}>
                Receba consultoria de estilo personalizada com nossa estilista para compra ou locação sob medida.
              </p>
            </div>

            <a
              href={buildWhatsAppLink('Olá! Gostaria de agendar uma prova exclusiva de vestidos no Atelier Nice.')}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1.25rem', width: '100%', textAlign: 'center' }}
            >
              Agendar no WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-bottom-bar"
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(243, 216, 207, 0.18)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#D8BCB3'
          }}
        >
          <p>© 2026 Atelier Nice — Alta Costura, Moda Festa e Vestidos Exclusivos.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .public-footer {
            padding-top: 3rem !important;
            margin-top: 3.5rem !important;
          }
          .footer-grid {
            gap: 2rem !important;
            margin-bottom: 2.5rem !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            text-align: center !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </footer>
  );
};
