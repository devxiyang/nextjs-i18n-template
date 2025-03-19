import { createNavigation } from 'next-intl/navigation';
import { Pathnames } from 'next-intl/routing';

export const locales = ['en', 'zh'] as const;
export const localePrefix = 'always'; // Default

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same pathname, a
  // single external path can be provided.
  '/': '/',
  '/about': '/about',
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales, localePrefix }); 