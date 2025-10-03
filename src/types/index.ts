// [AI Generated] Data: 19/01/2025
// Descrição: Definição de tipos TypeScript para toda a aplicação
// Gerado por: Cursor AI
// Versão: TypeScript 5.5.3
// AI_GENERATED_CODE_START
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'athlete' | 'coach' | 'physiotherapist';
  coach_id?: string;
  created_at: string;
  avatar_url?: string;
}

export interface DailyData {
  id: string;
  user_id: string;
  date: string;
  sleep_quality: number; // 1-10
  fatigue_level: number; // 1-10
  mood: number; // 1-10
  muscle_soreness: number; // 1-10
  stress_level: number; // 1-10
  resting_hr?: number;
  hrv?: number;
  readiness_score: number; // 0-100
  created_at: string;
}

export interface TrainingSession {
  id: string;
  user_id: string;
  date: string;
  duration: number; // minutes
  rpe: number; // 1-10
  training_type: string;
  volume?: number;
  intensity?: number;
  tss: number; // Training Stress Score
  notes?: string;
  created_at: string;
}

export interface TrainingMetrics {
  date: string;
  tss: number;
  atl: number; // Acute Training Load (7 days)
  ctl: number; // Chronic Training Load (28 days)
  tsb: number; // Training Stress Balance
  monotony: number;
  strain: number;
}

export interface Recommendation {
  type: 'training' | 'recovery' | 'rest';
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface GamificationStats {
  user_id: string;
  consistency_points: number;
  streak_days: number;
  total_sessions: number;
  achievements: string[];
}
// AI_GENERATED_CODE_END