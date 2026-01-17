import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AssessmentPage from './pages/Assessment';

// Modules
import { TrainingForm } from './modules/training/TrainingForm';
import { SpravatoForm } from './modules/spravato/SpravatoForm';
import { EvaluationForm } from './modules/evaluation/EvaluationForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Module Routes */}
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/training/new" element={<TrainingForm />} />
        <Route path="/spravato/new" element={<SpravatoForm />} />
        <Route path="/evaluation" element={<EvaluationForm />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
