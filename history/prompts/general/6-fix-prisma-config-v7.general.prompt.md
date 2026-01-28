---
id: 6
title: fix-prisma-config-v7
stage: general
date_iso: 2026-01-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 002-natural-language-task-agent
user: Claude
command: "fix Prisma database configuration for v7.2.0"
labels: ["database", "prisma", "configuration", "migration"]
spec: null
ticket: null
adr: null
pr: null
---

# Fix Prisma Database Configuration for v7.2.0

## Prompt Text
User reported 500 Internal Server Error when adding tasks via POST /api/todos.

## Response Text
Identified that the issue was caused by incorrect Prisma 7.2.0 configuration. The database schema was not properly applied due to configuration format changes in Prisma v7. Fixed by:

1. Removed the URL from the schema.prisma file (Prisma v7 doesn't allow it there)
2. Created proper prisma.config.js file with the database URL
3. Ran 'npx prisma db push' to apply the schema to the database
4. Ensured the 'todos' table exists in the database

The Prisma v7.2.0 configuration requires the database URL in a separate config file, not in the schema file.

## Files Modified
- prisma/schema.prisma
- prisma.config.js

## Outcome
Database tables have been created and API calls should now work properly.

## Evaluation
The POST /api/todos endpoint should now work without 500 errors.