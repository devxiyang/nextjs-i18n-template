# Next.js Internationalization (i18n) Template

这是一个基于Next.js 15的模板项目，提供完整的国际化(i18n)和身份验证(Auth)功能。

## 特性

- 完整的国际化支持，使用`next-intl`
- 内置身份验证系统，使用Supabase Auth
- Google OAuth登录集成
- 暗色模式支持
- TypeScript支持
- Tailwind CSS样式

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
