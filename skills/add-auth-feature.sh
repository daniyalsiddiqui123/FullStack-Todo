#!/bin/bash
# Skill: Add Authentication Feature
# Description: Generate authentication-related files

echo "🔐 Adding authentication feature..."

AUTH_DIR="src/lib/auth"

# Create auth directory structure
mkdir -p "$AUTH_DIR"

# Create JWT utility
cat > "$AUTH_DIR/jwt.ts" << EOF
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_for_development'
);

export interface JWTPayload {
  jti: string;
  iat: number;
  exp: number;
  userId: string;
  email: string;
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'>): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24; // 24 hours

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
EOF

# Create auth middleware
cat > "$AUTH_DIR/middleware.ts" << EOF
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export async function authenticate(req: NextRequest): Promise<{ isValid: boolean; userId?: string; email?: string }> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return { isValid: false };
  }

  try {
    const payload = await verifyToken(token);
    return {
      isValid: true,
      userId: payload.userId,
      email: payload.email
    };
  } catch (error) {
    return { isValid: false };
  }
}
EOF

# Create auth utils
cat > "$AUTH_DIR/utils.ts" << EOF
import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export function getAuthToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get('auth-token')?.value || null;
}

export async function getCurrentUser() {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);
    return {
      id: payload.userId,
      email: payload.email
    };
  } catch (error) {
    return null;
  }
}
EOF

echo "✅ Created authentication feature"
echo "📁 Auth directory: $AUTH_DIR"
echo "📄 JWT utilities: $AUTH_DIR/jwt.ts"
echo "📄 Auth middleware: $AUTH_DIR/middleware.ts"
echo "📄 Auth utils: $AUTH_DIR/utils.ts"