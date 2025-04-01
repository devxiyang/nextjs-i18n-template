import { requiresAuth, AUTH_PATHS } from '@/config/auth.paths'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 删除本地常量，改用配置文件
// const PROTECTED_PREFIXES = ['/protected/'];

// 删除本地函数，改用配置文件中的函数
// function requiresAuth(path: string): boolean {
//   return PROTECTED_PREFIXES.some(prefix => path.startsWith(prefix));
// }

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

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 移除语言前缀后再检查是否需要认证
  // 例如：'/en/protected/keywords' -> '/protected/keywords'
  const pathWithoutLocale = request.nextUrl.pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '');
  
  // 基于路径约定判断是否需要认证
  if (!user && requiresAuth(pathWithoutLocale)) {
    // 简化：直接重定向到登录路径，让next-intl处理locale
    const url = request.nextUrl.clone()
    url.pathname = AUTH_PATHS.SIGN_IN
    url.searchParams.set('next', request.nextUrl.pathname)
    
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}