#!/bin/bash
# Skill: Setup Development Environment
# Description: Complete setup for the development environment

echo "🚀 Setting up development environment..."

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "🐍 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Generate Prisma client
echo "⚙️ Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev

# Check for .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Remember to update your .env file with actual credentials"
fi

echo "✅ Development environment setup complete!"
echo ""
echo "To start development, run: npm run dev"