// [AI Generated] Data: 19/01/2025
// Descrição: Cliente Supabase para autenticação e banco de dados
// Gerado por: Cursor AI
// Versão: Supabase 2.57.4
// AI_GENERATED_CODE_START
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in demo mode (no Supabase config)
const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'demo' || supabaseAnonKey === 'demo';

export const supabase = isDemoMode 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);

// Demo user data
const demoUser = {
  id: 'demo-user-123',
  email: 'demo@synthonia.ai',
  name: 'Usuário Demo',
  role: 'athlete' as const,
  created_at: new Date().toISOString(),
  avatar_url: null
};

// Demo daily data
const generateDemoData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      id: `demo-daily-${i}`,
      user_id: demoUser.id,
      date: date.toISOString().split('T')[0],
      sleep_quality: Math.floor(Math.random() * 4) + 6, // 6-10
      fatigue_level: Math.floor(Math.random() * 4) + 3, // 3-7
      mood: Math.floor(Math.random() * 3) + 7, // 7-10
      muscle_soreness: Math.floor(Math.random() * 5) + 2, // 2-7
      stress_level: Math.floor(Math.random() * 4) + 2, // 2-6
      resting_hr: Math.floor(Math.random() * 20) + 55, // 55-75
      hrv: Math.floor(Math.random() * 20) + 30, // 30-50
      readiness_score: Math.floor(Math.random() * 40) + 50, // 50-90
      created_at: date.toISOString()
    });
  }
  return data;
};

// Demo training sessions
const generateDemoTrainingSessions = () => {
  const sessions = [];
  for (let i = 25; i >= 0; i -= 2) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    sessions.push({
      id: `demo-training-${i}`,
      user_id: demoUser.id,
      date: date.toISOString().split('T')[0],
      duration: Math.floor(Math.random() * 60) + 45, // 45-105 min
      rpe: Math.floor(Math.random() * 4) + 6, // 6-10
      training_type: ['Musculação', 'Corrida', 'Ciclismo', 'Natação', 'Funcional'][Math.floor(Math.random() * 5)],
      tss: Math.floor(Math.random() * 80) + 40, // 40-120
      notes: 'Treino demo gerado automaticamente',
      created_at: date.toISOString()
    });
  }
  return sessions;
};
// Database utility functions
export const authHelpers = {
  async signUp(email: string, password: string, userData: any) {
    if (isDemoMode) {
      return { 
        data: { user: demoUser }, 
        error: null 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { data, error };
    } catch (networkError) {
      return { 
        data: null, 
        error: { 
          message: 'Erro de conexão com o servidor. Verifique sua conexão com a internet e tente novamente.' 
        } 
      };
    }
  },

  async signIn(email: string, password: string) {
    if (isDemoMode) {
      return { 
        data: { user: demoUser }, 
        error: null 
      };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (networkError) {
      return { 
        data: null, 
        error: { 
          message: 'Erro de conexão com o servidor. Verifique sua conexão com a internet e tente novamente.' 
        } 
      };
    }
  },

  async signOut() {
    if (isDemoMode) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    if (isDemoMode) {
      return demoUser;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

export const dbHelpers = {
  async insertDailyData(data: Partial<any>) {
    if (isDemoMode) {
      return { 
        data: [{ ...data, id: `demo-${Date.now()}` }], 
        error: null 
      };
    }
    
    const { data: result, error } = await supabase
      .from('daily_data')
      .insert([data])
      .select();
    return { data: result, error };
  },

  async getDailyData(userId: string, days: number = 30) {
    if (isDemoMode) {
      return { 
        data: generateDemoData(), 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('daily_data')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });
    return { data, error };
  },

  async insertTrainingSession(data: Partial<any>) {
    if (isDemoMode) {
      return { 
        data: [{ ...data, id: `demo-training-${Date.now()}` }], 
        error: null 
      };
    }
    
    const { data: result, error } = await supabase
      .from('training_sessions')
      .insert([data])
      .select();
    return { data: result, error };
  },

  async getTrainingSessions(userId: string, days: number = 30) {
    if (isDemoMode) {
      return { 
        data: generateDemoTrainingSessions(), 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });
    return { data, error };
  }
};
// AI_GENERATED_CODE_END