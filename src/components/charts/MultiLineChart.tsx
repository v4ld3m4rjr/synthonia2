import React, { useRef, useEffect, useState } from 'react';

interface DataPoint {
  x: string;
  y: number;
}

interface DataSeries {
  name: string;
  data: DataPoint[];
  color?: string;
}

interface MultiLineChartProps {
  series: DataSeries[];
  width?: number | string;
  height?: number;
  showGrid?: boolean;
  showDots?: boolean;
  showLegend?: boolean;
  darkTheme?: boolean;
}

function MultiLineChart({
  series,
  width = '100%',
  height = 300,
  showGrid = true,
  showDots = true,
  showLegend = true,
  darkTheme = false
}: MultiLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const actualWidth = typeof width === 'string' ? container.offsetWidth : width;
    const actualHeight = height;

    if ((actualWidth as number) <= 0 || actualHeight <= 0) {
      if (import.meta.env.DEV) {
        console.warn('MultiLineChart - Dimensões inválidas:', { actualWidth, actualHeight });
      }
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = (actualWidth as number) * dpr;
    canvas.height = actualHeight * dpr;
    canvas.style.width = `${actualWidth}px`;
    canvas.style.height = `${actualHeight}px`;
    ctx.scale(dpr, dpr);

    // Cores padrão para as séries
    const defaultColors = [
      '#3b82f6', // blue-500
      '#ef4444', // red-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#06b6d4', // cyan-500
      '#f97316', // orange-500
    ];



    return (
      <div ref={containerRef} className="w-full">
        <canvas ref={canvasRef} className="rounded-lg w-full" />
      </div>
    );
  }, [series, width, height, showGrid, showDots, showLegend, darkTheme, containerWidth]);

  // Observa mudanças de tamanho do contêiner para tornar o canvas responsivo
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Inicializa com a largura atual
    setContainerWidth(container.offsetWidth);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = Math.floor(entry.contentRect.width);
        setContainerWidth((prev) => (prev !== newWidth ? newWidth : prev));
      }
    });

    ro.observe(container);

    const handleWindowResize = () => {
      if (containerRef.current) {
        const newWidth = Math.floor(containerRef.current.offsetWidth);
        setContainerWidth((prev) => (prev !== newWidth ? newWidth : prev));
      }
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="rounded-lg w-full" />
    </div>
  );
}

export default MultiLineChart;
export { MultiLineChart };