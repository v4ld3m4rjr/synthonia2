import { BarChart, Bar, ResponsiveContainer, XAxis } from 'recharts';

const data = [
    { score: 1, count: 2 },
    { score: 2, count: 4 },
    { score: 3, count: 6 },
    { score: 4, count: 8 },
    { score: 5, count: 12 },
    { score: 6, count: 18 },
    { score: 7, count: 20 }, // Peak
    { score: 8, count: 24 }, // Peak
    { score: 9, count: 10 },
    { score: 10, count: 5 },
];

export function AnxietyDistributionChart() {
    return (
        <div className="bg-card border border-border rounded-xl p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-white">Distribuição da Ansiedade</h3>
                <span className="text-xs text-zinc-600 uppercase tracking-widest">CURVA DE GAUSS</span>
            </div>

            <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="score"
                            stroke="#52525b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Bar
                            dataKey="count"
                            fill="#ef4444"
                            radius={[2, 2, 0, 0]}
                            opacity={0.8}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
