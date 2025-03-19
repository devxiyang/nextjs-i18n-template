import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { siteConfig } from '@/config/site.config';
export const routing = defineRouting({
    // A list of all locales that are supported
    locales: siteConfig.locales,

    // Used when no locale matches
    defaultLocale: siteConfig.defaultLocale
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);