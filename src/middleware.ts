import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { siteConfig } from './config/site.config';
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', `/(${siteConfig.locales.join('|')})/:path*`]
};
