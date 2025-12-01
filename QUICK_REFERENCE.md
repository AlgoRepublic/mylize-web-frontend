# 🔐 Authentication Quick Reference

## Start the Application

```bash
# Option 1: Quick start script
./start.sh

# Option 2: Manual start (both frontend & backend)
npm start

# Option 3: Separate terminals
npm run dev          # Frontend (Terminal 1)
npm run server:dev   # Backend (Terminal 2)
```

## URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## API Endpoints

### Public (No Auth Required)
```bash
POST /api/auth/register      # Register new user
POST /api/auth/login         # Login
POST /api/auth/forgotpassword     # Request password reset
PUT  /api/auth/resetpassword/:token  # Reset password
```

### Protected (Auth Required)
```bash
GET  /api/auth/me            # Get current user
POST /api/auth/logout        # Logout
PUT  /api/auth/updatedetails # Update profile
PUT  /api/auth/updatepassword # Change password
```

## Frontend Usage

### Use Auth in Components
```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Login
  await login({ email: 'user@example.com', password: 'password' });
  
  // Register
  await register({ 
    fullName: 'John Doe',
    email: 'john@example.com', 
    password: 'password',
    accountType: 'subscriber'
  });
  
  // Logout
  await logout();
  
  // Check auth
  if (isAuthenticated) {
    console.log('User:', user);
  }
}
```

## Backend - Protect Routes

```javascript
const { protect, authorize, requireSubscription } = require('./middleware/auth');

// Any authenticated user
router.get('/protected', protect, controller);

// Admin only
router.get('/admin', protect, authorize('admin'), controller);

// Active subscription required
router.get('/premium', protect, requireSubscription, controller);
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forex-analyst
JWT_SECRET=change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "accountType": "subscriber"
  }' \
  -c cookies.txt
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

## User Model Fields

```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  accountType: 'demo' | 'subscriber',
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled',
  role: 'user' | 'analyst' | 'admin',
  isEmailVerified: Boolean,
  isDemoApproved: Boolean,
  lastLogin: Date
}
```

## Common Issues & Solutions

### MongoDB Not Running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in server/.env
PORT=5001
```

### CORS Issues
- Verify `CLIENT_URL` in server/.env
- Check browser console for specific error
- Ensure `withCredentials: true` in axios

### Cookie Not Set
- Check browser developer tools → Application → Cookies
- Verify `withCredentials: true` in frontend
- Check `httpOnly` and `secure` settings

### JWT Verification Failed
- Ensure `JWT_SECRET` hasn't changed
- Clear cookies and login again
- Check token expiration

## File Structure

```
├── server/
│   ├── config/
│   │   ├── database.js
│   │   └── passport.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── .env
│   └── server.js
│
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── authService.ts
│   ├── components/
│   │   ├── auth-login.tsx
│   │   └── auth-signup.tsx
│   └── App.tsx
│
├── .env
├── .gitignore
├── AUTH_README.md
├── IMPLEMENTATION_SUMMARY.md
└── QUICK_REFERENCE.md (this file)
```

## Key Security Features

✅ Bcrypt password hashing (10 rounds)
✅ HTTP-only cookies (XSS protection)
✅ JWT tokens (7-day expiration)
✅ CORS configured
✅ Input validation
✅ Secure cookie flags
✅ Role-based access control
✅ Password requirements (min 8 chars)

## Next Steps

1. ✅ Start MongoDB
2. ✅ Run `npm start`
3. ✅ Create an account at http://localhost:5173
4. ✅ Test login/logout
5. ✅ Access protected routes

## Documentation

- **AUTH_README.md**: Full authentication guide
- **IMPLEMENTATION_SUMMARY.md**: What's been implemented
- **QUICK_REFERENCE.md**: This file (quick commands)

---

**Need help?** Check AUTH_README.md for detailed documentation!
