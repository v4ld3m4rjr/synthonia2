// [AI Generated] Data: 19/01/2025
// Descrição: Tela de autenticação com login e cadastro
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React, { useState } from 'react';
import { authHelpers } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Activity, Brain, Target, Users, Award, TrendingUp } from 'lucide-react';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'athlete' as 'athlete' | 'coach' | 'physiotherapist',
    coach_id: ''
  });

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
        const { error } = await authHelpers.signUp(formData.email, formData.password, {
          name: formData.name,
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
        }
      }
    } catch (error) {
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Synthonia AI
              </h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
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
                        ID do Treinador (opcional)
                      </label>
                      <input
                        type="text"
                        name="coach_id"
                        value={formData.coach_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Deixe vazio se não tiver treinador"
                      />
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
                />
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
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-lg font-semibold"
                size="lg"
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

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

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center space-y-2 hover:bg-white/70 transition-colors">
      <div className="flex justify-center">{icon}</div>
      <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
      <p className="text-xs text-gray-600 leading-tight">{description}</p>
    </div>
  );
};

export default AuthScreen;
// AI_GENERATED_CODE_END