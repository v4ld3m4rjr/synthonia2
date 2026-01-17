export function CorrelationMatrix() {
    // Mock Data mimicking the screenshot
    const metrics = ['Ansiedade', 'Obsessão', 'Irritab.', 'Risco', 'Sono'];

    // 1.00 is diagonal. 
    // Values are roughly estimated from screenshot red/green intensity
    const data = [
        [1.00, 0.85, 0.00, 0.78, -0.42], // Ansiedade msg row
        [0.85, 1.00, 0.00, 0.65, -0.42], // Obsessao row
        [0.00, 0.00, 0.00, 0.00, 0.00],  // Irritab row (gray)
        [0.78, 0.65, 0.00, 1.00, -0.45], // Risco row
        [-0.42, -0.42, 0.00, -0.45, 1.00] // Sono row
    ];

    const getColor = (val: number) => {
        if (val === 0) return 'bg-zinc-800 text-zinc-500'; // Neutral/No correlation
        if (val === 1) return 'bg-red-500 text-white'; // Self
        if (val > 0.5) return 'bg-red-500/80 text-white'; // High Positive
        if (val > 0) return 'bg-red-500/40 text-red-100'; // Low Positive
        if (val < 0) return 'bg-green-500 text-white'; // Negative (Green in screenshot)
        return 'bg-zinc-800';
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-medium text-white">Mapa de Correlações</h3>
                <span className="text-xs text-zinc-600 uppercase tracking-widest">PEARSON</span>
            </div>

            <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-1 min-w-[300px]">
                    {/* Header Row */}
                    <div className="h-8"></div> {/* Corner Spacer */}
                    {metrics.map(m => (
                        <div key={m} className="h-8 flex items-end justify-center pb-2">
                            <span className="text-[10px] text-zinc-500 uppercase">{m}</span>
                        </div>
                    ))}

                    {/* Data Rows */}
                    {metrics.map((rowLabel, rowIndex) => (
                        <>
                            {/* Row Label */}
                            <div key={`row-${rowLabel}`} className="h-10 flex items-center justify-end pr-3">
                                <span className="text-[10px] text-zinc-500 uppercase">{rowLabel}</span>
                            </div>

                            {/* Cells */}
                            {data[rowIndex].map((val, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`h-10 rounded-sm flex items-center justify-center text-xs font-medium transition-colors hover:opacity-80 cursor-default ${getColor(val)}`}
                                >
                                    {val.toFixed(2)}
                                </div>
                            ))}
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
