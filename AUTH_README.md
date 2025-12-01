# Authentication System - Mylize Analyst Dashboard

## Overview

This project implements a secure, production-ready authentication system using:
- **Backend**: Node.js + Express + MongoDB + Passport.js + JWT
- **Frontend**: React + TypeScript + Axios
- **Security**: bcrypt password hashing, HTTP-only cookies, JWT tokens

## Architecture

### Backend Structure
```
server/
├── config/
│   ├── database.js          # MongoDB connection
│   └── passport.js           # Passport JWT & Local strategies
├── controllers/
│   └── authController.js     # Authentication logic
├── middleware/
│   └── auth.js               # Auth middleware (protect, authorize)
├── models/
│   └── User.js               # User model with bcrypt
├── routes/
│   └── auth.js               # Auth routes
└── server.js                 # Express app entry point
```

### Frontend Structure
```
src/
├── contexts/
│   └── AuthContext.tsx       # Global auth state management
├── services/
│   ├── api.ts                # Axios instance configuration
│   └── authService.ts        # Auth API calls
├── components/
│   ├── auth-login.tsx        # Login component
│   └── auth-signup.tsx       # Signup component
└── App.tsx                   # Main app with auth routing
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup
Install and start MongoDB locally:
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongod

# Windows
# Download and install from https://www.mongodb.com/try/download/community
```

Or use MongoDB Atlas (cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `server/.env`

### 3. Environment Configuration

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/forex-analyst
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

### 4. Start the Application

**Development Mode (both frontend & backend):**
```bash
npm start
```

**Or start separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server:dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

### Public Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password

### Protected Routes (requires authentication)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/updatedetails` - Update user profile
- `PUT /api/auth/updatepassword` - Change password

## Security Features

### 1. Password Security
- **Bcrypt hashing** with salt rounds (10)
- Minimum 8 characters required
- Passwords never returned in API responses
- Password confirmation validation

### 2. JWT Authentication
- **HTTP-only cookies** (prevents XSS attacks)
- **7-day expiration** (configurable)
- Secure flag in production (HTTPS only)
- SameSite: strict (prevents CSRF)

### 3. Authorization
- Role-based access control (user, analyst, admin)
- Subscription status validation
- Demo approval workflow
- Protected route middleware

### 4. Database Security
- Email uniqueness validation
- Email format validation
- MongoDB injection prevention
- Password select: false (excluded by default)

## User Flow

### Registration
1. User fills signup form
2. Frontend validates input
3. API creates user with hashed password
4. User chooses account type (demo/subscriber)
5. JWT token set in HTTP-only cookie
6. User redirected to dashboard

### Login
1. User enters credentials
2. API validates email & password
3. JWT token set in cookie
4. User data returned
5. Frontend updates auth context
6. User redirected to dashboard

### Session Management
- Token stored in HTTP-only cookie
- Auto-refresh on app load
- Automatic logout on token expiration
- Persistent login across tabs

## User Model Schema

```javascript
{
  fullName: String,
  email: String (unique, validated),
  password: String (hashed),
  accountType: 'demo' | 'subscriber',
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled',
  subscriptionEndDate: Date,
  role: 'user' | 'analyst' | 'admin',
  isEmailVerified: Boolean,
  isDemoApproved: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

## Usage Examples

### Frontend - Using Auth Context

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.fullName}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Backend - Protected Route

```javascript
const { protect, authorize } = require('./middleware/auth');

// Protect route - any authenticated user
router.get('/protected', protect, (req, res) => {
  res.json({ user: req.user });
});

// Authorize specific roles
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin only content' });
});
```

## Testing

### Manual Testing

1. **Register**: http://localhost:5173 → Click "Sign up"
2. **Login**: Use registered credentials
3. **Protected Access**: Navigate to dashboard (requires login)
4. **Logout**: Click logout button
5. **Session Persistence**: Refresh page (should stay logged in)

### API Testing (Postman/cURL)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123","accountType":"subscriber"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  -c cookies.txt

# Get current user (requires cookie)
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
JWT_SECRET=<strong-random-string-64-chars>
MONGODB_URI=<mongodb-atlas-connection-string>
CLIENT_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Change JWT_SECRET to strong random string
- [ ] Use HTTPS (secure cookies)
- [ ] Configure MongoDB with authentication
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Implement email verification
- [ ] Add 2FA support
- [ ] Set up monitoring & logging
- [ ] Configure helmet.js for security headers
- [ ] Implement refresh tokens

### Recommended Enhancements
1. **Email Verification**: Send verification email on signup
2. **Refresh Tokens**: Implement token refresh mechanism
3. **Rate Limiting**: Prevent brute force attacks
4. **2FA**: Two-factor authentication
5. **OAuth**: Google/Facebook login
6. **Password Reset**: Email-based password recovery
7. **Account Lockout**: Lock after failed login attempts
8. **Session Management**: Track active sessions
9. **Audit Logging**: Log auth events
10. **GDPR Compliance**: Data export/deletion

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Start MongoDB service
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

**2. CORS Error**
```
Access-Control-Allow-Origin error
```
Solution: Check `CLIENT_URL` in server/.env matches frontend URL

**3. JWT Verification Failed**
```
Error: invalid signature
```
Solution: Ensure `JWT_SECRET` is same across app restarts

**4. Cookie Not Set**
```
Token not found in cookie
```
Solution: Enable `withCredentials: true` in axios config

## Contributing

When adding new authentication features:
1. Update User model in `server/models/User.js`
2. Add controller methods in `server/controllers/authController.js`
3. Create routes in `server/routes/auth.js`
4. Update frontend service in `src/services/authService.ts`
5. Update AuthContext if needed
6. Update this README

## License

MIT

## Support

For issues or questions:
- Create an issue on GitHub
- Email: support@forexanalyst.com
