// [AI Generated] Data: 19/01/2025
// Descrição: Definição de tipos TypeScript para toda a aplicação
// Gerado por: Cursor AI
// Versão: TypeScript 5.5.3
// AI_GENERATED_CODE_START
export interface User {
  id: string;
  email: string;
  name: string;
  birth_date?: string;
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
  sleep_duration: number; // horas
  sleep_regularity: number; // 1-10 (consistência do horário de sono)
  fatigue_level: number; // 1-10
  exhaustion: number; // 1-10 (nível de exaustão física/mental)
  mood: number; // 1-10
  muscle_soreness: number; // 1-10
  stress_level: number; // 1-10
  tqr: number; // 0-10 (Total Quality Recovery)
  psr: number; // 0-10 (Perceived Stress and Recovery)
  resting_hr?: number;
  readiness_score: number; // 0-100
  // Dados para cálculos de treinamento
  rpe?: number; // Rating of Perceived Exertion (1-10)
  training_duration?: number; // minutos
  training_intensity?: number; // 1-10
  
  // New Mental Health Fields
  sleep_score?: number; // 0-100 (Sleep Nota)
  stress_score?: number; // 0-100 (Stress App)
  energy_level?: number; // 0-10
  mood_depressed?: number; // 0-10
  mood_euphoria?: number; // 0-10
  irritability?: number; // 0-10
  anxiety?: number; // 0-10
  obsessive_thoughts?: number; // 0-10
  sensory_overload?: number; // 0-10
  social_masking?: number; // 0-10
  suicide_risk?: number; // 0-10
  
  created_at: string;
}

export type ClinicalAssessmentType = 'PHQ-9' | 'GAD-7' | 'ASRM' | 'FAST' | 'Y-BOCS' | 'CAT-Q' | 'RAADS-R';

export interface ClinicalAssessment {
  id: string;
  user_id: string;
  date: string;
  type: ClinicalAssessmentType;
  total_score: number;
  answers: Record<string, any>;
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
  trimp?: number; // Training Impulse
  pse?: number; // Percepção Subjetiva de Esforço
  notes?: string;
  created_at: string;
}

export interface TrainingMetrics {
  date: string;
  tss: number; // Training Stress Score
  atl: number; // Acute Training Load (7 days)
  ctl: number; // Chronic Training Load (28 days)
  tsb: number; // Training Stress Balance
  daily_monotony: number; // Monotonia diária
  monotony: number; // Monotonia semanal
  trimp: number; // Training Impulse
  pse: number; // Perceived Strain and Exertion
  psr: number; // Perceived Stress and Recovery
  tqr: number; // Total Quality Recovery
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

// Interfaces para cálculos científicos
export interface MetricCalculationInput {
  dailyData: DailyData[];
  trainingSessions: TrainingSession[];
  period: number; // dias
}

export interface SleepMetrics {
  duration: number;
  regularity: number;
  quality: number;
  efficiency: number;
}

export interface ExhaustionMetrics {
  physical: number;
  mental: number;
  overall: number;
  recovery_needed: number;
}

export interface AdvancedTrainingMetrics {
  tss: number;
  atl: number;
  ctl: number;
  tsb: number;
  daily_monotony: number;
  weekly_monotony: number;
  trimp: number;
  pse: number;
  psr: number;
  tqr: number;
}

// Interface para dados do gráfico
export interface ChartDataPoint {
  date: string;
  value: number;
  metric: string;
}

export interface AnalyticsFilter {
  metrics: string[];
  period: 7 | 14 | 21 | 28;
  startDate?: string;
  endDate?: string;
}
// AI_GENERATED_CODE_END