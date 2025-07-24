'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

interface GameHistoryItem {
  id: string;
  playerId?: string;
  userId?: string;
  playerName?: string;
  userName?: string;
  playerEmail?: string;
  userEmail?: string;
  targetNumber: number;
  randomNumber?: number;
  result?: 'Gagné' | 'Perdu';
  won: boolean;
  attempts: number;
  guesses?: number[];
  score: number;
  pointsChange?: number;
  balanceAfter?: number;
  createdAt: string;
  created_at?: string;
}

export default function AdminHistoryPage() {
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log('🔄 [AdminHistory] Récupération de l\'historique global...');
        const response = await api.get('/admin/history');
        console.log('📥 [AdminHistory] Réponse reçue:', response.data);
        
        // L'API retourne soit directement un tableau, soit { games: [...] }
        const historyData = response.data?.games || response.data;
        console.log('🎮 [AdminHistory] Données d\'historique extraites:', historyData);
        
        // S'assurer que la réponse est un tableau et mapper les données
        const mappedHistory = Array.isArray(historyData) ? historyData.map((game: any) => ({
          id: game.id || game._id,
          playerId: game.playerId || game.userId || game.user_id,
          playerName: game.playerName || game.userName || game.user_name || 'Utilisateur',
          playerEmail: game.playerEmail || game.userEmail || game.user_email || 'email@example.com',
          targetNumber: game.targetNumber || game.random_number,
          won: game.won !== undefined ? game.won : (game.result === 'Gagné'),
          attempts: game.attempts || 1,
          guesses: game.guesses || [],
          score: game.score || game.points_change || 0,
          createdAt: game.createdAt || game.created_at
        })) : [];
        
        setHistory(mappedHistory);
      } catch (error) {
        console.error('❌ [AdminHistory] Échec de la récupération de l\'historique:', error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <Navbar />
          <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-lg animate-pulse">
                <History className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Loading Game History...</h1>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-300 rounded w-48"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
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
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 shadow-lg">
              <History className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              All Game History
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Monitor all gaming activity across the platform with comprehensive game statistics
            </p>
          </div>

          {history.length === 0 ? (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="py-16">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No Games Played Yet</h3>
                  <p className="text-lg text-gray-500 mb-6">Game history will appear here once users start playing.</p>
                  <div className="text-6xl mb-4">🎲</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">{history.length}</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{history.length}</div>
                        <div className="text-sm text-gray-500">Total Games</div>
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
                          {history.filter(g => g.result === 'Gagné').length}
                        </div>
                        <div className="text-sm text-gray-500">Games Won</div>
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
                          {history.filter(g => g.result === 'Perdu').length}
                        </div>
                        <div className="text-sm text-gray-500">Games Lost</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-sm">👥</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {new Set(history.map(g => g.playerId || g.userId)).size}
                        </div>
                        <div className="text-sm text-gray-500">Active Players</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Game History List */}
              <div className="space-y-4">
                {history.map((game, index) => (
                  <Card key={game.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                    <div className={`h-1 ${game.result === 'Gagné' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}></div>
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
                                {game.playerName}
                              </span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {game.playerEmail}
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
                                📅 {new Date(game.createdAt || Date.now()).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                🕒 {new Date(game.createdAt || Date.now()).toLocaleTimeString()}
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
                          {game.guesses && game.guesses.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Essais: {game.guesses.join(' → ')}
                            </div>
                          )}
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