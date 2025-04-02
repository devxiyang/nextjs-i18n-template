"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithEmail, signInWithGoogle, signOut } from "@/services/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, LogOut, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from 'next/navigation';
import useAuth from "@/hooks/useAuth";

type AuthProviderProps = {
  isLoading?: boolean;
};

// Google 图标组件
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className="mr-1">
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
      </g>
    </svg>
  );
}

/* Google Sign-In Button Component */
export function GoogleSignInButton({ isLoading }: AuthProviderProps) {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const auth = useAuth();
  
  // Combine loading states
  const isPending = isLoading || auth.isPending;

  // Get redirect path from URL or use default
  const redirectTo = searchParams?.get('next') || undefined;
  
  const handleGoogleSignIn = async () => {
    // Authentication action
    await auth.executeAction(
      () => signInWithGoogle(redirectTo),
      // Success callback
      (result) => {
        if (result.redirectUrl) {
          // Short delay to ensure button state is visible
          setTimeout(() => {
            window.location.href = result.redirectUrl!;
          }, 500);
        }
      },
      // Error callback
      (error) => {
        console.error("Google sign-in error:", error);
      }
    );
  };

  // Combine loading states
  const isAuthLoading = isPending || auth.isPending;

  return (
    <Button
      variant="outline" 
      type="button"
      disabled={isAuthLoading}
      onClick={handleGoogleSignIn}
      className="w-full bg-white dark:bg-gray-800 text-black dark:text-white flex items-center justify-center gap-2"
    >
      {isAuthLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54L20.0303 3.12C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.61L5.27028 9.61C6.23528 6.79 8.87028 4.75 12.0003 4.75Z"
              fill="#EA4335"
            />
            <path
              d="M23.49 12.27C23.49 11.48 23.42 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.33 17.24 16.07 18.09L19.93 21.04C22.1 18.97 23.49 15.87 23.49 12.27Z"
              fill="#4285F4"
            />
            <path
              d="M5.27 14.39C5.02 13.64 4.89 12.84 4.89 12C4.89 11.16 5.02 10.36 5.27 9.61L1.28 6.61C0.47 8.27 0 10.08 0 12C0 13.92 0.47 15.73 1.28 17.39L5.27 14.39Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0003 24C15.2353 24 17.9603 22.92 19.9303 21.04L16.0703 18.09C15.0003 18.82 13.6203 19.25 12.0003 19.25C8.87028 19.25 6.23528 17.21 5.27028 14.39L1.28027 17.39C3.25527 21.31 7.31028 24 12.0003 24Z"
              fill="#34A853"
            />
          </svg>
          {t('signInWithGoogle')}
        </>
      )}
    </Button>
  );
}

/* Sign Out Button Component */
export function SignOutButton({ 
  className = "",
  variant = "default",
}: { 
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}) {
  const t = useTranslations('auth');
  const auth = useAuth();
  
  // Use configured redirect path
  const handleSignOut = async () => {
    await auth.executeAction(
      () => signOut(),
      () => {
        window.location.href = '/';
      }
    );
  };

  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      disabled={auth.isPending}
      className={className}
    >
      {auth.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
      {t('signOut')}
    </Button>
  );
}

/* Email Sign In Form - Email Validation */
const formSchema = z.object({
  email: z.string().email(),
});

/* Email Sign In Form Component */
export function EmailSignInForm({ isLoading }: AuthProviderProps) {
  const t = useTranslations('auth');
  const auth = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await auth.executeAction(
      () => signInWithEmail(values.email),
      (result) => {
        // Clear form
        form.reset();
        
        if (result.message) {
          setSuccess(result.message);
        }
      },
      // Error callback
      (error) => {
        console.error("Email sign-in error:", error);
      }
    );
  }

  // Combine loading states
  const isPending = isLoading || form.formState.isSubmitting || auth.isPending;

  // If login link was successfully sent, show success message
  if (success) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
        <div className="text-green-800 dark:text-green-300 mb-2 text-sm font-medium">{success}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSuccess(null)}
          className="mt-2"
        >
          {t('tryAnotherEmail')}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder={t('emailPlaceholder')}
                      type="email"
                      disabled={isPending}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t('continue')}
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

// More authentication providers can be easily added in the future
// Such as GitHub, Facebook, Twitter, etc. 