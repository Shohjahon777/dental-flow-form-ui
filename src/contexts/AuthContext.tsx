import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Use relative URLs that will be proxied by Vite
const API_BASE_URL = 'https://backendfastapi-v8lv.onrender.com/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('dentalApp_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('dentalApp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          password: password,
        }),
        credentials: 'include', // Include cookies if needed
      });

      if (response.ok) {
        const data = await response.json();
        
        // Determine role based on email domain or username pattern
        let role: 'student' | 'instructor' | 'admin' = 'student';
        if (name.toLowerCase().includes('admin')) {
          role = 'admin';
        } else if (name.toLowerCase().includes('instructor')) {
          role = 'instructor';
        }
        
        const userData: User = {
          id: data.id || Math.random().toString(36).substr(2, 9),
          email: data.email || name,
          name: data.name || data.username || name,
          role: role,
          username: data.username || name,
        };
        
        setUser(userData);
        localStorage.setItem('dentalApp_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        console.error('Login failed:', errorData);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'instructor'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
          role: role,
        }),
        credentials: 'include', // Include cookies if needed
      });

      if (response.ok) {
        const data = await response.json();
        
        const userData: User = {
          id: data.id || Math.random().toString(36).substr(2, 9),
          email: email,
          name: name,
          role: role,
          username: data.username || name,
        };
        
        setUser(userData);
        localStorage.setItem('dentalApp_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        console.error('Registration failed:', errorData);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dentalApp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};