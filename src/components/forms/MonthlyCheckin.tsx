import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { MonthlyCheckin } from '../../types/assessment';

const FAST_QUESTIONS = [
    { key: 'fast_autonomy', label: "Autonomia (Banho, vestir, comer sozinho)" },
    { key: 'fast_work', label: "Trabalho (Manter emprego, desempenho)" },
    { key: 'fast_cognition', label: "Cognição (Concentração, memória)" },
    { key: 'fast_finance', label: "Finanças (Gerir dinheiro, gastos)" },
    { key: 'fast_relations', label: "Relações (Família, amigos)" },
    { key: 'fast_leisure', label: "Lazer (Hobbies, esportes)" },
];

const YBOCS_QUESTIONS = [
    "Tempo Ocupado (Quanto tempo gasta com pensamentos/rituais?)",
    "Interferência (O quanto atrapalha sua vida?)",
    "Angústia (O quanto te deixa ansioso?)",
    "Resistência (O quanto tenta lutar contra?)",
    "Controle (O quanto consegue controlar?)"
];

export function MonthlyCheckinForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [fastAnswers, setFastAnswers] = useState<number[]>(new Array(6).fill(0));
    const [ybocsAnswers, setYbocsAnswers] = useState<number[]>(new Array(5).fill(0));

    const { register, handleSubmit } = useForm();

    const scores = {
        fast: fastAnswers.reduce((a, b) => a + b, 0),
        ybocs: ybocsAnswers.reduce((a, b) => a + b, 0),
    };

    const handleAnswerChange = (
        index: number,
        value: number,
        setAnswers: React.Dispatch<React.SetStateAction<number[]>>,
        currentAnswers: number[]
    ) => {
        const newAnswers = [...currentAnswers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const payload: MonthlyCheckin = {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                fast_autonomy: fastAnswers[0],
                fast_work: fastAnswers[1],
                fast_cognition: fastAnswers[2],
                fast_finance: fastAnswers[3],
                fast_relations: fastAnswers[4],
                fast_leisure: fastAnswers[5],
                fast_total_score: scores.fast,
                work_absences: Number(data.work_absences) || 0,
                ybocs_score: scores.ybocs,
                eq5d_score: Number(data.eq5d_score),
                tsqm_score: Number(data.tsqm_score),
            };

            const { error } = await supabase.from('monthly_checkins').upsert(payload, { onConflict: 'user_id,date' });

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            alert('Erro ao salvar check-in mensal: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderFastItem = (item: typeof FAST_QUESTIONS[0], index: number) => (
        <div key={item.key} className="p-4 bg-muted/20 rounded-lg space-y-3">
            <p className="font-medium text-sm">{item.label}</p>
            <div className="flex gap-2">
                {[0, 1, 2, 3].map((val) => (
                    <button
                        key={val}
                        type="button"
                        onClick={() => handleAnswerChange(index, val, setFastAnswers, fastAnswers)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors border ${fastAnswers[index] === val
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-input'
                            }`}
                    >
                        {val}
                        <span className="block text-[10px] opacity-70">
                            {val === 0 && " Sem dificuldade"}
                            {val === 1 && " Leve"}
                            {val === 2 && " Moderada"}
                            {val === 3 && " Grave"}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderYbocsItem = (question: string, index: number) => (
        <div key={index} className="p-4 bg-muted/20 rounded-lg space-y-3">
            <p className="font-medium text-sm">{question}</p>
            <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((val) => (
                    <button
                        key={val}
                        type="button"
                        onClick={() => handleAnswerChange(index, val, setYbocsAnswers, ybocsAnswers)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors border ${ybocsAnswers[index] === val
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-input'
                            }`}
                    >
                        {val}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
            {/* FAST Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">FAST (Funcionalidade)</h3>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Score: {scores.fast}</span>
                </div>
                <div className="space-y-3">
                    {FAST_QUESTIONS.map((q, i) => renderFastItem(q, i))}
                </div>
                <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Faltas no Trabalho (dias/mês)</label>
                    <Input type="number" {...register('work_absences')} placeholder="0" />
                </div>
            </div>

            {/* Y-BOCS Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">Y-BOCS (TOC)</h3>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Score: {scores.ybocs}</span>
                </div>
                <div className="space-y-3">
                    {YBOCS_QUESTIONS.map((q, i) => renderYbocsItem(q, i))}
                </div>
            </div>

            {/* Quality of Life Section */}
            <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Qualidade de Vida</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">EQ-5D (Termômetro de Saúde 0-100)</label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            {...register('eq5d_score', { required: true, min: 0, max: 100 })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">TSQM (Satisfação Medicação 0-100)</label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            {...register('tsqm_score', { required: true, min: 0, max: 100 })}
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Salvar Check-in Mensal
            </Button>
        </form>
    );
}
