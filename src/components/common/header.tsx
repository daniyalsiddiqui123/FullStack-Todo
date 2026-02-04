'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuthCookie } from '@/lib/auth/cookies.client';
import { useTheme } from '@/contexts/theme-context';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const pathname = usePathname();

  // Effect to check authentication status once on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check authentication status by making an API call
        const response = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include' // Important: include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();

          if (data.authenticated) {
            setIsLoggedIn(true);
            if (data.user && data.user.email) {
              setUserEmail(data.user.email);
            } else {
              setUserEmail('User');
            }
          } else {
            setIsLoggedIn(false);
            setUserEmail('');
          }
        } else {
          setIsLoggedIn(false);
          setUserEmail('');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setUserEmail('');
      }

      // Set loading to false after the first check
      setIsLoading(false);
    };

    // Initial check after a small delay to ensure page is ready
    const initialCheck = setTimeout(checkAuthStatus, 100);

    // Also listen for auth changes (in case login/logout happens elsewhere)
    const handleAuthEvent = () => {
      checkAuthStatus();
    };

    window.addEventListener('auth-change', handleAuthEvent);

    return () => {
      clearTimeout(initialCheck);
      window.removeEventListener('auth-change', handleAuthEvent);
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = pathname?.includes('/auth');
  const isLandingPage = pathname === '/' || pathname === '/index';

  if (isAuthPage || isLandingPage) {
    return null; // Don't show header on auth pages or landing page
  }

  // Don't render header until auth status is determined to avoid flickering
  if (isLoading) {
    // Show a minimal header or loading state
    return (
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">TodoPro</span>
            </div>
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TodoPro</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/dashboard'
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/20'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/ai-chatbot"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/ai-chatbot'
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/20'
                }`}
              >
                AI Assistant
              </Link>
            </nav>
          </div>

          {/* Mobile menu button - Visible only on mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent/20 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>

          {/* Desktop Right Side Items - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => toggleTheme()}
              className="p-2 rounded-xl hover:bg-accent/20 transition-all duration-200 group"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <div className="relative w-5 h-5">
                  <svg className="w-5 h-5 text-yellow-400 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="relative w-5 h-5">
                  <svg className="w-5 h-5 text-foreground transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </div>
              )}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* User Profile */}
                <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-primary-foreground font-medium text-sm">{getUserInitial()}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                  </div>
                  <span className="hidden sm:inline text-foreground/80">{userEmail ? userEmail.split('@')[0] : 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm shadow-primary/20"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu - Shown only when mobileMenuOpen is true */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/dashboard"
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/dashboard'
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/20'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/ai-chatbot"
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === '/ai-chatbot'
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/20'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Assistant
              </Link>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-border/30">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 pb-4">
                      {/* User Profile */}
                      <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-primary-foreground font-medium text-sm">{getUserInitial()}</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                        </div>
                        <span className="text-foreground/80">{userEmail ? userEmail.split('@')[0] : 'User'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/20 rounded-lg transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-4">
                    <Link
                      href="/auth/login"
                      className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/20 rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-4 py-3 text-sm font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-lg transition-all duration-200 shadow-sm shadow-primary/20"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                )}

                {/* Mobile Theme Toggle */}
                <div className="pt-2 px-4">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-accent/20 rounded-lg transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>Toggle Theme</span>
                    <div className="relative w-5 h-5">
                      {theme === 'dark' ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}