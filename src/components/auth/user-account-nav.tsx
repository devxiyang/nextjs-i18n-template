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
import { AuthService } from "@/services/auth.service"
import { User } from "@supabase/supabase-js"
import { Loader2, LogIn, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useMemo, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import useAuth from "@/hooks/useAuth"

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
  const auth = useAuth();
  const t = useTranslations('auth');
  const [isSigningOut, setIsSigningOut] = useState(false);
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
  
  // 初始化认证状态
  useEffect(() => {
    if (!initialized.current && user) {
      auth.setUser(user);
      auth.setAuthenticated(true);
      initialized.current = true;
    } else if (!user && initialized.current) {
      // Reset if user becomes null
      auth.signOut();
    }
  }, [user, auth]);

  // 用户导航菜单项配置
  const userMenuItems = [
    {
      label: t('userNav.profile'),
      href: AUTH_PATHS.PROFILE
    }
  ];
  
  // 处理登出
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 显示加载动画
    setIsSigningOut(true);
    
    // 添加超时逻辑，防止永久转圈圈，只重置状态不跳转
    const timeout = setTimeout(() => {
      setIsSigningOut(false);
    }, 3000);
    
    // 立即更新认证状态
    auth.signOut();
    
    // 执行服务器端登出操作
    auth.executeAction(
      async () => await AuthService.signOut(),
      () => {
        clearTimeout(timeout); // 如果成功，清除超时计时器
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
  
  // If in the process of signing out, show spinner - 优先检查是否正在登出
  if (isSigningOut) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }
  
  // If no user or not authenticated, show sign-in button
  if (!user || !auth.isAuthenticated) {
    return (
      <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 px-3 py-2 border-primary/50">
        <Link href="/sign-in" className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-primary" />
          <span>{t('header.signIn')}</span>
        </Link>
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
          disabled={auth.isPending}
          onClick={handleSignOut}
        >
          {auth.isPending ? (
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