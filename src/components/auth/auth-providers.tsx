"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithEmail, signInWithGoogle, signOut } from "@/server/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, LogOut, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSearchParams } from 'next/navigation';
import { useAuthAction } from "@/hooks/use-auth-action";

type AuthProviderProps = {
  isLoading?: boolean;
};

/* Google Sign-In Button Component */
export function GoogleSignInButton({ isLoading }: AuthProviderProps) {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const { isPending, executeAction } = useAuthAction();
  
  // Get redirect path from URL or use default
  const redirectTo = searchParams?.get('next') || undefined;
  
  const handleGoogleSignIn = async () => {
    // Authentication action
    executeAction(
      () => signInWithGoogle(redirectTo),
      // Success callback handled automatically by useAuthAction (redirectUrl)
      undefined,
      // Error callback
      (error) => {
        console.error("Google sign-in error:", error);
      }
    );
  };

  return (
    <Button
      variant="outline" 
      type="button"
      disabled={isLoading || isPending}
      onClick={handleGoogleSignIn}
      className="w-full bg-white dark:bg-gray-800 text-black dark:text-white flex items-center justify-center gap-2"
    >
      {isLoading || isPending ? (
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
          {t('buttons.googleSignIn')}
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
  const { isPending, executeAction } = useAuthAction();
  
  // Use configured redirect path
  const handleSignOut = async () => {
    executeAction(
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
      disabled={isPending}
      className={className}
    >
      {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}
      {t('buttons.signOut')}
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
  const { isPending, executeAction } = useAuthAction();
  const [success, setSuccess] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    executeAction(
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
          {t('buttons.useAnotherEmail')}
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
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('email.placeholder')}
                    className="pl-10"
                    {...field}
                    disabled={isLoading || isPending}
                  />
                </div>
              </FormControl>
              <FormMessage>{t('email.invalidEmail')}</FormMessage>
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          disabled={isLoading || isPending || !form.formState.isValid}
          className="w-full"
        >
          {isLoading || isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <>
              {t('buttons.sendLoginLink')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

// More authentication providers can be easily added in the future
// Such as GitHub, Facebook, Twitter, etc. 