import { LayoutDashboard, FileText, History, Lightbulb, LogOut, Disc } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'assessment', label: 'Questionário', icon: FileText, path: '/assessment' },
    { id: 'history', label: 'Histórico', icon: History, path: '/history' },
    { id: 'insights', label: 'Insights', icon: Lightbulb, path: '/insights' },
];

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    return (
        <div className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
            {/* Logo Area */}
            <div className="p-8 pb-12 flex items-center gap-3">
                <Disc className="w-6 h-6 text-white" />
                <span className="text-sm font-medium tracking-[0.2em] text-white">SYNTHONIA</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-zinc-800 text-white'
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                                }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg text-sm transition-colors"
                >
                    <LogOut size={18} />
                    Sair
                </button>
            </div>
        </div>
    );
}
