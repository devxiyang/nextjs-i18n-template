"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthAction } from "@/hooks/use-auth-action";
import { signInWithEmail, signInWithGoogle, signOut } from "@/server/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, LogOut, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSearchParams } from 'next/navigation';

type AuthProviderProps = {
  isLoading?: boolean;
};

// Google 图标组件
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Google 登录按钮组件
export function GoogleSignInButton({ isLoading: externalLoading = false }: AuthProviderProps) {
  const { isPending, executeAction } = useAuthAction();
  const isLoading = isPending || externalLoading;
  const t = useTranslations('auth');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '';

  const handleSignIn = async () => {
    setIsSubmitting(true);

    executeAction(
      // 认证操作
      async () => await signInWithGoogle(nextUrl),
      // 成功回调
      (result) => {
        if (result.redirectUrl) {
          // 短延迟确保按钮状态能够显示
          setTimeout(() => {
            window.location.href = result.redirectUrl || '/';
          }, 100);
        } else {
          setIsSubmitting(false);
        }
      },
      // 错误回调
      () => setIsSubmitting(false)
    );
  };

  // 组合加载状态
  const buttonLoading = isLoading || isSubmitting;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!buttonLoading) handleSignIn();
    }} className="w-full">
      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-3 relative bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm py-6 transition-all dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:border-gray-700"
        disabled={buttonLoading}
        variant="outline"
      >
        {buttonLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        <span className="font-medium">{buttonLoading ? t('buttons.connecting') : t('buttons.googleSignIn')}</span>
        {!buttonLoading && <ArrowRight className="ml-auto h-4 w-4 opacity-70" />}
      </Button>
    </form>
  );
}

// 登出按钮组件
type SignOutButtonProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
};

export function SignOutButton({
  variant = "outline",
  size = "default",
  className = "",
  children
}: SignOutButtonProps) {
  const { isPending, executeAction } = useAuthAction();
  const t = useTranslations('auth.buttons');

  const handleSignOut = async () => {
    executeAction(
      async () => await signOut(),
      () => {
        // 使用配置的重定向路径
        window.location.href = "/";
      }
    );
  };

  return (
    <form action={handleSignOut}>
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={className}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : children || (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            {t('signOut')}
          </>
        )}
      </Button>
    </form>
  );
}

// 邮箱登录表单验证
const emailSchema = z.object({
  email: z.string().email()
});

type EmailFormValues = z.infer<typeof emailSchema>;

// 邮箱登录组件
export function EmailSignInForm({ isLoading: externalLoading = false }: AuthProviderProps) {
  const { isPending, executeAction } = useAuthAction();
  const isLoading = isPending || externalLoading;
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('auth');

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const handleSignIn = async (values: EmailFormValues) => {
    setIsSubmitting(true);

    executeAction(
      async () => await signInWithEmail(values.email),
      (result) => {
        setIsSubmitting(false);
        if (result.success) {
          setEmailSent(true);
          if (result.message) {
            toast.success(result.message);
          }
        }
      },
      // 错误回调
      () => setIsSubmitting(false)
    );
  };

  // 组合加载状态
  const buttonLoading = isLoading || isSubmitting;

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-100 dark:border-gray-700">
        <Mail className="h-12 w-12 text-primary dark:text-primary/90" />
        <h3 className="text-lg font-medium dark:text-gray-100">{t('email.linkSent')}</h3>
        <p className="text-muted-foreground text-sm dark:text-gray-300">
          {t('email.checkEmail')}
        </p>
        <Button
          variant="outline"
          className="mt-4 w-full dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={() => setEmailSent(false)}
        >
          {t('buttons.useAnotherEmail')}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={t('email.placeholder')}
                  {...field}
                  disabled={buttonLoading}
                  className="w-full py-6 px-4 rounded-md bg-gray-50 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-primary dark:focus:ring-primary"
                />
              </FormControl>
              <FormMessage className="dark:text-red-300" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-3 py-6 relative dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border dark:border-gray-700"
          disabled={buttonLoading}
        >
          {buttonLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Mail className="h-5 w-5" />
          )}
          <span className="font-medium">{buttonLoading ? t('buttons.sending') : t('buttons.sendLoginLink')}</span>
          {!buttonLoading && <ArrowRight className="ml-auto h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
}

// 未来可以很容易地添加其他身份验证提供商
// 例如 GitHub、Facebook、Twitter 等 