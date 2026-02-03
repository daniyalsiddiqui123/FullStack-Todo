#!/bin/bash
# Skill: Add Component
# Description: Generate a new React component with tests

echo "🧩 Creating new React component..."

if [ $# -eq 0 ]; then
    echo "Usage: $0 <component-name>"
    echo "Example: $0 todo-item"
    exit 1
fi

COMPONENT_NAME=$1
COMPONENT_NAME_CAPITALIZED=$(echo "$COMPONENT_NAME" | sed 's/\b\w/\U&/g' | sed 's/-//g')

# Create components directory if it doesn't exist
COMPONENT_DIR="src/components/$COMPONENT_NAME"
mkdir -p "$COMPONENT_DIR"

# Create the component
cat > "$COMPONENT_DIR/$COMPONENT_NAME.tsx" << EOF
'use client';

import React from 'react';
import styles from './$COMPONENT_NAME.module.css';

interface ${COMPONENT_NAME_CAPITALIZED}Props {
  // Define your props here
  children?: React.ReactNode;
}

const ${COMPONENT_NAME_CAPITALIZED}: React.FC<${COMPONENT_NAME_CAPITALIZED}Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      <h2>${COMPONENT_NAME_CAPITALIZED}</h2>
      {children}
      {/* Add your component content here */}
    </div>
  );
};

export default ${COMPONENT_NAME_CAPITALIZED};
EOF

# Create CSS module
cat > "$COMPONENT_DIR/$COMPONENT_NAME.module.css" << EOF
.container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
}

/* Add your component styles here */
EOF

# Create index file for easy imports
cat > "$COMPONENT_DIR/index.ts" << EOF
export { default } from './$COMPONENT_NAME';
export * from './$COMPONENT_NAME';
EOF

# Create storybook file
cat > "$COMPONENT_DIR/$COMPONENT_NAME.stories.tsx" << EOF
import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import ${COMPONENT_NAME_CAPITALIZED}, { ${COMPONENT_NAME_CAPITALIZED}Props } from './$COMPONENT_NAME';

export default {
  title: 'Components/${COMPONENT_NAME_CAPITALIZED}',
  component: ${COMPONENT_NAME_CAPITALIZED},
  argTypes: {},
} as Meta<${COMPONENT_NAME_CAPITALIZED}Props>;

const Template: StoryFn<${COMPONENT_NAME_CAPITALIZED}Props> = (args) => <${COMPONENT_NAME_CAPITALIZED} {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
};
EOF

echo "✅ Created new component: $COMPONENT_NAME"
echo "📁 Component directory: $COMPONENT_DIR"
echo "📄 Component: $COMPONENT_DIR/$COMPONENT_NAME.tsx"
echo "📄 Styles: $COMPONENT_DIR/$COMPONENT_NAME.module.css"
echo "📄 Index: $COMPONENT_DIR/index.ts"
echo "📄 Storybook: $COMPONENT_DIR/$COMPONENT_NAME.stories.tsx"