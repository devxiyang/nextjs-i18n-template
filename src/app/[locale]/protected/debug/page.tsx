import { createClient } from "@/utils/supabase/server";

export default async function DebugPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="mb-8 text-3xl font-bold">认证调试页面</h1>
      
      <div className="rounded-lg bg-card p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">认证状态</h2>
        
        {error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>错误: {error.message}</p>
          </div>
        ) : !data.user ? (
          <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
            <p>未登录</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-green-800">
              <p>已登录!</p>
            </div>
            
            <div className="overflow-auto">
              <h3 className="mb-2 text-lg font-medium">用户信息:</h3>
              <pre className="rounded-md bg-slate-100 p-4 text-xs">
                {JSON.stringify(data.user, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 