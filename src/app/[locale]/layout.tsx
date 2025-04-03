import Header from '@/components/Header';
import { siteConfig } from '@/config/site.config';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from "next-themes";
import { Inter, Source_Code_Pro } from "next/font/google";
import { notFound } from 'next/navigation';
import "./globals.css";

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
 * 3. Initializes authentication state via Header component
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
        className={`${inter.variable} ${sourceCodePro.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
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
