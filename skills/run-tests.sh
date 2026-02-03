#!/bin/bash
# Skill: Run Tests
# Description: Run all tests with coverage reporting

echo "🧪 Running tests..."

# Run unit tests
echo "Running unit tests..."
if [ -f "node_modules/.bin/jest" ]; then
    npx jest --verbose
elif [ -f "node_modules/.bin/vitest" ]; then
    npx vitest run
else
    npm test
fi

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run type checking if TypeScript
if [ -f "tsconfig.json" ]; then
    echo "📝 Running type checking..."
    npx tsc --noEmit
fi

# Run build to ensure everything compiles
echo "🔨 Running build check..."
npm run build

echo "✅ Tests completed!"