---
description: Design system and styling conventions
pattern: "**/*.{tsx,ts,css}"
---

# Design System and Styling Guidelines

## Styling Approach

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling, along with shadcn/ui components.

### Tailwind Usage Guidelines:

1. Prefer utility classes over custom CSS when possible
2. Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, etc.) for responsive design
3. Apply consistent spacing using Tailwind's spacing scale

### Custom Components Style Rules:

1. When building UI components:
   - Use composition rather than inheritance
   - Follow shadcn/ui design principles for consistency
   - Utilize `cva` (class-variance-authority) for component variants

2. Design Tokens:
   - Use Tailwind's theme system for colors, spacing, etc.
   - Avoid hardcoding colors or sizes; use Tailwind's values

### Accessibility:

1. Ensure proper color contrast for text
2. Use appropriate ARIA attributes when needed
3. Ensure keyboard navigation works as expected

### Dark Mode:

1. Support dark mode using Tailwind's dark mode feature
2. Test all components in both light and dark modes

Remember that a clean, consistent design system leads to better user experience and easier maintenance. 