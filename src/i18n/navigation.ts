import { createNavigation } from 'next-intl/navigation';
import { Pathnames } from 'next-intl/routing';
import { siteConfig } from '@/config/site.config';

export const locales = siteConfig.locales;
export const localePrefix = 'always'; // Default

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales, localePrefix }); 