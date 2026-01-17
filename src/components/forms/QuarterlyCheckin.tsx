import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { QuarterlyCheckin } from '../../types/assessment';
import { ExternalLink } from 'lucide-react';

export function QuarterlyCheckinForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const payload: QuarterlyCheckin = {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                raads_r_score: Number(data.raads_r_score) || undefined,
                cat_q_score: Number(data.cat_q_score) || undefined,
                burnout_index: Number(data.burnout_index) || undefined,
            };

            const { error } = await supabase.from('quarterly_checkins').upsert(payload, { onConflict: 'user_id,date' });

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            alert('Erro ao salvar check-in trimestral: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-blue-500/10 p-4 rounded-lg text-sm text-blue-500 border border-blue-500/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ExternalLink size={16} />
                    Testes Externos
                </h4>
                <p>
                    Para o RAADS-R e CAT-Q, realize os testes nos sites recomendados e insira apenas o resultado final abaixo.
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium flex justify-between">
                        Pontuação Total RAADS-R
                        <a
                            href="https://embrace-autism.com/raads-r/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            Fazer teste online <ExternalLink size={10} />
                        </a>
                    </label>
                    <Input type="number" {...register('raads_r_score')} placeholder="Insira o resultado numérico" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex justify-between">
                        Pontuação Total CAT-Q (Camuflagem)
                        <a
                            href="https://embrace-autism.com/cat-q/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            Fazer teste online <ExternalLink size={10} />
                        </a>
                    </label>
                    <Input type="number" {...register('cat_q_score')} placeholder="Insira o resultado numérico" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Índice de Burnout (Autoavaliação 0-10)</label>
                    <div className="p-4 bg-muted/20 rounded-lg">
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-orange-500"
                            {...register('burnout_index')}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>0 (Sem esgotamento)</span>
                            <span>10 (Esgotamento total)</span>
                        </div>
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Salvar Check-in Trimestral
            </Button>
        </form>
    );
}
