import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return NextResponse.redirect(new URL("/", redirectUrl));
} 