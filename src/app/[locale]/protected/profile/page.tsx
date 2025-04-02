import { createClient } from "@/lib/supabase/server";
import { AuthCard } from "@/components/auth/auth-card";
import { SignOutButton } from "@/components/auth/auth-providers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  const t = await getTranslations('auth.profile');
  
  if (error || !user) {
    // 如果没有用户，重定向到登录页面
    return redirect("/sign-in");
  }
  
  // 获取用户详细信息
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return (
    <AuthCard
      title={t('title')}
      description={t('description')}
      icon={<User2 className="h-6 w-6 text-primary" />}
      footer={
        <div className="w-full">
          <SignOutButton className="w-full" variant="destructive" />
        </div>
      }
    >
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.user_metadata.avatar_url || ''} alt={user.user_metadata.full_name || user.email || t('defaultUsername')} />
          <AvatarFallback className="text-2xl">
            {(user.user_metadata.full_name || user.email || t('defaultUsername')).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-1 text-center">
          <h3 className="text-xl font-medium">
            {user.user_metadata.full_name || t('defaultUsername')}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        
        <div className="w-full space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm font-medium mb-1">{t('accountId')}</p>
              <p className="text-xs text-muted-foreground break-all">{user.id}</p>
            </div>
            
            <div className="rounded-lg border p-3">
              <p className="text-sm font-medium mb-1">{t('lastLogin')}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(user.last_sign_in_at || '').toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthCard>
  );
} 