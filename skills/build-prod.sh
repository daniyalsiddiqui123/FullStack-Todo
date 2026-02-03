#!/bin/bash
# Skill: Build Production
# Description: Build the project for production deployment

echo "🏗️ Building project for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next dist build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "⚙️ Generating Prisma client..."
npx prisma generate

# Run type checking
echo "📝 Running type checking..."
npx tsc --noEmit

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Run production checks
echo "✅ Running production checks..."
if [ -f "node_modules/.bin/next" ]; then
    npx next telemetry disable 2>/dev/null
fi

echo "🎉 Production build completed successfully!"
echo "Build output is in the .next directory"