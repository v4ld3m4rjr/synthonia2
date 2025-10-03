// [AI Generated] Data: 19/01/2025
// Descrição: Componente principal da aplicação Synthonia AI
// Gerado por: Cursor AI
// Versão: React 18.3.1, TypeScript 5.5.3
// AI_GENERATED_CODE_START
import React, { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { User } from './types';
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/dashboard/Dashboard';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !userProfile) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Dashboard user={userProfile} />
    </div>
  );
}

export default App;
// AI_GENERATED_CODE_END