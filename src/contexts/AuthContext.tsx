
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';

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

  // Check for stored auth on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.user && authData.token) {
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with backend API...');
      
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Store auth data in localStorage
        const authData = {
          user: data.user,
          token: data.token
        };
        localStorage.setItem('auth', JSON.stringify(authData));
        
        setUser(data.user);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to demo users for development
      console.log('Falling back to demo users...');
      const DEMO_USERS: User[] = [
        {
          id: '1',
          email: 'admin@exampro.com',
          password: 'AdminSecure2024!',
          role: 'administrator',
          name: 'System Administrator'
        },
        {
          id: '2',
          email: 'director@exampro.com',
          password: 'DirectorPass2024!',
          role: 'director',
          name: 'Academic Director'
        },
        {
          id: '3',
          email: 'teacher@exampro.com',
          password: 'TeacherKey2024!',
          role: 'teacher',
          name: 'John Teacher'
        },
        {
          id: '4',
          email: 'marie@etudiant.com',
          password: 'StudentAccess2024!',
          role: 'student',
          name: 'Marie Dubois'
        }
      ];

      const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser(foundUser);
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
