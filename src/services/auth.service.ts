import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User } from '@supabase/supabase-js';
import { AuthActionResult } from "@/hooks/useAuth";

// Auth API paths
const AUTH_CALLBACK_PATH = '/api/auth/callback';

// 集中认证服务
export const AuthService = {
  // 获取当前用户
  getCurrentUser: async (): Promise<User | null> => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Google登录
  signInWithGoogle: async (redirectTo?: string): Promise<AuthActionResult> => {
    const supabase = await createClient();
    
    // Build callback URL (with optional redirect parameter)
    const callbackUrl = new URL('/api/auth/callback', process.env.NEXT_PUBLIC_SITE_URL!);
    
    // If a redirect target is provided, add it to the callback URL
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
  },
  
  // 邮箱登录
  signInWithEmail: async (email: string): Promise<AuthActionResult> => {
    const supabase = await createClient();
    
    // Build callback URL
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
      message: "Login link has been sent to your email. Please check your inbox and click the link to complete login." 
    };
  },
  
  // 退出登录
  signOut: async (): Promise<AuthActionResult> => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: error.message, success: false };
    }
    
    return { success: true };
  },
  
  // 退出登录并重定向
  signOutWithRedirect: async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/');
  }
}; 