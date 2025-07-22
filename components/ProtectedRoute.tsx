'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Interface définissant les propriétés du composant ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

/**
 * Composant de protection des routes avec authentification
 * Redirige vers la page de connexion si non authentifié
 * Peut être configuré pour n'autoriser que les administrateurs
 * 
 * @param children - Contenu à afficher si autorisé
 * @param adminOnly - Si true, n'autorise que les administrateurs
 */
export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (adminOnly && user.role !== 'admin') {
        router.push('/game');
        return;
      }
    }
  }, [user, loading, adminOnly, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (adminOnly && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}