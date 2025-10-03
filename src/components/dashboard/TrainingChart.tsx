// [AI Generated] Data: 19/01/2025
// Descrição: Componente de gráfico para visualizar dados de treinamento
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React from 'react';
import { LineChart } from '../charts/LineChart';

interface DataPoint {
  x: string;
  y: number;
}

interface TrainingChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
}

const TrainingChart: React.FC<TrainingChartProps> = ({ 
  data, 
  title, 
  color = '#3B82F6' 
}) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">Sem dados disponíveis</p>
          <p className="text-sm">Complete algumas avaliações para ver o gráfico</p>
        </div>
      </div>
    );
  }

  // Processar dados para últimos 14 pontos
  const processedData = data
    .slice(-14)
    .map(point => ({
      x: new Date(point.x).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      y: point.y
    }));

  return (
    <div className="w-full">
      <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>
      <LineChart 
        data={processedData}
        width={400}
        height={200}
        color={color}
        showGrid={true}
        showDots={true}
      />
    </div>
  );
};

export default TrainingChart;
// AI_GENERATED_CODE_END