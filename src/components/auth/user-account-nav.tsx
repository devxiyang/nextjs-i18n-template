"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthAction } from "@/hooks/use-auth-action"
import { signOut } from "@/server/auth.actions"
import { User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"

// Define AUTH_PATHS constant
const AUTH_PATHS = {
  PROFILE: "/protected/profile",
  REDIRECT: {
    AFTER_SIGN_OUT: "/"
  }
};

type UserAccountNavProps = {
  user: User
}

// 从用户信息中提取姓名首字母
const getUserInitials = (user: User): string => {
  const fullName = user.user_metadata.full_name || user.email || "User"
  return fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { isPending, executeAction } = useAuthAction();
  const t = useTranslations('auth');
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(user);
  
  // 用户导航菜单项配置 - 使用配置文件中的路径
  const userMenuItems = [
    {
      label: t('userNav.profile'),
      href: AUTH_PATHS.PROFILE
    }
  ];
  
  // 使用useMemo优化用户详细信息的计算
  const userDetails = useMemo(() => {
    if (!userInfo) {
      return { initials: "", email: "", name: "", avatarUrl: "" };
    }
    
    const initials = getUserInitials(userInfo);
    const email = userInfo.email as string;
    const name = userInfo.user_metadata.full_name || email || "User";
    const avatarUrl = userInfo.user_metadata.avatar_url;
    
    return { initials, email, name, avatarUrl };
  }, [userInfo]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Close dropdown menu first
    setOpen(false);
    setIsSigningOut(true);
    
    try {
      // Execute sign-out directly without the error callback
      await signOut();
      
      // Sign-out was successful, clear user data
      setUserInfo(null);
      
      // Clear session storage
      sessionStorage.clear();
      
      // Wait for state updates to complete before redirecting
      setTimeout(() => {
        // 登出后重定向到首页，让next-intl处理locale
        window.location.href = AUTH_PATHS.REDIRECT.AFTER_SIGN_OUT;
      }, 200); // slightly longer delay to ensure state updates
    } catch (err) {
      // Check if this is a NEXT_REDIRECT error (which is actually expected)
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage.includes("NEXT_REDIRECT")) {
        // This is actually a successful sign-out with redirect
        setUserInfo(null);
        sessionStorage.clear();
        // Let Next.js handle the redirect
        return;
      }
      
      // Handle actual errors
      setIsSigningOut(false);
      console.error("Sign out failed:", errorMessage);
    }
  };

  // If actively signing out or user info is cleared, show a minimal loading avatar
  if (isSigningOut || !userInfo) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Loader2 className="h-4 w-4 animate-spin" />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userDetails.avatarUrl} alt={userDetails.name} />
            <AvatarFallback>{userDetails.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {userDetails.name && <p className="font-medium">{userDetails.name}</p>}
            {userDetails.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {userDetails.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {/* 从配置数组渲染菜单项 */}
        {userMenuItems.map(item => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={isPending}
          onClick={handleSignOut}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t('userNav.signingOut')}
            </>
          ) : (
            t('buttons.signOut')
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 