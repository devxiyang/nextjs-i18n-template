"use client";

import { useTheme } from "next-themes";
import { Button } from './ui/button';
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import useUserStore from '@/store/userStore';
import { useTranslations } from "next-intl";

export default function ThemeSwitcher() {
  const t = useTranslations('common');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const userStoreTheme = useUserStore(state => state.preferences.theme);
  const setUserStoreTheme = useUserStore(state => state.setTheme);

  // 在渲染时同步theme
  useEffect(() => {
    setMounted(true);
    // 如果Zustand存储的主题与当前主题不同，更新当前主题
    if (userStoreTheme && userStoreTheme !== theme) {
      setTheme(userStoreTheme);
    }
  }, [theme, userStoreTheme, setTheme]);

  // 切换主题并更新存储
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setUserStoreTheme(newTheme);
  };

  // 避免水合不匹配
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t('toggleTheme')}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
} 