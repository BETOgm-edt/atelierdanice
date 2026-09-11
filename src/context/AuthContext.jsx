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
                avatar: initialSession.user.user_metadata?.avatar_url || null
              });
            } else {
              setAdminUser(null);
            }
          }
        } else {
          if (isMounted) {
            setSession(null);
            setAdminUser(null);
          }
        }
      } catch (err) {
        console.error('Falha na inicialização da autenticação:', err);
        if (isMounted) {
          setSession(null);
          setAdminUser(null);
        }
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
              avatar: currentSession.user.user_metadata?.avatar_url || null
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

      if (!isSupabaseConfigured()) {
        return {
          success: false,
          error: 'Serviço de autenticação Supabase não configurado ou indisponível.'
        };
      }

      const cleanEmail = email.trim().toLowerCase();

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
        } else if (error.message.includes('Too many requests')) {
          userFriendlyMessage = 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
        } else if (error.message) {
          userFriendlyMessage = error.message;
        }
        return { success: false, error: userFriendlyMessage };
      }

      if (!data?.user) {
        return { success: false, error: 'Usuário não encontrado no Supabase Auth.' };
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'Administradora Atelier Nice',
        role: 'admin',
        avatar: data.user.user_metadata?.avatar_url || null
      };

      setSession(data.session);
      setAdminUser(user);
      return { success: true, user };
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
        isAuthenticated: Boolean(session?.user && adminUser),
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
