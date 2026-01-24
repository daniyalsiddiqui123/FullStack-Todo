'use client';

import Link from 'next/link';
import { getAuthCookie } from '@/lib/auth/cookies.client';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthCookie();
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.email) {
              setUserEmail(payload.email);
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        setUserEmail('');
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {isLoggedIn ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <span>{userEmail ? userEmail.split('@')[0] : 'User'}</span>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}