# TrueNumber Game - Application de Jeu de Nombres

Application web full-stack permettant de jouer au jeu TrueNumber - devinez si un nombre aléatoire sera supérieur ou inférieur à 50.

## 🚀 Technologies Utilisées
- **Frontend** : Next.js 13, React, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express.js, TypeScript  
- **Base de données** : MongoDB
- **Authentification** : JWT
- **Documentation API** : Swagger/OpenAPI

## 🎮 Fonctionnement de l'Application

### Processus d'Inscription/Connexion
1. **Inscription** : Les utilisateurs créent un compte avec nom, email et mot de passe
2. **Connexion** : Authentification avec email/mot de passe pour recevoir un token JWT
3. **Stockage des tokens** : Les tokens JWT sont stockés dans localStorage pour l'authentification API
4. **Protected Routes**: All game and admin features require authentication

### Game Mechanics
- **Cost**: 100 points per game play
- **Rules**: Random number 1-100 is generated
  - **Win**: Number > 50 → Gain 200 points
  - **Lose**: Number ≤ 50 → Lose 100 points
- **Balance**: Users start with 1000 points
- **History**: All games are recorded with timestamp, number, result, and point changes

### Admin Features
- **User Management**: Create, edit, delete users and modify balances
- **Global History**: View all users' game history
- **Role Management**: Assign admin/user roles

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Clone and install dependencies**:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

2. **Environment Configuration**:

Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
NODE_ENV=development
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Start Development Servers**:

**Option 1 - Both servers together:**
```bash
# From project root
npm run dev
```

**Option 2 - Separate terminals:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

4. **Access the Application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🧪 Testing Instructions

### Demo Accounts
The application includes demo accounts for testing:
- **Admin**: admin@demo.com / password
- **User**: user@demo.com / password

### Manual Testing Workflow

1. **Registration Test**:
   - Go to http://localhost:3000/auth/register
   - Create new account with valid email/password
   - Verify automatic login and redirect to game page

2. **Game Testing**:
   - Click "Generate Random Number" button
   - Verify number display and win/lose logic
   - Check balance updates correctly
   - Test with insufficient balance (< 100 points)

3. **History Testing**:
   - Navigate to History page
   - Verify all games are recorded
   - Check timestamps and point changes

4. **Admin Features** (login as admin@demo.com):
   - Go to Users page to manage users
   - Go to Admin History to see all game history
   - Test CRUD operations on users

### API Testing with Postman/cURL

**1. Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**3. Play Game (with token):**
```bash
curl -X POST http://localhost:5000/api/game/play \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**4. Get Balance:**
```bash
curl -X GET http://localhost:5000/api/game/balance \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**5. Get Game History:**
```bash
curl -X GET http://localhost:5000/api/game/history \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Admin Endpoints (require admin token):**
```bash
# Get all users
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"

# Get all game history
curl -X GET http://localhost:5000/api/users/history/all \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### Testing Protected Routes
1. Try accessing /game, /history, or /admin pages without logging in
2. Verify automatic redirect to login page
3. Test admin-only pages with regular user account
4. Verify proper error messages and access control

## 🏗️ Project Structure

```
/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # API route handlers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API route definitions
│   │   └── server.ts       # Express server entry point
│   ├── package.json
│   └── .env               # Backend environment variables
├── frontend/               # Next.js React application
│   ├── app/               # Next.js 13+ app directory
│   │   ├── auth/          # Authentication pages
│   │   ├── admin/         # Admin-only pages
│   │   └── game/          # Game pages
│   ├── components/        # Reusable React components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions
│   └── package.json
├── package.json          # Root package.json for scripts
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage  
- **Protected Routes**: Middleware verification for all sensitive endpoints
- **Role-Based Access**: Admin-only routes and features
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin request handling

## 📊 Database Schema

**Users Table:**
- id (Primary Key, UUID)
- name (String)
- email (Unique, String) 
- password (Hashed, String)
- role (admin/user)
- balance (Integer, default 1000)
- created_at, updated_at (Timestamps)

**Game History Table:**
- id (Primary Key, UUID)
- user_id (Foreign Key)
- random_number (Integer 1-100)
- result (Gagné/Perdu)
- points_change (Integer)
- balance_after (Integer)
- created_at (Timestamp)

## 🚀 Deployment Notes

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway/Heroku)
```bash
cd backend
npm run build
# Set environment variables on hosting platform
# Deploy built files
```

**Important**: Update `NEXT_PUBLIC_API_URL` in frontend to point to deployed backend URL.

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express.js
- SQLite with better-sqlite3 (production-ready alternative to MongoDB for this demo)
- JWT for authentication
- bcryptjs for password hashing
- TypeScript for type safety

**Frontend:**
- Next.js 13+ with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI components
- Axios for API calls
- React Hot Toast for notifications

## 📝 Notes

- **Database Choice**: Using SQLite instead of MongoDB due to WebContainer environment constraints, but the API structure follows MongoDB/Mongoose patterns
- **Authentication**: Implements standard JWT flow with localStorage storage
- **Demo Data**: Includes demo accounts for immediate testing
- **Responsive Design**: Mobile-first design approach with Tailwind CSS
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🐛 Troubleshooting

**Common Issues:**

1. **"Module not found" errors**: Run `npm install` in both backend and frontend directories
2. **API connection issues**: Verify backend is running on port 5000 and environment variables are set
3. **Authentication failures**: Check JWT_SECRET is set and consistent
4. **Database errors**: SQLite database is created automatically, ensure write permissions

**Debugging Tips:**
- Check browser console for frontend errors
- Check terminal output for backend API errors  
- Verify network requests in browser DevTools
- Ensure environment variables are loaded correctly