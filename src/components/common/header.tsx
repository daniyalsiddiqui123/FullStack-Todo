'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuthCookie } from '@/lib/auth/cookies.client';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const pathname = usePathname();

  // Effect to check authentication status once on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Direct cookie check
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        // Also try getAuthCookie function
        const funcToken = getAuthCookie();

        // Use either method, prioritize the one that has a value
        const token = cookieValue || funcToken;

        const isCurrentlyLoggedIn = !!token && token.length > 0;

        setIsLoggedIn(isCurrentlyLoggedIn);

        if (isCurrentlyLoggedIn && token) {
          // Extract user info from token
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              if (payload.email) {
                setUserEmail(payload.email);
              }
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
          }
        } else {
          setUserEmail('');
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        setIsLoggedIn(false);
        setUserEmail('');
      }

      // Set loading to false after the first check
      setIsLoading(false);
    };

    // Initial check after a small delay to ensure cookies are available
    const initialCheck = setTimeout(checkAuthStatus, 100);

    return () => {
      clearTimeout(initialCheck);
    };
  }, []); // Run once on mount and clean up on unmount

  // Function to get initial from email
  const getUserInitial = () => {
    if (!userEmail) return 'U';
    return userEmail.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Clear the auth cookie manually
        document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Redirect to main landing page after logout
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthPage = pathname?.includes('/auth');
  const isLandingPage = pathname === '/' || pathname === '/index';

  if (isAuthPage || isLandingPage) {
    return null; // Don't show header on auth pages or landing page
  }

  // Don't render header until auth status is determined to avoid flickering
  if (isLoading) {
    // Show a minimal header or loading state
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">TodoPro</span>
            </div>
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  // Special handling for dashboard page - since middleware protects it,
  // we can assume user is authenticated if they're on this page
  const isDashboardPage = pathname === '/dashboard';

  // For dashboard page, always show profile/logout if loading is done
  const showProfileOnDashboard = isDashboardPage && !isLoading;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">TodoPro</span>
            </Link>
            <nav className="ml-6 flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/dashboard'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            {isLoggedIn || showProfileOnDashboard ? (
              <div className="flex items-center space-x-4">
                {/* User Profile */}
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">{getUserInitial()}</span>
                  </div>
                  <span>{userEmail ? userEmail.split('@')[0] : 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}