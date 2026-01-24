import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'auth_token';

export async function setAuthCookie(token: string, res?: NextResponse): Promise<void> {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'strict' as const,
    path: '/',
  };

  if (res) {
    res.cookies.set(TOKEN_COOKIE_NAME, token, cookieOptions);
  } else {
    // For Next.js 16, cookies() returns a Promise
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, token, cookieOptions);
  }
}

export async function getAuthCookie(req?: NextRequest): Promise<string | undefined> {
  if (req) {
    const tokenCookie = req.cookies.get(TOKEN_COOKIE_NAME);
    return tokenCookie?.value;
  }

  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

export async function clearAuthCookie(res?: NextResponse): Promise<void> {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expire immediately
    sameSite: 'strict' as const,
    path: '/',
  };

  if (res) {
    res.cookies.set(TOKEN_COOKIE_NAME, '', cookieOptions);
  } else {
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, '', cookieOptions);
  }
}
