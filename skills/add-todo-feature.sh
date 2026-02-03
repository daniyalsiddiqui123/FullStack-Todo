#!/bin/bash
# Skill: Add New Todo Feature
# Description: Generate files for a new todo feature

echo "➕ Adding new todo feature..."

if [ $# -eq 0 ]; then
    echo "Usage: $0 <feature-name>"
    echo "Example: $0 calendar-integration"
    exit 1
fi

FEATURE_NAME=$1
FEATURE_DIR="src/features/$FEATURE_NAME"

# Create feature directory structure
mkdir -p "$FEATURE_DIR/components"
mkdir -p "$FEATURE_DIR/hooks"
mkdir -p "$FEATURE_DIR/utils"
mkdir -p "$FEATURE_DIR/types"

# Create a basic component
cat > "$FEATURE_DIR/components/${FEATURE_NAME}.tsx" << EOF
'use client'

import React from 'react';

interface ${FEATURE_NAME^}Props {
  // Define props here
}

const ${FEATURE_NAME^}: React.FC<${FEATURE_NAME^}Props> = ({}) => {
  return (
    <div className="${FEATURE_NAME}">
      <h2>${FEATURE_NAME^} Component</h2>
      {/* Add your component logic here */}
    </div>
  );
};

export default ${FEATURE_NAME^};
EOF

# Create a hook if needed
cat > "$FEATURE_DIR/hooks/use${FEATURE_NAME^}.ts" << EOF
import { useState, useEffect } from 'react';

export const use${FEATURE_NAME^} = () => {
  const [data, setData] = useState<any>(null);

  // Add your hook logic here

  return { data, /* other return values */ };
};
EOF

echo "✅ Created new feature: $FEATURE_NAME"
echo "📁 Feature directory: $FEATURE_DIR"
echo "📄 Component: $FEATURE_DIR/components/${FEATURE_NAME}.tsx"
echo "📄 Hook: $FEATURE_DIR/hooks/use${FEATURE_NAME^}.ts"