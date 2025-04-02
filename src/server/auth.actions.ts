"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Auth API paths
const AUTH_CALLBACK_PATH = '/api/auth/callback';

// Google sign in
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();
  
  // Build callback URL (with optional redirect parameter)
  const callbackUrl = new URL(AUTH_CALLBACK_PATH, process.env.NEXT_PUBLIC_SITE_URL!);
  
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
}

// Email login - send magic link
export async function signInWithEmail(email: string) {
  const supabase = await createClient();
  
  // Build callback URL
  const callbackUrl = new URL(AUTH_CALLBACK_PATH, process.env.NEXT_PUBLIC_SITE_URL!);
  
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
}

// Sign out function
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/');
}