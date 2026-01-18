import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Header } from '../components/dashboard/Header';

export function AppLayout() {
    return (
        <div className="min-h-screen bg-background text-white flex">
            {/* Persistent Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-background">
                <div className="max-w-[1200px] mx-auto space-y-6">
                    {/* Persistent Header (or contextual, can be adjusted) */}
                    <Header userName="Valdemar" streakDays={12} />

                    {/* The active route's content will be rendered here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
