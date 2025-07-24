'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Users, 
  Gamepad2, 
  TrendingUp, 
  Clock,
  BarChart3,
  Settings,
  Database
} from 'lucide-react';
import Link from 'next/link';

/**
 * Interface pour les statistiques générales de l'administration
 */
interface AdminStats {
  totalUsers: number;
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  averageScore: number;
  activeUsers: number;
  recentGames: number;
  winRate: number;
}

/**
 * Interface pour les jeux récents dans l'admin
 */
interface RecentGame {
  id: string;
  playerName: string;
  playerEmail: string;
  targetNumber: number;
  attempts: number;
  won: boolean;
  score: number;
  createdAt: string;
}

/**
 * Page d'administration principale - Tableau de bord avec statistiques globales
 * Route: /admin (Accès administrateur uniquement)
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      console.log('🔄 [Admin] Récupération des données d\'administration...');
      
      // Récupérer les statistiques globales et les jeux récents en parallèle
      const [usersResponse, historyResponse] = await Promise.all([
        api.get('/users'),
        api.get('/history/all') // Endpoint admin pour tout l'historique
      ]);

      console.log('👥 [Admin] Utilisateurs:', usersResponse.data);
      console.log('🎮 [Admin] Historique global:', historyResponse.data);

      // Traiter les données utilisateurs
      const users = Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data?.users || [];
      
      // Traiter les données de l'historique
      const allGames = Array.isArray(historyResponse.data) ? historyResponse.data : historyResponse.data?.games || [];
      
      // Calculer les statistiques
      const adminStats: AdminStats = {
        totalUsers: users.length,
        totalGames: allGames.length,
        totalWins: allGames.filter((g: any) => g.won).length,
        totalLosses: allGames.filter((g: any) => !g.won).length,
        averageScore: allGames.length > 0 ? allGames.reduce((sum: number, g: any) => sum + (g.score || 0), 0) / allGames.length : 0,
        activeUsers: users.filter((u: any) => {
          const lastActivity = new Date(u.updatedAt || u.created_at || u.createdAt || 0);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return lastActivity > weekAgo;
        }).length,
        recentGames: allGames.filter((g: any) => {
          const gameDate = new Date(g.createdAt || g.created_at || 0);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return gameDate > dayAgo;
        }).length,
        winRate: allGames.length > 0 ? (allGames.filter((g: any) => g.won).length / allGames.length) * 100 : 0
      };

      // Préparer les jeux récents (derniers 10)
      const recent = allGames
        .sort((a: any, b: any) => new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime())
        .slice(0, 10)
        .map((game: any) => ({
          id: game.id || game._id,
          playerName: game.playerName || 'Utilisateur',
          playerEmail: game.playerEmail || 'email@example.com',
          targetNumber: game.targetNumber,
          attempts: game.attempts,
          won: game.won,
          score: game.score || 0,
          createdAt: game.createdAt || game.created_at
        }));

      setStats(adminStats);
      setRecentGames(recent);
      
      console.log('📊 [Admin] Statistiques calculées:', adminStats);
      console.log('🎯 [Admin] Jeux récents:', recent);

    } catch (error) {
      console.error('❌ [Admin] Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <Navbar />
          <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg animate-pulse">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Chargement du tableau de bord...</h1>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6 shadow-lg">
              <Settings className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Administration
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tableau de bord complet pour la gestion et le suivi des performances de TrueNumber
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</div>
                    <div className="text-sm text-gray-500">Utilisateurs Total</div>
                    <div className="text-xs text-green-600">{stats?.activeUsers || 0} actifs (7j)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                    <Gamepad2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.totalGames || 0}</div>
                    <div className="text-sm text-gray-500">Parties Totales</div>
                    <div className="text-xs text-blue-600">{stats?.recentGames || 0} aujourd'hui</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.winRate.toFixed(1) || 0}%</div>
                    <div className="text-sm text-gray-500">Taux de Réussite</div>
                    <div className="text-xs text-gray-400">{stats?.totalWins || 0}/{stats?.totalGames || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats?.averageScore.toFixed(1) || 0}</div>
                    <div className="text-sm text-gray-500">Score Moyen</div>
                    <div className="text-xs text-gray-400">Tous les joueurs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Link href="/admin/users">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs</h3>
                        <p className="text-gray-600">Créer, modifier et supprimer les comptes</p>
                      </div>
                    </div>
                    <div className="text-3xl text-gray-300 group-hover:text-blue-500 transition-colors">→</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Games Table */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Parties Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGames.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune partie récente trouvée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Joueur</th>
                        <th className="text-left py-2">Nombre Cible</th>
                        <th className="text-left py-2">Tentatives</th>
                        <th className="text-left py-2">Résultat</th>
                        <th className="text-left py-2">Score</th>
                        <th className="text-left py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentGames.map((game, index) => (
                        <tr key={game.id || index} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{game.playerName}</div>
                              <div className="text-sm text-gray-500">{game.playerEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 font-bold">{game.targetNumber}</td>
                          <td className="py-3">{game.attempts}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              game.won 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {game.won ? '🏆 Gagné' : '💸 Perdu'}
                            </span>
                          </td>
                          <td className="py-3 font-bold">{game.score}</td>
                          <td className="py-3 text-sm text-gray-500">
                            {new Date(game.createdAt).toLocaleDateString()} {new Date(game.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
