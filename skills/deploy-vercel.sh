#!/bin/bash
# Skill: Deploy to Vercel
# Description: Deploy the frontend to Vercel

echo "🚀 Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel
echo "🔐 Logging to Vercel..."
vercel login

# Pull project settings
echo "📥 Pulling project settings..."
vercel pull --yes

# Build project
echo "🏗️ Building project..."
vercel build

# Deploy to production
echo "📤 Deploying to production..."
vercel deploy --prod

echo "✅ Deployment completed!"
echo "Your application is now live on Vercel!"