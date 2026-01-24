#!/bin/bash

# Setup script for the Next.js Todo Application

echo "Setting up the Next.js Todo Application..."

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo "Dependencies installed successfully!"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "Error: Failed to generate Prisma client"
    exit 1
fi

echo "Prisma client generated successfully!"

# Apply database migrations
echo "Applying database migrations..."
npx prisma migrate dev

if [ $? -ne 0 ]; then
    echo "Error: Failed to apply database migrations"
    exit 1
fi

echo "Database migrations applied successfully!"

echo ""
echo "Setup completed successfully!"
echo ""
echo "To run the application, use: npm run dev"
echo "The application will be available at: http://localhost:3000"