import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AuthCodeError() {
  const t = useTranslations('auth.error');
  
  return (
    <AuthCard
      title={t('title')}
      description={t('description')}
      icon={<AlertCircle className="h-6 w-6 text-red-500" />}
      footer={
        <div className="flex justify-between w-full">
          <Button asChild variant="outline">
            <Link href="/">
              {t('backToHome')}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">
              {t('retryLogin')}
            </Link>
          </Button>
        </div>
      }
    >
      <div className="text-sm text-muted-foreground">
        <p>{t('possibleReasons')}:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>{t('reasons.expiredCode')}</li>
          <li>{t('reasons.configError')}</li>
          <li>{t('reasons.serverIssue')}</li>
        </ul>
      </div>
    </AuthCard>
  );
} 