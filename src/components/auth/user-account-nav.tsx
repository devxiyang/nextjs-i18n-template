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
import { useMemo, useEffect, useRef } from "react"
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
  
  // Use Zustand auth store
  const authStore = useAuthStore();
  const initialized = useRef(false);
  
  // Set the Zustand store with the user on component mount using useEffect
  // This ensures the store has the current user data
  useEffect(() => {
    if (!initialized.current && user && !authStore.user) {
      authStore.setUser(user);
      authStore.setAuthenticated(true);
      initialized.current = true;
    }
  }, [user]);
  
  // 用户导航菜单项配置 - 使用配置文件中的路径
  const userMenuItems = [
    {
      label: t('userNav.profile'),
      href: AUTH_PATHS.PROFILE
    }
  ];
  
  // 使用useMemo优化用户详细信息的计算
  const userDetails = useMemo(() => {
    const initials = getUserInitials(user);
    const email = user.email as string;
    const name = user.user_metadata.full_name || email || "User";
    const avatarUrl = user.user_metadata.avatar_url;
    
    return { initials, email, name, avatarUrl };
  }, [user]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Update Zustand store immediately for UI responsiveness
    authStore.signOut();
    
    executeAction(
      async () => await signOut(),
      () => {
        window.location.replace(AUTH_PATHS.REDIRECT.AFTER_SIGN_OUT);
      }
    );
  };

  // If not authenticated in store, show nothing
  if (!authStore.isAuthenticated) {
    return null;
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