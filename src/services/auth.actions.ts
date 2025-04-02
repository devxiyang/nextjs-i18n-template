"use server";

import { AuthService } from "@/services/auth.service";

/**
 * Server Actions for Authentication
 * 
 * These exports allow client components to call server-side authentication methods.
 * The "use server" directive is necessary to make these functions available as Server Actions.
 */

// Google sign in
export const signInWithGoogle = AuthService.signInWithGoogle;

// Email login - send magic link
export const signInWithEmail = AuthService.signInWithEmail;

// Sign out function
export const signOut = AuthService.signOutWithRedirect; 