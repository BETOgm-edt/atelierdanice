import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Sparkles, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LuxuryLogo } from '../../../components/common/LuxuryLogo';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export const AdminLogin = ({ onReturnToStore }) => {
  const { login, isSupabaseConfigured } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showToast('Autenticado com sucesso! Bem-vinda ao painel.', 'success');
    } else {
      setErrorMessage(result.error || 'Credenciais inválidas.');
      showToast(result.error || 'Erro na autenticação.', 'error');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@ateliernice.com.br');
    setPassword('nice2026');
    setLoading(true);
    const result = await login('admin@ateliernice.com.br', 'nice2026');
    setLoading(false);
    if (result.success) {
      showToast('Acesso de demonstração liberado!', 'success');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#4E231F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative'
      }}
    >
      {/* Top Left Return Button */}
      <button
        onClick={onReturnToStore}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#FAF0EC',
          fontSize: '0.88rem',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        <span>Voltar para a Loja Pública</span>
      </button>

      {/* Login Box */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          padding: '2.75rem 2.5rem',
          textAlign: 'center'
        }}
      >
        {/* Brand Logo */}
        <div style={{ marginBottom: '1.75rem' }}>
          <LuxuryLogo height={96} color="#B67068" />
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--color-primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '0.5rem'
          }}
        >
          <Shield size={14} /> Painel Administrativo
        </span>

        <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.75rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
          Acesso Restrito
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Autenticação segura via Supabase Auth para gestão do catálogo e acervo.
        </p>

        {/* Supabase Status Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isSupabaseConfigured ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
            color: isSupabaseConfigured ? 'var(--color-success)' : 'var(--color-warning)',
            marginBottom: '1.5rem',
            border: `1px solid ${isSupabaseConfigured ? 'var(--color-success-border)' : 'var(--color-warning-border)'}`
          }}
        >
          {isSupabaseConfigured ? (
            <>
              <CheckCircle2 size={13} />
              <span>Supabase Auth Conectado</span>
            </>
          ) : (
            <>
              <AlertCircle size={13} />
              <span>Modo Demonstração (Configure o .env.local)</span>
            </>
          )}
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
              textAlign: 'left'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">E-mail Administrativo</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="admin@ateliernice.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Senha de Acesso</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
          >
            <span>{loading ? 'Autenticando no Supabase...' : 'Entrar no Painel'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Fallback Demo Helper if not yet configured */}
        {!isSupabaseConfigured && (
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-border-subtle)'
            }}
          >
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '0.82rem' }}
            >
              <Sparkles size={14} color="var(--color-accent-gold)" />
              <span>Entrar com 1-Clique (Modo Demonstração)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
