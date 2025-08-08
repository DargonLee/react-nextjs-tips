# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with ThemeProvider
│   ├── page.tsx           # Main dashboard page
│   ├── globals.css        # Global styles and CSS variables
│   └── favicon.ico        # Site favicon
├── components/            # Reusable UI components
│   ├── Dashboard.tsx      # Main educational component (1400+ lines)
│   ├── Button.tsx         # Reusable button component
│   ├── UseCallbackShowcase.tsx
│   └── UseEffectShowcase.tsx
├── contexts/              # React Context providers
│   └── ThemeContext.tsx   # Theme management with localStorage
└── hooks/                 # Custom React hooks
    └── useLocalStorage.ts # Persistent state hook
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `Dashboard.tsx`, `Button.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLocalStorage.ts`)
- **Contexts**: PascalCase with `Context` suffix (e.g., `ThemeContext.tsx`)
- **Pages**: lowercase for Next.js routing (e.g., `page.tsx`)

## Component Architecture

### Main Dashboard Structure
- **Single comprehensive component** containing all 8 React patterns
- **Progressive teaching approach** with commented sections
- **Widget-based examples** for practical learning
- **Extensive inline documentation** with Python comparisons

### Reusable Components
- **Button component** with variant props (`primary`, `secondary`, `destructive`)
- **TypeScript interfaces** for all component props
- **Consistent styling** using CSS custom properties

## Styling Architecture

### CSS Organization
- **Global styles** in `src/app/globals.css`
- **CSS custom properties** for theming (light/dark modes)
- **Tailwind utilities** for layout and spacing
- **Component-specific classes** with semantic naming

### Theme System
- **CSS variables** for all colors and spacing
- **Automatic theme switching** via Context API
- **System preference detection** with manual override
- **localStorage persistence** for user preferences

## State Management Patterns

### Local State
- **useState** for component-level state
- **Immutable updates** for nested objects and arrays
- **Proper dependency arrays** in useEffect

### Global State
- **Context API** for theme management
- **Custom hooks** for context consumption
- **localStorage integration** for persistence

## Code Organization Principles

- **Educational focus**: Code is heavily commented for learning
- **Progressive complexity**: Simple patterns first, advanced patterns later
- **Problem-oriented**: Shows what happens without each pattern
- **Type safety**: TypeScript interfaces for all data structures
- **Performance awareness**: Proper use of useCallback and useMemo