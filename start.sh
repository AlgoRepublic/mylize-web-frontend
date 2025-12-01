#!/bin/bash

echo "🚀 Starting Mylize Analyst Dashboard with Authentication"
echo "=========================================================="
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running"
    echo "Starting MongoDB..."
    
    # Try to start MongoDB based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start mongodb-community 2>/dev/null || echo "Please start MongoDB manually"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo systemctl start mongod 2>/dev/null || echo "Please start MongoDB manually"
    else
        echo "Please start MongoDB manually for your operating system"
    fi
fi

echo ""
echo "📦 Checking dependencies..."

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "🔧 Checking environment files..."

if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cat > .env << EOF
# Frontend API URL
VITE_API_URL=http://localhost:5000/api
EOF
fi

if [ ! -f "server/.env" ]; then
    echo "Creating backend .env file..."
    cat > server/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MongoDB)
MONGODB_URI=mongodb://localhost:27017/forex-analyst

# JWT Configuration
JWT_SECRET=forex-analyst-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
EOF
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Starting application..."
echo "📱 Frontend: http://localhost:5173"
echo "🔐 Backend API: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the application
npm start
