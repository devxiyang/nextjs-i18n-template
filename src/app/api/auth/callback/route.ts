import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 确保路径包含语言前缀
      const hasLanguagePrefix = /^\/[a-z]{2}(\/|$)/.test(next)
      const redirectPath = hasLanguagePrefix ? next : `/en${next}`
      
      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
    }
  }

  // 默认重定向到首页
  return NextResponse.redirect(new URL('/en', requestUrl.origin))
}