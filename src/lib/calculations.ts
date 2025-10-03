// [AI Generated] Data: 19/01/2025
// Descrição: Funções para cálculos de métricas de treinamento e recuperação
// Gerado por: Cursor AI
// Versão: Algoritmos baseados em literatura científica esportiva
// AI_GENERATED_CODE_START
import { DailyData, TrainingSession, TrainingMetrics } from '../types';

// Cálculo do Readiness Score (0-100)
export function calculateReadinessScore(dailyData: DailyData): number {
  const {
    sleep_quality,
    fatigue_level,
    mood,
    muscle_soreness,
    stress_level
  } = dailyData;

  // Normalizar valores (alguns são invertidos)
  const sleepScore = (sleep_quality / 10) * 20; // 0-20 pontos
  const fatigueScore = ((10 - fatigue_level) / 10) * 20; // 0-20 pontos (invertido)
  const moodScore = (mood / 10) * 20; // 0-20 pontos
  const sorenessScore = ((10 - muscle_soreness) / 10) * 20; // 0-20 pontos (invertido)
  const stressScore = ((10 - stress_level) / 10) * 20; // 0-20 pontos (invertido)

  const totalScore = sleepScore + fatigueScore + moodScore + sorenessScore + stressScore;
  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

// Cálculo do TSS (Training Stress Score)
export function calculateTSS(duration: number, rpe: number): number {
  // TSS simplificado baseado em RPE e duração
  // Fórmula: Duração * RPE * RPE / 100 (normalizado)
  return Math.round((duration * rpe * rpe) / 100);
}

// Cálculo da média móvel exponencial
function exponentialMovingAverage(values: number[], days: number): number {
  if (values.length === 0) return 0;
  
  const alpha = 2 / (days + 1);
  let ema = values[0];
  
  for (let i = 1; i < values.length; i++) {
    ema = alpha * values[i] + (1 - alpha) * ema;
  }
  
  return ema;
}

// Cálculo das métricas de treinamento (ATL, CTL, TSB)
export function calculateTrainingMetrics(
  trainingSessions: TrainingSession[],
  targetDate: string
): TrainingMetrics {
  const targetDateTime = new Date(targetDate);
  
  // Filtrar sessões até a data alvo
  const relevantSessions = trainingSessions
    .filter(session => new Date(session.date) <= targetDateTime)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (relevantSessions.length === 0) {
    return {
      date: targetDate,
      tss: 0,
      atl: 0,
      ctl: 0,
      tsb: 0,
      monotony: 1,
      strain: 0
    };
  }

  // TSS diário (últimas sessões do dia)
  const dailyTSS = relevantSessions
    .filter(session => session.date === targetDate)
    .reduce((sum, session) => sum + session.tss, 0);

  // Preparar dados para ATL e CTL
  const last42Days = relevantSessions.slice(0, 42);
  const tssValues = last42Days.map(session => session.tss);

  // ATL (Acute Training Load) - 7 dias
  const atl = exponentialMovingAverage(tssValues.slice(0, 7), 7);
  
  // CTL (Chronic Training Load) - 28 dias
  const ctl = exponentialMovingAverage(tssValues, 28);
  
  // TSB (Training Stress Balance)
  const tsb = ctl - atl;

  // Monotonia e Strain (últimos 7 dias)
  const last7Days = tssValues.slice(0, 7);
  const weeklyAverage = last7Days.reduce((sum, val) => sum + val, 0) / Math.max(1, last7Days.length);
  const standardDeviation = Math.sqrt(
    last7Days.reduce((sum, val) => sum + Math.pow(val - weeklyAverage, 2), 0) / Math.max(1, last7Days.length)
  );
  
  const monotony = standardDeviation > 0 ? weeklyAverage / standardDeviation : 1;
  const strain = weeklyAverage * monotony;

  return {
    date: targetDate,
    tss: dailyTSS,
    atl: Math.round(atl),
    ctl: Math.round(ctl),
    tsb: Math.round(tsb),
    monotony: Math.round(monotony * 10) / 10,
    strain: Math.round(strain)
  };
}

// Determinar cor baseada no Readiness Score
export function getReadinessColor(score: number): string {
  if (score >= 76) return '#3B82F6'; // Azul - Treino forte
  if (score >= 51) return '#10B981'; // Verde - Treino moderado/intenso
  if (score >= 26) return '#F59E0B'; // Amarelo - Treino leve/moderado
  return '#EF4444'; // Vermelho - Apenas recovery
}

// Gerar recomendação baseada no score
export function getTrainingRecommendation(readinessScore: number, tsb: number): {
  type: 'training' | 'recovery' | 'rest';
  title: string;
  description: string;
  icon: string;
  color: string;
} {
  const color = getReadinessColor(readinessScore);
  
  if (readinessScore >= 76) {
    return {
      type: 'training',
      title: 'Treino Forte 💪',
      description: 'Seu corpo está pronto para um treino de alta intensidade! Aproveite para trabalhar com cargas altas ou fazer treinos intervalados.',
      icon: '💪',
      color
    };
  } else if (readinessScore >= 51) {
    return {
      type: 'training',
      title: 'Treino Moderado ⚡',
      description: 'Boa condição para treino moderado a intenso. Mantenha o foco na técnica e progressão controlada.',
      icon: '⚡',
      color
    };
  } else if (readinessScore >= 26) {
    return {
      type: 'recovery',
      title: 'Treino Leve 🚶',
      description: 'Seu nível de recuperação sugere treino leve. Foque em movimentos básicos, mobilidade ou cardio leve.',
      icon: '🚶',
      color
    };
  } else {
    return {
      type: 'rest',
      title: 'Apenas Recovery 🛌',
      description: 'Sua recuperação está baixa. Priorize descanso, sono de qualidade, nutrição e técnicas de relaxamento.',
      icon: '🛌',
      color
    };
  }
}
// AI_GENERATED_CODE_END

// [AI Generated] Data: 19/01/2025
// Descrição: Funções adicionais para volume de trabalho e análises avançadas
// Gerado por: Cursor AI
// Versão: Extensão das funções de cálculo existentes
// AI_GENERATED_CODE_START

// Calcular volume total de trabalho (TSS acumulado)
export function calculateTotalWorkVolume(
  trainingSessions: TrainingSession[],
  days: number = 30
): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return trainingSessions
    .filter(session => new Date(session.date) >= cutoffDate)
    .reduce((total, session) => total + session.tss, 0);
}

// Calcular série temporal de métricas para gráficos
export function calculateMetricsTimeSeries(
  trainingSessions: TrainingSession[],
  days: number = 42
): Array<{
  date: string;
  tss: number;
  atl: number;
  ctl: number;
  tsb: number;
  monotony: number;
  strain: number;
}> {
  const result = [];
  const endDate = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const currentDate = new Date(endDate);
    currentDate.setDate(currentDate.getDate() - i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    const metrics = calculateTrainingMetrics(trainingSessions, dateString);
    result.push({
      date: dateString,
      ...metrics
    });
  }
  
  return result;
}

// Calcular tendência (crescente, estável, decrescente)
export function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const recent = values.slice(-7); // Últimos 7 valores
  const older = values.slice(-14, -7); // 7 valores anteriores
  
  if (recent.length === 0 || older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
  
  const difference = recentAvg - olderAvg;
  const threshold = olderAvg * 0.05; // 5% de mudança
  
  if (difference > threshold) return 'up';
  if (difference < -threshold) return 'down';
  return 'stable';
}

// Calcular estatísticas de consistência para gamificação
export function calculateConsistencyStats(
  dailyData: DailyData[],
  trainingSessions: TrainingSession[]
): {
  consistencyScore: number;
  streakDays: number;
  totalAssessments: number;
  followedRecommendations: number;
} {
  const totalAssessments = dailyData.length;
  let streakDays = 0;
  let followedRecommendations = 0;
  
  // Calcular sequência atual
  const today = new Date();
  for (let i = 0; i < dailyData.length; i++) {
    const dataDate = new Date(dailyData[i].date);
    const daysDiff = Math.floor((today.getTime() - dataDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streakDays) {
      streakDays++;
    } else {
      break;
    }
  }
  
  // Calcular recomendações seguidas (simplificado)
  dailyData.forEach(data => {
    const readinessScore = calculateReadinessScore(data);
    const recommendation = getTrainingRecommendation(readinessScore, 0);
    
    // Assumir que seguiu a recomendação se o readiness estava adequado
    if (readinessScore >= 50) {
      followedRecommendations++;
    }
  });
  
  const consistencyScore = totalAssessments > 0 
    ? Math.round((followedRecommendations / totalAssessments) * 100)
    : 0;
  
  return {
    consistencyScore,
    streakDays,
    totalAssessments,
    followedRecommendations
  };
}
// AI_GENERATED_CODE_END