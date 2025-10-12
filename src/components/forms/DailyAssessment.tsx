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
import { calculateAdvancedTrainingMetrics, calculateTRIMP } from '../../utils/metricsCalculations';

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
    sleep_duration: '',
    sleep_regularity: 5,
    fatigue_level: 5,
    exhaustion: 5,
    mood: 5,
    muscle_soreness: 5,
    stress_level: 5,
    tqr: 5, // Total Quality Recovery (0-10)
    psr: 5, // Perceived Stress and Recovery (0-10)
    
    // Variáveis objetivas (opcionais)
    resting_hr: '',
    
    // Dados do treino anterior
    trained: false,
    training_duration: '',
    training_rpe: 5,
    training_intensity: 5,
    training_type: '',
    training_notes: '',
    // Novo campo
    pse: 5 // Percepção Subjetiva de Esforço (0-10)
  });

  const steps = [
    {
      title: 'Como você dormiu?',
      icon: <Moon className="h-6 w-6 text-indigo-600" />,
      fields: ['sleep_quality', 'sleep_duration', 'sleep_regularity']
    },
    {
      title: 'Como está se sentindo?',
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      fields: ['fatigue_level', 'exhaustion', 'mood', 'stress_level']
    },
    {
      title: 'Estado físico atual',
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      fields: ['muscle_soreness', 'tqr']
    },
    {
      title: 'Dados objetivos (opcional)',
      icon: <Heart className="h-6 w-6 text-red-600" />,
      fields: ['resting_hr']
    },
    {
      title: 'Treino do dia anterior',
      icon: <Activity className="h-6 w-6 text-green-600" />,
      fields: ['training_duration', 'training_rpe', 'training_intensity', 'training_type', 'training_notes']
    }
  ];

  const handleSliderChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: any) => {
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
        sleep_duration: formData.sleep_duration ? parseFloat(formData.sleep_duration) : 8,
        sleep_regularity: formData.sleep_regularity,
        fatigue_level: formData.fatigue_level,
        exhaustion: formData.exhaustion,
        mood: formData.mood,
        muscle_soreness: formData.muscle_soreness,
        stress_level: formData.stress_level,
        tqr: formData.tqr, // Total Quality Recovery (0-10)
        psr: formData.psr, // Perceived Stress and Recovery
        resting_hr: formData.resting_hr ? parseInt(formData.resting_hr) : null,
        rpe: formData.training_rpe,
        training_duration: formData.training_duration ? parseInt(formData.training_duration) : null,
        training_intensity: formData.training_intensity,
        readiness_score: 0, // Será calculado automaticamente
        created_at: new Date().toISOString()
      };

      const { error: dailyError } = await dbHelpers.insertDailyData(dailyDataEntry);
      
      if (dailyError) {
        throw new Error('Erro ao salvar dados diários: ' + dailyError.message);
      }

      // Salvar sessão de treino se foi informada
      if (formData.training_duration && formData.training_rpe) {
        const durationMinutes = parseInt(formData.training_duration);
        const estimatedAvgHR = formData.resting_hr
          ? parseInt(formData.resting_hr) + (formData.training_intensity || 0) * 15
          : 60 + (formData.training_intensity || 0) * 15;
        const trimp = durationMinutes ? calculateTRIMP(durationMinutes, estimatedAvgHR) : 0;

        const trainingSession = {
          user_id: user.id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dia anterior
          duration: durationMinutes,
          rpe: formData.training_rpe,
          training_type: formData.training_type || 'Geral',
          tss: tss,
          trimp: trimp,
          pse: formData.pse,
          notes: formData.training_notes,
          created_at: new Date().toISOString()
        };

        const { error: trainingError } = await dbHelpers.insertTrainingSession(trainingSession);
        
        if (trainingError) {
          if (import.meta.env.DEV) {
            console.warn('Erro ao salvar sessão de treino:', trainingError.message);
          }
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
            <Calendar className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Avaliação Diária</h2>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-300">
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
            <div className="space-y-8">
              <SliderField
                label="Qualidade do sono (1-10)"
                value={formData.sleep_quality}
                onChange={(value) => handleSliderChange('sleep_quality', value)}
                leftLabel="Péssima"
                rightLabel="Excelente"
                color="indigo"
                valueDescriptions={{
                  1: "Não consegui dormir, insônia total",
                  2: "Sono muito fragmentado, acordei várias vezes",
                  3: "Sono ruim, demorei para adormecer",
                  4: "Sono irregular, acordei algumas vezes",
                  5: "Sono médio, nem bom nem ruim",
                  6: "Sono razoável, pequenos despertares",
                  7: "Sono bom, acordei descansado",
                  8: "Sono muito bom, profundo e reparador",
                  9: "Sono excelente, acordei revigorado",
                  10: "Sono perfeito, melhor noite possível"
                }}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duração do sono (horas)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 8.5"
                  value={formData.sleep_duration}
                  onChange={(e) => handleInputChange('sleep_duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              <SliderField
                label="Regularidade do sono (1-10)"
                value={formData.sleep_regularity}
                onChange={(value) => handleSliderChange('sleep_regularity', value)}
                leftLabel="Muito irregular"
                rightLabel="Muito regular"
                color="indigo"
                valueDescriptions={{
                  1: "Horários completamente desregulados",
                  2: "Muito irregular, sem padrão",
                  3: "Bastante irregular, varia muito",
                  4: "Irregular, algumas variações",
                  5: "Moderadamente regular",
                  6: "Razoavelmente regular",
                  7: "Bem regular, pequenas variações",
                  8: "Muito regular, horários consistentes",
                  9: "Extremamente regular, rotina fixa",
                  10: "Perfeitamente regular, mesmo horário sempre"
                }}
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
                valueDescriptions={{
                  1: "Extremamente cansado, sem energia",
                  2: "Muito cansado, dificuldade para atividades",
                  3: "Bastante cansado, energia baixa",
                  4: "Cansado, mas consigo fazer atividades",
                  5: "Energia moderada, nem cansado nem disposto",
                  6: "Razoavelmente disposto",
                  7: "Bem disposto, boa energia",
                  8: "Muito disposto, energia alta",
                  9: "Extremamente disposto, muita energia",
                  10: "Energia máxima, completamente revigorado"
                }}
              />
              
              <SliderField
                label="Nível de exaustão (1-10)"
                value={formData.exhaustion}
                onChange={(value) => handleSliderChange('exhaustion', value)}
                leftLabel="Sem exaustão"
                rightLabel="Completamente exausto"
                color="red"
                valueDescriptions={{
                  1: "Totalmente recuperado, sem exaustão",
                  2: "Muito pouca exaustão",
                  3: "Leve sensação de exaustão",
                  4: "Alguma exaustão, mas controlável",
                  5: "Exaustão moderada",
                  6: "Bastante exausto",
                  7: "Muito exausto, preciso descansar",
                  8: "Extremamente exausto",
                  9: "Quase no limite da exaustão",
                  10: "Completamente exausto, não consigo mais"
                }}
              />
              
              <SliderField
                label="Humor geral (1-10)"
                value={formData.mood}
                onChange={(value) => handleSliderChange('mood', value)}
                leftLabel="Péssimo"
                rightLabel="Excelente"
                color="blue"
                valueDescriptions={{
                  1: "Muito deprimido, humor péssimo",
                  2: "Bastante triste, humor ruim",
                  3: "Humor baixo, desanimado",
                  4: "Humor um pouco baixo",
                  5: "Humor neutro, nem bom nem ruim",
                  6: "Humor razoável, ligeiramente positivo",
                  7: "Bom humor, me sinto bem",
                  8: "Muito bom humor, otimista",
                  9: "Humor excelente, muito feliz",
                  10: "Humor perfeito, eufórico e motivado"
                }}
              />
              
              <SliderField
                label="Nível de estresse (1-10)"
                value={formData.stress_level}
                onChange={(value) => handleSliderChange('stress_level', value)}
                leftLabel="Muito estressado"
                rightLabel="Muito relaxado"
                color="green"
                valueDescriptions={{
                  1: "Extremamente estressado, ansioso",
                  2: "Muito estressado, difícil relaxar",
                  3: "Bastante estressado, tenso",
                  4: "Estressado, mas controlável",
                  5: "Estresse moderado, nem relaxado nem tenso",
                  6: "Razoavelmente relaxado",
                  7: "Bem relaxado, calmo",
                  8: "Muito relaxado, tranquilo",
                  9: "Extremamente relaxado, zen",
                  10: "Completamente relaxado, paz total"
                }}
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
                valueDescriptions={{
                  1: "Dor intensa, dificulta movimentos",
                  2: "Dor forte, desconforto significativo",
                  3: "Dor moderada a forte",
                  4: "Dor moderada, mas suportável",
                  5: "Dor leve a moderada",
                  6: "Dor leve, pouco desconforto",
                  7: "Dor muito leve, quase imperceptível",
                  8: "Desconforto mínimo",
                  9: "Praticamente sem dor",
                  10: "Totalmente sem dor, músculos relaxados"
                }}
              />
              
              <SliderField
                label="TQR - Qualidade Total de Recuperação (0-10)"
                value={formData.tqr}
                onChange={(value) => handleSliderChange('tqr', value)}
                leftLabel="Não recuperado"
                rightLabel="Totalmente recuperado"
                color="blue"
                valueDescriptions={{
                  0: "Nada recuperado, exaustão total",
                  1: "Muito pouco recuperado, extremamente cansado",
                  2: "Pouco recuperado, muito cansado",
                  3: "Recuperação insuficiente, cansado",
                  4: "Recuperação parcial, ainda cansado",
                  5: "Recuperação moderada, energia média",
                  6: "Razoavelmente recuperado, energia adequada",
                  7: "Bem recuperado, boa energia",
                  8: "Muito bem recuperado, energia alta",
                  9: "Quase totalmente recuperado, energia excelente",
                  10: "Totalmente recuperado, energia máxima"
                }}
              />
              
              {/* PSR */}
              <SliderField
                label="PSR - Estresse/Recuperação percebida (0-10)"
                value={formData.psr}
                onChange={(value) => handleSliderChange('psr', value)}
                leftLabel="Muito estressado"
                rightLabel="Totalmente recuperado"
                color="blue"
              />
            </div>
          )}

          {/* Step 3: Objective Data */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Frequência cardíaca de repouso (bpm)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 60"
                  value={formData.resting_hr}
                  onChange={(e) => handleInputChange('resting_hr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Dica:</strong> Este dado pode ser obtido de dispositivos como relógios inteligentes ou monitores cardíacos. Se não tiver, deixe em branco.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Training */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="trained"
                  checked={formData.trained}
                  onChange={(e) => handleInputChange('trained', e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-500 bg-gray-700 rounded focus:ring-orange-500"
                />
                <label htmlFor="trained" className="text-lg font-medium text-white">
                  Treinei hoje
                </label>
              </div>
              
              {formData.trained && (
                <div className="space-y-6 pl-8 border-l-4 border-orange-600">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duração do treino (minutos)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 60"
                      value={formData.training_duration}
                      onChange={(e) => handleInputChange('training_duration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <SliderField
                    label="Intensidade do treino (1-10)"
                    value={formData.training_intensity}
                    onChange={(value) => handleSliderChange('training_intensity', value)}
                    leftLabel="Muito leve"
                    rightLabel="Máxima"
                    color="orange"
                  />
                  
                  <SliderField
                    label="RPE - Percepção de esforço (1-10)"
                    value={formData.training_rpe}
                    onChange={(value) => handleSliderChange('training_rpe', value)}
                    leftLabel="Muito fácil"
                    rightLabel="Máximo esforço"
                    color="orange"
                    min={1}
                    max={10}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de treino
                    </label>
                    <select
                      value={formData.training_type}
                      onChange={(e) => handleInputChange('training_type', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="cardio">Cardio</option>
                      <option value="strength">Força</option>
                      <option value="flexibility">Flexibilidade</option>
                      <option value="sports">Esportes</option>
                      <option value="mixed">Misto</option>
                    </select>
                  </div>
                </div>
              )}
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
  min?: number;
  max?: number;
  valueDescriptions?: { [key: number]: string };
}> = ({ label, value, onChange, leftLabel, rightLabel, color, min = 1, max = 10, valueDescriptions }) => {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500'
  };

  const percentage = ((value - min) / (max - min)) * 100;

  // Função para obter a descrição do valor atual
  const getCurrentDescription = () => {
    if (valueDescriptions && valueDescriptions[value]) {
      return valueDescriptions[value];
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-lg font-medium text-white">{label}</label>
        <div className="text-right">
          <span className="text-3xl font-bold text-white">{value}</span>
          {getCurrentDescription() && (
            <div className="text-sm text-gray-300 mt-1 max-w-xs">
              {getCurrentDescription()}
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4">
        <input
          type="range"
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${colorClasses[color as keyof typeof colorClasses]} 0%, ${colorClasses[color as keyof typeof colorClasses]} ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`
          }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-300">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      
      {/* Escala de referência visual */}
      <div className="flex justify-between text-xs text-gray-400 px-2">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
          <span key={num} className={`${num === value ? 'text-white font-bold' : ''}`}>
            {num}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DailyAssessment;