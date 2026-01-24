import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators';
import { hashPassword } from '@/lib/auth/password';
import { createUser } from '@/lib/db/user-service';
import { setAuthCookie } from '@/lib/auth/cookies.server';
import { signToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the input
    const validatedData = registerSchema.parse(body);

    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create the user
    const user = await createUser(validatedData.email, hashedPassword);

    // Generate JWT token
    const token = await signToken(user.id, user.email);

    // Set the auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully',
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

    if (error.message === 'Email already exists') {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists'
        },
        { status: 409 }
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