import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // 使用当前请求的origin作为基础URL
  const { origin } = new URL(request.url);
  return NextResponse.redirect(new URL("/", origin));
} 