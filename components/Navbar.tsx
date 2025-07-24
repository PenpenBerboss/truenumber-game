'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, GamepadIcon, History, Menu, X } from 'lucide-react';

/**
 * Composant de barre de navigation principale
 * Affiche le logo, les liens de navigation et les actions utilisateur
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Fermer le menu mobile quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <nav ref={navRef} className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
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
                  <Link href="/admin">
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
              
              {/* User Info & Mobile Menu Toggle */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  {user.role === 'admin' && (
                    <div className="text-xs text-orange-600 font-medium">Administrateur</div>
                  )}
                </div>
                
                {/* Avatar - Clickable on mobile */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="relative w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center hover:from-gray-700 hover:to-gray-800 transition-all duration-200 md:cursor-default md:hover:from-gray-600 md:hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:focus:ring-0"
                >
                  <span className="text-white text-sm font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                  {/* Indicateur mobile */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full md:hidden flex items-center justify-center">
                    <Menu className="w-2 h-2 text-white" />
                  </div>
                </button>
              </div>
              
              {/* Logout Button - Desktop only */}
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="sm"
                className="hidden md:flex hover:bg-red-50 hover:text-red-600 transition-all duration-200 p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Mobile Déroulant */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {/* Info utilisateur en mobile */}
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
                {user.role === 'admin' && (
                  <div className="text-xs text-orange-600 font-medium">Administrateur</div>
                )}
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="space-y-1 pt-2">
              <Link href="/game" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  <GamepadIcon className="h-4 w-4 mr-3" />
                  Jeu
                </Button>
              </Link>
              
              <Link href="/history" onClick={closeMobileMenu}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                >
                  <History className="h-4 w-4 mr-3" />
                  Historique
                </Button>
              </Link>
              
              {/* Admin Links */}
              {user.role === 'admin' && (
                <>
                  <Link href="/admin/users" onClick={closeMobileMenu}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Utilisateurs
                    </Button>
                  </Link>
                  
                  <Link href="/admin" onClick={closeMobileMenu}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Administration
                    </Button>
                  </Link>
                </>
              )}
              
              {/* Logout */}
              <div className="pt-2 border-t border-gray-200">
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="w-full justify-start hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}