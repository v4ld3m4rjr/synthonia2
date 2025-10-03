// [AI Generated] Data: 19/01/2025
// Descrição: Formulário de avaliação diária completo
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React, { useState } from 'react';
import { User, DailyData } from '../../types';
import { dbHelpers } from '../../lib/supabase';
import { calculateTSS } from '../../lib/calculations';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, Moon, Zap, Heart, Brain, Activity, Save } from 'lucide-react';

interface DailyAssessmentProps {
  user: User;
  onComplete: () => void;
}

const DailyAssessment: React.FC<DailyAssessmentProps> = ({ user, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Variáveis subjetivas
    sleep_quality: 5,
    fatigue_level: 5,
    mood: 5,
    muscle_soreness: 5,
    stress_level: 5,
    
    // Variáveis objetivas (opcionais)
    resting_hr: '',
    hrv: '',
    
    // Dados do treino anterior
    training_duration: '',
    training_rpe: 5,
    training_type: '',
    training_notes: ''
  });

  const steps = [
    {
      title: 'Como você dormiu?',
      icon: <Moon className="h-6 w-6 text-indigo-600" />,
      fields: ['sleep_quality']
    },
    {
      title: 'Como está se sentindo?',
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      fields: ['fatigue_level', 'mood', 'stress_level']
    },
    {
      title: 'Estado físico atual',
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      fields: ['muscle_soreness']
    },
    {
      title: 'Dados objetivos (opcional)',
      icon: <Heart className="h-6 w-6 text-red-600" />,
      fields: ['resting_hr', 'hrv']
    },
    {
      title: 'Treino do dia anterior',
      icon: <Activity className="h-6 w-6 text-green-600" />,
      fields: ['training_duration', 'training_rpe', 'training_type', 'training_notes']
    }
  ];

  const handleSliderChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Calcular TSS do treino se foi informado
      let tss = 0;
      if (formData.training_duration && formData.training_rpe) {
        tss = calculateTSS(parseInt(formData.training_duration), formData.training_rpe);
      }

      const dailyDataEntry: Partial<DailyData> = {
        user_id: user.id,
        date: today,
        sleep_quality: formData.sleep_quality,
        fatigue_level: formData.fatigue_level,
        mood: formData.mood,
        muscle_soreness: formData.muscle_soreness,
        stress_level: formData.stress_level,
        resting_hr: formData.resting_hr ? parseInt(formData.resting_hr) : null,
        hrv: formData.hrv ? parseFloat(formData.hrv) : null,
        readiness_score: 0, // Será calculado automaticamente
        created_at: new Date().toISOString()
      };

      const { error: dailyError } = await dbHelpers.insertDailyData(dailyDataEntry);
      
      if (dailyError) {
        throw new Error('Erro ao salvar dados diários: ' + dailyError.message);
      }

      // Salvar sessão de treino se foi informada
      if (formData.training_duration && formData.training_rpe) {
        const trainingSession = {
          user_id: user.id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dia anterior
          duration: parseInt(formData.training_duration),
          rpe: formData.training_rpe,
          training_type: formData.training_type || 'Geral',
          tss: tss,
          notes: formData.training_notes,
          created_at: new Date().toISOString()
        };

        const { error: trainingError } = await dbHelpers.insertTrainingSession(trainingSession);
        
        if (trainingError) {
          console.warn('Erro ao salvar sessão de treino:', trainingError.message);
        }
      }

      onComplete();
      
    } catch (error) {
      alert('Erro ao salvar avaliação: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Avaliação Diária</h2>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            {currentStepData.icon}
            <span className="font-medium">{currentStepData.title}</span>
          </div>
          
          <p className="text-sm text-gray-500">
            Passo {currentStep + 1} de {steps.length}
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Step 0: Sleep Quality */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <SliderField
                label="Qualidade do sono (1-10)"
                value={formData.sleep_quality}
                onChange={(value) => handleSliderChange('sleep_quality', value)}
                leftLabel="Péssima"
                rightLabel="Excelente"
                color="indigo"
              />
            </div>
          )}

          {/* Step 1: Mood & Energy */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <SliderField
                label="Nível de fadiga (1-10)"
                value={formData.fatigue_level}
                onChange={(value) => handleSliderChange('fatigue_level', value)}
                leftLabel="Muito cansado"
                rightLabel="Muito disposto"
                color="purple"
              />
              
              <SliderField
                label="Humor geral (1-10)"
                value={formData.mood}
                onChange={(value) => handleSliderChange('mood', value)}
                leftLabel="Péssimo"
                rightLabel="Excelente"
                color="blue"
              />
              
              <SliderField
                label="Nível de estresse (1-10)"
                value={formData.stress_level}
                onChange={(value) => handleSliderChange('stress_level', value)}
                leftLabel="Muito estressado"
                rightLabel="Muito relaxado"
                color="green"
              />
            </div>
          )}

          {/* Step 2: Physical State */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <SliderField
                label="Dor muscular (1-10)"
                value={formData.muscle_soreness}
                onChange={(value) => handleSliderChange('muscle_soreness', value)}
                leftLabel="Muita dor"
                rightLabel="Sem dor"
                color="yellow"
              />
            </div>
          )}

          {/* Step 3: Objective Data */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência cardíaca de repouso (bpm)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 60"
                  value={formData.resting_hr}
                  onChange={(e) => handleInputChange('resting_hr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HRV - Variabilidade da FC (ms)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 35.5"
                  value={formData.hrv}
                  onChange={(e) => handleInputChange('hrv', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Estes dados podem ser obtidos de dispositivos como relógios inteligentes ou monitores cardíacos. Se não tiver, deixe em branco.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Previous Training */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração do treino anterior (minutos)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 60"
                  value={formData.training_duration}
                  onChange={(e) => handleInputChange('training_duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <SliderField
                label="RPE - Percepção de esforço do treino (1-10)"
                value={formData.training_rpe}
                onChange={(value) => handleSliderChange('training_rpe', value)}
                leftLabel="Muito fácil"
                rightLabel="Máximo"
                color="green"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de treino
                </label>
                <input
                  type="text"
                  placeholder="Ex: Musculação, Corrida, Futebol..."
                  value={formData.training_type}
                  onChange={(e) => handleInputChange('training_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações sobre o treino
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Treino pesado de pernas, senti dor no joelho..."
                  value={formData.training_notes}
                  onChange={(e) => handleInputChange('training_notes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6"
            >
              Anterior
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Salvando...' : 'Finalizar'}</span>
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="px-6"
              >
                Próximo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente do slider customizado
const SliderField: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
  color: string;
}> = ({ label, value, onChange, leftLabel, rightLabel, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-lg font-medium text-gray-700">{label}</label>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      
      <div className="px-4">
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${colorClasses[color as keyof typeof colorClasses]} 0%, ${colorClasses[color as keyof typeof colorClasses]} ${(value-1)*11.11}%, #e5e7eb ${(value-1)*11.11}%, #e5e7eb 100%)`
          }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default DailyAssessment;
// AI_GENERATED_CODE_END