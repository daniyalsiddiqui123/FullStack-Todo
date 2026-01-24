# Quickstart Guide: Multi-User Todo Web Application

**Feature**: Multi-User Todo Web Application
**Date**: 2026-01-13
**Branch**: 001-multi-user-todo

## Overview

This guide provides step-by-step instructions to get the multi-user todo web application up and running quickly.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Neon PostgreSQL account with database credentials
- Git for version control

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="your_neon_postgres_connection_string"
NEXTAUTH_SECRET="your_jwt_secret_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Initialize Database

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev --name init
```

Generate Prisma client:

```bash
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Key Features Walkthrough

### 1. User Registration
- Navigate to `/auth/register`
- Fill in email and password
- Account is created and user is logged in

### 2. User Login
- Navigate to `/auth/login`
- Enter registered email and password
- JWT token is stored securely

### 3. Todo Management
- After authentication, visit `/dashboard`
- Create new todos with title and description
- Toggle completion status
- Edit or delete existing todos

### 4. Data Isolation
- Each user only sees their own todos
- Attempts to access other users' data are blocked

## Common Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm run test

# Run linter
npm run lint

# Apply database migrations
npx prisma db push

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## Troubleshooting

### Database Connection Issues
- Verify your Neon PostgreSQL connection string is correct
- Check that the database is accessible from your network
- Ensure the database schema has been applied with migrations

### Authentication Issues
- Verify JWT secret is properly set in environment variables
- Check that CORS settings allow requests from your domain
- Ensure the authentication middleware is properly configured

### UI Not Loading
- Confirm Tailwind CSS is properly configured
- Check browser console for JavaScript errors
- Verify all dependencies are installed correctly

## Next Steps

1. Customize the UI components in `components/ui/`
2. Add additional features based on your requirements
3. Set up automated testing
4. Configure production environment variables
5. Deploy to your preferred hosting platform