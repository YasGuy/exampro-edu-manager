
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrator': return 'bg-red-100 text-red-800';
      case 'director': return 'bg-purple-100 text-purple-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-[#22C55E]/10 text-[#22C55E]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrator': return 'ADMINISTRATEUR';
      case 'director': return 'DIRECTEUR';
      case 'teacher': return 'ENSEIGNANT';
      case 'student': return 'ÉTUDIANT';
      default: return role?.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter">
      <header className="bg-[#1E293B] shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white font-inter uppercase">ExamPro</h1>
              <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role || '')}`}>
                {getRoleLabel(user?.role || '')}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-[#6B7280]" />
                <span className="text-sm text-white font-inter">{user?.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-1 bg-[#22C55E] text-white border-[#22C55E] hover:bg-[#22C55E]/90 font-inter"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
