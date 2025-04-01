import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
import { AUTH_PATHS } from '@/config/auth.paths'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 使用搜索参数中的 next 值，如果没有则使用默认值
  const next = searchParams.get('next') || AUTH_PATHS.REDIRECT.AFTER_SIGN_IN
  
  // 错误重定向地址 - 这里也可以使用配置，但目前保持简单
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

    // 处理重定向
    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    
    let baseUrl: string;
    
    if (isLocalEnv) {
      baseUrl = origin;
    } else if (forwardedHost) {
      const protocol = forwardedProto || 'https';
      baseUrl = `${protocol}://${forwardedHost}`;
    } else {
      baseUrl = origin;
    }
    
    // 构建有效的重定向URL
    const redirectPath = next.startsWith('/') ? next : `/${next}`;
    return NextResponse.redirect(`${baseUrl}${redirectPath}`);
    
  } catch (err) {
    console.error('Unexpected error in auth callback:', err)
    return NextResponse.redirect(errorUrl)
  }
}