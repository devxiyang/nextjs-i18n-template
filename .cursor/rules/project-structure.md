---
description: General rules for project structure and i18n implementation
pattern: "**/*.{tsx,ts,json}"
---

# Project Structure and i18n Guidelines

## Directory Structure

- `src/components/ui/`: shadcn/ui components only (see ui-components-convention.md)
- `src/components/`: Custom application components
- `src/app/[locale]/`: Internationalized app routes following Next.js App Router pattern
- `src/i18n/`: Internationalization configuration
- `src/config/`: Application configuration
- `messages/`: Translation files for each supported language

## i18n Implementation Rules

1. **Translation Keys**:
   - Use hierarchical structures: `section.subsection.key`
   - Keys should be descriptive and in English

2. **Message Files**:
   - Each supported language has its own JSON file in the `messages/` directory
   - Maintain consistent structure across all language files

3. **Text Content**:
   - Never hardcode user-facing text strings
   - Always use translation hooks/components:
     ```tsx
     // Use this:
     const t = useTranslations('common');
     return <p>{t('welcome')}</p>
     
     // Instead of:
     return <p>Welcome</p>
     ```

4. **Component Props**:
   - When creating components that display text, accept translation keys rather than direct text

## Language Switching

The application should provide an intuitive way for users to switch languages, and the current language should be preserved across navigation. 