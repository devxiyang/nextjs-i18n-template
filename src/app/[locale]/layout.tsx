import Header from '@/components/Header';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from 'next/navigation';
import "./globals.css";
import StoreHydration from '@/components/StoreHydration';

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js i18n Template",
  description: "A Next.js template with i18n support",
};

// Get dynamic params for internationalization
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'es' }, { locale: 'ja' }];
}

/**
 * Root Layout Component
 * 
 * This is a Server Component that:
 * 1. Handles i18n setup and language detection
 * 2. Sets up theming and base layout structure
 * 3. Initializes client-side state with StoreHydration
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
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <StoreHydration initialLanguage={locale} />
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
