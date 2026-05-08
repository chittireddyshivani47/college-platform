#!/bin/bash
# ============================================
# CollegeHub Quick Start Script
# Run: chmod +x start.sh && ./start.sh
# ============================================

set -e

echo "🎓 CollegeHub Setup"
echo "==================="

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ is required. Current: $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root deps
echo ""
echo "📦 Installing root dependencies..."
npm install

# Backend setup
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Check if .env has been configured
if grep -q "user:password" .env 2>/dev/null; then
  echo ""
  echo "⚠️  IMPORTANT: Configure your DATABASE_URL in backend/.env"
  echo "   Get a free PostgreSQL at: https://neon.tech"
  echo ""
  read -p "   Press Enter once you've set DATABASE_URL..."
fi

echo ""
echo "🗄️  Setting up database..."
npm run db:generate
npm run db:push
npm run db:seed

cd ..

# Frontend setup
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development servers..."
echo "   Frontend → http://localhost:3000"
echo "   Backend  → http://localhost:5000"
echo "   Demo login: demo@college.com / password123"
echo ""

npm run dev
