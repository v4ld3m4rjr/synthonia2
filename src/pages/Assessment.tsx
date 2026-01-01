import { DailyAssessment } from '../components/forms/DailyAssessment';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AssessmentPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-2xl mx-auto mb-6">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 pl-0">
                    <ArrowLeft size={16} /> Voltar para Dashboard
                </Button>
            </div>
            <DailyAssessment />
        </div>
    );
}
