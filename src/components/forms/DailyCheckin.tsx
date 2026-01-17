import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { DailyCheckin } from '../../types/assessment';

const dailySchema = z.object({
    sleep_hours: z.coerce.number().min(0).max(24).optional(),
    sleep_quality: z.coerce.number().min(0).max(100),
    stress_level: z.coerce.number().min(0).max(100),
    resting_hr: z.coerce.number().optional(),

    energy_level: z.coerce.number().min(0).max(10),
    depression_mood: z.coerce.number().min(0).max(10),
    mania_euphoria: z.coerce.number().min(0).max(10),
    irritability: z.coerce.number().min(0).max(10),
    anxiety: z.coerce.number().min(0).max(10),
    ocd_thoughts: z.coerce.number().min(0).max(10),
    sensory_overload: z.coerce.number().min(0).max(10),
    social_masking: z.coerce.number().min(0).max(10),
    suicide_risk: z.coerce.number().min(0).max(10),

    meds_taken: z.boolean(),
    notes: z.string().optional(),
});

type DailyCheckinForm = z.infer<typeof dailySchema>;

export function DailyCheckinForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<DailyCheckinForm>({
        resolver: zodResolver(dailySchema) as any,
        defaultValues: {
            sleep_quality: 50,
            stress_level: 50,
            energy_level: 5,
            depression_mood: 0,
            mania_euphoria: 0,
            irritability: 0,
            anxiety: 0,
            ocd_thoughts: 0,
            sensory_overload: 0,
            social_masking: 0,
            suicide_risk: 0,
            meds_taken: false,
        }
    });

    const onSubmit = async (data: DailyCheckinForm) => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const payload: DailyCheckin = {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                ...data
            };

            const { error } = await supabase.from('daily_checkins').upsert(payload, { onConflict: 'user_id,date' });

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            alert('Erro ao salvar check-in diário: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderSlider0to10 = (name: keyof DailyCheckinForm, label: string, colorClass: string = "accent-primary") => (
        <div className="space-y-2 p-4 bg-muted/20 rounded-lg">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-lg font-bold w-8 text-center">{watch(name) as number}</span>
            </div>
            <input
                type="range"
                min="0"
                max="10"
                step="1"
                className={`w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer ${colorClass}`}
                {...register(name)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>10</span>
            </div>
            {errors[name] && <p className="text-sm text-destructive">{errors[name]?.message}</p>}
        </div>
    );

    const renderSlider0to100 = (name: keyof DailyCheckinForm, label: string) => (
        <div className="space-y-2 p-4 bg-muted/20 rounded-lg">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-lg font-bold w-12 text-center">{watch(name) as number}</span>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-blue-500"
                {...register(name)}
            />
            {errors[name] && <p className="text-sm text-destructive">{errors[name]?.message}</p>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
            {/* Biometrics Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Biometria & Sono</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Horas de Sono</label>
                        <Input type="number" step="0.5" {...register('sleep_hours')} placeholder="Ex: 7.5" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">FC Repouso (bpm)</label>
                        <Input type="number" {...register('resting_hr')} placeholder="Ex: 60" />
                    </div>
                    {renderSlider0to100('sleep_quality', 'Qualidade do Sono (0-100)')}
                    {renderSlider0to100('stress_level', 'Nível de Stress Fisiológico (0-100)')}
                </div>
            </div>

            {/* Symptoms Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Autoavaliação de Sintomas (0-10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {renderSlider0to10('energy_level', 'Nível de Energia', 'accent-yellow-500')}
                    {renderSlider0to10('depression_mood', 'Humor Depressivo', 'accent-blue-600')}
                    {renderSlider0to10('mania_euphoria', 'Euforia / Mania', 'accent-orange-500')}
                    {renderSlider0to10('irritability', 'Irritabilidade', 'accent-red-500')}
                    {renderSlider0to10('anxiety', 'Ansiedade', 'accent-purple-500')}
                    {renderSlider0to10('ocd_thoughts', 'Pensamentos Obsessivos (TOC)', 'accent-indigo-500')}
                    {renderSlider0to10('sensory_overload', 'Sobrecarga Sensorial', 'accent-pink-500')}
                    {renderSlider0to10('social_masking', 'Masking Social', 'accent-teal-500')}
                    {renderSlider0to10('suicide_risk', 'Risco de Suicídio', 'accent-red-700')}
                </div>
            </div>

            {/* Routine Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Rotina</h3>
                <div className="flex items-center space-x-2 p-4 bg-muted/20 rounded-lg">
                    <input
                        type="checkbox"
                        id="meds"
                        className="w-5 h-5 accent-primary"
                        {...register('meds_taken')}
                    />
                    <label htmlFor="meds" className="font-medium cursor-pointer">Tomei todas as medicações hoje?</label>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Notas do Dia</label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...register('notes')}
                        placeholder="Gatilhos, eventos importantes ou observações..."
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Salvar Check-in Diário
            </Button>
        </form>
    );
}
