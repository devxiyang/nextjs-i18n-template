import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';

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

// 获取动态信息
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'es' }, { locale: 'ja' }];
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
