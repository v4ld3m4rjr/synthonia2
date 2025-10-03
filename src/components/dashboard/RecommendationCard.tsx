// [AI Generated] Data: 19/01/2025
// Descrição: Card de recomendações baseadas no readiness score
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React from 'react';
import { Recommendation } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Lightbulb, Clock, Calendar } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      case 'recovery':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      case 'rest':
        return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'text-blue-600';
      case 'recovery':
        return 'text-yellow-600';
      case 'rest':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className={`border ${getBackgroundColor(recommendation.type)} hover:shadow-lg transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <Lightbulb className={`h-6 w-6 ${getIconColor(recommendation.type)}`} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {recommendation.title}
              </h3>
              <span className="text-2xl">{recommendation.icon}</span>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              {recommendation.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Recomendação para hoje</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons based on recommendation type */}
        {recommendation.type === 'training' && (
          <div className="mt-6 flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Registrar Treino
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
              Ver Plano de Treino
            </button>
          </div>
        )}

        {recommendation.type === 'recovery' && (
          <div className="mt-6 flex space-x-3">
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
              Treino de Recuperação
            </button>
            <button className="px-4 py-2 bg-white text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium">
              Exercícios de Mobilidade
            </button>
          </div>
        )}

        {recommendation.type === 'rest' && (
          <div className="mt-6 flex space-x-3">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Técnicas de Relaxamento
            </button>
            <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
              Dicas de Recuperação
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
// AI_GENERATED_CODE_END