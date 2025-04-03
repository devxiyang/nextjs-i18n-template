import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

// Create middleware to handle internationalization
const intlMiddleware = createIntlMiddleware(routing);

// i18n middleware
export async function middleware(request: NextRequest) {
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
