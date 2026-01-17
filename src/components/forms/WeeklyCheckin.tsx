import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WeeklyCheckin } from '../../types/assessment';

const PHQ9_QUESTIONS = [
    "Pouco interesse ou prazer em fazer as coisas?",
    "Sentir-se triste, deprimido ou sem esperança?",
    "Dificuldade para adormecer, permanecer dormindo ou dormir demais?",
    "Sentir-se cansado ou com pouca energia?",
    "Falta de apetite ou comendo demais?",
    "Sentir-se mal consigo mesmo (fracasso ou decepção)?",
    "Dificuldade para se concentrar (ler jornal ou ver TV)?",
    "Mover-se ou falar tão devagar que notaram? Ou estar agitado demais?",
    "Pensamentos de que seria melhor estar morto ou de se ferir?"
];

const GAD7_QUESTIONS = [
    "Sentir-se nervoso, ansioso ou muito tenso?",
    "Não ser capaz de impedir ou controlar as preocupações?",
    "Preocupar-se muito com diversas coisas diferentes?",
    "Dificuldade para relaxar?",
    "Estar tão agitado que se torna difícil ficar parado?",
    "Ficar facilmente irritado ou chateado?",
    "Sentir medo como se algo terrível fosse acontecer?"
];

const ASRM_QUESTIONS = [
    {
        label: "Humor",
        options: [
            "0 - Normal / Não deprimido",
            "1 - Mais feliz que o normal",
            "2 - Muito feliz / animado",
            "3 - Exultante / Romântico",
            "4 - Eufórico / Rindo sem parar"
        ]
    },
    {
        label: "Autoestima",
        options: [
            "0 - Normal",
            "1 - Mais confiante",
            "2 - Sinto que sou especial / melhor",
            "3 - Tenho poderes / habilidades únicas",
            "4 - Sou um enviado de Deus / Missão especial"
        ]
    },
    {
        label: "Sono",
        options: [
            "0 - Normal",
            "1 - Preciso de menos sono",
            "2 - Durmo pouco e me sinto ótimo",
            "3 - Não preciso dormir",
            "4 - Não durmo há dias e não canso"
        ]
    },
    {
        label: "Fala",
        options: [
            "0 - Normal",
            "1 - Mais falante",
            "2 - Falo rápido / interrompo",
            "3 - Falo sem parar / ninguém entende",
            "4 - Pensamentos correndo / fala incoerente"
        ]
    },
    {
        label: "Atividade",
        options: [
            "0 - Normal",
            "1 - Mais ativo socialmente / trabalho",
            "2 - Muitos planos / projetos novos",
            "3 - Hiperativo / sexo excessivo / gastos",
            "4 - Agitação psicomotora constante"
        ]
    }
];

export function WeeklyCheckinForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [phq9Answers, setPhq9Answers] = useState<number[]>(new Array(9).fill(0));
    const [gad7Answers, setGad7Answers] = useState<number[]>(new Array(7).fill(0));
    const [asrmAnswers, setAsrmAnswers] = useState<number[]>(new Array(5).fill(0));

    const { register, handleSubmit } = useForm();
    const scores = {
        phq9: phq9Answers.reduce((a, b) => a + b, 0),
        gad7: gad7Answers.reduce((a, b) => a + b, 0),
        asrm: asrmAnswers.reduce((a, b) => a + b, 0),
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

            const payload: WeeklyCheckin = {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                phq9_score: scores.phq9,
                gad7_score: scores.gad7,
                asrm_score: scores.asrm,
                weight_kg: Number(data.weight_kg) || undefined,
                treatment_satisfaction: Number(data.treatment_satisfaction),
            };

            const { error } = await supabase.from('weekly_checkins').upsert(payload, { onConflict: 'user_id,date' });

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            alert('Erro ao salvar check-in semanal: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderScale0to3 = (question: string, index: number, currentAnswers: number[], setAnswers: any) => (
        <div key={index} className="p-4 bg-muted/20 rounded-lg space-y-3">
            <p className="font-medium text-sm">{question}</p>
            <div className="flex gap-2 flex-wrap">
                {[0, 1, 2, 3].map((val) => (
                    <button
                        key={val}
                        type="button"
                        onClick={() => handleAnswerChange(index, val, setAnswers, currentAnswers)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors border ${currentAnswers[index] === val
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-input'
                            }`}
                    >
                        {val}
                        <span className="block text-[10px] opacity-70">
                            {val === 0 && " Nenhuma vez"}
                            {val === 1 && " Vários dias"}
                            {val === 2 && " > Metade dias"}
                            {val === 3 && " Quase todo dia"}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
            {/* PHQ-9 Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">PHQ-9 (Depressão)</h3>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Score: {scores.phq9}</span>
                </div>
                <div className="space-y-3">
                    {PHQ9_QUESTIONS.map((q, i) => renderScale0to3(q, i, phq9Answers, setPhq9Answers))}
                </div>
            </div>

            {/* GAD-7 Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">GAD-7 (Ansiedade)</h3>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Score: {scores.gad7}</span>
                </div>
                <div className="space-y-3">
                    {GAD7_QUESTIONS.map((q, i) => renderScale0to3(q, i, gad7Answers, setGad7Answers))}
                </div>
            </div>

            {/* ASRM Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">ASRM (Mania)</h3>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Score: {scores.asrm}</span>
                </div>
                <div className="space-y-4">
                    {ASRM_QUESTIONS.map((item, i) => (
                        <div key={i} className="p-4 bg-muted/20 rounded-lg space-y-3">
                            <p className="font-medium text-sm">{item.label}</p>
                            <div className="flex flex-col gap-2">
                                {item.options.map((option, val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handleAnswerChange(i, val, setAsrmAnswers, asrmAnswers)}
                                        className={`text-left py-2 px-3 rounded-md text-sm transition-colors border ${asrmAnswers[i] === val
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background hover:bg-muted border-input'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* General Section */}
            <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold">Dados Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Peso Corporal (kg)</label>
                        <Input type="number" step="0.1" {...register('weight_kg')} placeholder="Ex: 75.5" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Satisfação com Tratamento (0-10)</label>
                        <Input
                            type="number"
                            min="0"
                            max="10"
                            {...register('treatment_satisfaction', { required: true, min: 0, max: 10 })}
                            placeholder="0 a 10"
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Salvar Check-in Semanal
            </Button>
        </form>
    );
}
