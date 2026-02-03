# Skills Directory

This directory contains reusable automation scripts for common development tasks in the Todo application.

## Available Skills

### Development Setup
- `setup-dev.sh` - Complete setup for the development environment
- `reset-db.sh` - Reset the database to a clean state
- `start-dev.sh` - Start both frontend and MCP servers for development
- `start-dev.bat` - Windows-compatible version of start-dev

### Testing & Quality
- `run-tests.sh` - Run all tests with coverage reporting
- `add-test-suite.sh` - Generate test files for a component or feature

### Building & Deployment
- `build-prod.sh` - Build the project for production deployment
- `deploy-vercel.sh` - Deploy the frontend to Vercel
- `deploy-hf-space.sh` - Prepare and deploy MCP server to Hugging Face Spaces

### Feature Development
- `add-todo-feature.sh` - Generate files for a new todo feature
- `update-api-endpoint.sh` - Generate files for a new API endpoint
- `add-auth-feature.sh` - Generate authentication-related files
- `add-database-model.sh` - Generate Prisma schema and related files for a new model
- `add-component.sh` - Generate a new React component with tests

## Usage

Most skills are bash scripts that can be run directly:

```bash
chmod +x skills/setup-dev.sh
./skills/setup-dev.sh
```

Some skills are shell scripts that work on Windows:
```cmd
skills\start-dev.bat
```

Some skills take parameters:
```bash
./skills/add-component.sh my-new-component
./skills/add-database-model.sh category
```

## Purpose

These skills automate common development tasks, reducing the time spent on boilerplate code generation and environment setup. They help maintain consistency across the development workflow and make it easier for new team members to get started.