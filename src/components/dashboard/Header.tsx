import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface HeaderProps {
    userName?: string;
    streakDays?: number;
}

export function Header({ userName = 'Valdemar', streakDays = 0 }: HeaderProps) {
    const today = new Date();
    const dateStr = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
    // Capitalize first letter
    const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    return (
        <header className="flex justify-between items-start mb-8">
            <div>
                <h1 className="text-3xl font-light text-white mb-1">
                    Bem-vindo, <span className="font-semibold">{userName}</span>
                </h1>
                <p className="text-zinc-500 text-sm">
                    {formattedDate}
                </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md">
                <Star className="w-4 h-4 text-zinc-400" fill="currentColor" />
                <span className="text-sm font-medium text-zinc-300">{streakDays} dias</span>
            </div>
        </header>
    );
}
