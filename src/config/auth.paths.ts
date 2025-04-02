/**
 * Authentication paths configuration
 * 
 * This file contains all the authentication-related paths and redirects,
 * allowing for easy customization while maintaining the convention-based approach.
 */

// Protected route prefix - any route with this prefix requires authentication
export const PROTECTED_PREFIX = '/protected';

// Authentication page paths
export const AUTH_PATHS = {
  // Page paths
  SIGN_IN: '/sign-in',
  SIGN_OUT: '/sign-out',
  PROFILE: '/protected/profile',
  
  // API endpoints
  API: {
    CALLBACK: '/api/auth/callback',
    SIGN_OUT: '/api/auth/sign-out',
  },
  
  // Default redirects
  REDIRECT: {
    AFTER_SIGN_IN: '/',
    AFTER_SIGN_OUT: '/',
  }
} as const; // This makes the object read-only

/**
 * Extract page path types from AUTH_PATHS
 * This allows using this type as a constraint for path parameters elsewhere
 */
export type AuthPagePath = typeof AUTH_PATHS.SIGN_IN | typeof AUTH_PATHS.SIGN_OUT | 
                         typeof AUTH_PATHS.PROFILE;

/**
 * Standard URL parameter name for redirection after authentication.
 * 
 * NOTE: Due to Next.js typing constraints, this parameter should be hardcoded as 'next' 
 * in searchParams types (e.g., in page.tsx files) and when using searchParams.get().
 * Using a dynamic key like searchParams[REDIRECT_PARAM] can cause type errors.
 * 
 * Example usage in middleware:
 *   url.searchParams.set('next', returnPath);
 * 
 * Example usage in page props:
 *   searchParams: { next?: string }
 */
export const REDIRECT_PARAM = 'next';

/**
 * Check if a path requires authentication
 * @param path The path to check
 * @returns true if the path requires authentication, false otherwise
 */
export function requiresAuth(path: string): boolean {
  if (!path) return false;
  return path.startsWith(PROTECTED_PREFIX);
} 