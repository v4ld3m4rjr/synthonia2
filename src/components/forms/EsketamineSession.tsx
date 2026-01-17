import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { EsketamineSession } from '../../types/assessment';

const TRIP_TAGS = [
    "Mística", "Reveladora", "Assustadora", "Neutra", "Confusa", "Eufórica", "Triste", "Visual"
];

export function EsketamineSessionForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { register, handleSubmit } = useForm();

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const payload: EsketamineSession = {
                user_id: user.id,
                date: new Date().toISOString().split('T')[0],
                dose_mg: Number(data.dose_mg),
                bp_pre_systolic: Number(data.bp_pre_systolic),
                bp_pre_diastolic: Number(data.bp_pre_diastolic),
                bp_post_systolic: Number(data.bp_post_systolic),
                bp_post_diastolic: Number(data.bp_post_diastolic),
                dissociation_level: Number(data.dissociation_level),
                physical_discomfort: Number(data.physical_discomfort),
                trip_quality: selectedTags.join(', '),
                insights: data.insights,
                humor_24h_later: Number(data.humor_24h_later),
            };

            const { error } = await supabase.from('esketamine_sessions').insert(payload); // Insert every session, not upsert

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            alert('Erro ao salvar sessão: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
            {/* Medical Data */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Dados Clínicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dose Administrada (mg)</label>
                        <Input type="number" {...register('dose_mg')} placeholder="Ex: 56 or 84" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">PA Pré-Sessão</label>
                        <div className="flex gap-2 items-center">
                            <Input type="number" {...register('bp_pre_systolic')} placeholder="SIS" />
                            <span>/</span>
                            <Input type="number" {...register('bp_pre_diastolic')} placeholder="DIA" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">PA Pós-Sessão</label>
                        <div className="flex gap-2 items-center">
                            <Input type="number" {...register('bp_post_systolic')} placeholder="SIS" />
                            <span>/</span>
                            <Input type="number" {...register('bp_post_diastolic')} placeholder="DIA" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Experiência Subjetiva</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nível de Dissociação (0-10)</label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple-500"
                            {...register('dissociation_level')}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Desconforto Físico / Náusea (0-10)</label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-red-500"
                            {...register('physical_discomfort')}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Qualidade da "Viagem"</label>
                    <div className="flex flex-wrap gap-2">
                        {TRIP_TAGS.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors border ${selectedTags.includes(tag)
                                    ? 'bg-purple-500 text-white border-purple-500'
                                    : 'bg-background hover:bg-secondary border-input'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Insights / Ideias</label>
                    <textarea
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...register('insights')}
                        placeholder="O que você percebeu ou sentiu..."
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Registrar Sessão
            </Button>
        </form>
    );
}
