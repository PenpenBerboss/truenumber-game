'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, GamepadIcon, History } from 'lucide-react';

/**
 * Composant de barre de navigation principale
 * Affiche le logo, les liens de navigation et les actions utilisateur
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/game" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">TN</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TrueNumber
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/game">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                  <GamepadIcon className="h-4 w-4 mr-2" />
                  Jeu
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200">
                  <History className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm" className="hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
                      <User className="h-4 w-4 mr-2" />
                      Utilisateurs
                    </Button>
                  </Link>
                  <Link href="/admin/history">
                    <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                      <Settings className="h-4 w-4 mr-2" />
                      Administration
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Balance Display */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">
                  {user.balance?.toLocaleString()} pts
                </span>
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  {user.role === 'admin' && (
                    <div className="text-xs text-orange-600 font-medium">Administrateur</div>
                  )}
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* Logout Button */}
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}