// [AI Generated] Data: 19/01/2025
// Descri+º+úo: Formul+írio de avalia+º+úo di+íria completo
// Gerado por: Cursor AI
// Vers+úo: React 18.3.1
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
    // Vari+íveis subjetivas
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
    
    // Vari+íveis objetivas (opcionais)
    resting_hr: '',
    
    // Dados do treino anterior
    trained: false,
    training_duration: '',
    training_rpe: 5,
    training_intensity: 5,
    training_type: '',
    training_notes: '',
    // Novo campo
    pse: 5 // Percep+º+úo Subjetiva de Esfor+ºo (0-10)
  });

  // Fallback local quando Supabase n+úo tem tabelas configuradas
  const saveLocalDailyData = (entry: Partial<DailyData>) => {
    try {
      const key = `daily_data_local_${user.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(entry);
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch {
      return false;
    }
  };

  const saveLocalTrainingSession = (entry: any) => {
    try {
      const key = `training_sessions_local_${user.id}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(entry);
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch {
      return false;
    }
  };

  const steps = [
    {
      title: 'Como voc+¬ dormiu?',
      icon: <Moon className="h-6 w-6 text-indigo-600" />,
      fields: ['sleep_quality', 'sleep_duration', 'sleep_regularity']
    },
    {
      title: 'Como est+í se sentindo?',
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      fields: ['fatigue_level', 'exhaustion', 'mood', 'stress_level']
    },
    {
      title: 'Estado f+¡sico atual',
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
        tqr: formData.tqr,
        psr: formData.psr,
        resting_hr: formData.resting_hr ? parseInt(formData.resting_hr) : null,
        rpe: formData.training_rpe,
        created_at: new Date().toISOString()
      };

      const { error: dailyError } = await dbHelpers.insertDailyData(dailyDataEntry);
      if (dailyError) {
        const msg = dailyError.message || '';
        const isSchemaMissing = (dailyError as any)?.code === '404' || /Could not find the table 'public\.daily_data'/i.test(msg);
        const isConnectivity = /Supabase n+úo configurado|Erro de conex+úo com Supabase|Failed to fetch|net::ERR/i.test(msg);
        if (isSchemaMissing || isConnectivity) {
          const ok = saveLocalDailyData(dailyDataEntry);
          if (!ok) {
            throw new Error('Erro ao salvar dados di+írios localmente.');
          }
          if (import.meta.env.DEV) {
            console.warn('Supabase indispon+¡vel (schema/conectividade). Entrada salva localmente.');
          }
        } else {
          throw new Error('Erro ao salvar dados di+írios: ' + msg);
        }
      }

      if (formData.training_duration && formData.training_rpe) {
        const durationMinutes = parseInt(formData.training_duration);
        const estimatedAvgHR = formData.resting_hr
          ? parseInt(formData.resting_hr) + (formData.training_intensity || 0) * 15
          : 60 + (formData.training_intensity || 0) * 15;
        const trimp = durationMinutes ? calculateTRIMP(durationMinutes, estimatedAvgHR) : 0;

        const trainingSession = {
          user_id: user.id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
          const msg = trainingError.message || '';
          const isSchemaMissing = (trainingError as any)?.code === '404' || /Could not find the table 'public\.training_sessions'/i.test(msg);
          const isConnectivity = /Supabase n+úo configurado|Erro de conex+úo com Supabase|Failed to fetch|net::ERR/i.test(msg);
          if (isSchemaMissing || isConnectivity) {
            const ok = saveLocalTrainingSession(trainingSession);
            if (!ok) {
              alert('Falha ao salvar sess+úo de treino localmente.');
            }
            if (import.meta.env.DEV) {
              console.warn('Supabase indispon+¡vel (schema/conectividade). Sess+úo salva localmente.');
            }
          } else if (import.meta.env.DEV) {
            console.warn('Erro ao salvar sess+úo de treino:', msg);
          }
        }
      }

      if (import.meta.env.DEV) {
        console.info('Avalia+º+úo salva com sucesso (Supabase ou local).');
      }
      onComplete();
      
    } catch (error) {
      alert('Erro ao salvar avalia+º+úo: ' + (error as Error).message);
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
            <h2 className="text-2xl font-bold text-white">Avalia+º+úo Di+íria</h2>
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
                leftLabel="P+®ssima"
                rightLabel="Excelente"
                color="indigo"
                valueDescriptions={{
                  1: "N+úo consegui dormir, ins+¦nia total",
                  2: "Sono muito fragmentado, acordei v+írias vezes",
                  3: "Sono ruim, demorei para adormecer",
                  4: "Sono irregular, acordei algumas vezes",
                  5: "Sono m+®dio, nem bom nem ruim",
                  6: "Sono razo+ível, pequenos despertares",
                  7: "Sono bom, acordei descansado",
                  8: "Sono muito bom, profundo e reparador",
                  9: "Sono excelente, acordei revigorado",
                  10: "Sono perfeito, melhor noite poss+¡vel"
                }}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dura+º+úo do sono (horas)
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
                  1: "Hor+írios completamente desregulados",
                  2: "Muito irregular, sem padr+úo",
                  3: "Bastante irregular, varia muito",
                  4: "Irregular, algumas varia+º+Áes",
                  5: "Moderadamente regular",
                  6: "Razoavelmente regular",
                  7: "Bem regular, pequenas varia+º+Áes",
                  8: "Muito regular, hor+írios consistentes",
                  9: "Extremamente regular, rotina fixa",
                  10: "Perfeitamente regular, mesmo hor+írio sempre"
                }}
              />
            </div>
          )}

          {/* Step 1: Mood & Energy */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <SliderField
                label="N+¡vel de fadiga (1-10)"
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
                  10: "Energia m+íxima, completamente revigorado"
                }}
              />
              
              <SliderField
                label="N+¡vel de exaust+úo (1-10)"
                value={formData.exhaustion}
                onChange={(value) => handleSliderChange('exhaustion', value)}
                leftLabel="Sem exaust+úo"
                rightLabel="Completamente exausto"
                color="red"
                valueDescriptions={{
                  1: "Totalmente recuperado, sem exaust+úo",
                  2: "Muito pouca exaust+úo",
                  3: "Leve sensa+º+úo de exaust+úo",
                  4: "Alguma exaust+úo, mas control+ível",
                  5: "Exaust+úo moderada",
                  6: "Bastante exausto",
                  7: "Muito exausto, preciso descansar",
                  8: "Extremamente exausto",
                  9: "Quase no limite da exaust+úo",
                  10: "Completamente exausto, n+úo consigo mais"
                }}
              />
              
              <SliderField
                label="Humor geral (1-10)"
                value={formData.mood}
                onChange={(value) => handleSliderChange('mood', value)}
                leftLabel="P+®ssimo"
                rightLabel="Excelente"
                color="blue"
                valueDescriptions={{
                  1: "Muito deprimido, humor p+®ssimo",
                  2: "Bastante triste, humor ruim",
                  3: "Humor baixo, desanimado",
                  4: "Humor um pouco baixo",
                  5: "Humor neutro, nem bom nem ruim",
                  6: "Humor razo+ível, ligeiramente positivo",
                  7: "Bom humor, me sinto bem",
                  8: "Muito bom humor, otimista",
                  9: "Humor excelente, muito feliz",
                  10: "Humor perfeito, euf+¦rico e motivado"
                }}
              />
              
              <SliderField
                label="N+¡vel de estresse (1-10)"
                value={formData.stress_level}
                onChange={(value) => handleSliderChange('stress_level', value)}
                leftLabel="Muito estressado"
                rightLabel="Muito relaxado"
                color="green"
                valueDescriptions={{
                  1: "Extremamente estressado, ansioso",
                  2: "Muito estressado, dif+¡cil relaxar",
                  3: "Bastante estressado, tenso",
                  4: "Estressado, mas control+ível",
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
                  4: "Dor moderada, mas suport+ível",
                  5: "Dor leve a moderada",
                  6: "Dor leve, pouco desconforto",
                  7: "Dor muito leve, quase impercept+¡vel",
                  8: "Desconforto m+¡nimo",
                  9: "Praticamente sem dor",
                  10: "Totalmente sem dor, m+¦sculos relaxados"
                }}
              />
              
              <SliderField
                label="TQR - Qualidade Total de Recupera+º+úo (0-10)"
                value={formData.tqr}
                onChange={(value) => handleSliderChange('tqr', value)}
                leftLabel="N+úo recuperado"
                rightLabel="Totalmente recuperado"
                color="blue"
                valueDescriptions={{
                  0: "Nada recuperado, exaust+úo total",
                  1: "Muito pouco recuperado, extremamente cansado",
                  2: "Pouco recuperado, muito cansado",
                  3: "Recupera+º+úo insuficiente, cansado",
                  4: "Recupera+º+úo parcial, ainda cansado",
                  5: "Recupera+º+úo moderada, energia m+®dia",
                  6: "Razoavelmente recuperado, energia adequada",
                  7: "Bem recuperado, boa energia",
                  8: "Muito bem recuperado, energia alta",
                  9: "Quase totalmente recuperado, energia excelente",
                  10: "Totalmente recuperado, energia m+íxima"
                }}
              />
              
              {/* PSR */}
              <SliderField
                label="PSR - Estresse/Recupera+º+úo percebida (0-10)"
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
                  Frequ+¬ncia card+¡aca de repouso (bpm)
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
                  ­ƒÆí <strong>Dica:</strong> Este dado pode ser obtido de dispositivos como rel+¦gios inteligentes ou monitores card+¡acos. Se n+úo tiver, deixe em branco.
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
                      Dura+º+úo do treino (minutos)
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
                    rightLabel="M+íxima"
                    color="orange"
                  />
                  
                  <SliderField
                    label="RPE - Percep+º+úo de esfor+ºo (1-10)"
                    value={formData.training_rpe}
                    onChange={(value) => handleSliderChange('training_rpe', value)}
                    leftLabel="Muito f+ícil"
                    rightLabel="M+íximo esfor+ºo"
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
                      <option value="strength">For+ºa</option>
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
                Pr+¦ximo
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

  // Fun+º+úo para obter a descri+º+úo do valor atual
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
      
      {/* Escala de refer+¬ncia visual */}
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
