import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { getWhatsAppDisplayPhone, buildWhatsAppLink } from '../../core/utils';

export const ContactPage = () => {
  const { settings } = useStore();
  const { showToast } = useToast();
  const store = settings?.store || {};

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    occasion: 'Madrinha de Casamento',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const displayPhone = getWhatsAppDisplayPhone();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      showToast('Por favor, preencha seu nome e WhatsApp.', 'warning');
      return;
    }

    const messageLines = [
      `*Solicitação de Agendamento — Atelier Nice*`,
      ``,
      `*Cliente:* ${form.name}`,
      `*WhatsApp:* ${form.phone}`,
      form.email ? `*E-mail:* ${form.email}` : '',
      `*Ocasião:* ${form.occasion}`,
      form.eventDate ? `*Data do Evento:* ${form.eventDate}` : '',
      form.notes ? `*Observações:* ${form.notes}` : ''
    ].filter(Boolean);

    const waUrl = buildWhatsAppLink({ customText: messageLines.join('\n') });
    window.open(waUrl, '_blank');

    setSubmitted(true);
    showToast('Solicitação preparada! Abrindo WhatsApp do Atelier...', 'success');
  };

  const directWaUrl = buildWhatsAppLink({
    customText: 'Olá! Gostaria de agendar um horário para consultoria e prova de vestidos no Atelier Nice.'
  });

  return (
    <div className="container" style={{ padding: '3rem 0 6rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem' }}>
        <span className="subtitle-editorial" style={{ marginBottom: '0.4rem', display: 'block' }}>
          Atendimento Personalizado
        </span>
        <h1 className="heading-section" style={{ marginBottom: '0.75rem' }}>
          Agende sua Consultoria no Atelier
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Estamos à disposição para receber você com exclusividade. Escolha seu vestido com a tranquilidade e a atenção que você merece.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'flex-start'
        }}
      >
        {/* Contact Form */}
        <div
          className="contact-form-card"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
                Solicitação Direcionada!
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Sua mensagem foi estruturada para o WhatsApp do Atelier. Caso a conversa não tenha aberto automaticamente, clique no botão abaixo.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                >
                  <MessageCircle size={16} />
                  <span>Conversar no WhatsApp</span>
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline btn-sm"
                >
                  Nova Solicitação
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.45rem', color: 'var(--color-text-main)', marginBottom: '1.25rem' }}>
                Solicitar Agendamento
              </h3>

              <div className="form-group">
                <label className="form-label">
                  <span>Nome Completo</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-text"
                />
              </div>

              <div className="contact-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>WhatsApp</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(12) 99127-9309"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>E-mail</span>
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="contact-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Data do Evento</span>
                  </label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="input-text"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Ocasião</span>
                  </label>
                  <select
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                    className="select-luxury"
                  >
                    <option value="Madrinha de Casamento">Madrinha de Casamento</option>
                    <option value="Noiva / Casamento Civil">Noiva / Casamento Civil</option>
                    <option value="Formatura">Formatura</option>
                    <option value="Debutante / 15 Anos">Debutante / 15 Anos</option>
                    <option value="Gala / Black Tie">Gala / Black Tie</option>
                    <option value="Outra Ocasião">Outra Ocasião</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mensagem ou Modelos de Interesse</label>
                <textarea
                  placeholder="Conte-nos sobre o evento, preferências de cor, tamanho ou modelos que mais gostou no catálogo."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="textarea-luxury"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                <Send size={16} />
                <span>Enviar via WhatsApp do Atelier</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Info Card */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-card)',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.45rem', color: 'var(--color-text-main)', marginBottom: '1.25rem' }}>
              Atendimento do Atelier
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <MapPin size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>Atendimento Presencial</strong>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{store.address || 'Consultoria e provas com agendamento prévio'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <Clock size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>Horário de Atendimento</strong>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{store.businessHours || 'Segunda a Sábado — com agendamento'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <Phone size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>WhatsApp Oficial</strong>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{displayPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Channel */}
          <div
            style={{
              backgroundColor: 'rgba(37,211,102,0.08)',
              border: '1px solid rgba(37,211,102,0.25)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.2rem' }}>
                Atendimento Rápido
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                Fale diretamente com nossa consultora no WhatsApp.
              </p>
            </div>

            <a
              href={directWaUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm"
              style={{ backgroundColor: '#25D366', color: '#FFFFFF', borderColor: '#25D366', minHeight: '42px', padding: '0 1rem' }}
            >
              <MessageCircle size={16} />
              <span>Abrir WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .contact-form-grid-2 {
            grid-template-columns: 1fr !important;
          }
          .contact-form-card {
            padding: 1.5rem 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};
