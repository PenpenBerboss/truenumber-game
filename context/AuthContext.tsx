'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

/**
 * Interface définissant la structure des données utilisateur
 */
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  balance: number;
}

/**
 * Interface définissant les méthodes et données du contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (user: User) => void;
}

/**
 * Contexte React pour la gestion globale de l'authentification
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @throws {Error} Si utilisé en dehors d'un AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

/**
 * Composant fournisseur du contexte d'authentification
 * Gère l'état global de l'utilisateur et les opérations d'authentification
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user info
          console.log('🔐 Vérification du token...');
          const response = await api.get('/game/balance');
          
          // If token is valid, we can get the balance
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log('✅ Utilisateur authentifié');
          }
        } catch (error: any) {
          console.warn('⚠️ Erreur d\'authentification:', error.message);
          // Token is invalid or backend unavailable
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
    
    // Timeout de sécurité pour éviter un loading infini
    const timeout = setTimeout(() => {
      console.warn('⏰ Timeout d\'authentification - déblocage de l\'interface');
      setLoading(false);
    }, 10000); // 10 secondes max

    return () => clearTimeout(timeout);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (name: string, username: string, email: string, password: string, phone?: string) => {
    const requestBody: any = { name, username, email, password };
    if (phone) {
      requestBody.phone = phone;
    }
    
    const response = await api.post('/auth/register', requestBody);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};