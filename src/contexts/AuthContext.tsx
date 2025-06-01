
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

// Hardcoded users for demo purposes
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@exampro.com',
    password: 'admin123',
    role: 'administrator',
    name: 'System Administrator'
  },
  {
    id: '2',
    email: 'director@exampro.com',
    password: 'director123',
    role: 'director',
    name: 'Academic Director'
  },
  {
    id: '3',
    email: 'teacher@exampro.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'John Teacher'
  },
  {
    id: '4',
    email: 'marie@etudiant.com',
    password: 'student123',
    role: 'student',
    name: 'Marie Dubois'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
