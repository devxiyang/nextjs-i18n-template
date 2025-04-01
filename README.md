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

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- A Supabase project (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nextjs-i18n-template.git
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

- `src/app/[locale]` - All pages and routes
- `src/components` - UI components
- `src/i18n` - Internationalization configuration
- `src/utils/supabase` - Supabase client configuration
- `messages/` - i18n translation files
- `src/middleware.ts` - Middleware handling i18n and auth
- `src/store/` - Zustand state management

## Internationalization Support

This template supports the following languages:

- English (en) - Default
- Chinese (zh)
- Japanese (ja)
- French (fr)
- German (de)
- Spanish (es)

To add more languages, add corresponding translation files to the `messages/` directory and update the `locales` array in `src/config/site.config.ts`.

## Authentication

This template uses Supabase Auth for authentication. It supports the following features:

- Google OAuth login
- Email link login (passwordless)
- User profile page
- Protected routes

## Zustand State Management

This template includes the Zustand state management library for client-side state. Here's the basic usage and how to integrate with server data.

### Basic Usage

Zustand is a lightweight state management library that works well with Next.js applications. Here's the basic usage:

```typescript
// Create store
import { create } from 'zustand';

interface BearState {
  bears: number
  increasePopulation: () => void
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
}))

// Use in components
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} bears around here ...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>Increase bears</button>
}
```

### Server Data Hydration Process

In Next.js applications, especially with App Router, data is often fetched by the server. Zustand can seamlessly integrate with server data. Here's the hydration process:

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

4. **Use in client components**

```typescript
'use client';

import useDataStore from '@/store/dataStore';

export default function DataList() {
  // Get hydrated data
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

### Avoiding Common Issues

When using Zustand with Next.js server components, there are some common issues to avoid:

1. **Preventing infinite loops**

Use `useRef` to ensure hydration only happens once:

```typescript
const hydrated = useRef(false);

useEffect(() => {
  if (!hydrated.current) {
    hydrateStore(data);
    hydrated.current = true;
  }
}, [data]);
```

2. **Using stable selectors**

Avoid creating new selector functions on each render:

```typescript
// Bad practice
const data = useStore(state => ({ value: state.value }));

// Good practice
const data = useStore(state => state.value);
```

3. **Caching derived state**

Use `useMemo` to cache computed results:

```typescript
const processedData = useMemo(() => {
  return data.map(item => processItem(item));
}, [data]);
```

## Customization

### Adding New Languages

1. Create a new translation file in the `messages/` directory, e.g., `it.json`
2. Update the `locales` array in `src/config/site.config.ts`
3. Add translation content

### Modifying Authentication Providers

1. Enable desired authentication providers in the Supabase dashboard
2. Add corresponding login buttons in `src/components/auth/auth-providers.tsx`

## License

MIT
