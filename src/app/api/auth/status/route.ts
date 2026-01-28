import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/auth/cookies.server';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({
        authenticated: false
      });
    }

    // Verify the token
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({
        authenticated: false
      });
    }

    // Token is valid, return user info
    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.userId || decoded.sub,
        email: decoded.email,
        name: decoded.name
      }
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({
      authenticated: false
    });
  }
}