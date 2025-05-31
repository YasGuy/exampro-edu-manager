
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'administrator' | 'director' | 'teacher' | 'student';
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
