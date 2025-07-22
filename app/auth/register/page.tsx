'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, username, email, password, phone || undefined);
      toast.success('Inscription réussie !');
      router.push('/game');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Échec de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">TN</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Rejoindre TrueNumber</h1>
          <p className="text-gray-600 mt-2">Créez votre compte et commencez votre aventure de devinette de nombres</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Remplissez vos informations pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Entrez votre nom complet"
                    className="h-11 pl-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Nom d'utilisateur
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choisissez un nom d'utilisateur"
                    className="h-11 pl-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse e-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Entrez votre e-mail"
                  className="h-11 pl-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Numéro de téléphone <span className="text-gray-400 font-normal">(Optionnel)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Entrez votre numéro de téléphone"
                  className="h-11 pl-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Entrez votre mot de passe (min 6 caractères)"
                  minLength={6}
                  className="h-11 pl-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Doit contenir au moins 6 caractères</p>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Création du compte...</span>
                  </div>
                ) : (
                  'Créer le compte'
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Vous avez déjà un compte ?</span>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  href="/auth/login" 
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Se connecter →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 TrueNumber. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}