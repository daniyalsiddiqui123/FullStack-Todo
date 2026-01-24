import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators';
import { findUserByEmail } from '@/lib/db/user-service';
import { verifyPassword } from '@/lib/auth/password';
import { setAuthCookie } from '@/lib/auth/cookies.server';
import { signToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the input
    const validatedData = loginSchema.parse(body);

    // Find the user by email
    const user = await findUserByEmail(validatedData.email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Verify the password
    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signToken(user.id, user.email);

    // Set the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      }
    });

    setAuthCookie(token, response);

    return response;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}