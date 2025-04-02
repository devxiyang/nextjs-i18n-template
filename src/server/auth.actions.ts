"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Google 登录
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();
  
  // 构建回调 URL（带有可选的重定向参数）
  const callbackUrl = new URL('/api/auth/callback', process.env.NEXT_PUBLIC_SITE_URL!);
  
  // 如果提供了重定向目标，将其添加到回调 URL
  if (redirectTo) {
    callbackUrl.searchParams.set('next', redirectTo);
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { redirectUrl: data.url, success: true };
}

// 邮箱登录 - 发送登录链接
export async function signInWithEmail(email: string) {
  const supabase = await createClient();
  
  // 构建回调 URL
  const callbackUrl = new URL('/api/auth/callback', process.env.NEXT_PUBLIC_SITE_URL!);
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { 
    success: true, 
    message: "登录链接已发送到您的邮箱，请查收并点击链接完成登录" 
  };
}

// 登出功能
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/');
}