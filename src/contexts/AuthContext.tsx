
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
    console.log('AuthProvider mounted, checking for stored auth...');
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        console.log('Found stored auth data:', authData);
        if (authData.user && authData.token) {
          setUser(authData.user);
          console.log('User restored from localStorage:', authData.user);
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem('auth');
      }
    } else {
      console.log('No stored auth found');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with backend API for:', email);
      
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
        
        // Try demo users as fallback
        console.log('Falling back to demo users...');
        return tryDemoLogin(email, password);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to demo users for development
      console.log('Network error, falling back to demo users...');
      return tryDemoLogin(email, password);
    }
  };

  const tryDemoLogin = (email: string, password: string): boolean => {
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

    console.log('Trying demo login for:', email);
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (foundUser) {
      console.log('Demo user found:', foundUser);
      setUser(foundUser);
      
      // Store demo auth data
      const authData = {
        user: foundUser,
        token: 'demo-token'
      };
      localStorage.setItem('auth', JSON.stringify(authData));
      
      return true;
    }
    console.log('No demo user found for credentials');
    return false;
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('auth');
  };

  const isAuthenticated = !!user;

  console.log('AuthProvider rendering, user:', user, 'isAuthenticated:', isAuthenticated);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
