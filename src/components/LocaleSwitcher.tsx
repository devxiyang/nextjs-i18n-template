"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations('common');
  const currentLocale = params.locale as string;

  // Handle locale change
  function handleLocaleChange(newLocale: string) {
    // Preserve the current pathname but change the locale
    router.push(pathname, { locale: newLocale });
  }

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-gray-200 hover:text-white hover:border-gray-600 focus:ring-gray-500 focus:ring-opacity-50">
        <Globe className="h-4 w-4 mr-2 text-gray-400" />
        <SelectValue placeholder={t('language')} />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
        {siteConfig.locales.map((locale) => (
          <SelectItem 
            key={locale} 
            value={locale}
            className={`${currentLocale === locale ? 'bg-gray-700' : ''} hover:bg-gray-700 focus:bg-gray-700 focus:text-white`}
          >
            <span className="flex items-center">
              <span className="mr-2">{languageFlags[locale]}</span>
              {languageNames[locale] || locale}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 