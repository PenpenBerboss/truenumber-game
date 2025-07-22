import axios from 'axios';

/**
 * URL de base de l'API backend, configurée via variable d'environnement
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('🔗 Configuration API:', {
  url: API_BASE_URL,
  environment: process.env.NODE_ENV
});

/**
 * Instance Axios configurée pour les appels API
 * Inclut automatiquement les tokens d'authentification et gère les erreurs
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Timeout de 30 secondes pour Render (cold start)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de réponse pour log les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API] Réponse API reçue:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      timestamp: new Date().toISOString()
    });
    return response;
  },
  (error) => {
    // Filtrer les erreurs liées aux extensions de navigateur
    if (error.message && error.message.includes('message channel closed')) {
      console.warn('⚠️ [API] Erreur extension navigateur ignorée:', error.message);
      // Ne pas rejeter cette erreur car elle vient des extensions
      return Promise.resolve({ data: null, status: 0 });
    }
    
    console.error('❌ [API] Erreur API:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de requête pour ajouter automatiquement le token JWT
 * Récupère le token depuis localStorage et l'ajoute aux headers
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Intercepteur de réponse pour gérer l'expiration des tokens
 * Redirige vers la page de connexion en cas d'erreur 401
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);