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
    }, 30000); // 30 secondes max pour le cold start de Render

    return () => clearTimeout(timeout);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🚀 [AUTH CONTEXT] Tentative de connexion...');
      console.log('📧 [AUTH CONTEXT] Email:', email);
      console.log('🌐 [AUTH CONTEXT] URL API:', process.env.NEXT_PUBLIC_API_URL);
      
      const response = await api.post('/auth/login', { email, password });
      
      console.log('📦 [AUTH CONTEXT] Réponse reçue:', response.status, response.statusText);
      
      // Vérifier si la réponse est valide (pas une erreur d'extension)
      if (!response || response.status === 0) {
        console.error('❌ [AUTH CONTEXT] Réponse invalide:', response);
        throw new Error('Erreur de communication avec le serveur');
      }
      
      const { token, user } = response.data;
      console.log('🔑 [AUTH CONTEXT] Token reçu:', token ? 'OUI' : 'NON');
      console.log('👤 [AUTH CONTEXT] User reçu:', user ? 'OUI' : 'NON');
      
      if (!token || !user) {
        console.error('❌ [AUTH CONTEXT] Données manquantes:', { token: !!token, user: !!user });
        throw new Error('Réponse invalide du serveur');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('✅ [AUTH CONTEXT] Connexion réussie, utilisateur défini');
      console.log('👤 [AUTH CONTEXT] Utilisateur connecté:', user.name, user.email);
      
    } catch (error: any) {
      console.error('❌ [AUTH CONTEXT] Erreur de connexion:', error);
      console.error('❌ [AUTH CONTEXT] Type d\'erreur:', typeof error);
      console.error('❌ [AUTH CONTEXT] Message:', error.message);
      
      // Gestion spéciale pour les erreurs d'extensions de navigateur
      if (error.message && error.message.includes('message channel closed')) {
        console.warn('⚠️ [AUTH CONTEXT] Erreur d\'extension détectée');
        throw new Error('Erreur d\'extension de navigateur. Essayez en mode navigation privée.');
      }
      
      if (error.response) {
        console.error('❌ [AUTH CONTEXT] Erreur serveur:', error.response.status, error.response.data);
        // Erreur de réponse du serveur
        throw new Error(error.response.data.message || 'Identifiants incorrects');
      } else if (error.request) {
        console.error('❌ [AUTH CONTEXT] Erreur réseau:', error.request);
        // Erreur de réseau
        throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        console.error('❌ [AUTH CONTEXT] Autre erreur:', error.message);
        // Autre erreur
        throw new Error('Erreur de connexion: ' + error.message);
      }
    }
  };

  const register = async (name: string, username: string, email: string, password: string, phone?: string) => {
    try {
      console.log('🚀 Tentative d\'inscription...');
      const requestBody: any = { name, username, email, password };
      if (phone) {
        requestBody.phone = phone;
      }
      
      const response = await api.post('/auth/register', requestBody);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      console.log('✅ Inscription réussie');
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Erreur lors de l\'inscription');
      } else if (error.request) {
        throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        throw new Error('Erreur d\'inscription: ' + error.message);
      }
    }
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