# Database Reset Skill

Reset the database to a clean state for development.

## Command Definition

```bash
sp.db-reset
```

## Behavior

This skill will:
1. Reset the database by dropping and recreating it
2. Run all migrations
3. Seed the database with initial data (if seed script exists)
4. Generate the Prisma client

## Implementation

```bash
#!/bin/bash
echo "Resetting database..."

# Drop and recreate database
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

echo "Database reset complete!"
```

## Usage

Run this command when you need to reset your database to a clean state, especially when making schema changes or when you want to start fresh during development.