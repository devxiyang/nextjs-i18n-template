import { NextRequest, NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

// Auth and locale constants
const DEFAULT_REDIRECT_PATH = '/';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Get the redirect path, default to home
  const next = requestUrl.searchParams.get('next') || DEFAULT_REDIRECT_PATH
  const redirectUrl = new URL(next, requestUrl.origin)

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to target page after successful login
  return NextResponse.redirect(redirectUrl)
}