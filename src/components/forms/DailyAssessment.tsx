// [AI Generated] Data: 19/01/2025
// Descrição: Formulário de avaliação diária completo (Atualizado para SPRAVATTO)
// Gerado por: Trae AI
// Versão: React 18.3.1
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
    sleep_score: '', // 0-100
    stress_score: '', // 0-100
    
    // Bipolaridade
    energy_level: 5,
    mood_depressed: 0,
    mood_euphoria: 0,
    irritability: 0,

    // Neurodivergência
    anxiety: 0,
    obsessive_thoughts: 0,
    sensory_overload: 0,
    social_masking: 0,
    
    // Segurança
    suicide_risk: 0,

    // Legado / Físico
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

  const descriptors = {
    energy_level: {
      0: 'Exaustão, corpo pesado ("chumbo"), fadiga crônica',
      5: 'Energia normal, sustentável ao longo do dia',
      8: '"Elétrico", produtivo demais, inquieto',
      10: 'Mania. Pensamento voando, agitação perigosa'
    },
    mood_depressed: {
      0: 'Bem/Estável',
      5: 'Desânimo, "vida cinza", perda de prazer leve',
      10: 'Dor emocional insuportável, choro incontrolável ou paralisia'
    },
    mood_euphoria: {
      0: 'Calmo',
      5: 'Mais feliz que o normal, muito otimista',
      10: 'Sensação de ser invencível, Deus ou grandiosidade delirante'
    },
    irritability: {
      0: 'Paciência total',
      5: 'Pavio curto, respostas ríspidas',
      10: 'Explosivo, vontade de quebrar coisas ou agredir'
    },
    anxiety: {
      0: 'Relaxado',
      5: 'Tensão muscular, preocupação de fundo constante',
      10: 'Ataque de Pânico'
    },
    obsessive_thoughts: {
      0: 'Mente limpa',
      5: 'O pensamento vem e incomoda, mas consigo mudar o foco',
      10: 'O pensamento grita na cabeça o dia todo, impossível ignorar'
    },
    sensory_overload: {
      0: 'Confortável',
      5: 'Luzes ou sons irritam, preciso usar fone ou óculos',
      10: 'Meltdown/Shutdown (Dor física com barulho, cérebro "desliga")'
    },
    social_masking: {
      0: 'Fui eu mesmo 100%',
      5: '"Atuação" social padrão de trabalho',
      10: 'Exaustão por fingir ser normal. Sinto-me uma farsa'
    },
    suicide_risk: {
      0: 'Nenhum',
      3: 'Passivo ("Queria dormir e não acordar")',
      7: 'Ativo (Planejamento)',
      10: 'Iminência/Emergência'
    }
  };

  // Fallback local quando Supabase não tem tabelas configuradas
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
      title: 'Biológico & Sinais Vitais',
      icon: <Moon className="h-6 w-6 text-indigo-600" />,
      fields: ['sleep_duration', 'sleep_score', 'stress_score', 'resting_hr']
    },
    {
      title: 'Bipolaridade (Energia & Humor)',
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      fields: ['energy_level', 'mood_depressed', 'mood_euphoria', 'irritability']
    },
    {
      title: 'Neurodivergência (TOC & Autismo)',
      icon: <Activity className="h-6 w-6 text-yellow-600" />,
      fields: ['anxiety', 'obsessive_thoughts', 'sensory_overload', 'social_masking']
    },
    {
      title: 'Segurança',
      icon: <Heart className="h-6 w-6 text-red-600" />,
      fields: ['suicide_risk']
    },
    {
      title: 'Físico & Treino',
      icon: <Zap className="h-6 w-6 text-green-600" />,
      fields: ['muscle_soreness', 'tqr', 'trained']
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

      // Map new 0-100/0-10 scales to legacy 1-10 scales for DB compatibility
      const legacySleepQuality = formData.sleep_score ? Math.max(1, Math.round(parseInt(formData.sleep_score as string) / 10)) : 5;
      const legacyStressLevel = formData.stress_score ? Math.max(1, Math.round(parseInt(formData.stress_score as string) / 10)) : 5;
      const legacyFatigue = Math.max(1, 10 - formData.energy_level);
      const legacyMood = Math.max(1, 10 - formData.mood_depressed); // Simple approx

      const dailyDataEntry: any = { // Using any to bypass strict type checking for new fields until types are fully propagated
        user_id: user.id,
        date: today,
        // Legacy required fields
        sleep_quality: legacySleepQuality,
        fatigue_level: legacyFatigue,
        exhaustion: formData.exhaustion, // Kept for legacy compatibility if needed
        mood: legacyMood,
        muscle_soreness: formData.muscle_soreness,
        stress_level: legacyStressLevel,
        tqr: formData.tqr,
        psr: formData.psr,
        readiness_score: 0, // Calculated by trigger
        
        // New Mental Health Fields
        sleep_duration: formData.sleep_duration ? parseFloat(formData.sleep_duration) : null,
        sleep_regularity: formData.sleep_regularity,
        sleep_score: formData.sleep_score ? parseInt(formData.sleep_score as string) : null,
        stress_score: formData.stress_score ? parseInt(formData.stress_score as string) : null,
        resting_hr: formData.resting_hr ? parseInt(formData.resting_hr) : null,
        
        energy_level: formData.energy_level,
        mood_depressed: formData.mood_depressed,
        mood_euphoria: formData.mood_euphoria,
        irritability: formData.irritability,
        
        anxiety: formData.anxiety,
        obsessive_thoughts: formData.obsessive_thoughts,
        sensory_overload: formData.sensory_overload,
        social_masking: formData.social_masking,
        
        suicide_risk: formData.suicide_risk,

        // Training Context
        rpe: formData.training_rpe,
        training_duration: formData.training_duration ? parseInt(formData.training_duration) : null,
        training_intensity: formData.training_intensity,
        
        created_at: new Date().toISOString()
      };

      const { error: dailyError } = await dbHelpers.insertDailyData(dailyDataEntry);
      if (dailyError) {
        const msg = dailyError.message || '';
        const isSchemaMissing = (dailyError as any)?.code === '404' || /Could not find the table 'public\.daily_data'/i.test(msg);
        const isConnectivity = /Supabase não configurado|Erro de conexão com Supabase|Failed to fetch|net::ERR/i.test(msg);
        if (isSchemaMissing || isConnectivity) {
          const ok = saveLocalDailyData(dailyDataEntry);
          if (!ok) {
            throw new Error('Erro ao salvar dados diários localmente.');
          }
          if (import.meta.env.DEV) {
            console.warn('Supabase indisponível (schema/conectividade). Entrada salva localmente.');
          }
        } else {
          throw new Error('Erro ao salvar dados diários: ' + msg);
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
          const isConnectivity = /Supabase não configurado|Erro de conexão com Supabase|Failed to fetch|net::ERR/i.test(msg);
          if (isSchemaMissing || isConnectivity) {
            const ok = saveLocalTrainingSession(trainingSession);
            if (!ok) {
              alert('Falha ao salvar sessão de treino localmente.');
            }
            if (import.meta.env.DEV) {
              console.warn('Supabase indisponível (schema/conectividade). Sessão salva localmente.');
            }
          } else if (import.meta.env.DEV) {
            console.warn('Erro ao salvar sessão de treino:', msg);
          }
        }
      }

      if (import.meta.env.DEV) {
        console.info('Avaliação salva com sucesso (Supabase ou local).');
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
          {/* Step 0: Biological & Vitals */}
          {currentStep === 0 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sono (Horas)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 8.5"
                  value={formData.sleep_duration}
                  onChange={(e) => handleInputChange('sleep_duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Copiar do App/Relógio</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sono (Nota) - 0 a 100
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ex: 85"
                  value={formData.sleep_score}
                  onChange={(e) => handleInputChange('sleep_score', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Nota do App (0 a 100)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stress (App) - 0 a 100
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Ex: 40"
                  value={formData.stress_score}
                  onChange={(e) => handleInputChange('stress_score', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {parseInt(formData.stress_score as string) > 80 && (
                  <p className="text-sm text-red-400 mt-1 font-bold">⚠️ Alerta: Stress Elevado!</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  FC Repouso (bpm)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 60"
                  value={formData.resting_hr}
                  onChange={(e) => handleInputChange('resting_hr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Batimentos ao acordar (Do App)</p>
              </div>
            </div>
          )}

          {/* Step 1: Bipolarity */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <SliderField
                label="Energia (0-10)"
                value={formData.energy_level}
                onChange={(value) => handleSliderChange('energy_level', value)}
                leftLabel="Exaustão"
                rightLabel="Mania"
                color="yellow"
                min={0}
                max={10}
                valueDescriptions={descriptors.energy_level}
              />
              
              {/* Mania Risk Alert */}
              {parseInt(formData.stress_score as string) > 80 && formData.energy_level >= 8 && (
                 <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4 animate-pulse">
                  <p className="text-red-200 text-sm font-bold flex items-center justify-center">
                    <Activity className="h-5 w-5 mr-2" />
                    ⚠️ ALERTA: Alto Stress + Alta Energia = Risco de Mania!
                  </p>
                </div>
              )}
              
              <SliderField
                label="Humor Depre (0-10)"
                value={formData.mood_depressed}
                onChange={(value) => handleSliderChange('mood_depressed', value)}
                leftLabel="Bem"
                rightLabel="Dor Emocional"
                color="blue"
                min={0}
                max={10}
                valueDescriptions={descriptors.mood_depressed}
              />

              <SliderField
                label="Euforia/Mania (0-10)"
                value={formData.mood_euphoria}
                onChange={(value) => handleSliderChange('mood_euphoria', value)}
                leftLabel="Calmo"
                rightLabel="Grandiosidade"
                color="orange"
                min={0}
                max={10}
                valueDescriptions={descriptors.mood_euphoria}
              />

              <SliderField
                label="Irritabilidade (0-10)"
                value={formData.irritability}
                onChange={(value) => handleSliderChange('irritability', value)}
                leftLabel="Paciência"
                rightLabel="Explosivo"
                color="red"
                min={0}
                max={10}
                valueDescriptions={descriptors.irritability}
              />
            </div>
          )}

          {/* Step 2: Neurodivergence */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <SliderField
                label="Ansiedade (0-10)"
                value={formData.anxiety}
                onChange={(value) => handleSliderChange('anxiety', value)}
                leftLabel="Relaxado"
                rightLabel="Pânico"
                color="purple"
                min={0}
                max={10}
                valueDescriptions={descriptors.anxiety}
              />

              <SliderField
                label="Pensamentos Obsessivos - TOC (0-10)"
                value={formData.obsessive_thoughts}
                onChange={(value) => handleSliderChange('obsessive_thoughts', value)}
                leftLabel="Mente limpa"
                rightLabel="Gritante"
                color="indigo"
                min={0}
                max={10}
                valueDescriptions={descriptors.obsessive_thoughts}
              />

              <SliderField
                label="Sobrecarga Sensorial - Autismo (0-10)"
                value={formData.sensory_overload}
                onChange={(value) => handleSliderChange('sensory_overload', value)}
                leftLabel="Confortável"
                rightLabel="Meltdown"
                color="yellow"
                min={0}
                max={10}
                valueDescriptions={descriptors.sensory_overload}
              />

              <SliderField
                label="Masking Social - Autismo (0-10)"
                value={formData.social_masking}
                onChange={(value) => handleSliderChange('social_masking', value)}
                leftLabel="Autêntico"
                rightLabel="Exaustão"
                color="green"
                min={0}
                max={10}
                valueDescriptions={descriptors.social_masking}
              />
            </div>
          )}

          {/* Step 3: Safety */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
                <p className="text-red-200 text-sm font-bold text-center">
                  ⚠️ Se você estiver em perigo imediato, ligue para 188 (CVV) ou procure ajuda profissional.
                </p>
              </div>
              <SliderField
                label="Risco Suicídio (0-10)"
                value={formData.suicide_risk}
                onChange={(value) => handleSliderChange('suicide_risk', value)}
                leftLabel="Nenhum"
                rightLabel="Emergência"
                color="red"
                min={0}
                max={10}
                valueDescriptions={descriptors.suicide_risk}
              />
            </div>
          )}

          {/* Step 4: Physical & Training (Legacy) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <SliderField
                label="Dor muscular (1-10)"
                value={formData.muscle_soreness}
                onChange={(value) => handleSliderChange('muscle_soreness', value)}
                leftLabel="Muita dor"
                rightLabel="Sem dor"
                color="yellow"
              />
              
              <SliderField
                label="TQR - Recuperação (0-10)"
                value={formData.tqr}
                onChange={(value) => handleSliderChange('tqr', value)}
                leftLabel="Exaustão"
                rightLabel="Recuperado"
                color="blue"
              />

              <div className="border-t border-gray-700 pt-6">
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
                        Duração (minutos)
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
                      label="RPE - Esforço (1-10)"
                      value={formData.training_rpe}
                      onChange={(value) => handleSliderChange('training_rpe', value)}
                      leftLabel="Fácil"
                      rightLabel="Máximo"
                      color="orange"
                    />
                  </div>
                )}
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
            <div className="text-sm text-gray-300 mt-1 max-w-xs text-right">
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
