import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// 创建一个处理国际化的中间件
const intlMiddleware = createIntlMiddleware(routing);

// 组合中间件：先处理 Supabase 会话，然后处理国际化
export async function middleware(request: NextRequest) {
  // 先处理 Supabase 会话
  const supabaseResponse = await updateSession(request);
  
  // 如果 Supabase 中间件返回了重定向或其他特殊响应，直接返回
  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }
  
  // 否则继续处理国际化路由
  return intlMiddleware(request);
}
 
export const config = {
  // 匹配所有需要国际化的路径，排除静态资源和API路由
  matcher: ['/((?!_next|api|.*\\..*).*)']
  // matcher: [
  //   /*
  //    * Match all request paths except:
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico (favicon file)
  //    * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
  //    * Feel free to modify this pattern to include more paths.
  //    */
  //   "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  // ],
};
