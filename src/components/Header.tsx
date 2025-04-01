"use client";

import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { UserAccountNav } from '@/components/auth/user-account-nav';
import { navigation, siteConfig } from '@/config/site.config';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';

export default function Header() {
  const t = useTranslations('common');
  const authT = useTranslations('auth');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    // 设置 Supabase 认证状态变化监听器
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full py-4 px-6 bg-gray-900 text-white dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/"
          className="text-xl font-bold hover:text-gray-300 transition-colors"
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
                className="hover:text-gray-300 transition-colors"
              >
                {t(`nav.${item.name.toLowerCase()}`)}
              </Link>
            ))}
          </nav>
          
          <LocaleSwitcher />
          
          <ThemeSwitcher />
          
          {/* 用户菜单 */}
          {isLoading ? null : user ? (
            <UserAccountNav user={user} />
          ) : (
            <Button asChild variant="ghost" size="sm" className="text-white hover:text-gray-300">
              <Link href="/sign-in">{authT('header.signIn')}</Link>
            </Button>
          )}
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-t border-gray-800 py-4 z-50 dark:bg-gray-900 dark:border-gray-800">
          <nav className="container mx-auto px-6 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-gray-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`nav.${item.name.toLowerCase()}`)}
              </Link>
            ))}
            
            {/* 移动端添加登录/注册链接 */}
            {!user && (
              <Link
                href="/sign-in"
                className="hover:text-gray-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {authT('header.signInRegister')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 