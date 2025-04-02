import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { AUTH_PATHS } from '@/config/auth.paths'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 使用搜索参数中的 next 值，如果没有则使用默认值
  const next = searchParams.get('next') || AUTH_PATHS.REDIRECT.AFTER_SIGN_IN
  
  // 错误重定向地址
  const errorUrl = `${origin}/auth/auth-code-error` 

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(errorUrl)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error.message)
      return NextResponse.redirect(errorUrl)
    }
    
    // 直接使用当前请求的origin作为基础URL
    const redirectPath = next.startsWith('/') ? next : `/${next}`
    return NextResponse.redirect(`${origin}${redirectPath}`)
    
  } catch (err) {
    console.error('Unexpected error in auth callback:', err)
    return NextResponse.redirect(errorUrl)
  }
}