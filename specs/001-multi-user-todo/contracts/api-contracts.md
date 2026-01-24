# API Contracts: Multi-User Todo Web Application

**Feature**: Multi-User Todo Web Application
**Date**: 2026-01-13
**Branch**: 001-multi-user-todo

## Overview

This document defines the API contracts for the multi-user todo web application based on the functional requirements in the feature specification.

## Authentication Endpoints

### POST /api/auth/register
**Description**: Register a new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": "Email already exists"
}
```

### POST /api/auth/login
**Description**: Authenticate user and return JWT token

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "token": "jwt-token-string",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

**Response (401 Unauthorized)**:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### POST /api/auth/logout
**Description**: Logout user and invalidate session

**Request**: None (uses authentication header)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Todo Management Endpoints

### GET /api/todos
**Description**: Retrieve all todos for the authenticated user

**Request**: None (uses authentication header)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "todo-id-1",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "userId": "user-id"
    },
    {
      "id": "todo-id-2",
      "title": "Finish report",
      "description": "Complete quarterly report",
      "completed": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z",
      "userId": "user-id"
    }
  ]
}
```

### POST /api/todos
**Description**: Create a new todo for the authenticated user

**Request**:
```json
{
  "title": "New todo title",
  "description": "Optional description",
  "completed": false
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "new-todo-id",
    "title": "New todo title",
    "description": "Optional description",
    "completed": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "userId": "user-id"
  }
}
```

### PUT /api/todos/{id}
**Description**: Update an existing todo for the authenticated user

**Request**:
```json
{
  "title": "Updated todo title",
  "description": "Updated description",
  "completed": true
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "existing-todo-id",
    "title": "Updated todo title",
    "description": "Updated description",
    "completed": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:01Z",
    "userId": "user-id"
  }
}
```

### PATCH /api/todos/{id}/toggle
**Description**: Toggle the completed status of a todo

**Request**: None (uses authentication header)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "existing-todo-id",
    "title": "Todo title",
    "description": "Todo description",
    "completed": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:01Z",
    "userId": "user-id"
  }
}
```

### DELETE /api/todos/{id}
**Description**: Delete a todo for the authenticated user

**Request**: None (uses authentication header)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

## Security Requirements

### Authentication Headers
All authenticated endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### Data Isolation
- All endpoints must verify that the requesting user owns the data being accessed
- Users cannot access, modify, or delete other users' todos
- API will return 404 for resources that don't belong to the user (rather than 403) to avoid revealing existence of other users' data

### Input Validation
- All string inputs must be validated for length and content
- All IDs must be validated for proper format
- Passwords must meet minimum strength requirements during registration
- Email must be validated for proper format

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": "Additional details about the error (optional)"
}
```

### Common HTTP Status Codes
- 200: Successful request
- 201: Resource created successfully
- 400: Bad request (validation error)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 409: Conflict (e.g., email already exists)
- 500: Internal server error