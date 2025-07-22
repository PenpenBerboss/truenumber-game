import axios from 'axios';

/**
 * URL de base de l'API backend, configurée via variable d'environnement
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Instance Axios configurée pour les appels API
 * Inclut automatiquement les tokens d'authentification et gère les erreurs
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
});

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