"use client";

import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { navigation, siteConfig } from '@/config/site.config';
import { Link } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from './ui/button';

export default function Header() {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full py-4 px-6 bg-background/95 backdrop-blur-sm text-foreground z-40 border-b border-border/20">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/"
          className="text-xl font-bold hover:text-foreground/70 transition-colors"
        >
          {t('siteTitle', { siteName: siteConfig.name })}
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground/70 transition-colors"
              >
                {t(`nav.${item.name.toLowerCase()}`)}
              </Link>
            ))}
          </nav>
          
          <LocaleSwitcher />
          
          <ThemeSwitcher />
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('header.openMenu')}</span>
              </Button>
            </SheetTrigger>
            {open && (
              <div 
                className="fixed inset-0 z-40 bg-background/25 dark:bg-background/15 backdrop-blur-3xl transition-all duration-300" 
                onClick={() => setOpen(false)}
              />
            )}
            <SheetContent 
              side="right" 
              className="pr-0 bg-background/80 dark:bg-background/60 backdrop-blur-md border-l border-border/30 dark:border-border/20 [&>button]:hidden"
            >
              <div className="absolute right-4 top-4">
                <SheetClose>
                  <X className="h-4 w-4 transition-transform group-hover:rotate-90" />
                </SheetClose>
              </div>
              <SheetHeader>
                <SheetTitle>{t('header.navigation')}</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-4 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-6 py-3 hover:bg-accent/70 hover:text-accent-foreground transition-colors rounded-l-md"
                    onClick={() => setOpen(false)}
                  >
                    {t(`nav.${item.name.toLowerCase()}`)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 