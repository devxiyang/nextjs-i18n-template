import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Auth path constants
const PROTECTED_PATH_PREFIX = '/protected';
const SIGN_IN_PATH = '/sign-in';

// Convention: Any route starting with '/protected' requires authentication
function requiresAuth(path: string): boolean {
  if (!path) return false;
  return path.startsWith(PROTECTED_PATH_PREFIX);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Remove language prefix before checking if auth is required
  // Example: '/en/protected/keywords' -> '/protected/keywords'
  const pathWithoutLocale = request.nextUrl.pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '')
  
  // Check if authentication is required based on path convention
  if (!user && requiresAuth(pathWithoutLocale)) {
    // Redirect to login page with next parameter for return after login
    const url = request.nextUrl.clone()
    url.pathname = SIGN_IN_PATH
    url.searchParams.set('next', request.nextUrl.pathname)
    
    return NextResponse.redirect(url)
  }

  return supabaseResponse
} 