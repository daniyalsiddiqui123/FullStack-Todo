#!/bin/bash
# Skill: Reset Database
# Description: Reset the database to a clean state

echo "🔄 Resetting database..."

# Reset database
echo "🗑️ Dropping and recreating database..."
npx prisma migrate reset --force

# Generate Prisma client
echo "⚙️ Regenerating Prisma client..."
npx prisma generate

# Run migrations
echo "🗄️ Running migrations..."
npx prisma migrate dev

# Seed database if seed script exists
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
elif [ -f "prisma/seed.ts" ]; then
    npx ts-node prisma/seed.ts
fi

echo "✅ Database reset complete!"