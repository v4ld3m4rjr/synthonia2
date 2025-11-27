import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) navigate('/auth');
            setUser(user);
        });
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <Button onClick={handleLogout} variant="outline">Sair</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Bem-vindo</h3>
                        <p className="text-muted-foreground">Olá, {user.user_metadata.full_name || user.email}</p>
                    </div>
                    {/* Add more widgets here */}
                </div>
            </div>
        </div>
    );
}
