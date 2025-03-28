---
description: Rule for UI components organization and shadcn/ui usage
pattern: "**/src/components/ui/**"
---

# UI Components Organization Rules

## shadcn/ui Components Convention

The directory `src/components/ui` is **exclusively reserved** for [shadcn/ui](https://ui.shadcn.com/) official components. 

### Rules:

1. **DO NOT** place custom components in this directory
2. **DO NOT** modify shadcn/ui components unless absolutely necessary
3. **DO** use the shadcn CLI to add components to this directory:
   ```bash
   npx shadcn@latest add [component-name]
   ```

### Custom Components Placement:

For custom UI components that build upon shadcn/ui:
- Place them in the `src/components/` root directory
- Create appropriate subdirectories for organization by feature/functionality

### Benefits:

- Maintains clear separation between official reusable UI components and application-specific components
- Makes upgrades of shadcn/ui components easier
- Facilitates consistent styling throughout the application
- Simplifies onboarding for new developers

### Note on Component Modification:

If you absolutely must modify a shadcn/ui component, add a comment explaining:
1. Why the modification was necessary
2. What changes were made
3. How it might affect upgrades 