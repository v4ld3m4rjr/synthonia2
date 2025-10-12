// [AI Generated] Data: 19/01/2025
// Descrição: Cliente Supabase para autenticação e banco de dados
// Gerado por: Cursor AI
// Versão: Supabase 2.57.4
// AI_GENERATED_CODE_START
import { createClient } from '@supabase/supabase-js';
import type { User } from '../types';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in demo mode (no Supabase config)
const isDemoMode = !supabaseUrl || 
                   !supabaseAnonKey || 
                   supabaseUrl === 'demo' || 
                   supabaseAnonKey === 'demo' ||
                   supabaseUrl === 'your_supabase_project_url' ||
                   supabaseAnonKey === 'your_supabase_anon_key' ||
                   // Tratar valores padrão de demo como modo demo
                   supabaseUrl === 'https://demo.supabase.co' ||
                   supabaseAnonKey === 'demo-key';

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
      const { data, error } = await (supabase as any).auth.signUp({
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
      const { data, error } = await (supabase as any).auth.signInWithPassword({
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
    const { error } = await (supabase as any).auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    if (isDemoMode) {
      return demoUser;
    }
    const { data: { user } } = await (supabase as any).auth.getUser();
    return user;
  }
};

export const dbHelpers = {
  async insertDailyData(data: any) {
    if (isDemoMode) {
      return { 
        data: [{ id: `demo-${Date.now()}`, ...data }], 
        error: null 
      };
    }
    const { data: result, error } = await (supabase as any)
      .from('daily_data')
      .insert([{
        date: data.date,
        sleep_quality: data.sleep_quality,
        fatigue_level: data.fatigue_level,
        mood: data.mood,
        muscle_soreness: data.muscle_soreness,
        stress_level: data.stress_level,
        resting_hr: data.resting_hr ?? null,
        hrv: data.hrv ?? null,
        tqr: data.tqr ?? null,
        psr: data.psr ?? null,
        sleep_duration: data.sleep_duration ?? null,
        sleep_regularity: data.sleep_regularity ?? null,
        exhaustion: data.exhaustion ?? null,
        readiness_score: data.readiness_score ?? null,
      }])
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
    const { data, error } = await (supabase as any)
      .from('daily_data')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });
    return { data, error };
  },

  async insertTrainingSession(session: any) {
    if (isDemoMode) {
      return { 
        data: [{ id: `demo-training-${Date.now()}`, ...session }], 
        error: null 
      };
    }
    const { data: result, error } = await (supabase as any)
      .from('training_sessions')
      .insert([{
        date: session.date,
        duration: session.duration,
        rpe: session.rpe,
        training_type: session.training_type,
        volume: session.volume ?? null,
        intensity: session.intensity ?? null,
        tss: session.tss ?? 0,
        trimp: session.trimp ?? 0,
        pse: session.pse ?? null,
        notes: session.notes ?? null,
      }])
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
    const { data, error } = await (supabase as any)
      .from('training_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });
    return { data, error };
  },

  async updateUserProfile(updates: Partial<User> & { id: string }) {
    if (isDemoMode) {
      return { data: [{ ...updates }], error: null };
    }
    const payload: any = {
      id: updates.id,
      name: updates.name,
      email: updates.email,
      birth_date: updates.birth_date,
      role: updates.role,
      avatar_url: updates.avatar_url,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabase as any)
      .from('users')
      .upsert(payload, { onConflict: 'id' })
      .select();

    return { data, error };
  }
};
// AI_GENERATED_CODE_END