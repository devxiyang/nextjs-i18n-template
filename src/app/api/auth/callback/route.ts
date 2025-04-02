import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

// Auth and locale constants
const DEFAULT_REDIRECT_PATH = '/';
const DEFAULT_LANGUAGE_PREFIX = '/en';
const LANGUAGE_PREFIX_REGEX = /^\/[a-z]{2}(\/|$)/;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Get the redirect path, default to home
  const next = requestUrl.searchParams.get('next') || DEFAULT_REDIRECT_PATH

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Ensure path includes language prefix
      const hasLanguagePrefix = LANGUAGE_PREFIX_REGEX.test(next)
      const redirectPath = hasLanguagePrefix ? next : `${DEFAULT_LANGUAGE_PREFIX}${next}`
      
      // Redirect to target page after successful login
      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
    }
  }

  // Redirect to home if login fails or no code provided
  return NextResponse.redirect(new URL(DEFAULT_LANGUAGE_PREFIX, requestUrl.origin))
}