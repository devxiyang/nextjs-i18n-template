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
import { Loader2, LogIn, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useMemo, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import useAuthStore from "@/store/authStore"

// Define AUTH_PATHS constant locally instead of importing
const AUTH_PATHS = {
  PROFILE: "/protected/profile",
  REDIRECT: {
    AFTER_SIGN_OUT: "/"
  }
};

type UserAccountNavProps = {
  user: User | null;
  isLoading?: boolean;
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

export function UserAccountNav({ user, isLoading = false }: UserAccountNavProps) {
  const { isPending, executeAction } = useAuthAction();
  const t = useTranslations('auth');
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Use Zustand auth store
  const authStore = useAuthStore();
  const initialized = useRef(false);
  
  // 使用useMemo优化用户详细信息的计算 - 一定要在所有条件语句之前定义
  const userDetails = useMemo(() => {
    if (!user) return { initials: "", email: "", name: "", avatarUrl: "" };
    
    const initials = getUserInitials(user);
    const email = user.email as string;
    const name = user.user_metadata.full_name || email || "User";
    const avatarUrl = user.user_metadata.avatar_url;
    
    return { initials, email, name, avatarUrl };
  }, [user]);
  
  // Set the Zustand store with the user on component mount using useEffect
  // This ensures the store has the current user data
  useEffect(() => {
    if (!initialized.current && user) {
      authStore.setUser(user);
      authStore.setAuthenticated(true);
      initialized.current = true;
    } else if (!user && initialized.current) {
      // Reset if user becomes null
      authStore.signOut();
    }
  }, [user]);
  
  // 用户导航菜单项配置 - 使用配置文件中的路径
  const userMenuItems = [
    {
      label: t('userNav.profile'),
      href: AUTH_PATHS.PROFILE
    }
  ];
  
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Show loading spinner
    setIsSigningOut(true);
    
    // Update Zustand store immediately for UI responsiveness
    authStore.signOut();
    
    executeAction(
      async () => await signOut(),
      () => {
        window.location.replace(AUTH_PATHS.REDIRECT.AFTER_SIGN_OUT);
      }
    );
  };
  
  // If loading, show a loading spinner
  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }
  
  // If no user or not authenticated, show sign-in button
  if (!user || !authStore.isAuthenticated) {
    return (
      <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 px-3 py-2 border-primary/50">
        <Link href="/sign-in" className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-primary" />
          <span>{t('header.signIn')}</span>
        </Link>
      </Button>
    );
  }
  
  // If in the process of signing out, show spinner
  if (isSigningOut) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
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