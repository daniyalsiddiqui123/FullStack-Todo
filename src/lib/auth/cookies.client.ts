'use client';

const TOKEN_COOKIE_NAME = 'auth_token';

export function getAuthCookie(): string | undefined {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${TOKEN_COOKIE_NAME}=`))
    ?.split('=')[1];

  return cookieValue;
}
