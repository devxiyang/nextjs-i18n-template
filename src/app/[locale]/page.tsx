'use client'

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site.config';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-in"
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('auth.signIn.title')}
            </Link>
            <Link
              href="/protected/profile"
              className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
            >
              {t('auth.profile.title')}
            </Link>
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {t('common.languageSwitcher')}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {siteConfig.locales.map((locale: string) => (
                <Link 
                  key={locale}
                  href="/"
                  locale={locale}
                  className="px-4 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {locale.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
