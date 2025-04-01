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

  // Synchronize theme on render
  useEffect(() => {
    setMounted(true);
    // If the Zustand stored theme differs from the current theme, update the current theme
    if (userStoreTheme && userStoreTheme !== 'system' && userStoreTheme !== theme) {
      setTheme(userStoreTheme);
    }
  }, [userStoreTheme, setTheme]);

  // Toggle theme and update the store
  const toggleTheme = () => {
    // Use resolvedTheme instead of theme to ensure we get the actually applied theme
    const currentTheme = resolvedTheme || theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setUserStoreTheme(newTheme);
  };

  // Avoid hydration mismatch
  if (!mounted) return null;

  // Use resolvedTheme to ensure button icon displays correctly
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