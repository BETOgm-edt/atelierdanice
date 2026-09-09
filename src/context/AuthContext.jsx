import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Erro ao recuperar sessão Supabase:', error.message);
          }
          if (isMounted) {
            setSession(initialSession);
            if (initialSession?.user) {
              setAdminUser({
                id: initialSession.user.id,
                email: initialSession.user.email,
                name: initialSession.user.user_metadata?.name || 'Administradora Atelier Nice',
                role: 'admin',
                avatar: initialSession.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              });
            } else {
              setAdminUser(null);
            }
          }
        } else {
          // Fallback if environment variables are not yet populated
          const saved = localStorage.getItem('atelier_nice_admin_session');
          if (saved && isMounted) {
            const parsed = JSON.parse(saved);
            setAdminUser(parsed);
          }
        }
      } catch (err) {
        console.error('Falha na inicialização da autenticação:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen to real-time Supabase Auth state changes
    let authListener = null;
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (isMounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            setAdminUser({
              id: currentSession.user.id,
              email: currentSession.user.email,
              name: currentSession.user.user_metadata?.name || 'Administradora Atelier Nice',
              role: 'admin',
              avatar: currentSession.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
            });
          } else {
            setAdminUser(null);
          }
          setLoading(false);
        }
      });
      authListener = subscription;
    }

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Por favor, informe e-mail e senha.' };
      }

      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) {
          let userFriendlyMessage = 'E-mail ou senha incorretos.';
          if (error.message.includes('Invalid login credentials')) {
            userFriendlyMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
          } else if (error.message.includes('Email not confirmed')) {
            userFriendlyMessage = 'E-mail ainda não confirmado no Supabase.';
          }
          return { success: false, error: userFriendlyMessage };
        }

        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || 'Administradora Atelier Nice',
          role: 'admin',
          avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        };

        setSession(data.session);
        setAdminUser(user);
        return { success: true, user };
      } else {
        // Safe development fallback when .env.local has placeholders
        const user = {
          id: 'adm-demo-1',
          name: 'Nice — Diretora Criativa',
          email: cleanEmail,
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          isDevSession: true
        };
        setAdminUser(user);
        localStorage.setItem('atelier_nice_admin_session', JSON.stringify(user));
        return { success: true, user };
      }
    } catch (err) {
      console.error('Erro no login:', err);
      return { success: false, error: 'Erro de conexão com o servidor de autenticação.' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      setAdminUser(null);
      setSession(null);
      localStorage.removeItem('atelier_nice_admin_session');
    } catch (err) {
      console.error('Erro no logout:', err);
      setAdminUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        session,
        isAuthenticated: Boolean(adminUser),
        loading,
        login,
        logout,
        isSupabaseConfigured: isSupabaseConfigured()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
