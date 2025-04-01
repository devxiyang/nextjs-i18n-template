"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Provider } from "@supabase/supabase-js";
import { AUTH_PATHS } from "@/config/auth.paths";

// 共享配置 - 使用约定而非复杂配置
const getAuthConfig = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined in environment variables");
  }
  
  // 使用配置文件中的路径
  return {
    redirectTo: `${siteUrl}${AUTH_PATHS.API.CALLBACK}`,
    scopes: 'email profile',
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  };
};

// 通用的社交登录方法
export async function signInWithSocialProvider(provider: Provider, next?: string) {
  try {
    const supabase = await createClient();
    const config = getAuthConfig();
    
    // 构建登录选项，添加 next 参数
    const options = {
      ...config,
    };
    
    // 如果提供了 next 参数，将其添加到回调 URL
    if (next) {
      const callbackUrl = new URL(options.redirectTo);
      callbackUrl.searchParams.set('next', next);
      options.redirectTo = callbackUrl.toString();
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    if (error) {
      console.error(`Error signing in with ${provider}:`, error);
      return { error: error.message, success: false };
    }

    if (!data.url) {
      console.error(`No redirect URL returned from Supabase for ${provider}`);
      return { error: "No redirect URL returned", success: false };
    }

    // 不使用Next.js的redirect，而是返回URL，让客户端处理重定向
    return { redirectUrl: data.url, success: true };

  } catch (error) {
    console.error(`Unexpected error during ${provider} sign in:`, error);
    return { error: "An unexpected error occurred", success: false };
  }
}

// Google 登录 - 使用通用方法
export async function signInWithGoogle(next?: string) {
  return signInWithSocialProvider('google', next);
}

// 可以轻松添加其他提供商
// export async function signInWithGithub() {
//   return signInWithSocialProvider('github');
// }

// export async function signInWithFacebook() {
//   return signInWithSocialProvider('facebook');
// }

// 邮箱登录 - 发送登录链接
export async function signInWithEmail(email: string) {
  try {
    const supabase = await createClient();
    const config = getAuthConfig();
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: config.redirectTo,
      },
    });

    if (error) {
      console.error(`Error sending email login link:`, error);
      return { error: error.message, success: false };
    }

    return { 
      success: true, 
      message: "登录链接已发送到您的邮箱，请查收并点击链接完成登录" 
    };

  } catch (error) {
    console.error(`Unexpected error during email sign in:`, error);
    return { error: "发送登录链接时出现意外错误", success: false };
  }
}

// 登出功能
export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    // 清除cookie的工作已经通过createClient内部处理
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error: "Failed to sign out", success: false };
  }
}