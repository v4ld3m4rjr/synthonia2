// Synthonia - Modern Authentication Screen
// Rebuilt with TypeScript, modern design, and robust validation
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { authHelpers, supabase, ensureSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Activity, Target, Users, Award, TrendingUp, Brain, Mail, Lock, User as UserIcon, Calendar, Shield } from 'lucide-react';
import SynthoniaLogo from '../ui/SynthoniaLogo';
import CustomDateInputLight from '../ui/CustomDateInputLight';

interface Coach {
  id: string;
  name: string;
  email: string;
}

interface FormData {
  email: string;
  password: string;
  name: string;
  birth_date: string;
  role: 'athlete' | 'coach' | 'physiotherapist';
  coach_id: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  birth_date?: string;
  coach_id?: string;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="group bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-xl p-6 text-center space-y-3 hover:from-gray-700/80 hover:to-gray-800/80 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
    <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="font-semibold text-base text-white">{title}</h3>
    <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    birth_date: '',
    role: 'athlete',
    coach_id: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [coachQuery, setCoachQuery] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const coachSelectRef = useRef<HTMLSelectElement | null>(null);
  const [signupEmailSent, setSignupEmailSent] = useState(false);
  const [supabaseReady, setSupabaseReady] = useState(!!supabase);
  const supabaseConfigured = supabaseReady;
  const coachAvailable = coaches.length > 0 && !coachError;
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);

  const redirectHint = (import.meta.env.VITE_AUTH_REDIRECT_URL)
    ? import.meta.env.VITE_AUTH_REDIRECT_URL
    : ((typeof window !== 'undefined' && window.location && window.location.origin)
      ? `${window.location.origin}/`
      : '');

  const handleResend = async () => {
    if (!formData.email) {
      alert('Informe seu email para reenviar a confirmação.');
      return;
    }
    const { error } = await authHelpers.resendSignupEmail(formData.email);
    if (error) {
      const msg = error.message || '';
      if (msg.includes('Failed to fetch')) {
        alert('❌ Falha de conexão com Supabase ao reenviar.\\n\\n💡 Dica: Verifique a URL e anon key em "Configuração Supabase" e salve novamente.');
      } else {
        alert('Não foi possível reenviar a confirmação: ' + msg);
      }
    } else {
      alert('E-mail de confirmação reenviado. Verifique sua caixa de entrada e spam.');
    }
  };

  useEffect(() => {
    ensureSupabaseConfigured()
      .then((client) => setSupabaseReady(!!client))
      .catch(() => setSupabaseReady(false));
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
        setCoachError('Treinadores indisponíveis no momento. Você poderá vincular depois.');
      } else {
        setCoaches((data || []).map((c: any) => ({
          id: c.id,
          name: c.name || c.email || 'Treinador',
          email: c.email
        })));
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

  const validateField = (name: keyof FormData, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? undefined
          : 'Email inválido';
        break;
      case 'password':
        newErrors.password = value.length >= 6
          ? undefined
          : 'A senha deve ter pelo menos 6 caracteres';
        break;
      case 'name':
        newErrors.name = value.trim().length > 2
          ? undefined
          : 'Informe seu nome completo';
        break;
      case 'birth_date':
        newErrors.birth_date = value
          ? undefined
          : 'Informe sua data de nascimento';
        break;
      case 'coach_id':
        newErrors.coach_id = value || !coachAvailable
          ? undefined
          : 'Selecione um treinador';
        break;
    }

    setErrors(newErrors);
  };

  const isFormValid = useMemo(() => {
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password: string) => password.length >= 6;
    const validateName = (name: string) => name.trim().length > 2;
    const validateBirthDate = (birthDate: string) => !!birthDate;

    const baseValid = validateEmail(formData.email) && validatePassword(formData.password);
    const signupValid = isLogin || (validateName(formData.name) && validateBirthDate(formData.birth_date));
    const coachValid = isLogin || formData.role !== 'athlete' || !!formData.coach_id || !coachAvailable;

    return baseValid && signupValid && coachValid;
  }, [formData, isLogin, coachAvailable]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name as keyof FormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await authHelpers.signIn(formData.email, formData.password);
        if (error) {
          const msg = error.message || '';
          if (msg.includes('Failed to fetch')) {
            alert('❌ Falha de conexão com Supabase.\\n\\n💡 Dica: Verifique a configuração do Supabase.');
          } else if (msg.includes('conexão')) {
            alert('❌ ' + msg);
          } else {
            alert('Erro ao fazer login: ' + msg);
          }
        }
      } else {
        const fieldsToCheck: (keyof FormData)[] = ['name', 'birth_date', 'email', 'password', 'role'];
        fieldsToCheck.forEach(f => validateField(f, formData[f]));
        if (formData.role === 'athlete') validateField('coach_id', formData.coach_id);

        if (!isFormValid) {
          const firstErrorKey = Object.keys(errors).find(k => errors[k as keyof FormErrors]);
          if (firstErrorKey === 'coach_id' && coachSelectRef.current) {
            coachSelectRef.current.focus();
          }
          throw new Error('Dados incompletos');
        }

        const { error } = await authHelpers.signUp(formData.email, formData.password, {
          name: formData.name,
          birth_date: formData.birth_date,
          role: formData.role,
          coach_id: formData.coach_id || null
        });

        if (error) {
          const msg = error.message || '';
          if (msg.includes('Failed to fetch')) {
            alert('❌ Falha de conexão com Supabase.\\n\\n💡 Dica: Verifique a configuração.');
          } else if (msg.includes('conexão')) {
            alert('❌ ' + msg);
          } else {
            alert('Erro ao criar conta: ' + msg);
          }
        } else {
          alert('Conta criada com sucesso! Verifique seu email.');
          setSignupEmailSent(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseConfig = () => {
    if (!supabaseUrlInput || !supabaseKeyInput) {
      alert('Preencha a URL e a chave anon do Supabase.');
      return;
    }
    try {
      localStorage.setItem('FALLBACK_SUPABASE_URL', supabaseUrlInput);
      localStorage.setItem('FALLBACK_SUPABASE_ANON_KEY', supabaseKeyInput);
      alert('✅ Configuração salva! Recarregando...');
      window.location.reload();
    } catch (err) {
      alert('Erro ao salvar configuração.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <SynthoniaLogo />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Synthonia
              </h1>
              <p className="text-sm text-gray-300">Treinamento inteligente e bem-estar integrado</p>
            </div>
          </div>
          {!supabaseConfigured && (
            <Button
              onClick={() => setShowSupabaseConfig(!showSupabaseConfig)}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              ⚙️ Configurar Supabase
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Features Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Potencialize seu desempenho
              </h2>
              <p className="text-gray-300">
                Monitore, analise e otimize seu treinamento com inteligência artificial
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureCard
                icon={<Activity className="h-8 w-8 text-blue-400" />}
                title="Autoavaliação Diária"
                description="Sono, energia, humor e recuperação"
              />
              <FeatureCard
                icon={<Target className="h-8 w-8 text-green-400" />}
                title="Metas e Planejamento"
                description="Acompanhe treinos e objetivos"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8 text-purple-400" />}
                title="Insights e Tendências"
                description="Análises com base em seus dados"
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-orange-400" />}
                title="Para Equipes"
                description="Treinadores acompanham múltiplos atletas"
              />
              <FeatureCard
                icon={<Award className="h-8 w-8 text-yellow-400" />}
                title="Conquistas"
                description="Gamificação e motivação"
              />
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-pink-400" />}
                title="IA Integrada"
                description="Recomendações personalizadas"
              />
            </div>
          </div>

          {/* Auth Form Section */}
          <div className="lg:sticky lg:top-8">
            {showSupabaseConfig && !supabaseConfigured ? (
              <Card className="bg-gray-800/90 backdrop-blur-md border-gray-700 shadow-2xl">
                <CardHeader>
                  <h3 className="text-xl font-bold text-white">Configuração Supabase</h3>
                  <p className="text-sm text-gray-300">Configure sua conexão com o Supabase</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL do Projeto
                    </label>
                    <input
                      type="text"
                      value={supabaseUrlInput}
                      onChange={(e) => setSupabaseUrlInput(e.target.value)}
                      placeholder="https://seu-projeto.supabase.co"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Anon Key
                    </label>
                    <input
                      type="password"
                      value={supabaseKeyInput}
                      onChange={(e) => setSupabaseKeyInput(e.target.value)}
                      placeholder="sua_chave_anon_aqui"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSupabaseConfig}
                      disabled={!supabaseUrlInput || !supabaseKeyInput}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Salvar e Recarregar
                    </Button>
                    <Button
                      onClick={() => setShowSupabaseConfig(false)}
                      className="bg-gray-700 hover:bg-gray-600"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : signupEmailSent ? (
              <Card className="bg-gray-800/90 backdrop-blur-md border-gray-700 shadow-2xl">
                <CardContent className="py-12 text-center space-y-4">
                  <div className="flex justify-center">
                    <Mail className="h-16 w-16 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Verifique seu email</h3>
                  <p className="text-gray-300">
                    Enviamos um link de confirmação para <strong className="text-blue-400">{formData.email}</strong>
                  </p>
                  <p className="text-sm text-gray-400">
                    O link redirecionará para: <code className="text-blue-400">{redirectHint}</code>
                  </p>
                  <Button onClick={handleResend} className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Reenviar Email
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800/90 backdrop-blur-md border-gray-700 shadow-2xl">
                <CardHeader>
                  <h3 className="text-2xl font-bold text-white">
                    {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {isLogin ? 'Entre para continuar' : 'Comece sua jornada hoje'}
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Lock className="inline h-4 w-4 mr-1" />
                        Senha
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                      )}
                    </div>

                    {/* Signup fields */}
                    {!isLogin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <UserIcon className="inline h-4 w-4 mr-1" />
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Seu nome"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Data de Nascimento
                          </label>
                          <CustomDateInputLight
                            value={formData.birth_date}
                            onChange={(value) => {
                              setFormData({ ...formData, birth_date: value });
                              validateField('birth_date', value);
                            }}
                            required={!isLogin}
                          />
                          {errors.birth_date && (
                            <p className="mt-1 text-sm text-red-400">{errors.birth_date}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Shield className="inline h-4 w-4 mr-1" />
                            Função
                          </label>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="athlete">Atleta</option>
                            <option value="coach">Treinador</option>
                            <option value="physiotherapist">Fisioterapeuta</option>
                          </select>
                        </div>

                        {formData.role === 'athlete' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Treinador (opcional)
                            </label>
                            {coachLoading ? (
                              <p className="text-sm text-gray-400">Carregando treinadores...</p>
                            ) : coachAvailable ? (
                              <>
                                <input
                                  type="text"
                                  value={coachQuery}
                                  onChange={(e) => setCoachQuery(e.target.value)}
                                  placeholder="Buscar treinador..."
                                  className="w-full px-4 py-2 mb-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <select
                                  ref={coachSelectRef}
                                  name="coach_id"
                                  value={formData.coach_id}
                                  onChange={(e) => {
                                    setFormData(prev => ({ ...prev, coach_id: e.target.value }));
                                    validateField('coach_id', e.target.value);
                                  }}
                                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                  <option value="">Selecione um treinador</option>
                                  {filteredCoaches.map(c => (
                                    <option key={c.id} value={c.id}>
                                      {c.name} ({c.email})
                                    </option>
                                  ))}
                                </select>
                              </>
                            ) : coachError ? (
                              <p className="text-sm text-yellow-400">{coachError}</p>
                            ) : null}
                            {errors.coach_id && (
                              <p className="mt-1 text-sm text-red-400">{errors.coach_id}</p>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <Button
                      type="submit"
                      disabled={loading || !isFormValid}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                    </Button>

                    <div className="text-center pt-4 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setErrors({});
                        }}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                      >
                        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;