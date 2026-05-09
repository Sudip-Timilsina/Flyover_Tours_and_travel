#!/bin/bash

echo "🚀 Nepal Tours - Setup Script"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Generating Prisma client..."
npm run prisma:generate

echo ""
echo "📝 Setting up environment file..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local - Update DATABASE_URL with your PostgreSQL connection string"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL in .env.local"
echo "2. Run: npm run prisma:migrate"
echo "3. Run: npm run seed"
echo "4. Run: npm run dev"
echo "5. Visit: http://localhost:3000"
echo ""
echo "Admin Login: http://localhost:3000/admin/login"
echo "Email: admin@nepaltours.com"
echo "Password: admin123"
