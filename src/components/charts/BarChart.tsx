// [AI Generated] Data: 19/01/2025
// Descrição: Componente de gráfico de barras usando Canvas API
// Gerado por: Cursor AI
// Versão: React 18.3.1 com Canvas nativo
// AI_GENERATED_CODE_START
import React, { useRef, useEffect } from 'react';

interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarDataPoint[];
  width?: number;
  height?: number;
  showValues?: boolean;
  spacing?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 200,
  showValues = true,
  spacing = 10
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

    // Padding
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Encontrar valor máximo
    const maxValue = Math.max(...data.map(d => d.value));
    const scale = chartHeight / maxValue;

    // Calcular largura das barras
    const totalSpacing = spacing * (data.length - 1);
    const barWidth = (chartWidth - totalSpacing) / data.length;

    // Desenhar barras
    data.forEach((item, index) => {
      const x = padding + index * (barWidth + spacing);
      const barHeight = item.value * scale;
      const y = padding + chartHeight - barHeight;

      // Cor da barra
      const barColor = item.color || '#3B82F6';
      
      // Gradiente para a barra
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, barColor);
      gradient.addColorStop(1, barColor + '80');

      // Desenhar barra
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Borda da barra
      ctx.strokeStyle = barColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barWidth, barHeight);

      // Valor no topo da barra
      if (showValues) {
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(
          item.value.toString(),
          x + barWidth / 2,
          y - 5
        );
      }

      // Label no eixo X
      ctx.fillStyle = '#6B7280';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(
        item.label,
        x + barWidth / 2,
        padding + chartHeight + 10
      );
    });

    // Linha do eixo X
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

  }, [data, width, height, showValues, spacing]);

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