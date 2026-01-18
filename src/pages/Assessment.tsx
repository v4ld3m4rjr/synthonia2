import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Activity, BarChart2, PieChart, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DailyCheckinForm } from '../components/forms/DailyCheckin';
import { WeeklyCheckinForm } from '../components/forms/WeeklyCheckin';
import { MonthlyCheckinForm } from '../components/forms/MonthlyCheckin';
import { QuarterlyCheckinForm } from '../components/forms/QuarterlyCheckin';
import { EsketamineSessionForm } from '../components/forms/EsketamineSession';

type AssessmentType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'esketamine';

export default function AssessmentPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AssessmentType>('daily');

    const handleSuccess = () => {
        // Maybe show a toast or confusion
        alert('Assessment salvo com sucesso!');
        navigate('/dashboard');
    };

    const tabs = [
        { id: 'daily', label: 'Diário', icon: Calendar },
        { id: 'weekly', label: 'Semanal', icon: Activity },
        { id: 'monthly', label: 'Mensal', icon: BarChart2 },
        { id: 'quarterly', label: 'Trimestral', icon: PieChart },
        { id: 'esketamine', label: 'Esketamine', icon: Zap },
    ];


    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-white">Check-in de Saúde</h1>
                <p className="text-zinc-500">
                    Selecione o tipo de avaliação que deseja realizar hoje.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 p-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as AssessmentType)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${isActive
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
                {activeTab === 'daily' && (
                    <div>
                        <div className="mb-6 pb-6 border-b">
                            <h2 className="text-2xl font-semibold">Check-in Diário</h2>
                            <p className="text-muted-foreground">Monitoramento rápido de sono, humor e sintomas.</p>
                        </div>
                        <DailyCheckinForm onSuccess={handleSuccess} />
                    </div>
                )}

                {activeTab === 'weekly' && (
                    <div>
                        <div className="mb-6 pb-6 border-b">
                            <h2 className="text-2xl font-semibold">Check-in Semanal</h2>
                            <p className="text-muted-foreground">Escalas clínicas para depressão (PHQ-9), ansiedade (GAD-7) e mania (ASRM).</p>
                        </div>
                        <WeeklyCheckinForm onSuccess={handleSuccess} />
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <div>
                        <div className="mb-6 pb-6 border-b">
                            <h2 className="text-2xl font-semibold">Check-in Mensal</h2>
                            <p className="text-muted-foreground">Avaliação de funcionalidade (FAST), TOC (Y-BOCS) e qualidade de vida.</p>
                        </div>
                        <MonthlyCheckinForm onSuccess={handleSuccess} />
                    </div>
                )}

                {activeTab === 'quarterly' && (
                    <div>
                        <div className="mb-6 pb-6 border-b">
                            <h2 className="text-2xl font-semibold">Check-in Trimestral</h2>
                            <p className="text-muted-foreground">Monitoramento de longo prazo para traços de espectro e burnout.</p>
                        </div>
                        <QuarterlyCheckinForm onSuccess={handleSuccess} />
                    </div>
                )}

                {activeTab === 'esketamine' && (
                    <div>
                        <div className="mb-6 pb-6 border-b">
                            <h2 className="text-2xl font-semibold">Sessão de Esketamina</h2>
                            <p className="text-muted-foreground">Registro clínico e fenomenológico das sessões.</p>
                        </div>
                        <EsketamineSessionForm onSuccess={handleSuccess} />
                    </div>
                )}
            </div>
        </div>
    );
}
