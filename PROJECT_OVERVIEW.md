# �� Mylize Analyst Dashboard - Project Overview

## 🎯 Project Description

A **professional Forex trading analyst dashboard** with secure authentication and authorization system. Built with modern web technologies and best security practices.

---

## 🏗️ Technology Stack

### Frontend
- ⚛️ **React 18.3** - UI framework
- 📘 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool & dev server
- 🎨 **Tailwind CSS** - Styling
- 🎭 **Radix UI** - Accessible components
- 🎬 **Framer Motion** - Animations
- 📡 **Axios** - HTTP client

### Backend
- 🟢 **Node.js** - Runtime environment
- 🚂 **Express.js** - Web framework
- 🍃 **MongoDB** - Database
- 🔐 **Passport.js** - Authentication middleware
- 🎟️ **JWT** - Token-based auth
- 🔒 **Bcrypt** - Password hashing

---

## 📁 Project Structure

```
Mylize analyst Dashboard/
│
├── 📂 server/                    # Backend API
│   ├── 📂 config/
│   │   ├── database.js           # MongoDB connection
│   │   └── passport.js           # Passport strategies
│   ├── 📂 controllers/
│   │   └── authController.js     # Auth logic
│   ├── 📂 middleware/
│   │   └── auth.js               # Auth middleware
│   ├── 📂 models/
│   │   └── User.js               # User model
│   ├── 📂 routes/
│   │   └── auth.js               # API routes
│   ├── .env                      # Backend config
│   └── server.js                 # Express app
│
├── 📂 src/                       # Frontend
│   ├── 📂 components/
│   │   ├── auth-login.tsx        # Login component
│   │   ├── auth-signup.tsx       # Signup component
│   │   ├── sidebar.tsx           # Navigation
│   │   ├── analyst-dashboard.tsx # Main dashboard
│   │   └── 📂 ui/                # UI components
│   ├── 📂 contexts/
│   │   └── AuthContext.tsx       # Auth state management
│   ├── 📂 services/
│   │   ├── api.ts                # Axios config
│   │   └── authService.ts        # Auth API calls
│   ├── App.tsx                   # Main app
│   └── main.tsx                  # Entry point
│
├── 📂 node_modules/              # Dependencies
│
├── 📄 .env                       # Frontend config
├── 📄 .env.example               # Config template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 package.json               # Dependencies & scripts
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tailwind.config.js         # Tailwind config
│
├── 📄 start.sh                   # Quick start script
│
└── 📚 Documentation/
    ├── AUTH_README.md            # Auth guide
    ├── IMPLEMENTATION_SUMMARY.md # What's implemented
    ├── QUICK_REFERENCE.md        # Quick commands
    ├── MONGODB_SETUP.md          # MongoDB guide
    └── PROJECT_OVERVIEW.md       # This file
```

---

## 🔐 Authentication System

### Features
✅ User registration with validation
✅ Secure login (bcrypt + JWT)
✅ HTTP-only cookies (XSS protection)
✅ Role-based access control
✅ Subscription management
✅ Password reset workflow
✅ Session persistence
✅ Auto-logout on token expiration

### User Roles
- 👤 **User**: Basic access
- 📊 **Analyst**: Advanced features
- 👑 **Admin**: Full control

### Account Types
- 🎮 **Demo**: Limited trial access (requires approval)
- 💎 **Subscriber**: Full platform access (14-day trial)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed (or MongoDB Atlas account)
- Git (for version control)

### Installation

**1️⃣ Clone/Download Project**
```bash
cd "Mylize analyst Dashboard"
```

**2️⃣ Install Dependencies**
```bash
npm install
```

**3️⃣ Setup MongoDB**
```bash
# See MONGODB_SETUP.md for detailed instructions

# macOS (Homebrew)
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Or use MongoDB Atlas (cloud)
# Get connection string and update server/.env
```

**4️⃣ Configure Environment**

Frontend (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/forex-analyst
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**5️⃣ Start Application**
```bash
# Quick start (recommended)
npm start

# Or use start script
./start.sh

# Or start separately
npm run dev          # Frontend
npm run server:dev   # Backend
```

**6️⃣ Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

---

## 📖 Available Scripts

```bash
npm run dev          # Start frontend dev server
npm run build        # Build frontend for production
npm run server       # Start backend server
npm run server:dev   # Start backend with auto-reload
npm start            # Start both frontend & backend
```

---

## 🔗 API Endpoints

### Public Routes
```
POST   /api/auth/register           # Create account
POST   /api/auth/login              # Login
POST   /api/auth/forgotpassword     # Request reset
PUT    /api/auth/resetpassword/:token  # Reset password
GET    /api/health                  # Server status
```

### Protected Routes (Authentication Required)
```
GET    /api/auth/me                 # Get current user
POST   /api/auth/logout             # Logout
PUT    /api/auth/updatedetails      # Update profile
PUT    /api/auth/updatepassword     # Change password
```

---

## 🔒 Security Features

### Password Security
- ✅ Bcrypt hashing (10 salt rounds)
- ✅ Never stored in plain text
- ✅ Minimum 8 characters required
- ✅ Password confirmation on signup

### Token Security
- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only cookies (XSS prevention)
- ✅ Secure flag in production (HTTPS)
- ✅ SameSite: strict (CSRF prevention)

### API Security
- ✅ CORS configured with credentials
- ✅ Input validation (frontend & backend)
- ✅ Email format validation
- ✅ Unique email enforcement
- ✅ Protected routes middleware
- ✅ Role-based authorization

### Database Security
- ✅ MongoDB connection secured
- ✅ Password field excluded by default
- ✅ Email uniqueness index
- ✅ Prepared statements (injection prevention)

---

## 👥 User Flow

### Registration Flow
1. User clicks "Sign up"
2. Fills registration form
3. System validates input
4. Password hashed with bcrypt
5. User saved to MongoDB
6. Choose account type (Demo/Subscriber)
7. JWT token generated
8. Token stored in HTTP-only cookie
9. Redirect to dashboard

### Login Flow
1. User enters credentials
2. System validates email format
3. Backend checks user exists
4. Password verified with bcrypt
5. JWT token generated
6. Token stored in cookie
7. User data returned
8. AuthContext updates state
9. Redirect to dashboard

### Protected Route Access
1. User makes request
2. Middleware extracts token from cookie
3. JWT token verified
4. User loaded from database
5. Authorization checked (role/subscription)
6. Access granted or denied

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **AUTH_README.md** | Complete authentication guide |
| **IMPLEMENTATION_SUMMARY.md** | What's been implemented |
| **QUICK_REFERENCE.md** | Quick commands & usage |
| **MONGODB_SETUP.md** | MongoDB installation guide |
| **PROJECT_OVERVIEW.md** | This file - project overview |

---

## �� Testing

### Manual Testing
1. **Register**: Create new account
2. **Login**: Use credentials
3. **Dashboard**: Access protected content
4. **Logout**: Clear session
5. **Persistence**: Refresh page (should stay logged in)
6. **Validation**: Try invalid inputs

### API Testing (cURL)
See **QUICK_REFERENCE.md** for cURL examples

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB
```bash
brew services start mongodb-community@7.0  # macOS
sudo systemctl start mongod                # Linux
```

### CORS Error
```
❌ Access-Control-Allow-Origin error
```
**Solution**: Verify CLIENT_URL in server/.env matches frontend URL

### Port Already in Use
```
❌ Port 5000 is already in use
```
**Solution**: Change port in server/.env or kill process
```bash
lsof -ti:5000 | xargs kill -9
```

### Cookie Not Set
```
❌ Token not found in cookie
```
**Solution**: Check browser cookies and `withCredentials: true` in axios

---

## 🎯 Next Steps

### Phase 1: Setup ✅
- [x] Install dependencies
- [x] Setup MongoDB
- [x] Configure environment
- [x] Start application
- [x] Test authentication

### Phase 2: Enhancement (Optional)
- [ ] Email verification
- [ ] Password reset via email
- [ ] 2FA (Two-Factor Authentication)
- [ ] OAuth (Google/Facebook)
- [ ] Rate limiting
- [ ] Session management UI

### Phase 3: Features
- [ ] Trading signals
- [ ] Market analysis
- [ ] Chart widgets
- [ ] News feed
- [ ] Live streaming
- [ ] Subscription payments

---

## 📞 Support & Resources

### Documentation
- 📖 **Full Auth Guide**: AUTH_README.md
- ⚡ **Quick Start**: QUICK_REFERENCE.md
- 🗃️ **MongoDB Setup**: MONGODB_SETUP.md

### External Resources
- **MongoDB Docs**: https://docs.mongodb.com
- **Express.js Guide**: https://expressjs.com
- **React Docs**: https://react.dev
- **Passport.js**: http://www.passportjs.org

### Common Issues
Check the **Troubleshooting** section above or refer to individual documentation files.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Summary

You now have a **fully functional Forex Analyst Dashboard** with:

✅ Secure authentication system
✅ MongoDB database integration
✅ JWT token-based authorization
✅ Role-based access control
✅ Complete frontend & backend
✅ Production-ready security
✅ Comprehensive documentation

**Ready to start!** 🚀

```bash
npm start
```

Then visit: **http://localhost:5173**

---

*Last Updated: November 2024*
