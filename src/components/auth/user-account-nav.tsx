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
import { signOut } from "@/server/auth-actions"
import { User } from "@supabase/supabase-js"
import { Loader2, User as UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useMemo } from "react"

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

// Extract initials from user information
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
  
  // Use useMemo to optimize user details calculation - must be defined before any conditional statements
  const userDetails = useMemo(() => {
    if (!user) return { initials: "", email: "", name: "", avatarUrl: "" };
    
    const initials = getUserInitials(user);
    const email = user.email as string;
    const name = user.user_metadata.full_name || email || "User";
    const avatarUrl = user.user_metadata.avatar_url;
    
    return { initials, email, name, avatarUrl };
  }, [user]);

  // User navigation menu item configuration
  const userMenuItems = [
    {
      label: t('userNav.profile'),
      href: AUTH_PATHS.PROFILE
    }
  ];
  
  // Handle sign out
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    executeAction(
      async () => await signOut(),
      () => {
        // After sign out, redirect to home page
        window.location.href = AUTH_PATHS.REDIRECT.AFTER_SIGN_OUT;
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
  
  // If in the process of signing out, show spinner
  if (isPending) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }
  
  // If no user, show sign-in button
  if (!user) {
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
        
        {/* Render menu items from configuration array */}
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