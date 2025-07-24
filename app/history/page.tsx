'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Interface pour les statistiques retournées par l'API
 */
interface GameStats {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  averageScore: number;
}

/**
 * Interface définissant la structure d'un élément d'historique de jeu selon l'API
 */
interface GameHistoryItem {
  id: string;
  targetNumber: number;
  guesses: number[];
  attempts: number;
  won: boolean;
  score: number;
  createdAt: string;
}

/**
 * Page d'historique des jeux - Affiche l'historique complet des parties de l'utilisateur
 * Route: /history
 */
export default function HistoryPage() {
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log('🔄 [History] Récupération de l\'historique...');
        const response = await api.get('/history');
        console.log('📥 [History] Réponse complète reçue:', response.data);
        
        // L'API retourne { games: [...], stats: {...} }
        const historyData = response.data?.games || response.data;
        const statsData = response.data?.stats;
        
        console.log('🎮 [History] Données d\'historique extraites:', historyData);
        console.log('📊 [History] Statistiques extraites:', statsData);
        
        // S'assurer que la réponse est un tableau
        setHistory(Array.isArray(historyData) ? historyData : []);
        
        // Définir les statistiques (de l'API ou calculées localement)
        if (statsData) {
          setStats(statsData);
        } else if (Array.isArray(historyData)) {
          // Calculer les stats localement si l'API ne les fournit pas
          const localStats: GameStats = {
            totalGames: historyData.length,
            gamesWon: historyData.filter(g => g.won).length,
            gamesLost: historyData.filter(g => !g.won).length,
            winRate: historyData.length > 0 ? (historyData.filter(g => g.won).length / historyData.length) * 100 : 0,
            averageScore: historyData.length > 0 ? historyData.reduce((sum, g) => sum + (g.score || 0), 0) / historyData.length : 0
          };
          setStats(localStats);
          console.log('📊 [History] Statistiques calculées localement:', localStats);
        }
      } catch (error) {
        console.error('❌ [History] Échec de la récupération de l\'historique:', error);
        // En cas d'erreur, définir comme tableau vide
        setHistory([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          <Navbar />
          <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-4 shadow-lg animate-pulse">
                <History className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Chargement de l'historique...</h1>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-300 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-6 shadow-lg">
              <History className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Historique des Jeux
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Suivez votre parcours de jeu et analysez vos performances au fil du temps
            </p>
          </div>

          {!Array.isArray(history) || history.length === 0 ? (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="py-16">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun Jeu Encore</h3>
                  <p className="text-lg text-gray-500 mb-6">Commencez à jouer pour voir votre historique de jeu apparaître ici !</p>
                  <div className="text-6xl mb-4">🎲</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">{stats?.totalGames || 0}</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stats?.totalGames || 0}</div>
                        <div className="text-sm text-gray-500">Parties Totales</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {stats?.gamesWon || 0}
                        </div>
                        <div className="text-sm text-gray-500">Parties Gagnées</div>
                        <div className="text-xs text-gray-400">Taux: {stats?.winRate ? stats.winRate.toFixed(1) : '0'}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mr-4">
                        <TrendingDown className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {stats?.gamesLost || 0}
                        </div>
                        <div className="text-sm text-gray-500">Parties Perdues</div>
                        <div className="text-xs text-gray-400">Score moyen: {stats?.averageScore ? stats.averageScore.toFixed(1) : '0'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Game History List */}
              <div className="space-y-4">
                {Array.isArray(history) && history.map((game, index) => (
                  <Card key={game.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                    <div className={`h-1 ${game.won ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Game Number Circle */}
                          <div className="flex-shrink-0">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                              game.won 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                : 'bg-gradient-to-r from-red-500 to-rose-500'
                            }`}>
                              {game.targetNumber}
                            </div>
                          </div>
                          
                          {/* Game Info */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl font-bold text-gray-900">
                                Game #{Array.isArray(history) ? history.length - index : 0}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                game.won
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {game.won ? '🏆 Gagné' : '💸 Perdu'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center space-x-4">
                              <span className="flex items-center">
                                📅 {new Date(game.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                🕒 {new Date(game.createdAt).toLocaleTimeString()}
                              </span>
                              <span className="flex items-center">
                                🎯 {game.attempts} tentatives
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Score */}
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            game.won ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {game.won ? `+${game.score}` : '0'} pts
                          </div>
                          <div className="text-sm text-gray-600">
                            Nombre cible: {game.targetNumber}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}