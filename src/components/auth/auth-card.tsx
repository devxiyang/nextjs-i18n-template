import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  icon
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg border-gray-100 dark:border-gray-800 dark:bg-gray-800/50 dark:backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6">
          {icon && (
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</CardTitle>
            </div>
          )}
          {!icon && <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</CardTitle>}
          {description && <CardDescription className="text-gray-600 dark:text-gray-400">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          {children}
        </CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
      <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} DevSEO. All rights reserved.
      </div>
    </div>
  );
} 