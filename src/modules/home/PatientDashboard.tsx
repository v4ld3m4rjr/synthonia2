import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { DailyMetricsMental, DailyMetricsPhysical, Profile } from '../../types';
import { checkManiaRisk, checkSuicideRisk } from '../../utils/calculations';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

// Componente simples de Card para garantir que não quebre se o ui/Card não existir
const SimpleCard = ({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-card border border-border rounded-xl p-6 shadow-sm ${className}`}>
    <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
    {children}
  </div>
);

export function PatientDashboard({ userProfile }: { userProfile: Profile }) {
  const [physicalMetrics, setPhysicalMetrics] = useState<DailyMetricsPhysical | null>(null);
  const [mentalMetrics, setMentalMetrics] = useState<DailyMetricsMental | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayMetrics = async () => {
      const today = new Date().toISOString().split('T')[0];

      // Buscar métricas físicas de hoje
      const { data: physData } = await supabase
        .from('daily_metrics_physical')
        .select('*')
        .eq('patient_id', userProfile.id)
        .eq('date', today)
        .single();

      // Buscar métricas mentais de hoje
      const { data: mentalData } = await supabase
        .from('daily_metrics_mental')
        .select('*')
        .eq('patient_id', userProfile.id)
        .eq('date', today)
        .single();

      if (physData) setPhysicalMetrics(physData);
      if (mentalData) setMentalMetrics(mentalData);
    };

    fetchTodayMetrics();
  }, [userProfile.id]);

  // Alertas
  const showManiaRisk = mentalMetrics && checkManiaRisk(mentalMetrics.stress_score_app || 0, mentalMetrics.energy_level || 0);
  const showSuicideRisk = mentalMetrics && checkSuicideRisk(mentalMetrics.suicide_risk || 0);

  // Cálculo de Readiness (Simplificado para demo)
  const readinessScore = physicalMetrics?.readiness_to_train || 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Olá, {userProfile.full_name}</h1>
        <Button onClick={() => navigate('/assessment')}>Check-in Diário</Button>
      </div>

      {/* Alertas Críticos */}
      {showSuicideRisk && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg animate-pulse">
          <strong>⚠️ ALERTA DE SEGURANÇA:</strong> Por favor, entre em contato com seu médico ou suporte imediatamente.
        </div>
      )}

      {showManiaRisk && (
        <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 p-4 rounded-lg">
          <strong>⚠️ Alerta de Energia:</strong> Risco elevado de mania detectado. Evite estimulantes e priorize o sono.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness Card */}
        <SimpleCard title="Prontidão para Treino">
          <div className="text-center py-4">
            <span className="text-4xl font-bold text-primary">{readinessScore}</span>
            <p className="text-sm text-muted-foreground mt-2">
              {typeof readinessScore === 'number' && readinessScore >= 7 ? 'Liberado para Treino Intenso' : 'Priorize Recuperação'}
            </p>
          </div>
        </SimpleCard>

        {/* Mental Status */}
        <SimpleCard title="Status Mental">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Humor</span>
              <span className="font-medium">{physicalMetrics?.mood_general ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>Ansiedade</span>
              <span className="font-medium">{mentalMetrics?.anxiety ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>Energia</span>
              <span className="font-medium">{mentalMetrics?.energy_level ?? '-'}</span>
            </div>
          </div>
        </SimpleCard>

        {/* Último Treino */}
        <SimpleCard title="Ações Rápidas">
           <div className="space-y-3">
             <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/training/new')}>
               Registrar Treino
             </Button>
             <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/spravato/new')}>
               Registrar Sessão Spravato
             </Button>
           </div>
        </SimpleCard>
      </div>

      {/* Gráficos de Tendência (Placeholder) */}
      <SimpleCard title="Evolução de Carga (TSB)">
        <div className="h-48 flex items-center justify-center bg-secondary/20 rounded-lg">
          <p className="text-muted-foreground">Gráfico de TSB vs Carga Crônica será exibido aqui</p>
        </div>
      </SimpleCard>
    </div>
  );
}
