import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest } from 'next/server';

// Create middleware to handle internationalization
const intlMiddleware = createIntlMiddleware(routing);

// Combined middleware: first handle Supabase session, then handle i18n
export async function middleware(request: NextRequest) {
  // First process Supabase session
  const supabaseResponse = await updateSession(request);
  
  // If Supabase middleware returns a redirect or other special response, return it directly
  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }
  
  // Otherwise continue with i18n routing
  return intlMiddleware(request);
}
 
export const config = {
  // Match all paths that need internationalization, exclude static assets and API routes
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
