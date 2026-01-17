import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AssessmentPage from './pages/Assessment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<AssessmentPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
