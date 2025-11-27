import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNavigate } from 'react-router-dom';

const assessmentSchema = z.object({
    sleep_quality: z.coerce.number().min(1).max(10),
    fatigue: z.coerce.number().min(1).max(10),
    soreness: z.coerce.number().min(1).max(10),
    stress: z.coerce.number().min(1).max(10),
    mood: z.coerce.number().min(1).max(10),
    resting_hr: z.coerce.number().optional(),
    hrv: z.coerce.number().optional(),
    notes: z.string().optional(),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

export function DailyAssessment() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<AssessmentFormData>({
        resolver: zodResolver(assessmentSchema) as any,
        defaultValues: {
            sleep_quality: 5,
            fatigue: 5,
            soreness: 5,
            stress: 5,
            mood: 5,
        }
    });

    const onSubmit = async (data: AssessmentFormData) => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { error } = await supabase.from('daily_assessments').insert({
                athlete_id: user.id,
                date: new Date().toISOString().split('T')[0],
                ...data
            });

            if (error) throw error;
            navigate('/dashboard');
        } catch (error: any) {
            alert('Erro ao salvar avaliação: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSlider = (name: keyof AssessmentFormData, label: string) => (
        <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-sm text-muted-foreground">1-10</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                step="1"
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                {...register(name)}
            />
            {errors[name] && (
                <p className="text-sm text-destructive">{errors[name]?.message}</p>
            )}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Avaliação Diária</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderSlider('sleep_quality', 'Qualidade do Sono')}
                    {renderSlider('fatigue', 'Nível de Fadiga')}
                    {renderSlider('soreness', 'Dor Muscular')}
                    {renderSlider('stress', 'Nível de Estresse')}
                    {renderSlider('mood', 'Humor / Disposição')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">FC Repouso (bpm)</label>
                        <Input type="number" {...register('resting_hr')} placeholder="Ex: 60" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">HRV (ms)</label>
                        <Input type="number" {...register('hrv')} placeholder="Ex: 50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Notas</label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('notes')}
                        placeholder="Como você está se sentindo hoje?"
                    />
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Salvar Avaliação
                </Button>
            </form>
        </div>
    );
}
