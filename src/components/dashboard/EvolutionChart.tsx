import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { day: '14/01', ansiedade: 4, energia: 6, risco: 2, hrv: 7 },
    { day: '15/01', ansiedade: 3, energia: 7, risco: 1, hrv: 8 },
    { day: '16/01', ansiedade: 5, energia: 5, risco: 3, hrv: 6 },
    { day: '17/01', ansiedade: 2, energia: 8, risco: 0, hrv: 8 },
];

export function EvolutionChart() {
    return (
        <div className="bg-card border border-border rounded-xl p-6 h-[350px] w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-medium text-white">Evolução dos Marcadores</h3>
                <div className="flex gap-4">
                    {/* Legend items could go here visually if custom */}
                </div>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="day"
                        stroke="#52525b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#52525b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 10]}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
                        itemStyle={{ fontSize: '12px' }}
                    />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="ansiedade" name="Ansiedade" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="energia" name="Energia" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="risco" name="Risco" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="hrv" name="HRV" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
