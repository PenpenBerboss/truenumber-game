'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';
import { Dices, TrendingUp, TrendingDown } from 'lucide-react';

interface GameResult {
  result: 'gagné' | 'perdu';
  generatedNumber: number;
  newBalance: number;
}

export default function GamePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastGame, setLastGame] = useState<GameResult | null>(null);

  const playGame = async () => {
    if (!user || user.balance < 100) {
      toast.error('Solde insuffisant. Minimum 100 points requis pour jouer.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/game/play');
      const gameResult = response.data;
      
      setLastGame(gameResult);
      
      // Update user balance
      updateUser({ ...user, balance: gameResult.newBalance });
      
      if (gameResult.result === 'gagné') {
        toast.success(`🎉 Vous avez gagné ! Numéro: ${gameResult.generatedNumber}. Nouveau solde: ${gameResult.newBalance}`);
      } else {
        toast.error(`😔 Vous avez perdu ! Numéro: ${gameResult.generatedNumber}. Nouveau solde: ${gameResult.newBalance}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec de la partie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Navbar />
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full mb-6 shadow-lg">
              <Dices className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Défi des Nombres
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Testez votre chance avec notre jeu de devinette de nombres ! Les nombres au-dessus de 50 rapportent gros, tandis que les nombres 50 et en dessous vous coûtent des points.
            </p>
          </div>

          {/* Balance Display */}
          <div className="text-center mb-8">
            <Card className="inline-block shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">$</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {user?.balance?.toLocaleString()} points
                    </div>
                    <div className="text-sm text-gray-500">Votre solde actuel</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Game Play Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-600 to-cyan-600"></div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                  <Dices className="h-7 w-7 mr-3 text-indigo-600" />
                  Jouer
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Générer un nombre aléatoire entre 1-100
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center space-y-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="text-lg font-bold text-blue-600">100</div>
                      <p className="text-xs text-blue-600">Coût pour jouer</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <div className="text-lg font-bold text-green-600">+200</div>
                      <p className="text-xs text-green-600">Gagné (&gt; 50)</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-100">
                      <div className="text-lg font-bold text-red-600">-100</div>
                      <p className="text-xs text-red-600">Perdu (≤ 50)</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={playGame}
                    disabled={loading || !user || user.balance < 100}
                    size="lg"
                    className="w-full h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Lancement du dé...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Dices className="h-5 w-5" />
                        <span>Lancer le Nombre</span>
                      </div>
                    )}
                  </Button>
                  
                  {user && user.balance < 100 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm font-medium">
                        💡 Solde insuffisant ! Vous avez besoin d'au moins 100 points pour jouer.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Last Game Result */}
            {lastGame ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className={`h-2 ${lastGame.result === 'gagné' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}></div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                    {lastGame.result === 'gagné' ? (
                      <TrendingUp className="h-7 w-7 mr-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-7 w-7 mr-3 text-red-600" />
                    )}
                    Game Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className={`text-8xl font-black mb-4 ${lastGame.result === 'gagné' ? 'text-green-600' : 'text-red-600'}`}>
                        {lastGame.generatedNumber}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        {lastGame.result === 'gagné' ? '🎉' : '💔'}
                      </div>
                    </div>
                    
                    <div className={`text-3xl font-bold ${lastGame.result === 'gagné' ? 'text-green-600' : 'text-red-600'}`}>
                      {lastGame.result === 'gagné' ? '🏆 Vous avez gagné!' : '💸 Vous avez perdu!'}
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500 mb-1">New Balance</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {lastGame.newBalance.toLocaleString()} points
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    🎲 Ready to Play?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-gray-500 text-lg">
                      Start your first game to see the results here!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Statistics */}
          <Card className="mt-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Game Statistics</CardTitle>
              <CardDescription className="text-gray-600">Understanding the game mechanics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">100</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">Entry Fee</div>
                  <p className="text-sm text-blue-600">Points required to play each game</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">+200</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">Win Prize</div>
                  <p className="text-sm text-green-600">Bonus when number is greater than 50</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">-100</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-2">Loss</div>
                  <p className="text-sm text-red-600">Deduction when number is 50 or below</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}