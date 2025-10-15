// [AI Generated] Data: 19/01/2025
// Descrição: Tela de autenticação com login e cadastro
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { authHelpers, supabase, ensureSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Activity, Target, Users, Award, TrendingUp, Brain } from 'lucide-react';
import SynthoniaLogo from '../ui/SynthoniaLogo';
import CustomDateInputLight from '../ui/CustomDateInputLight';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 text-center space-y-2 hover:bg-gray-700/80 transition-colors">
      <div className="flex justify-center">{icon}</div>
      <h3 className="font-semibold text-sm text-white">{title}</h3>
      <p className="text-xs text-gray-300 leading-tight">{description}</p>
    </div>
  );
};

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [isDemoMode, setIsDemoMode] = useState(!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'demo');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    birth_date: '',
    role: 'athlete' as 'athlete' | 'coach' | 'physiotherapist',
    coach_id: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coaches, setCoaches] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [coachQuery, setCoachQuery] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const coachSelectRef = useRef<HTMLSelectElement | null>(null);
  const [signupEmailSent, setSignupEmailSent] = useState(false);
  const [supabaseReady, setSupabaseReady] = useState(!!supabase);
  const supabaseConfigured = supabaseReady;
  // Quando não há treinadores carregados ou ocorre erro, não exigir seleção
  const coachAvailable = coaches.length > 0 && !coachError;
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const redirectHint = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? `${window.location.origin}/`
    : (import.meta.env.VITE_AUTH_REDIRECT_URL || '');
  
  const handleResend = async () => {
    if (!formData.email) {
      alert('Informe seu email para reenviar a confirmação.');
      return;
    }
    const { error } = await authHelpers.resendSignupEmail(formData.email);
    if (error) {
      alert('Não foi possível reenviar a confirmação: ' + error.message);
    } else {
      alert('E-mail de confirmação reenviado. Verifique sua caixa de entrada e spam.');
    }
  };

  useEffect(() => {
    // Tenta configurar Supabase ao montar, usando fallback em runtime
    ensureSupabaseConfigured().then(() => setSupabaseReady(true)).catch(() => {});
  }, []);

  useEffect(() => {
    const loadCoaches = async () => {
      if (!supabase) {
        setCoachError('Lista de treinadores indisponível: Supabase não configurado.');
        return;
      }
      setCoachLoading(true);
      setCoachError(null);
      const { data, error } = await supabase
        .from('users')
        .select('id,name,email')
        .eq('role', 'coach')
        .order('name', { ascending: true });
      if (error) {
        // Não bloquear cadastro: apenas avisar e permitir seguir sem treinador
        setCoachError('Treinadores indisponíveis no momento (tabela users não encontrada ou vazia). Você poderá vincular depois.');
      } else {
        setCoaches((data || []).map((c: any) => ({ id: c.id, name: c.name || c.email || 'Treinador', email: c.email })));
      }
      setCoachLoading(false);
    };

    if (!isLogin && formData.role === 'athlete') {
      loadCoaches();
    }
  }, [isLogin, formData.role]);

  const filteredCoaches = useMemo(() => {
    const q = coachQuery.trim().toLowerCase();
    if (!q) return coaches;
    return coaches.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }, [coachQuery, coaches]);

  const validateField = (name: string, value: string) => {
    let msg = '';
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) msg = 'Informe seu nome completo.';
        break;
      case 'birth_date':
        if (!value) msg = 'Informe sua data de nascimento.';
        break;
      case 'email':
        if (!value) msg = 'Informe seu e-mail.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'E-mail inválido.';
        break;
      case 'password':
        if (!value || value.length < 8) msg = 'Senha deve ter ao menos 8 caracteres.';
        break;
      case 'role':
        if (!value) msg = 'Selecione seu perfil.';
        break;
      case 'coach_id':
        // Exigir treinador somente se houver lista disponível e sem erros
        if (formData.role === 'athlete' && coachAvailable && !value) msg = 'Selecione seu treinador.';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: msg }));
    return msg;
  };

  const isFormValid = useMemo(() => {
    const requiredOk = (
      (!!formData.name && formData.name.trim().length >= 2) &&
      (!!formData.birth_date) &&
      (!!formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) &&
      (!!formData.password && formData.password.length >= 8) &&
      (!!formData.role)
    );
    const coachOk = formData.role !== 'athlete' ? true : (coachAvailable ? !!formData.coach_id : true);
    const noErrors = Object.values(errors).every(v => !v);
    return requiredOk && coachOk && noErrors;
  }, [formData, errors, coachAvailable]);
  // const handleDemoLogin = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await authHelpers.signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('conexão')) {
            alert('❌ ' + error.message + '\n\n💡 Dica: Verifique se o Supabase está configurado corretamente no arquivo .env');
          } else {
            alert('Erro ao fazer login: ' + error.message);
          }
        }
      } else {
        // Validação final antes de enviar
        const fieldsToCheck = ['name','birth_date','email','password','role'] as const;
        fieldsToCheck.forEach(f => validateField(f, (formData as any)[f]));
        if (formData.role === 'athlete') validateField('coach_id', formData.coach_id);
        if (!isFormValid) {
          const firstErrorKey = Object.keys(errors).find(k => errors[k]);
          if (firstErrorKey === 'coach_id' && coachSelectRef.current) coachSelectRef.current.focus();
          throw new Error('Dados incompletos');
        }
        const { error } = await authHelpers.signUp(formData.email, formData.password, {
          name: formData.name,
          birth_date: formData.birth_date,
          role: formData.role,
          coach_id: formData.coach_id || null
        });
        if (error) {
          if (error.message.includes('conexão')) {
            alert('❌ ' + error.message + '\n\n💡 Dica: Verifique se o Supabase está configurado corretamente no arquivo .env');
          } else {
            alert('Erro ao criar conta: ' + error.message);
          }
        } else {
          alert('Conta criada com sucesso! Verifique seu email.');
          setSignupEmailSent(true);
        }
      }
    } catch (error) {
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (name === 'role' && value !== 'athlete') {
      setFormData(prev => ({ ...prev, coach_id: '' }));
      setErrors(prev => ({ ...prev, coach_id: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <SynthoniaLogo className="h-10 w-10" size={48} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SynthonIA AI
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Plataforma inteligente de monitoramento esportivo que combina ciência do treinamento com análise avançada de recuperação
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FeatureCard 
              icon={<Activity className="h-6 w-6 text-blue-600" />}
              title="Readiness Score"
              description="Indicador 0-100 da sua prontidão para treino"
            />
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6 text-green-600" />}
              title="Métricas ATL/CTL"
              description="Análise científica de carga de treinamento"
            />
            <FeatureCard 
              icon={<Target className="h-6 w-6 text-purple-600" />}
              title="IA Coach"
              description="Recomendações personalizadas inteligentes"
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-orange-600" />}
              title="Para Equipes"
              description="Treinadores acompanham múltiplos atletas"
            />
            <FeatureCard 
              icon={<Award className="h-6 w-6 text-red-600" />}
              title="Gamificação"
              description="Sistema de pontos e achievements"
            />
            <FeatureCard 
              icon={<Brain className="h-6 w-6 text-indigo-600" />}
              title="Análise Holística"
              description="Físico, mental e recuperação integrados"
            />
          </div>
        </div>

        {/* Auth Form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Acesse seu dashboard personalizado' : 'Comece sua jornada inteligente'}
            </p>
          </CardHeader>
          
          <CardContent>
            {!supabaseConfigured && (
              <div className="p-3 mb-4 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-900">
                <p className="font-semibold mb-2">Supabase não configurado.</p>
                <p className="mb-3">Cole abaixo sua URL e chave anônima para habilitar o login neste preview.</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    placeholder="https://SEU-PROJETO.supabase.co"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    aria-label="Supabase URL"
                  />
                  <input
                    type="password"
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    placeholder="Chave anônima (anon key)"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    aria-label="Supabase anon key"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        if (!supabaseUrlInput || !supabaseKeyInput) {
                          alert('Informe URL e chave anônima do Supabase.');
                          return;
                        }
                        localStorage.setItem('SUPABASE_URL', supabaseUrlInput);
                        localStorage.setItem('SUPABASE_ANON_KEY', supabaseKeyInput);
                        alert('Credenciais salvas. Recarregando para aplicar...');
                        window.location.reload();
                      }}
                    >
                      Salvar e recarregar
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {signupEmailSent && (
              <div className="p-3 mb-3 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-800">
                <p>Enviamos um e-mail de confirmação para <strong>{formData.email}</strong>. Caso não receba em alguns minutos, verifique a pasta de spam.</p>
                <p className="mt-2">Redirect configurado: <span className="font-mono">{redirectHint}</span></p>
                <Button type="button" onClick={handleResend} className="mt-3">Reenviar e-mail de confirmação</Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <CustomDateInputLight
                      value={formData.birth_date}
                      onChange={(value) => setFormData({...formData, birth_date: value})}
                      className="w-full"
                      name="birth_date"
                      required={!isLogin}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Perfil
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="athlete">Atleta</option>
                      <option value="coach">Treinador</option>
                      <option value="physiotherapist">Fisioterapeuta</option>
                    </select>
                  </div>

                  {formData.role === 'athlete' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecione seu Treinador
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={coachQuery}
                          onChange={(e) => setCoachQuery(e.target.value)}
                          placeholder="Buscar por nome ou e-mail"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          aria-label="Buscar treinador"
                        />
                        <select
                          ref={coachSelectRef}
                          name="coach_id"
                          value={formData.coach_id}
                          onChange={(e) => {
                            const v = e.target.value;
                            setFormData(prev => ({ ...prev, coach_id: v }));
                            validateField('coach_id', v);
                          }}
                          required={coachAvailable}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          aria-invalid={!!errors.coach_id}
                          aria-describedby="coach-error"
                        >
                          <option value="" disabled>
                            {coachLoading ? 'Carregando...' : (coachAvailable ? 'Selecione um treinador' : 'Nenhum treinador disponível')}
                          </option>
                          {filteredCoaches.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.email})
                            </option>
                          ))}
                        </select>
                        {coachError && (
                          <p className="text-sm text-yellow-700">{coachError}</p>
                        )}
                        {!!errors.coach_id && (
                          <p id="coach-error" className="text-sm text-red-600">{errors.coach_id}</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                {!!errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
                {!!errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full py-3 text-lg font-semibold"
                size="lg"
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

            {!isLogin && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (!formData.email) {
                      alert('Informe seu email para reenviar a confirmação.');
                      return;
                    }
                    const { error } = await authHelpers.resendSignupEmail(formData.email);
                    if (error) {
                      alert('Não foi possível reenviar a confirmação: ' + error.message);
                    } else {
                      alert('E-mail de confirmação reenviado. Verifique sua caixa de entrada e spam.');
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reenviar e-mail de confirmação
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Fazer login'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthScreen;
// AI_GENERATED_CODE_END