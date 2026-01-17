// [AI Generated]
// Descrição: Definição de tipos TypeScript atualizada para o novo schema
// Versão: TypeScript 5.5.3

export type UserRole = 'patient' | 'doctor';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  birth_date: string | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  profile_type: string | null;
  doctor_id: string | null;
  created_at: string;
}

export interface DailyMetricsPhysical {
  id: string;
  patient_id: string;
  date: string;
  sleep_quality: number | null; // 0-10
  sleep_start: string | null; // TIME
  sleep_end: string | null; // TIME
  fatigue_physical: number | null; // 0-10
  stress_mental: number | null; // 0-10
  doms_pain: number | null; // 0-10
  mood_general: number | null; // 0-10
  readiness_to_train: number | null; // 0-10
  perception_recovery_prs: number | null; // 0-10
  resting_hr: number | null;
  jump_test_result: number | null;
  created_at: string;
}

export interface DailyMetricsMental {
  id: string;
  patient_id: string;
  date: string;
  sleep_hours_log: number | null;
  sleep_score_app: number | null; // 0-100
  stress_score_app: number | null; // 0-100
  energy_level: number | null; // 0-10
  depression_mood: number | null; // 0-10
  mania_euphoria: number | null; // 0-10
  irritability: number | null; // 0-10
  anxiety: number | null; // 0-10
  obsessive_thoughts: number | null; // 0-10
  sensory_overload: number | null; // 0-10
  social_masking: number | null; // 0-10
  suicide_risk: number | null; // 0-10
  medication_taken: boolean | null;
  notes: string | null;
  created_at: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  load_kg: number;
}

export interface TrainingSession {
  id: string;
  patient_id: string;
  date: string; // ISO timestamp
  duration_minutes: number | null;
  session_rpe: number | null; // 0-10
  exercises_json: Exercise[];
  created_at: string;
}

export interface SpravatoSession {
  id: string;
  patient_id: string;
  date: string; // ISO timestamp
  dose_mg: number | null;
  dissociation_level: number | null; // 0-10
  nausea_physical: number | null; // 0-10
  bp_pre: string | null;
  bp_post: string | null;
  trip_quality: string | null;
  insights: string | null;
  mood_24h_after: number | null; // -5 to +5
  created_at: string;
}

export type AssessmentType = 'PHQ9' | 'GAD7' | 'ASRM' | 'FAST' | 'YBOCS' | 'EQ5D' | 'TSQM';

export interface ClinicalAssessment {
  id: string;
  patient_id: string;
  date: string;
  type: AssessmentType;
  raw_scores: Record<string, number>;
  total_score: number | null;
  burnout_index: number | null; // 0-10
  created_at: string;
}

// Interfaces para Cálculos e Lógica de Negócio
export interface WorkloadMetrics {
  internal_load: number; // duration * rpe
  total_tonnage: number;
  monotony: number;
  strain: number;
  acwr: number; // Acute:Chronic Workload Ratio
  atl: number; // Acute Training Load (Fatigue)
  ctl: number; // Chronic Training Load (Fitness)
  tsb: number; // Training Stress Balance (Form)
  injury_risk: boolean;
}

export interface MentalHealthAlerts {
  mania_risk: boolean;
  suicide_risk_alert: boolean;
  depression_severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
}

export interface NumerologyProfile {
  destiny_number: number;
  soul_number: number;
  description: string;
}
