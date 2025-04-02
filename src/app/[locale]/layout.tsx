import Header from '@/components/Header';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from "next-themes";
import { Inter, Source_Code_Pro } from "next/font/google";
import { notFound } from 'next/navigation';
import "./globals.css";
import { siteConfig } from '@/config/site.config';
import { createClient } from '@/utils/supabase/server';
import { AuthProvider } from '@/components/providers/auth-provider';

// Load fonts
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

// Get dynamic params for internationalization
export function generateStaticParams() {
  return siteConfig.locales.map(locale => ({ locale }));
}

/**
 * Root Layout Component
 * 
 * This is a Server Component that:
 * 1. Handles i18n setup and language detection
 * 2. Sets up theming and base layout structure
 * 3. Initializes authentication state
 */
export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Get locale from route params
  const { locale } = await params;

  // Load translations for the detected locale
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(error);
    notFound();
  }
  
  // Get session and user data from Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sourceCodePro.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider initialUser={user} />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
