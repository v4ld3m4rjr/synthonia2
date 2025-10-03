// [AI Generated] Data: 19/01/2025
// Descrição: Header da aplicação com navegação e perfil
// Gerado por: Cursor AI
// Versão: React 18.3.1
// AI_GENERATED_CODE_START
import React, { useState } from 'react';
import { User } from '../../types';
import { Button } from '../ui/Button';
import { Brain, User as UserIcon, Settings, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
  currentView?: string;
  setCurrentView?: (view: 'overview' | 'assessment' | 'analytics' | 'history' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut, currentView, setCurrentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    const badges = {
      athlete: { text: 'Atleta', color: 'bg-blue-100 text-blue-800' },
      coach: { text: 'Treinador', color: 'bg-green-100 text-green-800' },
      physiotherapist: { text: 'Fisioterapeuta', color: 'bg-purple-100 text-purple-800' }
    };
    return badges[role as keyof typeof badges] || badges.athlete;
  };

  const badge = getRoleBadge(user.role);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Synthonia AI
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Recovery & Performance Coach</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentView?.('overview')}
              className={`font-medium transition-colors ${
                currentView === 'overview' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView?.('analytics')}
              className={`font-medium transition-colors ${
                currentView === 'analytics' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Análises
            </button>
            <button 
              onClick={() => setCurrentView?.('history')}
              className={`font-medium transition-colors ${
                currentView === 'history' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Histórico
            </button>
            <button 
              onClick={() => setCurrentView?.('settings')}
              className={`font-medium transition-colors ${
                currentView === 'settings' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Configurações
            </button>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            
            {/* User Info - Hidden on small screens */}
            <div className="hidden lg:block text-right">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                {badge.text}
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                  
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4" />
                    <span onClick={() => setCurrentView?.('settings')}>Configurações</span>
                  </button>
                  
                  <button 
                    onClick={onSignOut}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="space-y-2">
              <button 
                onClick={() => setCurrentView?.('overview')}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView?.('analytics')}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'analytics' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Análises
              </button>
              <button 
                onClick={() => setCurrentView?.('history')}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'history' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Histórico
              </button>
              <button 
                onClick={() => setCurrentView?.('settings')}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Configurações
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Click outside handler for profile menu */}
      {profileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
// AI_GENERATED_CODE_END