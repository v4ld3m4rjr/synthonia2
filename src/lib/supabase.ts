// [AI Generated] Data: 19/01/2025
// Descrição: Cliente Supabase para autenticação e banco de dados
// Gerado por: Cursor AI
// Versão: Supabase 2.57.4
// AI_GENERATED_CODE_START
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { User } from '../types';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de configuração: evita erro de criação do cliente com variáveis indefinidas
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helpers de Autenticação
export const authHelpers = {
  async signUp(email: string, password: string, userData: any) {
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
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
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
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
    if (!supabase) {
      return { error: { message: 'Supabase não configurado.' } };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    if (!supabase) {
      return null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

// Helpers de Banco de Dados
export const dbHelpers = {
  async insertDailyData(data: any) {
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
      };
    }
    const { data: result, error } = await supabase
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
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
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

  async insertTrainingSession(session: any) {
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
      };
    }
    const { data: result, error } = await supabase
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
    if (!supabase) {
      return {
        data: null,
        error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
      };
    }
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });
    return { data, error };
  },

  async updateUserProfile(updates: Partial<User> & { id: string }) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' } };
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

    const { data, error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'id' })
      .select();

    return { data, error };
  }
};
// AI_GENERATED_CODE_END