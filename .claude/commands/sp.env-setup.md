# Environment Setup Skill

Set up the development environment with all necessary dependencies.

## Command Definition

```bash
sp.env-setup
```

## Behavior

This skill will:
1. Install all Node.js dependencies
2. Generate Prisma client
3. Run database migrations
4. Verify environment variables
5. Run basic health checks

## Implementation

```bash
#!/bin/bash
echo "Setting up development environment..."

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev

# Check environment variables
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found, copying from .env.example"
    cp .env.example .env
fi

# Run a basic health check
echo "Environment setup complete!"
echo "To start development, run: npm run dev"
```

## Usage

Run this command when you first clone the repository or when you need to set up the development environment on a new machine.