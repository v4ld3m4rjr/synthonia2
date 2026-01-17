import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface MetricGaugeProps {
    title: string;
    value: number; // 0 to 100 or specific range
    maxValue?: number;
    unit?: string;
    subtext?: string;
    color?: string;
}

export function MetricGauge({
    title,
    value,
    maxValue = 10,
    unit = '',
    subtext = 'Ideal',
    color = '#3b82f6' // Default blue
}: MetricGaugeProps) {
    const percentage = (value / maxValue) * 100;

    // Data for Recharts RadialBar
    const data = [
        {
            name: 'val',
            value: percentage,
            fill: color,
        },
    ];

    return (
        <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 z-10">
                <h3 className="text-sm font-medium text-white">{title}</h3>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{subtext}</span>
            </div>

            <div className="flex-1 relative flex items-center justify-center min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="80%"
                        outerRadius="100%"
                        barSize={10}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                            background={{ fill: '#27272a' }}
                            dataKey="value"
                            cornerRadius={30} // Rounded caps
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* Value Center Overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[20%] text-center">
                    <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-light text-white">{value}</span>
                        {unit && <span className="text-sm text-zinc-500 ml-1">{unit}</span>}
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-auto pt-4 text-xs text-zinc-600 px-4">
                <span>Baixo</span>
                <span>Ideal</span>
                <span>Alto</span>
            </div>
        </div>
    );
}
