#!/bin/bash
# Skill: Add Test Suite
# Description: Generate test files for a component or feature

echo "🧪 Creating new test suite..."

if [ $# -eq 0 ]; then
    echo "Usage: $0 <component-or-feature-name>"
    echo "Example: $0 todo-item"
    exit 1
fi

COMPONENT_NAME=$1
TEST_DIR="__tests__"

# Create test directory if it doesn't exist
mkdir -p "$TEST_DIR"

# Create unit test file
cat > "$TEST_DIR/${COMPONENT_NAME}.test.tsx" << EOF
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Import the component you want to test
// import { COMPONENT_NAME } from '../src/path/to/component';

describe('$COMPONENT_NAME', () => {
  it('renders without crashing', () => {
    // Render your component
    // render(<COMPONENT_NAME />);

    // Add assertions
    // expect(screen.getByText('expected text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    // Test user interactions
    // render(<COMPONENT_NAME />);
    // fireEvent.click(screen.getByRole('button'));
    // expect(/* some condition */).toBe(true);
  });

  // Add more tests as needed
});
EOF

# Create integration test file
cat > "$TEST_DIR/${COMPONENT_NAME}.integration.test.tsx" << EOF
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Import the component and related services
// import { COMPONENT_NAME } from '../src/path/to/component';
// import { apiService } from '../src/services/api';

describe('$COMPONENT_NAME Integration', () => {
  it('works with API services', async () => {
    // Mock API calls
    // vi.spyOn(apiService, 'getData').mockResolvedValue(mockData);

    // Render component
    // render(<COMPONENT_NAME />);

    // Wait for async operations
    // await waitFor(() => {
    //   expect(screen.getByText('expected text')).toBeInTheDocument();
    // });
  });

  // Add more integration tests as needed
});
EOF

echo "✅ Created test suite for: $COMPONENT_NAME"
echo "📁 Test directory: $TEST_DIR"
echo "📄 Unit test: $TEST_DIR/${COMPONENT_NAME}.test.tsx"
echo "📄 Integration test: $TEST_DIR/${COMPONENT_NAME}.integration.test.tsx"