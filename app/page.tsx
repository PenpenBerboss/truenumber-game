/**
 * Page d'accueil de l'application TrueNumber
 * 
 * Redirige automatiquement l'utilisateur vers :
 * - La page de jeu s'il est connecté
 * - La page de connexion s'il n'est pas connecté
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/game');
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  // Affichage du loading pendant la vérification d'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          {/* Logo animé de l'application */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full mb-6 shadow-lg animate-pulse">
            <span className="text-3xl font-bold text-white">TN</span>
          </div>
          
          {/* Spinner de chargement double */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            </div>
          </div>
          
          {/* Titre et message de chargement */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">
            TrueNumber
          </h1>
          <p className="text-gray-600">Chargement de votre expérience de jeu...</p>
        </div>
      </div>
    );
  }

  return null;
}