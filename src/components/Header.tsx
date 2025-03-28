"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { navigation } from '@/config/site.config';
import { useParams } from 'next/navigation';
import { siteConfig } from '@/config/site.config';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Header() {
  const t = useTranslations('common');
  const params = useParams();
  const currentLocale = params.locale as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
          </nav>
        </div>
      )}
    </header>
  );
} 