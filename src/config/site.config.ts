export const siteConfig = {
    name: 'Next.js I18n Template',
    description: 'Next.js template with internationalization and authentication',
    locales: ['en', 'zh', 'ja', 'fr', 'de', 'es'],
    defaultLocale: 'en',
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
}

export const navigation = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Profile',
        href: '/protected/profile',
    }
]