import React from 'react';
import { LuxuryLogo } from '../common/LuxuryLogo';
import { Phone, MapPin, Clock, MessageCircle, Shield, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../common/Icons';
import { useStore } from '../../context/StoreContext';

export const Footer = ({ onNavigate }) => {
  const { settings } = useStore();
  const store = settings?.store || {};

  return (
    <footer
      style={{
        backgroundColor: '#4E231F', // Rich luxury velvet rose background (strict pink/rose foundation)
        color: '#FBF0EB',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
        borderTop: '2px solid var(--color-border)',
        marginTop: '6rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <LuxuryLogo height={92} color="#F3D8CF" showSlogan={true} />
            </div>
            <p
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#E8CEC5',
                marginBottom: '1.5rem'
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
                href={`https://wa.me/${store.whatsapp || '5511999998888'}`}
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
              <li>
                <button
                  onClick={() => onNavigate('/produtos?categoria=festa-e-gala')}
                  style={{ color: '#C7AFA7', transition: 'color var(--transition-fast)' }}
                >
                  Vestidos de Gala & Noite
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/produtos?categoria=madrinhas')}
                  style={{ color: '#C7AFA7', transition: 'color var(--transition-fast)' }}
                >
                  Madrinhas de Casamento
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/produtos?categoria=noivas-e-civil')}
                  style={{ color: '#C7AFA7', transition: 'color var(--transition-fast)' }}
                >
                  Noivas & Cerimônia Civil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/produtos?categoria=formatura')}
                  style={{ color: '#C7AFA7', transition: 'color var(--transition-fast)' }}
                >
                  Formatura & Bailes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/produtos?categoria=debutantes')}
                  style={{ color: '#C7AFA7', transition: 'color var(--transition-fast)' }}
                >
                  Debutantes 15 Anos
                </button>
              </li>
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
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: '#C7AFA7' }}>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{store.address || 'Alameda das Magnólias, 480 — Jardins, São Paulo - SP'}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <Clock size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{store.businessHours || 'Seg. a Sex. 09h às 19h | Sábados com agendamento'}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>{store.phone || '(11) 3456-7890'}</span>
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
                <Sparkles size={14} /> Atendimento VIP
              </span>
              <h5 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Agende sua Prova Exclusiva
              </h5>
              <p style={{ fontSize: '0.82rem', color: '#C7AFA7', lineHeight: 1.4 }}>
                Receba consultoria de estilo personalizada com nossa estilista em sala privativa com espumante.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/contato')}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1.25rem', width: '100%' }}
            >
              Agendar Horário
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(243, 216, 207, 0.18)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#D8BCB3'
          }}
        >
          <p>© 2026 Atelier Nice — Todos os direitos reservados. Alta Costura & Moda Festa.</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => onNavigate('/admin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#F3D8CF',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Shield size={14} color="#B67068" />
              <span>Acesso Administrativo</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
