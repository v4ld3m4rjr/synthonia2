// [AI Generated] Data: 19/01/2025
// Descrição: Componente de histórico com visualização de dados passados
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React, { useState, useMemo } from 'react';
import { DailyData, TrainingSession, User } from '../../types';
import { calculateReadinessScore } from '../../lib/calculations';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Calendar, 
  Activity, 
  Moon, 
  Brain, 
  Heart, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

interface HistoryViewProps {
  user: User;
  dailyData: DailyData[];
  trainingSessions: TrainingSession[];
}

const HistoryView: React.FC<HistoryViewProps> = ({
  user,
  dailyData,
  trainingSessions
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  const [filterType, setFilterType] = useState<'all' | 'assessments' | 'trainings'>('all');

  // Gerar dados do calendário
  const calendarData = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      const dayData = dailyData.find(d => d.date === dateString);
      const dayTraining = trainingSessions.filter(t => t.date === dateString);
      
      days.push({
        day,
        date: dateString,
        dailyData: dayData,
        trainingSessions: dayTraining,
        readinessScore: dayData ? calculateReadinessScore(dayData) : null
      });
    }
    
    return days;
  }, [selectedMonth, dailyData, trainingSessions]);

  // Dados filtrados para visualização em lista
  const listData = useMemo(() => {
    let filtered = [];
    
    if (filterType === 'all' || filterType === 'assessments') {
      filtered.push(...dailyData.map(d => ({
        type: 'assessment' as const,
        date: d.date,
        data: d,
        readinessScore: calculateReadinessScore(d)
      })));
    }
    
    if (filterType === 'all' || filterType === 'trainings') {
      filtered.push(...trainingSessions.map(t => ({
        type: 'training' as const,
        date: t.date,
        data: t
      })));
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [dailyData, trainingSessions, filterType]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getReadinessColor = (score: number | null) => {
    if (!score) return 'bg-gray-100';
    if (score >= 76) return 'bg-blue-100 border-blue-300';
    if (score >= 51) return 'bg-green-100 border-green-300';
    if (score >= 26) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Histórico</h1>
          <p className="text-gray-600">Visualize seus dados passados e evolução</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewType === 'calendar' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewType('calendar')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendário
          </Button>
          <Button
            variant={viewType === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewType('list')}
          >
            <Filter className="h-4 w-4 mr-2" />
            Lista
          </Button>
        </div>
      </div>

      {viewType === 'calendar' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Week day headers */}
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarData.map((dayData, index) => (
                <div key={index} className="aspect-square">
                  {dayData ? (
                    <div className={`h-full border-2 rounded-lg p-2 ${getReadinessColor(dayData.readinessScore)} hover:shadow-md transition-shadow cursor-pointer`}>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {dayData.day}
                      </div>
                      <div className="space-y-1">
                        {dayData.readinessScore && (
                          <div className="text-xs font-bold text-gray-700">
                            {dayData.readinessScore}%
                          </div>
                        )}
                        {dayData.trainingSessions.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Activity className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-blue-600">
                              {dayData.trainingSessions.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                <span>Excelente (76-100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                <span>Bom (51-75)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                <span>Regular (26-50)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                <span>Baixo (0-25)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {viewType === 'list' && (
        <div className="space-y-4">
          {/* Filter buttons */}
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'Todos' },
              { value: 'assessments', label: 'Avaliações' },
              { value: 'trainings', label: 'Treinos' }
            ].map(filter => (
              <Button
                key={filter.value}
                variant={filterType === filter.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterType(filter.value as 'all' | 'assessments' | 'trainings')}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* List items */}
          <div className="space-y-3">
            {listData.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {item.type === 'assessment' ? (
                    <AssessmentItem data={item.data} readinessScore={item.readinessScore} />
                  ) : (
                    <TrainingItem data={item.data} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AssessmentItem: React.FC<{ data: DailyData; readinessScore: number }> = ({ data, readinessScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 76) return 'text-blue-600';
    if (score >= 51) return 'text-green-600';
    if (score >= 26) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Avaliação Diária</h3>
          <p className="text-sm text-gray-600">
            {new Date(data.date).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Moon className="h-4 w-4 text-indigo-500" />
            <span>{data.sleep_quality}/10</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>{11 - data.fatigue_level}/10</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{data.resting_hr || 'N/A'}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(readinessScore)}`}>
            {readinessScore}%
          </div>
          <div className="text-xs text-gray-500">Readiness</div>
        </div>
      </div>
    </div>
  );
};

const TrainingItem: React.FC<{ data: TrainingSession }> = ({ data }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Activity className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{data.training_type}</h3>
          <p className="text-sm text-gray-600">
            {new Date(data.date).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 text-sm">
          <div>
            <span className="text-gray-500">Duração:</span>
            <span className="ml-1 font-medium">{data.duration}min</span>
          </div>
          <div>
            <span className="text-gray-500">RPE:</span>
            <span className="ml-1 font-medium">{data.rpe}/10</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {data.tss}
          </div>
          <div className="text-xs text-gray-500">TSS</div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
// AI_GENERATED_CODE_END