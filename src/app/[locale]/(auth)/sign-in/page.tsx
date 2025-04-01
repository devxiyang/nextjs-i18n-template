"use client";
import { useTranslations } from "next-intl";
import { useSearchParams } from 'next/navigation';

import { AuthCard } from "@/components/auth/auth-card";
import { GoogleSignInButton, EmailSignInForm } from "@/components/auth/auth-providers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AUTH_PATHS } from "@/config/auth.paths";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

// 加载状态组件
function LoadingButton() {
  return (
    <div className="w-full h-[52px] rounded-md bg-gray-100 dark:bg-gray-700 animate-pulse flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-gray-500" />
    </div>
  );
}

function SignInFooter() {
  const t = useTranslations('auth.signIn.footer');
  
  return (
    <div className="text-center text-sm">
      <p className="text-muted-foreground dark:text-gray-400">
        {t('termsText')}
        <Link href="/terms" className="text-primary hover:underline underline-offset-4 mx-1 dark:text-primary/90">
          {t('termsLink')}
        </Link>
        {t('andText')}
        <Link href="/privacy" className="text-primary hover:underline underline-offset-4 mx-1 dark:text-primary/90">
          {t('privacyLink')}
        </Link>
      </p>
    </div>
  );
}

export default function SignIn() {  
  const searchParams = useSearchParams();
  const hasRedirect = !!searchParams.get('next');
  const t = useTranslations('auth');
  
  return (
    <AuthCard
      title={t('signIn.title')}
      description={t('signIn.description')}
    >
      {hasRedirect && (
        <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30">
          <AlertDescription className="flex items-center text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('signIn.redirectMessage')}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-7 w-full">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <span className="mr-2">{t('signIn.quickSignIn')}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">({t('signIn.recommended')})</span>
          </h3>
          <Suspense fallback={<LoadingButton />}>
            <GoogleSignInButton />
          </Suspense>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full dark:bg-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 py-1 text-muted-foreground rounded-full border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
              {t('signIn.dividerText')}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('signIn.emailSignIn')}</h3>
          <Suspense fallback={<LoadingButton />}>
            <EmailSignInForm />
          </Suspense>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
        <SignInFooter />
      </div>
    </AuthCard>
  );
} 