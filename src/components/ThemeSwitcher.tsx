"use client";

import { useTheme as useNextTheme } from "next-themes";
import { Button } from './ui/button';
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import useTheme from '@/hooks/useTheme';
import { useTranslations } from "next-intl";

export default function ThemeSwitcher() {
  const t = useTranslations('common');
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const userStoreTheme = useTheme(state => state.theme);
  const setUserStoreTheme = useTheme(state => state.setTheme);

  // Synchronize theme on render
  useEffect(() => {
    setMounted(true);
    // If the Zustand stored theme differs from the current theme, update the current theme
    if (userStoreTheme && userStoreTheme !== 'system' && userStoreTheme !== theme) {
      setTheme(userStoreTheme);
    }
  }, [userStoreTheme, setTheme, theme]);

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