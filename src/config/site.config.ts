export const siteConfig = {
    name: 'DevSEO.Click',
    description: 'Developer-focused SEO keyword research tool with usage-based pricing',
    locales: ['en', 'zh', 'ja', 'fr', 'de', 'es'],
    defaultLocale: 'en',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
}

export const navigation = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Pricing',
        href: '/pricing',
    },
    {
        name: 'About',
        href: '/about',
    }
]