// [AI Generated] Data: 19/01/2025
// Descrição: Componente de análises avançadas com gráficos de métricas de treinamento
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React, { useState, useMemo } from 'react';
import { DailyData, TrainingSession, User } from '../../types';
import { calculateMetricsTimeSeries, calculateTotalWorkVolume, calculateTrend } from '../../lib/calculations';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Activity, 
  Target,
  Zap,
  BarChart3,
  LineChart as LineChartIcon
} from 'lucide-react';

interface AnalyticsViewProps {
  user: User;
  dailyData: DailyData[];
  trainingSessions: TrainingSession[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  user,
  dailyData,
  trainingSessions
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90'>('30');
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'load' | 'recovery'>('overview');

  // Calcular métricas para o período selecionado
  const metricsData = useMemo(() => {
    const days = parseInt(selectedPeriod);
    return calculateMetricsTimeSeries(trainingSessions, days);
  }, [trainingSessions, selectedPeriod]);

  // Calcular estatísticas resumidas
  const stats = useMemo(() => {
    const totalVolume = calculateTotalWorkVolume(trainingSessions, parseInt(selectedPeriod));
    const recentTSS = metricsData.slice(-7).map(d => d.tss);
    const recentATL = metricsData.slice(-7).map(d => d.atl);
    const recentCTL = metricsData.slice(-7).map(d => d.ctl);
    const recentTSB = metricsData.slice(-7).map(d => d.tsb);

    return {
      totalVolume,
      avgTSS: recentTSS.length > 0 ? Math.round(recentTSS.reduce((a, b) => a + b, 0) / recentTSS.length) : 0,
      currentATL: recentATL[recentATL.length - 1] || 0,
      currentCTL: recentCTL[recentCTL.length - 1] || 0,
      currentTSB: recentTSB[recentTSB.length - 1] || 0,
      tssTrend: calculateTrend(recentTSS),
      atlTrend: calculateTrend(recentATL),
      ctlTrend: calculateTrend(recentCTL),
      tsbTrend: calculateTrend(recentTSB)
    };
  }, [metricsData, trainingSessions, selectedPeriod]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTSBColor = (tsb: number) => {
    if (tsb > 10) return 'text-green-600';
    if (tsb < -10) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getTSBStatus = (tsb: number) => {
    if (tsb > 10) return 'Recuperado';
    if (tsb < -10) return 'Fatigado';
    return 'Equilibrado';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análises Avançadas</h1>
          <p className="text-gray-600">Métricas científicas de carga e recuperação</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex space-x-2">
          {[
            { value: '7', label: '7 dias' },
            { value: '30', label: '30 dias' },
            { value: '90', label: '90 dias' }
          ].map(period => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period.value as '7' | '30' | '90')}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { value: 'overview', label: 'Visão Geral', icon: <BarChart3 className="h-4 w-4" /> },
          { value: 'load', label: 'Carga de Treino', icon: <Activity className="h-4 w-4" /> },
          { value: 'recovery', label: 'Recuperação', icon: <Target className="h-4 w-4" /> }
        ].map(metric => (
          <Button
            key={metric.value}
            variant={selectedMetric === metric.value ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedMetric(metric.value as 'overview' | 'load' | 'recovery')}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            {metric.icon}
            <span>{metric.label}</span>
          </Button>
        ))}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Volume Total"
          value={`${stats.totalVolume} TSS`}
          subtitle={`Últimos ${selectedPeriod} dias`}
          icon={<Activity className="h-5 w-5 text-blue-600" />}
          color="blue"
        />
        
        <MetricCard
          title="ATL (Carga Aguda)"
          value={stats.currentATL.toString()}
          subtitle="Últimos 7 dias"
          icon={<Zap className="h-5 w-5 text-orange-600" />}
          color="orange"
          trend={getTrendIcon(stats.atlTrend)}
        />
        
        <MetricCard
          title="CTL (Carga Crônica)"
          value={stats.currentCTL.toString()}
          subtitle="Últimos 28 dias"
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          color="green"
          trend={getTrendIcon(stats.ctlTrend)}
        />
        
        <MetricCard
          title="TSB (Balanço)"
          value={stats.currentTSB.toString()}
          subtitle={getTSBStatus(stats.currentTSB)}
          icon={<Target className="h-5 w-5" />}
          color="purple"
          trend={getTrendIcon(stats.tsbTrend)}
          valueColor={getTSBColor(stats.currentTSB)}
        />
      </div>

      {/* Charts Section */}
      {selectedMetric === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <LineChartIcon className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">ATL vs CTL vs TSB</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <LineChart
                  data={metricsData.map(d => ({ x: d.date, y: d.atl }))}
                  width={400}
                  height={200}
                  color="#F59E0B"
                  showGrid={true}
                />
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>ATL (Aguda)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>CTL (Crônica)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>TSB (Balanço)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">TSS Diário</h3>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart
                data={metricsData.slice(-14).map(d => ({
                  label: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                  value: d.tss,
                  color: '#10B981'
                }))}
                width={400}
                height={200}
                showValues={true}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'load' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Evolução da Carga (ATL/CTL)</h3>
            </CardHeader>
            <CardContent>
              <LineChart
                data={metricsData.map(d => ({ x: d.date, y: d.atl }))}
                width={400}
                height={250}
                color="#F59E0B"
                showGrid={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Monotonia e Strain</h3>
            </CardHeader>
            <CardContent>
              <LineChart
                data={metricsData.map(d => ({ x: d.date, y: d.monotony }))}
                width={400}
                height={250}
                color="#8B5CF6"
                showGrid={true}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'recovery' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Training Stress Balance (TSB)</h3>
            </CardHeader>
            <CardContent>
              <LineChart
                data={metricsData.map(d => ({ x: d.date, y: d.tsb }))}
                width={400}
                height={250}
                color="#6366F1"
                showGrid={true}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Interpretação do TSB:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><span className="text-green-600">• TSB &gt; +10:</span> Bem recuperado, pronto para treino intenso</li>
                  <li><span className="text-yellow-600">• TSB -10 a +10:</span> Equilibrado, treino moderado</li>
                  <li><span className="text-red-600">• TSB &lt; -10:</span> Fatigado, priorizar recuperação</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Distribuição de Carga</h3>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { label: 'Baixa (0-50)', value: metricsData.filter(d => d.tss <= 50).length, color: '#10B981' },
                  { label: 'Moderada (51-100)', value: metricsData.filter(d => d.tss > 50 && d.tss <= 100).length, color: '#F59E0B' },
                  { label: 'Alta (101-150)', value: metricsData.filter(d => d.tss > 100 && d.tss <= 150).length, color: '#EF4444' },
                  { label: 'Muito Alta (>150)', value: metricsData.filter(d => d.tss > 150).length, color: '#8B5CF6' }
                ]}
                width={400}
                height={200}
                showValues={true}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Insights e Recomendações</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Análise de Carga</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• ATL atual: <span className="font-medium">{stats.currentATL}</span> (carga aguda dos últimos 7 dias)</p>
                <p>• CTL atual: <span className="font-medium">{stats.currentCTL}</span> (fitness acumulado em 28 dias)</p>
                <p>• Razão ATL/CTL: <span className="font-medium">{stats.currentCTL > 0 ? (stats.currentATL / stats.currentCTL).toFixed(2) : 'N/A'}</span></p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Status de Recuperação</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• TSB: <span className={`font-medium ${getTSBColor(stats.currentTSB)}`}>{stats.currentTSB}</span></p>
                <p>• Status: <span className="font-medium">{getTSBStatus(stats.currentTSB)}</span></p>
                <p>• Volume total ({selectedPeriod} dias): <span className="font-medium">{stats.totalVolume} TSS</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: React.ReactNode;
  valueColor?: string;
}> = ({ title, value, subtitle, icon, color, trend, valueColor }) => {
  const colorClasses = {
    blue: 'bg-blue-50',
    orange: 'bg-orange-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          {trend && <div>{trend}</div>}
        </div>
        <h3 className={`text-2xl font-bold mb-1 ${valueColor || 'text-gray-900'}`}>{value}</h3>
        <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsView;
// AI_GENERATED_CODE_END