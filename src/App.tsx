import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AssessmentPage from './pages/Assessment';
import { TrainingForm } from './components/forms/TrainingForm';
import { SpravatoForm } from './components/forms/SpravatoForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rotas de Formulários */}
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/training/new" element={<TrainingForm />} />
        <Route path="/spravato/new" element={<SpravatoForm />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
