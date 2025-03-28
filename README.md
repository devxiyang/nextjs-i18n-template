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

## License

MIT License

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [next-intl](https://next-intl-docs.vercel.app/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
