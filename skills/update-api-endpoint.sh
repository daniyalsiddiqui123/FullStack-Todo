#!/bin/bash
# Skill: Update API Endpoint
# Description: Generate files for a new API endpoint

echo "🔗 Creating new API endpoint..."

if [ $# -eq 0 ]; then
    echo "Usage: $0 <endpoint-name>"
    echo "Example: $0 statistics"
    exit 1
fi

ENDPOINT_NAME=$1
ENDPOINT_DIR="src/app/api/$ENDPOINT_NAME"

# Create API route directory
mkdir -p "$ENDPOINT_DIR"

# Create GET route
cat > "$ENDPOINT_DIR/route.ts" << EOF
import { NextRequest, NextResponse } from 'next/server';

// GET /api/$ENDPOINT_NAME
export async function GET(request: NextRequest) {
  try {
    // Add your GET logic here
    return NextResponse.json({
      message: '$ENDPOINT_NAME endpoint accessed via GET',
      data: [] // Replace with actual data
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch $ENDPOINT_NAME data' },
      { status: 500 }
    );
  }
}

// POST /api/$ENDPOINT_NAME
export async function POST(request: NextRequest) {
  try {
    // Add your POST logic here
    const body = await request.json();

    return NextResponse.json({
      message: '$ENDPOINT_NAME endpoint accessed via POST',
      received: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process $ENDPOINT_NAME data' },
      { status: 500 }
    );
  }
}

// PUT /api/$ENDPOINT_NAME
export async function PUT(request: NextRequest) {
  try {
    // Add your PUT logic here
    const body = await request.json();

    return NextResponse.json({
      message: '$ENDPOINT_NAME endpoint accessed via PUT',
      updated: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update $ENDPOINT_NAME data' },
      { status: 500 }
    );
  }
}

// DELETE /api/$ENDPOINT_NAME
export async function DELETE(request: NextRequest) {
  try {
    // Add your DELETE logic here

    return NextResponse.json({
      message: '$ENDPOINT_NAME endpoint accessed via DELETE'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete $ENDPOINT_NAME data' },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Created new API endpoint: /api/$ENDPOINT_NAME"
echo "📁 Endpoint directory: $ENDPOINT_DIR"
echo "📄 Route file: $ENDPOINT_DIR/route.ts"