import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../core/utils';

export const WhatsAppFloatingButton = ({ contextProductName = null, contextProductSKU = null }) => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const defaultMsg = contextProductName
    ? `Olá! Tenho interesse no vestido ${contextProductName}${contextProductSKU ? ` (Ref: ${contextProductSKU})` : ''} do Atelier Nice e gostaria de agendar uma prova ou saber mais informações.`
    : (settings?.store?.whatsappDefaultMessage || 'Olá! Gostaria de falar com uma consultora do Atelier Nice sobre vestidos de festa e noivas.');

  const waUrl = buildWhatsAppLink({ customText: defaultMsg });

  return (
    <div
      className="whatsapp-floating-container"
      style={{
        position: 'fixed',
        bottom: 'calc(1.75rem + var(--safe-area-bottom))',
        left: '1.75rem',
        zIndex: 850,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      {/* Floating Mini Popup */}
      {isOpen && (
        <div
          style={{
            marginBottom: '0.75rem',
            background: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1.25rem',
            maxWidth: '300px',
            animation: 'slideUp 200ms ease-out',
            position: 'relative'
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '0.6rem',
              right: '0.6rem',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
            aria-label="Fechar janela WhatsApp"
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#25D366'
              }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Consultoria Atelier Nice
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '0.9rem' }}>
            {contextProductName
              ? `Gostaria de atendimento exclusivo sobre o ${contextProductName}?`
              : 'Fale diretamente com nossas estilistas para agendamento de prova ou dúvidas sob medida.'}
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm"
            style={{
              width: '100%',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              borderColor: '#25D366',
              fontWeight: 600
            }}
          >
            <MessageCircle size={16} />
            <span>Iniciar Conversa</span>
          </a>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform var(--transition-normal)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Atendimento via WhatsApp"
        title="Atendimento via WhatsApp"
      >
        <MessageCircle size={28} />
      </button>
      <style>{`
        @media (max-width: 768px) {
          .whatsapp-floating-container {
            bottom: calc(1rem + var(--safe-area-bottom)) !important;
            left: 1rem !important;
          }
          .whatsapp-floating-container button {
            width: 48px !important;
            height: 48px !important;
          }
          .whatsapp-floating-container button svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};
