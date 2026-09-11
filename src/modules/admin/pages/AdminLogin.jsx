import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
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

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, informe seu e-mail e senha cadastrados no Supabase Auth.');
      return;
    }

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

  return (
    <div
      className="admin-login-screen"
      style={{
        minHeight: '100vh',
        backgroundColor: '#4E231F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative'
      }}
    >
      {/* Top Left Return Button */}
      <button
        onClick={onReturnToStore}
        className="admin-login-return-btn"
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#FAF0EC',
          fontSize: '0.85rem',
          cursor: 'pointer',
          padding: '0.4rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(255,255,255,0.08)'
        }}
      >
        <ArrowLeft size={16} />
        <span>Loja Pública</span>
      </button>

      {/* Login Box */}
      <div
        className="admin-login-box"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginTop: '2rem'
        }}
      >
        {/* Brand Logo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <LuxuryLogo height={80} color="#B67068" />
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
          Autenticação exclusiva via Supabase Auth para gestão do Atelier Nice.
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
            backgroundColor: isSupabaseConfigured ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
            color: isSupabaseConfigured ? 'var(--color-success)' : 'var(--color-danger)',
            marginBottom: '1.5rem',
            border: `1px solid ${isSupabaseConfigured ? 'var(--color-success-border)' : 'var(--color-danger-border)'}`
          }}
        >
          {isSupabaseConfigured ? (
            <>
              <CheckCircle2 size={13} />
              <span>Supabase Auth Ativo</span>
            </>
          ) : (
            <>
              <AlertCircle size={13} />
              <span>Supabase não configurado no .env.local</span>
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
                placeholder="seu-email@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '2.4rem' }}
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
          >
            <span>{loading ? 'Autenticando no Supabase...' : 'Entrar no Painel'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .admin-login-screen {
            padding: 1rem !important;
          }
          .admin-login-box {
            padding: 1.75rem 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};
