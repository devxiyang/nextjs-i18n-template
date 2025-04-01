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
import useUserStore from '@/store/userStore';
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
  
  // 使用Zustand状态
  const currentLanguage = useUserStore(state => state.preferences.language);
  const setUserLanguage = useUserStore(state => state.setLanguage);
  
  // 页面加载时同步当前语言到Zustand
  useEffect(() => {
    // 从URL中提取locale并更新Zustand
    const localeFromPath = window.location.pathname.split('/')[1];
    if (siteConfig.locales.includes(localeFromPath) && localeFromPath !== currentLanguage) {
      setUserLanguage(localeFromPath);
    }
  }, [currentLanguage, setUserLanguage]);

  const switchLocale = (locale: string) => {
    // 更新Zustand状态
    setUserLanguage(locale);
    // 切换路由
    router.push(pathname, { locale });
  };

  // 获取当前显示的语言国旗
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