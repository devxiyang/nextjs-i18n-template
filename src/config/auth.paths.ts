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
  DEBUG: '/protected/debug',
  
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
} as const; // 使用 as const 确保对象是只读的

/**
 * 从AUTH_PATHS类型提取页面路径的类型
 * 这样可以在其他地方使用这个类型作为路径参数的类型约束
 */
export type AuthPagePath = typeof AUTH_PATHS.SIGN_IN | typeof AUTH_PATHS.SIGN_OUT | 
                         typeof AUTH_PATHS.PROFILE | typeof AUTH_PATHS.DEBUG;

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
 * 检查路径是否需要身份认证
 * @param path 要检查的路径
 * @returns 如果路径需要认证则为true，否则为false
 */
export function requiresAuth(path: string): boolean {
  if (!path) return false;
  return path.startsWith(PROTECTED_PREFIX);
} 