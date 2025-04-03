"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Provider } from "@supabase/supabase-js";

// Auth API paths
const AUTH_CALLBACK_PATH = '/api/auth/callback';

// Get authentication configuration
const getAuthConfig = () => {
  // Get site URL from environment variables
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined in environment variables");
  }
  
  return {
    redirectTo: `${siteUrl}${AUTH_CALLBACK_PATH}`,
    scopes: 'email profile',
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  };
};

// Generic social provider sign in
export async function signInWithSocialProvider(provider: Provider, next?: string) {
  try {
    const supabase = await createClient();
    const config = getAuthConfig();
    
    // Build login options, add next parameter
    const options = {
      ...config,
    };
    
    // If next parameter is provided, add it to callback URL
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

    // Don't use Next.js redirect, return URL for client-side handling
    return { redirectUrl: data.url, success: true };

  } catch (error) {
    console.error(`Unexpected error during ${provider} sign in:`, error);
    return { error: "An unexpected error occurred", success: false };
  }
}

// Google sign in - using generic method
export async function signInWithGoogle(next?: string) {
  return signInWithSocialProvider('google', next);
}

// Email sign in - send login link
export async function signInWithEmail(email: string) {
  try {
    const supabase = await createClient();
    const config = getAuthConfig();
    
    const { error } = await supabase.auth.signInWithOtp({
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
      message: "Login link sent to your email. Please check your inbox and click the link to complete login."
    };

  } catch (error) {
    console.error(`Unexpected error during email sign in:`, error);
    return { error: "An unexpected error occurred when sending login link", success: false };
  }
}

// Sign out
export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    // Cookie clearing is handled internally by createClient
    
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { error: "Failed to sign out", success: false };
  }
} 