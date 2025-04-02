"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site.config";
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Globe } from "lucide-react";
import useLanguage from '@/hooks/useLanguage';
import { useEffect } from 'react';

// Language display names mapping
const languageNames: Record<string, string> = {
  en: "English",
  zh: "中文",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  ja: "日本語"
};

// Flag emojis for languages
const languageFlags: Record<string, string> = {
  en: "🇺🇸",
  zh: "🇨🇳",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  ja: "🇯🇵"
};

export default function LocaleSwitcher() {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  
  // Use Zustand state
  const currentLanguage = useLanguage(state => state.language);
  const setUserLanguage = useLanguage(state => state.setLanguage);
  
  // Synchronize current language to Zustand on page load
  useEffect(() => {
    // Extract locale from URL and update Zustand
    const localeFromPath = window.location.pathname.split('/')[1];
    if (siteConfig.locales.includes(localeFromPath) && localeFromPath !== currentLanguage) {
      setUserLanguage(localeFromPath);
    }
  }, [currentLanguage, setUserLanguage]);

  const switchLocale = (locale: string) => {
    // Update Zustand state
    setUserLanguage(locale);
    // Switch route
    router.push(pathname, { locale });
  };

  // Get current language flag
  const currentFlag = currentLanguage ? languageFlags[currentLanguage] : '🌐';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
          <span className="text-base mr-1">{currentFlag}</span>
          <span className="hidden sm:inline">{currentLanguage ? languageNames[currentLanguage] : t('language')}</span>
          <Globe className="h-4 w-4 sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {siteConfig.locales.map((locale) => (
          <DropdownMenuItem 
            key={locale}
            onClick={() => switchLocale(locale)}
            className={`flex items-center gap-2 min-w-[140px] ${locale === currentLanguage ? "bg-muted" : ""}`}
          >
            <span className="text-base">{languageFlags[locale]}</span>
            <span>{languageNames[locale]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 