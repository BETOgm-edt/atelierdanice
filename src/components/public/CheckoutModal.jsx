import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, ShieldCheck, AlertCircle, MessageCircle, CreditCard, QrCode } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { dataService } from '../../data';
import { formatCurrency } from '../../core/utils';
import { useToast } from '../../context/ToastContext';

export const CheckoutModal = ({ isOpen, onClose, onOrderCompleted }) => {
  const { cart, subtotal, discountAmount, shippingCost, total, clearCart } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Contact & Delivery, 2: Payment Simulation, 3: Completed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    cep: '',
    address: '',
    city: '',
    state: '',
    shippingMethod: 'Retirada e Prova no Atelier Nice (Grátis)',
    paymentMethod: 'pix_simulation', // 'pix_simulation' | 'card_simulation' | 'whatsapp_boutique'
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Por favor, informe seu nome e WhatsApp para contato.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create order in real Data Service layer
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          document: formData.document.trim()
        },
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          size: item.variant?.size || 'Padrão',
          color: item.variant?.color?.name || 'Padrão',
          modality: item.modality,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        status: 'pending_payment',
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        total,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod === 'whatsapp_boutique'
          ? 'Atendimento e Pagamento via Consultora WhatsApp'
          : formData.paymentMethod === 'card_simulation'
          ? 'Cartão de Crédito (Simulação de Checkout)'
          : 'PIX (Simulação de Checkout)',
        notes: formData.notes
      };

      const newOrder = await dataService.orders.create(orderPayload);

      // Decrement stock in real data layer
      for (const item of cart) {
        await dataService.products.decrementStock(item.productId, item.variant?.id, item.quantity);
      }

      // Record in customer CRM
      await dataService.customers.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state
      });

      setCreatedOrder(newOrder);
      clearCart();
      setStep(3);
      showToast(`Pedido ${newOrder.orderNumber} gerado com sucesso!`, 'success');
      onOrderCompleted?.(newOrder);
    } catch (err) {
      console.error('Error creating order:', err);
      showToast('Erro ao processar o pedido. Tente novamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {step === 3 ? 'Pedido Confirmado' : 'Finalizar Atendimento & Compra'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Prototype Transparency Notice */}
        {step !== 3 && (
          <div
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              borderBottom: '1px solid var(--color-border-subtle)',
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.78rem',
              color: 'var(--color-text-secondary)'
            }}
          >
            <ShieldCheck size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Ambiente de Demonstração Oficial:</strong> Os dados deste pedido serão registrados no painel administrativo real sem cobrança financeira em cartão/banco.
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.5rem 2rem' }}>
          {step === 1 && (
            <form id="checkout-form-step1" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.3rem', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
                1. Informações de Contato & Prova
              </h4>

              <div className="form-group">
                <label className="form-label">
                  <span>Nome Completo</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex: Mariana Drummond Silveira"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-text"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>WhatsApp / Telefone</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-text"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>E-mail</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="mariana@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-text"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Modalidade de Entrega / Prova</label>
                <select
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleChange}
                  className="select-luxury"
                >
                  <option value="Retirada e Prova no Atelier Nice (Grátis)">
                    Retirada & Prova Presencial no Atelier Nice (Grátis - Recomendado)
                  </option>
                  <option value="Sedex Especial com Seguro e Bag de Luxo (R$ 45,00)">
                    Sedex Especial com Seguro e Bag de Luxo (R$ 45,00)
                  </option>
                  <option value="Entrega Vip por Portador Atelier (São Paulo Capital)">
                    Entrega VIP por Portador Atelier (São Paulo Capital - R$ 80,00)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Observações ou Data do Evento (Opcional)</label>
                <textarea
                  name="notes"
                  placeholder="Ex: Casamento no dia 20/05 em Ilhabela, gostaria de agendar prova presencial para ajustes."
                  value={formData.notes}
                  onChange={handleChange}
                  className="textarea-luxury"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  Prosseguir para Pagamento / Agendamento
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleCreateOrder}>
              <h4 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.3rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                2. Escolha como Deseja Finalizar
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Selecione a forma de prosseguir com seu pedido no Atelier Nice.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: `1.5px solid ${formData.paymentMethod === 'pix_simulation' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: formData.paymentMethod === 'pix_simulation' ? 'var(--color-bg-subtle)' : 'var(--color-bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix_simulation"
                    checked={formData.paymentMethod === 'pix_simulation'}
                    onChange={handleChange}
                  />
                  <QrCode size={22} color="var(--color-primary)" />
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', display: 'block' }}>
                      PIX com 5% de Desconto Especial
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Pagamento instantâneo do sinal ou valor integral.
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: `1.5px solid ${formData.paymentMethod === 'whatsapp_boutique' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: formData.paymentMethod === 'whatsapp_boutique' ? 'var(--color-bg-subtle)' : 'var(--color-bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="whatsapp_boutique"
                    checked={formData.paymentMethod === 'whatsapp_boutique'}
                    onChange={handleChange}
                  />
                  <MessageCircle size={22} color="#25D366" />
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', display: 'block' }}>
                      Atendimento Consultivo com Estilista no WhatsApp
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Finalize os detalhes de medidas, ajustes e data de prova diretamente com nossa equipe.
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: `1.5px solid ${formData.paymentMethod === 'card_simulation' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: formData.paymentMethod === 'card_simulation' ? 'var(--color-bg-subtle)' : 'var(--color-bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_simulation"
                    checked={formData.paymentMethod === 'card_simulation'}
                    onChange={handleChange}
                  />
                  <CreditCard size={22} color="var(--color-primary)" />
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', display: 'block' }}>
                      Cartão de Crédito em até 6x Sem Juros
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Pronto para integração com gateway seguro (Stripe / Pagar.me / Cielo).
                    </span>
                  </div>
                </label>
              </div>

              {/* Order summary box */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span>Itens ({cart.length})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-success)', marginBottom: '0.35rem' }}>
                    <span>Desconto</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                  <span>Total do Pedido</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-ghost">
                  Voltar
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Gerando Pedido...' : 'Confirmar e Gerar Pedido'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && createdOrder && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                Pedido Registrado com Sucesso
              </span>

              <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
                {createdOrder.orderNumber}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                Obrigada, <strong>{createdOrder.customer.name}</strong>! Seu pedido foi gravado no sistema do Atelier Nice. Nossa equipe entrará em contato via WhatsApp no número <strong>{createdOrder.customer.phone}</strong> para os próximos passos.
              </p>

              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  textAlign: 'left',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Status Inicial:</span>
                  <strong>Aguardando Atendimento / Pagamento</strong>
                </div>
                <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Modalidade:</span>
                  <strong>{createdOrder.shippingMethod}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Valor Total:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(createdOrder.total)}</strong>
                </div>
              </div>

              <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
                Concluir e Continuar Navegando
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
