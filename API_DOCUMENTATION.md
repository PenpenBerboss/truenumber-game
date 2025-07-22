# 🎮 API TrueNumber Game - Documentation Complète

## 📋 Vue d'ensemble

J'ai développé une API complète pour un jeu de devinette de nombres appelé "TrueNumber". L'API est entièrement documentée avec Swagger et permet aux joueurs de deviner un nombre entre 1 et 100 avec un système de points et d'historique.

## 🌐 Accès à l'API

### URLs principales
- **API Backend** : http://localhost:5000/api
- **Documentation Swagger** : http://localhost:5000/api-docs
- **Raccourci documentation** : http://localhost:5000/docs
- **Health Check** : http://localhost:5000/api/health
- **Frontend** : http://localhost:3000

### Interface Swagger UI
Mon API est entièrement documentée avec Swagger UI qui permet de :
- ✅ Visualiser tous les endpoints avec leurs descriptions
- ✅ Tester les endpoints directement depuis le navigateur
- ✅ Voir les modèles de données (schemas) avec exemples
- ✅ Comprendre les codes de réponse d'erreur
- ✅ Gérer l'authentification JWT facilement
- ✅ Exporter la documentation au format JSON

## 🔐 Système d'authentification

J'ai implémenté un système d'authentification JWT complet :

### Création de compte
```bash
POST /api/auth/register
{
  "name": "Mon Nom",
  "email": "mon.email@example.com",
  "password": "monmotdepasse123"
}
```

### Connexion
```bash
POST /api/auth/login
{
  "email": "mon.email@example.com",
  "password": "monmotdepasse123"
}
```

### Utilisation du token
1. Je récupère le `token` dans la réponse de connexion
2. Dans Swagger UI, je clique sur "Authorize" 🔒
3. J'entre : `Bearer MON_TOKEN`
4. Tous les endpoints protégés deviennent accessibles

## 🎮 Endpoints de l'API

### Authentification (`/api/auth`)
- `POST /register` - Créer un nouveau compte
- `POST /login` - Se connecter avec email/password
- `POST /logout` - Se déconnecter

### Jeu (`/api/game`)
- `POST /play` - Jouer une partie (deviner un nombre entre 1-100)

### Utilisateurs (`/api/users`)
- `GET /me` - Récupérer mon profil personnel
- `GET /` - Lister tous les utilisateurs (Admin uniquement)
- `GET /:id` - Récupérer un utilisateur par ID (Admin)
- `POST /` - Créer un utilisateur (Admin)
- `PUT /:id` - Modifier un utilisateur (Admin)
- `DELETE /:id` - Supprimer un utilisateur (Admin)

### Solde (`/api/balance`)
- `GET /` - Consulter mon solde de points actuel

### Historique (`/api/history`)
- `GET /` - Mon historique personnel des parties
- `GET /all` - Historique global de tous les joueurs (Admin)

## 🎯 Comment tester mon API

### Méthode 1: Swagger UI (Recommandée)
1. J'ouvre http://localhost:5000/api-docs dans mon navigateur
2. Je sélectionne un endpoint (ex: `POST /auth/register`)
3. Je clique "Try it out"
4. Je remplis les données d'exemple
5. Je clique "Execute" pour voir la réponse

### Méthode 2: Tests avec cURL
```bash
# Test de santé de l'API
curl http://localhost:5000/api/health

# Créer un compte
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Jouer une partie (avec token)
curl -X POST http://localhost:5000/api/game/play \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MON_TOKEN" \
  -d '{"guess":42}'

# Voir mon profil
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer MON_TOKEN"
```

### Méthode 3: Postman
1. J'importe la collection depuis : http://localhost:5000/api-docs.json
2. Je configure l'authentification Bearer Token
3. Je teste tous les endpoints

### Méthode 4: Scripts automatisés
J'ai créé des scripts de test automatisés :
- **PowerShell** : `backend/test-api.ps1`
- **Node.js** : `backend/test-api.js`

## 🏆 Règles du jeu TrueNumber

### Principe
1. **Objectif** : Deviner un nombre généré aléatoirement entre 1 et 100
2. **Tentatives** : Maximum 10 essais par partie
3. **Feedback** : L'API indique "trop petit", "trop grand" ou "trouvé!"
4. **Fin de partie** : Soit le nombre est trouvé, soit les 10 tentatives sont épuisées

### Système de scoring que j'ai implémenté
- **1 tentative** : 100 points 🥇
- **2-3 tentatives** : 75 points 🥈
- **4-6 tentatives** : 50 points 🥉
- **7-10 tentatives** : 25 points 📈
- **Échec (>10 tentatives)** : -5 points 📉
- **Solde initial** : 100 points par défaut

## 📊 Exemples de réponses

### Réponse de connexion réussie
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Mon Nom",
    "email": "mon.email@example.com",
    "isAdmin": false
  }
}
```

### Réponse pendant une partie
```json
{
  "message": "Trop petit!",
  "result": "too_low",
  "attempts": 3,
  "maxAttempts": 10,
  "gameCompleted": false,
  "won": false,
  "guessHistory": [50, 25, 30]
}
```

### Mon historique personnel
```json
{
  "games": [
    {
      "id": "648f7b3b3b3b3b3b3b3b3b3b",
      "targetNumber": 42,
      "guesses": [50, 25, 37, 42],
      "attempts": 4,
      "won": true,
      "score": 50,
      "createdAt": "2025-07-21T21:30:00.000Z"
    }
  ],
  "stats": {
    "totalGames": 25,
    "gamesWon": 15,
    "gamesLost": 10,
    "winRate": 60.0,
    "averageScore": 42.5
  }
}
```

## 👑 Comptes administrateur

Pour tester les fonctionnalités admin, je peux créer un compte administrateur :
```bash
cd backend
node create-admin.js
```

Ou utiliser ces comptes de test :
- **Admin** : admin@example.com / admin123
- **User** : user@example.com / password123

## ⚠️ Codes d'erreur

Mon API retourne ces codes d'erreur standard :
- **400** - Bad Request (données manquantes ou invalides)
- **401** - Unauthorized (token manquant ou expiré)
- **403** - Forbidden (privilèges insuffisants pour cette action)
- **404** - Not Found (ressource introuvable)
- **500** - Internal Server Error (erreur côté serveur)

## 🛠️ Technologies utilisées

### Backend
- **Node.js** avec **Express** et **TypeScript**
- **MongoDB** pour la base de données
- **JWT** pour l'authentification sécurisée
- **bcryptjs** pour le hachage des mots de passe

### Documentation
- **Swagger/OpenAPI 3.0** pour la spécification
- **swagger-ui-express** pour l'interface web
- **swagger-jsdoc** pour générer la documentation

### Frontend (bonus)
- **Next.js 13** avec app router
- **React** avec **TypeScript**
- **Tailwind CSS** pour le styling moderne

## 🚀 Comment démarrer

### Lancement des serveurs
```bash
# Backend (dans un terminal)
cd backend
npm run dev
# ➜ Serveur sur http://localhost:5000

# Frontend (dans un autre terminal)  
cd frontend
npm run dev
# ➜ Interface sur http://localhost:3000
```

### Première utilisation
1. J'ouvre http://localhost:5000/api-docs pour la documentation
2. Je teste l'endpoint de santé : http://localhost:5000/api/health
3. Je crée un compte via `/auth/register`
4. Je me connecte via `/auth/login`
5. Je joue des parties via `/game/play`
6. Je consulte mes stats via `/history`

## 📈 Statistiques disponibles

Mon API fournit des statistiques complètes :
- **Historique personnel** avec détails de chaque partie
- **Taux de victoire** et scores moyens
- **Progression dans le temps**
- **Classements globaux** (pour les admins)
- **Statistiques de tous les joueurs** (pour les admins)

---

**🎯 Résumé** : J'ai créé une API REST complète, sécurisée et entièrement documentée avec Swagger pour un jeu de devinette de nombres. L'interface interactive permet de tester tous les endpoints facilement !

**📚 Documentation interactive** : http://localhost:5000/api-docs
