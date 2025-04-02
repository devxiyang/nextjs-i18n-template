import { requiresAuth, AUTH_PATHS } from '@/config/auth.paths'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Get user session
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
    url.pathname = AUTH_PATHS.SIGN_IN
    url.searchParams.set('next', request.nextUrl.pathname)
    
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}