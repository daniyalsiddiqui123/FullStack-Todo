#!/bin/bash
# Skill: Add Database Model
# Description: Generate Prisma schema and related files for a new model

echo "🗄️ Creating new database model..."

if [ $# -eq 0 ]; then
    echo "Usage: $0 <model-name>"
    echo "Example: $0 category"
    exit 1
fi

MODEL_NAME=$1
MODEL_NAME_CAPITALIZED=$(echo "$MODEL_NAME" | sed 's/./\U&/')

# Add model to Prisma schema
SCHEMA_FILE="prisma/schema.prisma"

if [ -f "$SCHEMA_FILE" ]; then
    # Check if model already exists
    if grep -q "model $MODEL_NAME_CAPITALIZED" "$SCHEMA_FILE"; then
        echo "⚠️ Model $MODEL_NAME already exists in schema.prisma"
        exit 1
    fi

    # Append the new model to the schema
    cat >> "$SCHEMA_FILE" << EOF


model $MODEL_NAME_CAPITALIZED {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Add more fields as needed
  // Example relations:
  // todos     Todo[]  @relation(references: [id])
}
EOF

    echo "✅ Added $MODEL_NAME_CAPITALIZED model to schema.prisma"
else
    echo "❌ prisma/schema.prisma file not found"
    exit 1
fi

# Create service file for the model
SERVICE_DIR="src/lib/db"
mkdir -p "$SERVICE_DIR"

cat > "$SERVICE_DIR/${MODEL_NAME}-service.ts" << EOF
import { PrismaClient } from '@prisma/client';
import prisma from './prisma';

export interface ${MODEL_NAME_CAPITALIZED}Input {
  name: string;
  // Add more fields as needed
}

export interface ${MODEL_NAME_CAPITALIZED} extends ${MODEL_NAME_CAPITALIZED}Input {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function create${MODEL_NAME_CAPITALIZED}(data: ${MODEL_NAME_CAPITALIZED}Input): Promise<${MODEL_NAME_CAPITALIZED}> {
  return prisma.${MODEL_NAME}$.create({
    data: {
      name: data.name,
      // Add more fields as needed
    }
  });
}

export async function get${MODEL_NAME_CAPITALIZED}ById(id: string): Promise<${MODEL_NAME_CAPITALIZED} | null> {
  return prisma.${MODEL_NAME}$.findUnique({
    where: { id }
  });
}

export async function getAll${MODEL_NAME_CAPITALIZED}s(): Promise<${MODEL_NAME_CAPITALIZED}[]> {
  return prisma.${MODEL_NAME}$.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function update${MODEL_NAME_CAPITALIZED}(id: string, data: Partial<${MODEL_NAME_CAPITALIZED}Input>): Promise<${MODEL_NAME_CAPITALIZED}> {
  return prisma.${MODEL_NAME}$.update({
    where: { id },
    data
  });
}

export async function delete${MODEL_NAME_CAPITALIZED}(id: string): Promise<${MODEL_NAME_CAPITALIZED}> {
  return prisma.${MODEL_NAME}$.delete({
    where: { id }
  });
}
EOF

echo "✅ Created database model: $MODEL_NAME"
echo "📄 Updated: prisma/schema.prisma"
echo "📄 Service: $SERVICE_DIR/${MODEL_NAME}-service.ts"

echo ""
echo "💡 Remember to run: npx prisma generate && npx prisma migrate dev"