import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PatientDashboard } from '../components/dashboard/PatientDashboard';
import { DoctorDashboard } from '../components/dashboard/DoctorDashboard';
import type { Profile } from '../types';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }

            // Buscar perfil completo
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (error || !data) {
                console.error('Erro ao carregar perfil:', error);
                // Fallback ou tratamento de erro
            } else {
                setProfile(data as Profile);
            }
            setLoading(false);
        }
        loadProfile();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!profile) {
        return <div>Erro ao carregar perfil. Tente recarregar.</div>;
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
             <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={handleLogout} size="sm">
                    Sair
                </Button>
            </div>

            {profile.role === 'doctor' ? (
                <DoctorDashboard userProfile={profile} />
            ) : (
                <PatientDashboard userProfile={profile} />
            )}
        </div>
    );
}
