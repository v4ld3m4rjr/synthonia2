// [AI Generated] Data: 19/01/2025
// Descrição: Componente de gráfico de linha usando Canvas API
// Gerado por: Cursor AI
// Versão: React 18.3.1 com Canvas nativo
// AI_GENERATED_CODE_START
import React, { useRef, useEffect } from 'react';

interface DataPoint {
  x: string;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#3B82F6',
  strokeWidth = 3,
  showGrid = true,
  showDots = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar alta resolução
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Padding para o gráfico
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Encontrar min/max values
    const yValues = data.map(d => d.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const yRange = maxY - minY || 1;

    // Desenhar grid
    if (showGrid) {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      
      // Linhas horizontais
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }
      
      // Linhas verticais
      const stepX = chartWidth / (data.length - 1);
      for (let i = 0; i < data.length; i++) {
        const x = padding + stepX * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
      }
    }

    // Desenhar linha
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - ((point.y - minY) / yRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Desenhar pontos
    if (showDots) {
      ctx.fillStyle = color;
      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - ((point.y - minY) / yRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Ponto branco no centro
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = color;
      });
    }

    // Labels do eixo Y
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      const value = maxY - (yRange / 4) * i;
      ctx.fillText(Math.round(value).toString(), padding - 10, y);
    }

  }, [data, width, height, color, strokeWidth, showGrid, showDots]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
      className="rounded-lg"
    />
  );
};
// AI_GENERATED_CODE_END