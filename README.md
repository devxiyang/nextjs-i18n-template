# Next.js Internationalization (i18n) Template

A Next.js 15 template project providing complete internationalization (i18n) and authentication capabilities.

## Features

- Complete internationalization support with `next-intl`
- Built-in authentication system using Supabase Auth
- Google OAuth login integration
- Dark mode support
- TypeScript support
- Tailwind CSS styling
- Zustand state management
- Server Actions
- Full App Router features

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- A Supabase project (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/devxiyang/nextjs-i18n-template.git
cd nextjs-i18n-template

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file with the following content:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the project.

## Project Structure

```
nextjs-i18n-template/
├── messages/              # i18n translation files
├── public/                # Static assets
├── src/
│   ├── app/               # App Router routes and pages
│   │   ├── [locale]/      # Internationalized routes
│   │   └── api/           # API routes
│   ├── components/        # UI components
│   │   ├── auth/          # Authentication-related components
│   │   └── ui/            # Common UI components
│   ├── config/            # Project configuration
│   ├── hooks/             # Custom hooks
│   ├── i18n/              # Internationalization configuration
│   ├── lib/               # Utility libraries
│   │   └── supabase/      # Supabase client configuration
│   ├── server/            # Server-side code and actions
│   ├── store/             # Zustand state management
│   └── middleware.ts      # Middleware (i18n + auth)
```

## Internationalization Support

This template supports the following languages:

- English (en) - Default
- Chinese (zh)
- Japanese (ja)
- French (fr)
- German (de)
- Spanish (es)

### Adding New Languages

1. Create a new translation file in the `messages/` directory, e.g., `it.json`
2. Update the `locales` array in `src/config/site.config.ts`
3. Add translation content

### How Internationalization Works

This project uses `next-intl` for internationalization support:

1. **Route setup**: Using `[locale]` dynamic route parameter, all pages are under this directory
2. **Middleware**: Language detection and redirects are handled via `middleware.ts`
3. **Translation files**: JSON files in the `messages/` directory contain translations for each language
4. **Runtime integration**: Translations are provided to client components via `NextIntlClientProvider`

### Using Translations

In client components:

```jsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

In server components:

```jsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

## Authentication

This template uses Supabase Auth for authentication. It supports the following features:

- Google OAuth login
- Email link login (passwordless)
- User profile page
- Protected routes

### Supabase Setup

1. Create a Supabase project: Visit [Supabase Console](https://app.supabase.com) to create a new project
2. Get your project URL and anon key: Find these in Project Settings > API
3. Add them to the `.env.local` environment variables

### Google OAuth Configuration

#### 1. Configure Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to APIs & Services > Credentials
4. Click "Create Credentials" and select "OAuth client ID"
5. Set the Application type to "Web application"
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: `https://your-production-domain.com`
8. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback`
   - For production: `https://your-production-domain.com/api/auth/callback`
9. Click "Create" and note the Client ID and Client Secret

#### 2. Configure Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find Google and toggle it to enabled
4. Enter your Google Client ID and Client Secret obtained in the previous step
5. **Important**: In the "Authorized redirect URIs" field, enter: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Save the changes

### Using Server Actions for Authentication

This template uses Next.js Server Actions for authentication operations, ensuring security:

```typescript
// src/server/auth.actions.ts
'use server';

// Google sign-in
export async function signInWithGoogle(redirectTo?: string) {
  // Implementation details...
}

// Email sign-in
export async function signInWithEmail(email: string) {
  // Implementation details...
}

// Sign out
export async function signOut() {
  // Implementation details...
}
```

### Protected Routes

1. All routes that require authentication are placed in the `/protected/` directory
2. The middleware automatically checks user login status and redirects to the login page if not authenticated

## Zustand State Management

This template includes the Zustand state management library for client-side state.

### Basic Usage

```typescript
// Create store
import { create } from 'zustand';

interface AuthActionStore {
  isPending: boolean;
  error: string | null;
  executeAction: (action, onSuccess?, onError?) => Promise<void>;
}

const useAuthAction = create<AuthActionStore>((set) => ({
  isPending: false,
  error: null,
  executeAction: async (action, onSuccess, onError) => {
    set({ isPending: true, error: null });
    try {
      const result = await action();
      // Process result...
      set({ isPending: false });
      if (onSuccess) onSuccess(result);
    } catch (err) {
      // Handle error...
      set({ error: errorMessage, isPending: false });
      if (onError) onError(errorMessage);
    }
  }
}));
```

### Using in Components

```typescript
import { useAuthAction } from '@/hooks/use-auth-action';
import { signInWithGoogle } from '@/server/auth.actions';

function LoginButton() {
  const { isPending, executeAction } = useAuthAction();
  
  const handleLogin = () => {
    executeAction(
      () => signInWithGoogle('/dashboard'),
      (result) => {
        // Success handling...
      }
    );
  };
  
  return (
    <button onClick={handleLogin} disabled={isPending}>
      {isPending ? 'Loading...' : 'Sign in with Google'}
    </button>
  );
}
```

### Server Data Hydration Process

In Next.js applications, especially with App Router, data is often fetched by the server. Zustand can seamlessly integrate with server data:

1. **Create store with hydrate method**

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

// Export direct hydrate function
export const hydrateDataStore = (data: any[]) => {
  useDataStore.getState().hydrate(data);
};

export default useDataStore;
```

2. **Create StoreHydration component**

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
      // Only hydrate once on first render
      hydrateDataStore(serverData);
      hydrated.current = true;
    }
  }, [serverData]);

  // Component doesn't render anything
  return null;
}
```

3. **Integrate in layout or page component**

```typescript
// src/app/[locale]/layout.tsx or page component
import StoreHydration from '@/components/StoreHydration';

export default async function Layout({ children }) {
  // Fetch data on the server
  const serverData = await fetchDataFromServer();
  
  return (
    <html>
      <body>
        {/* Hydrate Zustand state */}
        <StoreHydration serverData={serverData} />
        {children}
      </body>
    </html>
  );
}
```

## Troubleshooting

### Google Login Issues

#### Not redirecting to Google login page

1. **Check environment variables**: Make sure `NEXT_PUBLIC_SITE_URL` is correctly set in `.env.local`.
2. **Open browser console**: Look for any errors when clicking the login button.
3. **Verify Supabase configuration**: Check that Google provider is enabled in Supabase dashboard.
4. **Check redirect URI**: In Google Cloud Console, ensure the redirect URI matches exactly what's in your code.

#### Google login succeeds but no user created

1. **Check Supabase callback URL**: In Supabase dashboard, make sure the callback URL is correct. It should be in the form of `https://your-project-ref.supabase.co/auth/v1/callback`.
2. **Check logs**: Open your browser console and check for any errors when redirecting back from Google.
3. **Verify Supabase setup**: Make sure your Supabase project is properly set up with Google OAuth credentials.
4. **Check network requests**: Monitor network requests during the login process to see if there are any errors.

#### Redirect URI mismatch errors

1. Make sure the redirect URI in your code, Google Cloud Console, and Supabase all match exactly.
2. For local development, use `http://localhost:3000/api/auth/callback`.
3. For production, use your actual domain like `https://your-domain.com/api/auth/callback`.

### Debugging Tips

1. Use browser console to see error messages.
2. Check network requests in the browser's developer tools Network tab.
3. In Supabase dashboard, check Auth > Logs for any authentication attempts and their status.

## Customization

### Modifying Authentication Providers

1. Enable desired authentication providers in the Supabase dashboard
2. Add corresponding login buttons in `src/components/auth/auth-providers.tsx`

### Adding New Pages

1. Create new pages in the `src/app/[locale]/` directory
2. If internationalization is required, add necessary translation keys in the respective translation files
3. For protected pages, place them in the `protected/` directory

## License

MIT
