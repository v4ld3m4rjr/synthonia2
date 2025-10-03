// [AI Generated] Data: 19/01/2025
// Descrição: Cliente Supabase para autenticação e banco de dados
// Gerado por: Cursor AI
// Versão: Supabase 2.57.4
// AI_GENERATED_CODE_START
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database utility functions
export const authHelpers = {
  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};

export const dbHelpers = {
  async insertDailyData(data: Partial<any>) {
    const { data: result, error } = await supabase
      .from('daily_data')
      .insert([data])
      .select();
    return { data: result, error };
  },

  async getDailyData(userId: string, days: number = 30) {
    const { data, error } = await supabase
      .from('daily_data')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });
    return { data, error };
  },

  async insertTrainingSession(data: Partial<any>) {
    const { data: result, error } = await supabase
      .from('training_sessions')
      .insert([data])
      .select();
    return { data: result, error };
  },

  async getTrainingSessions(userId: string, days: number = 30) {
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