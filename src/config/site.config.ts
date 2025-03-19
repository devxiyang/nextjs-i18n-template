export const siteConfig = {
    name: 'Resume Maker',
    description: 'Resume Maker is a tool that helps you create a resume',
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
        name: 'About',
        href: '/about',
    },
]