import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function StatusCard() {
    const navigate = useNavigate();

    return (
        <div className="w-full p-6 rounded-xl bg-card border border-border flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <div className="w-4 h-4 rounded-full bg-zinc-800" />
                </div>
                <div>
                    <h3 className="font-medium text-white">Status de Hoje</h3>
                    <p className="text-sm text-zinc-500">Complete seu questionário diário</p>
                </div>
            </div>

            <Button
                onClick={() => navigate('/assessment')}
                className="bg-white text-black hover:bg-zinc-200 font-semibold text-xs px-6 tracking-wide"
            >
                RESPONDER
            </Button>
        </div>
    );
}
