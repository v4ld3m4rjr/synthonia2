// [AI Generated] Data: 19/01/2025
// Descrição: Dashboard principal da aplicação
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React, { useState, useEffect } from 'react';
import { User, DailyData, TrainingSession } from '../../types';
import { supabase, dbHelpers } from '../../lib/supabase';
import { calculateReadinessScore, calculateTrainingMetrics, getTrainingRecommendation } from '../../lib/calculations';
import Header from './Header';
import ReadinessGauge from './ReadinessGauge';
import QuickStats from './QuickStats';
import DailyAssessment from '../forms/DailyAssessment';
import TrainingChart from './TrainingChart';
import RecommendationCard from './RecommendationCard';
import AnalyticsView from './AnalyticsView';
import HistoryView from './HistoryView';
import SettingsView from './SettingsView';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Calendar, TrendingUp, Target, Brain, Activity } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [currentView, setCurrentView] = useState<'overview' | 'assessment' | 'analytics' | 'history' | 'settings'>('overview');
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [todayData, setTodayData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dailyResult, trainingResult] = await Promise.all([
        dbHelpers.getDailyData(user.id, 30),
        dbHelpers.getTrainingSessions(user.id, 30)
      ]);

      if (dailyResult.data) {
        setDailyData(dailyResult.data);
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = dailyResult.data.find(d => d.date === today);
        setTodayData(todayEntry || null);
      }

      if (trainingResult.data) {
        setTrainingSessions(trainingResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentComplete = () => {
    setCurrentView('overview');
    loadData();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Calcular readiness score atual
  let readinessScore = 50; // Default
  let recommendation = getTrainingRecommendation(50, 0);
  
  if (todayData) {
    readinessScore = calculateReadinessScore(todayData);
    const today = new Date().toISOString().split('T')[0];
    const metrics = calculateTrainingMetrics(trainingSessions, today);
    recommendation = getTrainingRecommendation(readinessScore, metrics.tsb);
  }

  if (currentView === 'assessment') {
    return (
      <div className="min-h-screen">
        <Header user={user} onSignOut={handleSignOut} currentView={currentView} setCurrentView={setCurrentView} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('overview')}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
          <DailyAssessment 
            user={user} 
            onComplete={handleAssessmentComplete} 
          />
        </main>
      </div>
    );
  }

  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen">
        <Header user={user} onSignOut={handleSignOut} currentView={currentView} setCurrentView={setCurrentView} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('overview')}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
          <AnalyticsView 
            user={user}
            dailyData={dailyData}
            trainingSessions={trainingSessions}
          />
        </main>
      </div>
    );
  }

  if (currentView === 'history') {
    return (
      <div className="min-h-screen">
        <Header user={user} onSignOut={handleSignOut} currentView={currentView} setCurrentView={setCurrentView} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('overview')}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
          <HistoryView 
            user={user}
            dailyData={dailyData}
            trainingSessions={trainingSessions}
          />
        </main>
      </div>
    );
  }

  if (currentView === 'settings') {
    return (
      <div className="min-h-screen">
        <Header user={user} onSignOut={handleSignOut} currentView={currentView} setCurrentView={setCurrentView} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('overview')}
              className="mb-4"
            >
              ← Voltar ao Dashboard
            </Button>
          </div>
          <SettingsView user={user} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header user={user} onSignOut={handleSignOut} currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button 
            onClick={() => setCurrentView('assessment')}
            className="flex items-center space-x-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Avaliação Diária</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('analytics')}
            className="flex items-center space-x-2"
            size="lg"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Ver Análises</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('history')}
            className="flex items-center space-x-2"
            size="lg"
          >
            <Calendar className="h-5 w-5" />
            <span>Histórico</span>
          </Button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Readiness Gauge - Central */}
          <div className="lg:col-span-5">
            <ReadinessGauge 
              score={readinessScore}
              date={new Date().toLocaleDateString('pt-BR')}
            />
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-7">
            <QuickStats 
              dailyData={dailyData}
              trainingSessions={trainingSessions}
              user={user}
            />
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="mb-8">
          <RecommendationCard recommendation={recommendation} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Evolução da Recuperação</h3>
              </div>
            </CardHeader>
            <CardContent>
              <TrainingChart 
                data={dailyData.map(d => ({
                  x: d.date,
                  y: calculateReadinessScore(d)
                }))}
                title="Readiness Score (últimos 30 dias)"
                color="#3B82F6"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Carga de Treinamento</h3>
              </div>
            </CardHeader>
            <CardContent>
              <TrainingChart 
                data={trainingSessions.map(s => ({
                  x: s.date,
                  y: s.tss
                }))}
                title="TSS (Training Stress Score)"
                color="#10B981"
              />
            </CardContent>
          </Card>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            icon={<Brain className="h-8 w-8 text-purple-600" />}
            title="Análise IA"
            description="Insights inteligentes sobre seus dados de treinamento e recuperação"
            comingSoon={true}
          />
          
          <ModuleCard
            icon={<Target className="h-8 w-8 text-orange-600" />}
            title="Testes Físicos"
            description="Avaliações de performance específicas por modalidade esportiva"
            comingSoon={true}
          />
          
          <ModuleCard
            icon={<Activity className="h-8 w-8 text-indigo-600" />}
            title="Meditação & Breathwork"
            description="Práticas personalizadas de respiração e mindfulness"
            comingSoon={true}
          />
        </div>
      </main>
    </div>
  );
};

const ModuleCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
}> = ({ icon, title, description, comingSoon }) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${comingSoon ? 'opacity-60' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            {comingSoon && (
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Em breve
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
// AI_GENERATED_CODE_END