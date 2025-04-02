"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithEmail, signInWithGoogle } from "@/services/auth.actions";
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

// Google 登录按钮组件
export function GoogleSignInButton({ isLoading: externalLoading = false }: AuthProviderProps) {
  const auth = useAuth();
  const isLoading = auth.isPending || externalLoading;
  const t = useTranslations('auth');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '';

  const handleSignIn = async () => {
    setIsSubmitting(true);

    auth.executeAction(
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
export function SignOutButton({ isLoading: externalLoading = false }: AuthProviderProps) {
  const auth = useAuth();
  const isLoading = auth.isPending || externalLoading;
  const t = useTranslations('auth');

  return (
    <Button
      className="flex items-center gap-2"
      variant="outline"
      disabled={isLoading}
      onClick={async () => {
        // 使用配置的重定向路径
        window.location.href = '/sign-in';
      }}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {t('buttons.signOut')}
    </Button>
  );
}

// 邮箱登录表单验证
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

// 邮箱登录组件
export function EmailSignInForm({ isLoading: externalLoading = false }: AuthProviderProps) {
  const auth = useAuth();
  const isLoading = auth.isPending || externalLoading;
  const t = useTranslations('auth');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    },
  });
  
  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    auth.executeAction(
      async () => await signInWithEmail(values.email),
      (result) => {
        if (result.success) {
          setShowSuccess(true);
          // 清空表单
          form.reset();
        }
        setIsSubmitting(false);
      },
      // 错误回调
      () => {
        setIsSubmitting(false);
      }
    );
  };
  
  // 组合加载状态
  const buttonLoading = isLoading || isSubmitting;
  
  // 如果成功发送了登录链接，显示成功消息
  if (showSuccess) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900/50 rounded-md text-green-800 dark:text-green-300">
          <h4 className="font-medium mb-1">{t('email.linkSent')}</h4>
          <p className="text-sm text-green-700 dark:text-green-400">{t('email.checkEmail')}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowSuccess(false)}
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