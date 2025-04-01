"use client";

import { useTheme } from "next-themes";
import { Button } from './ui/button';
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import useUserStore from '@/store/userStore';
import { useTranslations } from "next-intl";

export default function ThemeSwitcher() {
  const t = useTranslations('common');
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const userStoreTheme = useUserStore(state => state.preferences.theme);
  const setUserStoreTheme = useUserStore(state => state.setTheme);

  // 在渲染时同步theme
  useEffect(() => {
    setMounted(true);
    // 如果Zustand存储的主题与当前主题不同，更新当前主题
    if (userStoreTheme && userStoreTheme !== 'system' && userStoreTheme !== theme) {
      setTheme(userStoreTheme);
    }
  }, [userStoreTheme, setTheme]);

  // 切换主题并更新存储
  const toggleTheme = () => {
    // 使用resolvedTheme替代theme可以确保获取到实际应用的主题
    const currentTheme = resolvedTheme || theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setUserStoreTheme(newTheme);
  };

  // 避免水合不匹配
  if (!mounted) return null;

  // 使用resolvedTheme确保按钮图标显示正确
  const currentTheme = resolvedTheme || theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t('toggleTheme')}
    >
      {currentTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
} 