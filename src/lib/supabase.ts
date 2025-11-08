// [AI Generated] Data: 19/01/2025
// Descrição: Cliente Supabase para autenticação e banco de dados
// Gerado por: Cursor AI
// Versão: Supabase 2.57.4
// AI_GENERATED_CODE_START
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { User, DailyData, TrainingSession } from '../types';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const authRedirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL;

// Resolve dinamicamente a URL de redirecionamento (origem atual) para evitar portas incorretas
const resolveRedirectUrl = (): string | undefined => {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/`;
  }
  return authRedirectUrl || undefined;
};

// Fallback: permitir configuração via localStorage quando env não estiverem definidos (útil em preview)
const fallbackSupabaseUrl = (typeof window !== 'undefined')
  ? (window.localStorage.getItem('SUPABASE_URL') || undefined)
  : undefined;
const fallbackSupabaseAnonKey = (typeof window !== 'undefined')
  ? (window.localStorage.getItem('SUPABASE_ANON_KEY') || undefined)
  : undefined;

// Preferir localStorage over .env para permitir override sem rebuild
const effectiveSupabaseUrl = fallbackSupabaseUrl || supabaseUrl;
const effectiveSupabaseAnonKey = fallbackSupabaseAnonKey || supabaseAnonKey;

console.info('[supabase] Fonte de configuração', {
  sourceUrl: fallbackSupabaseUrl ? 'localStorage' : (supabaseUrl ? '.env' : 'none'),
  sourceKey: fallbackSupabaseAnonKey ? 'localStorage' : (supabaseAnonKey ? '.env' : 'none')
});

// Export: cliente Supabase (somente após verificação de conectividade)
export let supabase: SupabaseClient | null = null;

// Verificação de conectividade: evita criar cliente quando DNS/URL estão inválidos
const checkSupabaseConnectivity = async (url: string, key: string): Promise<boolean> => {
  try {
    if (!url || !key) return false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const endpoint = `${url.replace(/\/$/, '')}/auth/v1/settings`;
    const res = await fetch(endpoint, {
      method: 'GET',
      mode: 'cors',
      headers: {
        apikey: key
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok; // 200/2xx indicam que o domínio respondeu
  } catch (err) {
    console.error('[supabase] Conectividade falhou', err);
    return false;
  }
};

// Inicialização dinâmica do Supabase em tempo de execução
const getRuntimeConfig = async (): Promise<{ url?: string; anonKey?: string }> => {
  try {
    const url = (typeof window !== 'undefined')
      ? (window.localStorage.getItem('SUPABASE_URL') || undefined)
      : undefined;
    const anonKey = (typeof window !== 'undefined')
      ? (window.localStorage.getItem('SUPABASE_ANON_KEY') || undefined)
      : undefined;
    if (url && anonKey) return { url, anonKey };

    if (typeof window !== 'undefined') {
      const res = await fetch('/supabase-config.json', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const jsonUrl = json.url || json.supabaseUrl || json.SUPABASE_URL;
        const jsonKey = json.anonKey || json.supabaseAnonKey || json.SUPABASE_ANON_KEY;
        if (jsonUrl && jsonKey) {
          try {
            window.localStorage.setItem('SUPABASE_URL', jsonUrl);
            window.localStorage.setItem('SUPABASE_ANON_KEY', jsonKey);
          } catch (_) {}
          return { url: jsonUrl, anonKey: jsonKey };
        }
      }
    }
  } catch (_) {
    // silencioso para não afetar UX
  }
  return {};
};

export const ensureSupabaseConfigured = async (): Promise<SupabaseClient | null> => {
  console.info('[supabase] ensureSupabaseConfigured iniciado', { supabaseExists: !!supabase });
  if (supabase) return supabase;

  const runtime = await getRuntimeConfig();
  console.info('[supabase] Runtime config', runtime);

  const candidates: Array<{ url: string; key: string; source: string }> = [];
  if (fallbackSupabaseUrl && fallbackSupabaseAnonKey) {
    candidates.push({ url: fallbackSupabaseUrl, key: fallbackSupabaseAnonKey, source: 'localStorage' });
  }
  if (supabaseUrl && supabaseAnonKey) {
    candidates.push({ url: supabaseUrl, key: supabaseAnonKey, source: '.env' });
  }
  if (runtime.url && runtime.anonKey) {
    candidates.push({ url: runtime.url, key: runtime.anonKey, source: 'supabase-config.json' });
  }

  console.info('[supabase] Candidatos de configuração', candidates.map(c => ({ source: c.source, hasUrl: !!c.url, hasKey: !!c.key })));

  let chosen: { url?: string; key?: string; source?: string } = {};
  for (const c of candidates) {
    console.info('[supabase] Testando conectividade com', c.source);
    const reachable = await checkSupabaseConnectivity(c.url, c.key);
    if (reachable) {
      chosen = c;
      break;
    } else {
      console.warn('[supabase] Conectividade falhou para', c.source);
    }
  }

  if (!chosen.url || !chosen.key) {
    // Limpar overrides inválidos para permitir UI de configuração aparecer
    try {
      window.localStorage.removeItem('SUPABASE_URL');
      window.localStorage.removeItem('SUPABASE_ANON_KEY');
    } catch (_) {}
    console.error('[supabase] Nenhuma configuração válida encontrada. Verifique URL/anon key.');
    return null;
  }

  // Persistir a configuração escolhida para sessões futuras
  try {
    window.localStorage.setItem('SUPABASE_URL', chosen.url!);
    window.localStorage.setItem('SUPABASE_ANON_KEY', chosen.key!);
  } catch (_) {}

  console.info('[supabase] Conectividade OK via', chosen.source, '. Criando cliente Supabase');
  supabase = createClient(chosen.url!, chosen.key!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  console.info('[supabase] Cliente criado com sucesso');

  return supabase;
};

// Helpers de Autenticação
const mapAuthErrorMessage = (err: any): string => {
  const raw = (err?.message || '').toLowerCase();
  if (raw.includes('service is unavailable') || raw.includes('service unavailable')) {
    return 'Serviço de e-mail indisponível no Supabase. Configure um provider em Authentication → Email (SMTP), ou desative "Confirm email" em desenvolvimento.';
  }
  if (raw.includes('redirect_to not allowed') || raw.includes('redirect to not allowed')) {
    return 'URL de redirecionamento não permitida. Inclua "http://localhost:5177/" (dev) e seu domínio em Authentication → URL Configuration.';
  }
  if (raw.includes('rate limit')) {
    return 'Limite de taxa atingido. Aguarde alguns minutos antes de tentar novamente.';
  }
  if (raw.includes('invalid email') || raw.includes('invalid login credentials')) {
    return 'Credenciais inválidas. Verifique o e-mail e a senha.';
  }
  return err?.message || 'Erro de autenticação no Supabase.';
};

export const authHelpers = {
  async signUp(email: string, password: string, userData: any) {
    console.info('[auth] signUp iniciado', { email, userData });

    const client = await ensureSupabaseConfigured();
    console.info('[auth] Supabase configurado?', { supabase: !!client });

    if (!client) {
      console.error('[auth] Supabase não configurado');
      return {
        data: null,
        error: { message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
      };
    }

    try {
      const redirectUrl = resolveRedirectUrl();
      console.info('[auth] Tentando signUp', { email, redirectUrl });

      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl,
        }
      });
      if (error) {
        return { data: null, error: { message: mapAuthErrorMessage(error) } } as any;
      }
      console.info('[auth] signUp result', { data, error });
      return { data, error };
    } catch (networkError) {
      console.error('[auth] signUp network error', networkError);
      return {
        data: null,
        error: {
          message: 'Erro de conexão com o servidor. Verifique sua conexão com a internet e tente novamente.'
        }
      };
    }
  },

  async signIn(email: string, password: string) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { data: null, error: { message: 'Falha de conexão com Supabase. Verifique URL/anon key.' } };
    }
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (networkError) {
      return { data: null, error: { message: 'Erro de conexão com Supabase.' } };
    }
  },

  async resendSignupEmail(email: string) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { error: { message: 'Supabase não configurado. Ajuste URL/anon key.' } };
    }
    try {
      const redirectUrl = resolveRedirectUrl();
      const { data, error } = await client.auth.resend({ type: 'signup', email, redirectTo: redirectUrl });
      if (error) {
        return { data: null, error: { message: mapAuthErrorMessage(error) } } as any;
      }
      return { data, error } as any;
    } catch (networkError) {
      return { data: null, error: { message: 'Erro de conexão com Supabase.' } } as any;
    }
  },

  async signOut() {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { error: { message: 'Supabase não configurado.' } };
    }
    const { error } = await client.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    if (!supabase) {
      return null;
    }
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async updateUserProfile(updates: Partial<User> & { id: string }) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
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

    const { data, error } = await client
      .from('users')
      .upsert(payload, { onConflict: 'id' })
      .select();

    return { data, error };
  }
};
// AI_GENERATED_CODE_END
export const dbHelpers = {
  async getDailyData(userId: string, days: number = 30) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { data: null, error: { message: 'Supabase não configurado. Ajuste URL/anon key.' } } as any;
    }
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      const startISO = startDate.toISOString().split('T')[0];
      const endISO = endDate.toISOString().split('T')[0];

      const { data, error } = await client
        .from('daily_data')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startISO)
        .lte('date', endISO)
        .order('date', { ascending: false });

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('[supabase] daily_data retornou erro', error);
          if ((error as any)?.code === '404' || /404/.test((error as any)?.message || '')) {
            console.warn('[supabase] Tabela daily_data não encontrada ou sem permissão (404). Retornando lista vazia para evitar quebra da UI.');
          }
        }
      }

      return { data: (data as DailyData[] | null) || [], error } as any;
    } catch (networkError) {
      return { data: [], error: { message: 'Erro de conexão com Supabase.' } } as any;
    }
  },

  async getTrainingSessions(userId: string, days: number = 30) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { data: null, error: { message: 'Supabase não configurado. Ajuste URL/anon key.' } } as any;
    }
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      const startISO = startDate.toISOString().split('T')[0];
      const endISO = endDate.toISOString().split('T')[0];

      const { data, error } = await client
        .from('training_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startISO)
        .lte('date', endISO)
        .order('date', { ascending: false });

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('[supabase] training_sessions retornou erro', error);
          if ((error as any)?.code === '404' || /404/.test((error as any)?.message || '')) {
            console.warn('[supabase] Tabela training_sessions não encontrada ou sem permissão (404). Retornando lista vazia para evitar quebra da UI.');
          }
        }
      }

      return { data: (data as TrainingSession[] | null) || [], error } as any;
    } catch (networkError) {
      return { data: [], error: { message: 'Erro de conexão com Supabase.' } } as any;
    }
  },

  async insertDailyData(entry: Partial<DailyData>) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { data: null, error: { message: 'Supabase não configurado. Ajuste URL/anon key.' } } as any;
    }
    try {
      const { data, error } = await client
        .from('daily_data')
        .insert(entry)
        .select()
        .single();
      return { data, error } as any;
    } catch (networkError) {
      return { data: null, error: { message: 'Erro de conexão com Supabase.' } } as any;
    }
  },

  async insertTrainingSession(entry: Partial<TrainingSession>) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { data: null, error: { message: 'Supabase não configurado. Ajuste URL/anon key.' } } as any;
    }
    try {
      const { data, error } = await client
        .from('training_sessions')
        .insert(entry)
        .select()
        .single();
      return { data, error } as any;
    } catch (networkError) {
      return { data: null, error: { message: 'Erro de conexão com Supabase.' } } as any;
    }
  },

  async updateUserProfile(updates: Partial<User> & { id: string }) {
    const client = await ensureSupabaseConfigured();
    if (!client) {
      return { data: null, error: { message: 'Supabase não configurado. Ajuste URL/anon key.' } } as any;
    }
    try {
      const payload: any = {
        id: updates.id,
        name: updates.name,
        email: updates.email,
        birth_date: updates.birth_date,
        role: updates.role,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('users')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      return { data, error } as any;
    } catch (networkError) {
      return { data: null, error: { message: 'Erro de conexão com Supabase.' } } as any;
    }
  }
};