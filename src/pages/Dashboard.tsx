import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, Activity, TrendingUp, Moon } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }
            setUser(user);

            const { data } = await supabase
                .from('daily_assessments')
                .select('*')
                .eq('athlete_id', user.id)
                .order('date', { ascending: true })
                .limit(7);

            if (data) setAssessments(data);
            setLoading(false);
        }
        loadData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    if (loading) return <div className="p-8 text-center">Carregando...</div>;

    const lastAssessment = assessments[assessments.length - 1];
    const readinessScore = lastAssessment?.readiness_score || '-';

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Bem-vindo, {user?.user_metadata?.full_name || 'Atleta'}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate('/assessment')} className="gap-2">
                        <PlusCircle size={16} /> Nova Avaliação
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>Sair</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Readiness Score</p>
                            <h3 className="text-2xl font-bold">{readinessScore}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-full text-accent-foreground">
                            <Moon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Último Sono</p>
                            <h3 className="text-2xl font-bold">{lastAssessment?.sleep_quality || '-'} / 10</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Carga Crônica</p>
                            <h3 className="text-2xl font-bold">-</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Tendência de Readiness</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={assessments}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--muted-foreground)"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                />
                                <YAxis stroke="var(--muted-foreground)" domain={[0, 10]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="readiness_score"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: 'var(--primary)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">Histórico Recente</h3>
                    <div className="space-y-4">
                        {assessments.slice().reverse().map((assessment) => (
                            <div key={assessment.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors">
                                <div>
                                    <p className="font-medium">{new Date(assessment.date).toLocaleDateString('pt-BR')}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sono: {assessment.sleep_quality} | Humor: {assessment.mood}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-bold">
                                        {assessment.readiness_score}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {assessments.length === 0 && (
                            <p className="text-muted-foreground text-center py-8">Nenhuma avaliação registrada.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
