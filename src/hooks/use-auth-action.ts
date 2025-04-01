"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AuthActionResult = {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  message?: string;
};

export function useAuthAction() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const executeAction = async (
    action: () => Promise<AuthActionResult>,
    onSuccess?: (result: AuthActionResult) => void,
    onError?: (errorMessage: string) => void
  ) => {
    setError(null);
    
    startTransition(async () => {
      try {
        const result = await action();
        
        if (!result.success) {
          const errorMessage = result.error || "操作失败，请稍后重试";
          setError(errorMessage);
          toast.error(errorMessage);
          if (onError) onError(errorMessage);
          return;
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "未知错误";
        setError(errorMessage);
        toast.error(errorMessage);
        if (onError) onError(errorMessage);
      }
    });
  };
  
  return {
    isPending,
    error,
    executeAction
  };
} 