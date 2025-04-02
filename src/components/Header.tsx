"use client";

import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { UserAccountNav } from '@/components/auth/user-account-nav';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation, siteConfig } from '@/config/site.config';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function Header() {
  const t = useTranslations('common');
  const authT = useTranslations('auth');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up Supabase auth state change listener
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
          
          {/* User Menu */}
          {isLoading ? null : user ? (
            <UserAccountNav user={user} />
          ) : (
            <Button asChild variant="ghost" size="sm" className="hover:text-foreground/70">
              <Link href="/sign-in">{authT('header.signIn')}</Link>
            </Button>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('header.openMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="pr-0 bg-background/80 backdrop-blur-md border-l border-border/30 [&>button]:hidden"
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
                
                {/* Add login/register link on mobile */}
                {!user && (
                  <Link
                    href="/sign-in"
                    className="px-6 py-3 hover:bg-accent/70 hover:text-accent-foreground transition-colors rounded-l-md"
                    onClick={() => setOpen(false)}
                  >
                    {authT('header.signInRegister')}
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 