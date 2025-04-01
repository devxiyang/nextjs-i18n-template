# Next.js Internationalization (i18n) Template

这是一个基于Next.js 15的模板项目，提供完整的国际化(i18n)和身份验证(Auth)功能。

## 特性

- 完整的国际化支持，使用`next-intl`
- 内置身份验证系统，使用Supabase Auth
- Google OAuth登录集成
- 暗色模式支持
- TypeScript支持
- Tailwind CSS样式
- Zustand状态管理

## 入门指南

### 先决条件

- Node.js 18.17或更高版本
- 一个Supabase项目（用于身份验证）

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/nextjs-i18n-template.git
cd nextjs-i18n-template

# 安装依赖
npm install
```

### 环境变量

创建一个`.env.local`文件，添加以下内容：

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site URL (用于OAuth重定向)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 运行开发服务器

```bash
npm run dev
```

访问[http://localhost:3000](http://localhost:3000)查看项目。

## 项目结构

- `src/app/[locale]` - 所有的页面和路由
- `src/components` - UI组件
- `src/i18n` - 国际化配置
- `src/utils/supabase` - Supabase客户端配置
- `messages/` - i18n翻译文件
- `src/middleware.ts` - 处理i18n和auth的中间件
- `src/store/` - Zustand状态管理

## 国际化支持

该模板支持以下语言：

- English (en) - 默认
- 中文 (zh)
- 日本語 (ja)
- Français (fr)
- Deutsch (de)
- Español (es)

若要添加更多语言，请添加相应的翻译文件到`messages/`目录，并在`src/config/site.config.ts`中更新`locales`数组。

## 身份验证

本模板使用Supabase Auth进行身份验证。支持以下功能：

- Google OAuth登录
- 通过电子邮件链接登录（无密码）
- 用户配置文件页面
- 受保护的路由

## Zustand状态管理

本模板包含Zustand状态管理库，用于客户端状态管理。以下是Zustand的基本用法和如何与服务器数据集成。

### 基本用法

Zustand是一个轻量级状态管理库，非常适合Next.js应用。下面是基本用法：

```typescript
// 创建store
import { create } from 'zustand';

interface BearState {
  bears: number
  increasePopulation: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
}))

// 在组件中使用
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} bears around here ...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>增加熊的数量</button>
}
```

### 服务器数据水合流程

在Next.js应用中，特别是使用App Router的应用，数据通常由服务器获取。Zustand可以与服务器数据无缝集成，以下是水合流程：

1. **创建带有hydrate方法的store**

```typescript
// src/store/dataStore.ts
import { create } from 'zustand';

interface DataState {
  items: any[];
  hydrate: (data: any[]) => void;
}

const useDataStore = create<DataState>((set) => ({
  items: [],
  hydrate: (data) => set({ items: data })
}));

// 导出直接的hydrate函数
export const hydrateDataStore = (data: any[]) => {
  useDataStore.getState().hydrate(data);
};

export default useDataStore;
```

2. **创建StoreHydration组件**

```typescript
// src/components/StoreHydration.tsx
'use client';

import { useEffect, useRef } from 'react';
import { hydrateDataStore } from '@/store/dataStore';

interface StoreHydrationProps {
  serverData: any[];
}

export default function StoreHydration({ serverData }: StoreHydrationProps) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      // 只在初次渲染时执行一次hydrate操作
      hydrateDataStore(serverData);
      hydrated.current = true;
    }
  }, [serverData]);

  // 组件不渲染任何内容
  return null;
}
```

3. **在布局或页面组件中集成**

```typescript
// src/app/[locale]/layout.tsx 或页面组件
import StoreHydration from '@/components/StoreHydration';

export default async function Layout({ children }) {
  // 在服务器端获取数据
  const serverData = await fetchDataFromServer();
  
  return (
    <html>
      <body>
        {/* 水合Zustand状态 */}
        <StoreHydration serverData={serverData} />
        {children}
      </body>
    </html>
  );
}
```

4. **在客户端组件中使用**

```typescript
'use client';

import useDataStore from '@/store/dataStore';

export default function DataList() {
  // 获取水合后的数据
  const items = useDataStore((state) => state.items);
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 避免常见问题

在使用Zustand与Next.js服务器组件集成时，有一些常见问题需要避免：

1. **防止无限循环**

使用`useRef`确保水合操作只执行一次：

```typescript
const hydrated = useRef(false);

useEffect(() => {
  if (!hydrated.current) {
    hydrateStore(data);
    hydrated.current = true;
  }
}, [data]);
```

2. **使用稳定选择器**

避免在每次渲染时创建新的选择器函数：

```typescript
// 不好的做法
const data = useStore(state => ({ value: state.value }));

// 好的做法
const selectValue = state => state.value;
const data = useStore(selectValue);
```

3. **缓存派生状态**

使用`useMemo`缓存计算结果：

```typescript
const processedData = useMemo(() => {
  return data.map(item => processItem(item));
}, [data]);
```

## 自定义

### 添加新语言

1. 在`messages/`目录中创建新的翻译文件，例如`it.json`
2. 在`src/config/site.config.ts`中更新`locales`数组
3. 添加翻译内容

### 修改身份验证提供商

1. 在Supabase仪表板中启用所需的身份验证提供商
2. 在`src/components/auth/auth-providers.tsx`中添加相应的登录按钮

## 许可证

MIT
