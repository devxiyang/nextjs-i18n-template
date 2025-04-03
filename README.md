# Next.js Internationalization (i18n) Template

A Next.js 15 template project providing complete internationalization (i18n) capabilities.

## Features

- Complete internationalization support with `next-intl`
- Dark mode support
- TypeScript support
- Tailwind CSS styling
- Zustand state management
- Server Actions
- Full App Router features

## Getting Started

### Prerequisites

- Node.js 18.17 or higher

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
# Site URL
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
│   │   └── ui/            # Common UI components
│   ├── config/            # Project configuration
│   ├── hooks/             # Custom hooks
│   ├── i18n/              # Internationalization configuration
│   ├── lib/               # Utility libraries
│   ├── server/            # Server-side code and actions
│   ├── store/             # Zustand state management
│   └── middleware.ts      # Middleware (i18n)
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

## Zustand State Management

This template includes the Zustand state management library for client-side state.

### Basic Usage

```typescript
// Create store
import { create } from 'zustand';

interface DataStore {
  items: any[];
  setItems: (items: any[]) => void;
}

const useDataStore = create<DataStore>((set) => ({
  items: [],
  setItems: (items) => set({ items })
}));
```

### Using in Components

```typescript
import { useDataStore } from '@/store/data-store';

function DataComponent() {
  const { items, setItems } = useDataStore();
  
  return (
    <div>
      <h1>Data Items: {items.length}</h1>
      <button onClick={() => setItems([...items, 'new item'])}>
        Add Item
      </button>
    </div>
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

## Customization

### Adding New Pages

1. Create new pages in the `src/app/[locale]/` directory
2. If internationalization is required, add necessary translation keys in the respective translation files

## License

MIT
