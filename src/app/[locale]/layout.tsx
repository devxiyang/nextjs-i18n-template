import Header from '@/components/Header';
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from 'next/navigation';
import "./globals.css";
import StoreHydration from '@/components/StoreHydration';
import { fetchLocations } from '@/server/seodata.actions';

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
 * 2. Fetches initial data from the server
 * 3. Passes this data to the StoreHydration component for client-side state initialization
 * 
 * The key pattern here is:
 * - Server Component fetches data
 * - Data is passed to a Client Component (StoreHydration)
 * - Client Component initializes global state
 * - Other Client Components can access this state
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
  
  // Fetch initial data from the server using a Server Action
  // This happens during SSR, before the page is sent to the client
  const locations = await fetchLocations().catch((error) => {
    console.error("Failed to fetch locations:", error);
    return [];
  });
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* 
              StoreHydration is an invisible component that initializes the Zustand store
              on the client side using the data fetched from the server.
              
              This is a key part of our pattern - providing server data to client state
              without using traditional Context Providers.
            */}
            <StoreHydration seoLocations={locations} />
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
