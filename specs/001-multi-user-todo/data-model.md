# Data Model: Multi-User Todo Web Application

**Feature**: Multi-User Todo Web Application
**Date**: 2026-01-13
**Branch**: 001-multi-user-todo

## Overview

This document defines the data model for the multi-user todo web application based on the feature specification and project constitution requirements.

## Entities

### User Entity

**Description**: Represents a registered user in the system

**Fields**:
- `id`: String (Primary Key) - Unique identifier for the user
- `email`: String (Unique) - User's email address for login and identification
- `passwordHash`: String - BCrypt hash of the user's password
- `createdAt`: DateTime - Timestamp when the user account was created
- `updatedAt`: DateTime - Timestamp when the user account was last updated

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users
- Password must meet security requirements (minimum length, complexity)
- Email and passwordHash are required fields

**Relationships**:
- One-to-Many: User has many Todos (via userId foreign key)

### Todo Entity

**Description**: Represents a task item owned by a specific user

**Fields**:
- `id`: String (Primary Key) - Unique identifier for the todo
- `title`: String - Title or short description of the todo
- `description`: String (Optional) - Detailed description of the todo
- `completed`: Boolean - Whether the todo is completed or not
- `createdAt`: DateTime - Timestamp when the todo was created
- `updatedAt`: DateTime - Timestamp when the todo was last updated
- `userId`: String (Foreign Key) - Reference to the owner user

**Validation Rules**:
- Title is required and must not be empty
- Title must be less than 255 characters
- Description, if provided, must be less than 1000 characters
- Completed defaults to false
- UserId is required and must reference an existing user
- Users can only access todos belonging to themselves

**Relationships**:
- Many-to-One: Todo belongs to one User (via userId foreign key)

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  todos         Todo[]

  @@map("users")
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("todos")
}
```

## State Transitions

### Todo State Transitions
- **Active** → **Completed**: When user marks todo as completed
- **Completed** → **Active**: When user unmarks todo as completed

### User Account States
- **Registered** → **Active**: When user completes registration and verification
- **Active** → **Suspended**: When account is administratively suspended (future feature)

## Data Access Patterns

### User-Specific Queries
- All queries must include user-specific filters to enforce data isolation
- Authentication and authorization must be validated before any data access
- Middleware should ensure users can only access their own data

### Common Query Patterns
1. Get all todos for a specific user
2. Get a specific todo for a specific user (to ensure ownership)
3. Create a new todo for a specific user
4. Update a specific todo owned by a specific user
5. Delete a specific todo owned by a specific user

## Security Considerations

### Data Isolation
- All database queries must include user ID filters
- Foreign key constraints enforce referential integrity
- Row-level security implemented via application layer validation

### Field-Level Security
- Password hashes must never be returned in API responses
- Internal timestamps (updatedAt) may be omitted from API responses if not needed by UI
- User emails may be partially masked in certain contexts for privacy

## Indexing Strategy

### Required Indexes
- User.email (unique index for login performance)
- Todo.userId (index for user-specific todo retrieval)
- Todo.completed (index for filtering completed vs active todos)
- Todo.createdAt (index for sorting by creation date)

## Validation Summary

### Input Validation
- Client-side validation for immediate user feedback
- Server-side validation as the authoritative check
- Database-level constraints as the final safeguard

### Business Rule Enforcement
- Users can only modify their own todos
- Todo ownership cannot be transferred between users
- Users cannot access other users' data through any means