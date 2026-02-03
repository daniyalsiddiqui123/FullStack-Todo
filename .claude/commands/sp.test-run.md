# Test Runner Skill

Run all tests for the project with coverage reporting.

## Command Definition

```bash
sp.test-run
```

## Behavior

This skill will:
1. Run all unit tests
2. Run integration tests
3. Generate coverage reports
4. Display test results

## Implementation

```bash
#!/bin/bash
echo "Running all tests..."

# Run unit tests
npm test

# If using Jest, run with coverage
if [ -f "node_modules/.bin/jest" ]; then
    echo "Running tests with coverage..."
    npx jest --coverage
fi

echo "Tests completed!"
```

## Usage

Run this command to execute all tests in your project and get coverage reports.