# Next.js i18n Template

A modern, internationalized Next.js template with dark mode support, built with TypeScript, Tailwind CSS, and shadcn/ui components.

![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38b2ac)
![next-intl](https://img.shields.io/badge/next--intl-4.0-orange)

## Features

- 📝 **TypeScript** - Type-safe code development
- 🌐 **Internationalization** - Multilingual support with next-intl
- 🎨 **Theming** - Light/dark mode with next-themes
- 📱 **Responsive Design** - Mobile-first layout approach
- 🧩 **Component Library** - Built with shadcn/ui components
- 🎯 **Cursor Rules** - Custom AI assistance directives for development
- ⚡ **Fast Development** - Powered by Next.js App Router and TurboRepo

## Supported Languages

- 🇺🇸 English
- 🇨🇳 Chinese (Simplified)
- 🇯🇵 Japanese
- 🇫🇷 French
- 🇩🇪 German
- 🇪🇸 Spanish

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-i18n-template.git
   cd nextjs-i18n-template
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the template in action.

## Project Structure

```
nextjs-i18n-template/
├── .cursor/                  # Cursor.sh rules for AI assistance
├── messages/                 # Translation files
│   ├── en.json              # English translations
│   ├── zh.json              # Chinese translations
│   ├── ja.json              # Japanese translations
│   └── ...                  # Other language files
├── public/                   # Static files
├── src/
│   ├── app/                 # Next.js App Router
│   │   └── [locale]/        # Locale-based routing
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.tsx       # Site header with language switcher
│   │   ├── LocaleSwitcher.tsx # Language selection component
│   │   └── ThemeSwitcher.tsx # Theme toggle component
│   ├── config/              # Application configuration
│   └── i18n/                # i18n configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Customization

### Adding New Languages

1. Create a new JSON file in the `messages` directory, e.g., `it.json` for Italian
2. Update the supported locales in `src/config/site.config.ts`
3. Add the locale to `generateStaticParams` in `src/app/[locale]/layout.tsx`

### Adding Components

The project follows a specific convention for UI components:

- `src/components/ui/` is exclusively for shadcn/ui components
- Custom components should be placed in the `src/components/` directory

To add a new shadcn/ui component:

```bash
npx shadcn-ui@latest add [component-name]
```

### Styling

This project uses Tailwind CSS for styling. The theme configuration is in `tailwind.config.ts`.

## Development Guidelines

- Follow the [Next.js best practices](https://nextjs.org/docs/advanced-features/best-practices)
- Use TypeScript for type safety
- Use the internationalization API for all user-facing text
- Test changes in both light and dark mode
- Test responsive design on various screen sizes

## Deployment

This template can be easily deployed to [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fnextjs-i18n-template)

## Authentication System

This project implements a convention-over-configuration approach for authentication, simplifying development and enhancing maintainability.

### Key Authentication Conventions

1. **Protected Routes**
   - Any route with the `/protected/` prefix requires authentication
   - All other routes are public by default
   - Example: `/protected/dashboard`, `/[locale]/protected/settings`

2. **Redirect Parameters**
   - Uses Supabase's standard `next` parameter for post-authentication redirects
   - Example: `/sign-in?next=/protected/dashboard`

3. **Fixed Callback Path**
   - OAuth callback is always `/api/auth/callback`
   - Configured in the authentication utility functions

4. **Default Redirects**
   - After Sign Out: Redirects to homepage (`/`)
   - After Sign In: Uses the `next` parameter or defaults to homepage (`/`)

### Paths Configuration

While we follow convention-over-configuration, all paths and redirects are centralized in a single configuration file:

```typescript
// src/config/auth.paths.ts
export const PROTECTED_PREFIX = '/protected';

export const AUTH_PATHS = {
  // Page paths
  SIGN_IN: '/sign-in',
  SIGN_OUT: '/sign-out',
  PROFILE: '/protected/profile',
  DEBUG: '/protected/debug',
  
  // API endpoints
  API: {
    CALLBACK: '/api/auth/callback',
    SIGN_OUT: '/api/auth/sign-out',
  },
  
  // Default redirects
  REDIRECT: {
    AFTER_SIGN_IN: '/',
    AFTER_SIGN_OUT: '/',
  }
};
```

This approach combines the benefits of conventions (simplicity, discoverability) with the flexibility of configuration (customization, centralization).

For detailed information, see [.cursor/rules/auth-convention.md](./.cursor/rules/auth-convention.md)

## License

MIT License

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [next-intl](https://next-intl-docs.vercel.app/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

# Next.js with Zustand Global State Management

This project demonstrates an efficient pattern for using Zustand with Next.js Server Components.

## Provider-less Integration Pattern for Zustand with Next.js Server Components

Integrating client-state management with Next.js 14+ Server Components can be challenging. This project showcases a clean approach that connects server data with Zustand client-state management without requiring traditional Provider wrappers.

### Why This Pattern Matters

When building Next.js applications, we often face these challenges:

1. Server Components cannot use React hooks (including state management hooks)
2. Server Components can efficiently fetch data
3. Client Components need to access this data and manage interactive state
4. Traditional approaches often require Provider wrappers, increasing code complexity

### Core Technology: Provider-less Zustand State Management

This project implements a provider-less pattern to solve these issues, consisting of three main parts:

## Implementation Details

### 1. Zustand Store (dataforseoStore.ts)

```typescript
// Create store
const useDataForSeoStore = create<DataForSeoLocationStore>((set) => ({
    locations: [],
    setLocations: (locations) => set({ locations }),
    hydrate: (data) => set({ locations: data })
}))

// Export direct hydration function
export const hydrateSeoStore = (data: LocationAndLanguage[]) => {
    useDataForSeoStore.getState().hydrate(data);
}
```

**Key Points:**
- Store is a module-level singleton, all imports use the same instance
- Includes a `hydrate` method for initialization
- Provides a convenient `hydrateSeoStore` function to simplify external calls

### 2. Hydration Component (StoreHydration.tsx)

```typescript
'use client';

export default function StoreHydration({ data }: { data: LocationAndLanguage[] }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (data && data.length > 0 && !hydrated.current) {
      hydrateSeoStore(data);
      hydrated.current = true;
    }
  }, [data]);

  return null;
}
```

**Key Points:**
- Marked as 'use client' to ensure client-side execution
- Uses useRef to prevent multiple hydrations
- useEffect ensures execution after DOM mounting
- Renders nothing (returns null)
- Only responsible for injecting server data into client state

### 3. Server Component Integration (layout.tsx)

```typescript
// Server Component
export default async function RootLayout({ children, params }) {
  // Get locale
  const { locale } = await params;
  
  // Fetch data on the server
  const locations = await fetchLocations().catch(() => []);

  return (
    <html lang={locale}>
      <body>
        {/* Other providers */}
        <ThemeProvider>
          <NextIntlClientProvider>
            {/* Hydration component - renders nothing, only initializes state */}
            <StoreHydration data={locations} />
            {/* Application content */}
            <Header />
            <main>{children}</main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Key Points:**
- Server component asynchronously fetches data
- Passes data as props to StoreHydration
- StoreHydration is placed alongside application content, not wrapping it

### 4. Using State in Client Components

```typescript
'use client';
import useDataForSeoStore from '@/store/dataforseoStore';

export default function MyClientComponent() {
  // Access hydrated data
  const locations = useDataForSeoStore(state => state.locations);
  
  return (
    <div>
      {locations.map(location => (
        <div key={location.id}>{location.name}</div>
      ))}
    </div>
  );
}
```

### Data Flow Diagram

Below is a diagram showing how data flows from server to client throughout the application:

```
┌─────────────────────────────────┐
│ Root Layout (SSR)               │
│                                 │
│ 1. Fetch data: fetchLocations() │
│ 2. Pass data to StoreHydration  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ StoreHydration (Client)         │
│                                 │
│ 1. Receive server data          │
│ 2. Hydrate Zustand store        │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ Page Component (SSR)            │
│                                 │
│ 1. Simple layout & Suspense     │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│ Client Components               │
│                                 │
│ 1. Read data from Zustand store │
│ 2. Handle user interactions     │
│ 3. Render UI                    │
└─────────────────────────────────┘
```

### Benefits

1. **Performance Optimization**:
   - Faster server-side data fetching
   - Avoids additional client-side data fetching requests
   - Reduces unnecessary component re-renders

2. **Code Simplicity**:
   - No complex Provider wrappers needed
   - Page components focus on layout and rendering
   - Data fetching and hydration logic centralized

3. **Better User Experience**:
   - Data available at top level, accessible during navigation between pages
   - Reduces loading state transitions frequency
   - More stable and responsive interface

4. **Simplified State Management**:
   - Centralized state management easier to maintain
   - All components share the same data source
   - Avoids state synchronization issues

This pattern perfectly combines the advantages of React Server Components and client-side state management, benefiting from both server rendering performance and SEO benefits, while maintaining client interaction flexibility.

## Avoiding Common Issues with Zustand and Server Components

When implementing this pattern, you might encounter some common issues. Here's how to avoid them:

### Preventing Infinite Update Loops

One of the most common issues with Zustand and React Server Components is the dreaded error:
```
Error: The result of getServerSnapshot should be cached to avoid an infinite loop
```

This typically happens when:

1. The store state changes trigger component re-renders
2. Component re-renders cause the store to change state again
3. This creates an infinite loop of updates

### Best Practices to Avoid Update Loops

1. **Use Stable Selectors**:
   ```typescript
   // ❌ WRONG: Creates a new function on every render
   const data = useStore(state => ({ value: state.value }));
   
   // ✅ RIGHT: Define selector outside component
   const selectValue = state => ({ value: state.value });
   const data = useStore(selectValue);
   ```

2. **Memoize Derived State**:
   ```typescript
   // Use useMemo to prevent recalculations on every render
   const processedData = useMemo(() => {
     return data.map(item => processItem(item));
   }, [data]);
   ```

3. **Use Stable References**:
   ```typescript
   // Define initial state object once
   const initialState = { data: [], loading: false };
   
   // Use it in your store
   const useStore = create(() => ({ ...initialState }));
   
   // And in reset operations
   const reset = () => set(initialState);
   ```

4. **Hydrate Only Once**:
   ```typescript
   // In StoreHydration component:
   const hydrated = useRef(false);
   
   useEffect(() => {
     if (!hydrated.current) {
       hydrated.current = true;
       hydrateSeoStore(data);
     }
   }, []); // Empty dependency array - run only once
   ```

5. **Guard Against Empty Data**:
   ```typescript
   // Only hydrate if we have meaningful data
   if (Array.isArray(data) && data.length > 0) {
     store.getState().hydrate(data);
   }
   ```

6. **Use Callback Handlers**:
   ```typescript
   // Use useCallback for event handlers
   const handleClick = useCallback(() => {
     setSelected(id);
   }, [id]);
   ```

### Solving the "getServerSnapshot" Error in Next.js

If you still encounter the "getServerSnapshot" error with Zustand and Next.js after trying the standard approaches, try these more advanced solutions:

#### 1. Use State Updater Functions

Always use the function form of `set` in your Zustand store to ensure state updates are based on the previous state:

```typescript
// ❌ WRONG: Direct object mutation
set({ count: count + 1 });

// ✅ RIGHT: Function updater
set((state) => ({ count: state.count + 1 }));
```

#### 2. Track Hydration Status Outside React

Keep track of hydration status outside of React's lifecycle:

```typescript
// In your store file
let storeHydrated = false;

// In your hydrate function
hydrate: (data) => {
  if (storeHydrated) return;
  storeHydrated = true;
  set(() => ({ data }));
}
```

#### 3. Use Local State with Manual Subscription

In components, use local state with manual subscription to avoid the direct useSyncExternalStore hook:

```typescript
function MyComponent() {
  // Use local state instead of directly accessing store
  const [data, setData] = useState(useMyStore.getState().data);
  
  // Subscribe to changes
  useEffect(() => {
    return useMyStore.subscribe(
      state => setData(state.data)
    );
  }, []);
  
  // Rest of component...
}
```

#### 4. Avoid Hydration in Client Components

Only perform hydration in dedicated components specifically designed for it:

```typescript
// StoreHydration.tsx
'use client';

export default function StoreHydration({ data }) {
  const hasEffectRun = useRef(false);
  
  useEffect(() => {
    if (hasEffectRun.current) return;
    hasEffectRun.current = true;
    
    if (data && Array.isArray(data) && data.length > 0) {
      hydrateSeoStore(data);
    }
  }, []);
  
  return null;
}
```

By combining these strategies, you can effectively prevent the "getServerSnapshot" error and build robust applications that efficiently utilize server-side rendering with client-side state management.
