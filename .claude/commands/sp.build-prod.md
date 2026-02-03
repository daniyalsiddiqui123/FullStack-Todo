# Production Build Skill

Build the project for production deployment.

## Command Definition

```bash
sp.build-prod
```

## Behavior

This skill will:
1. Clean previous build artifacts
2. Generate Prisma client
3. Build the Next.js application
4. Run production checks
5. Display build size and performance metrics

## Implementation

```bash
#!/bin/bash
echo "Building project for production..."

# Clean previous builds
rm -rf .next

# Generate Prisma client
npx prisma generate

# Build Next.js application
npm run build

# Run production checks
npm run lint

echo "Production build completed successfully!"
echo "Build output is in the .next directory"
```

## Usage

Run this command when you want to create a production-ready build of your application before deployment.