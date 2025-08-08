# Technology Stack

## Framework & Runtime
- **Next.js 15** with App Router
- **React 19** with latest features
- **TypeScript 5** for type safety
- **Node.js** runtime environment

## Styling & UI
- **Tailwind CSS 4** for utility-first styling
- **CSS Custom Properties** for theming (light/dark modes)
- **Geist & Geist Mono** fonts from Google Fonts
- Responsive design with mobile-first approach

## Development Tools
- **ESLint** with Next.js configuration
- **PostCSS** with Tailwind plugin
- **TypeScript** strict mode enabled
- **pnpm** as package manager (lock file present)

## Build System & Commands

### Development
```bash
npm run dev          # Start development server
pnpm dev            # Alternative with pnpm
```

### Production
```bash
npm run build       # Build for production
npm run start       # Start production server
```

### Code Quality
```bash
npm run lint        # Run ESLint checks
```

## Key Dependencies
- `react` ^19.0.0
- `react-dom` ^19.0.0  
- `next` 15.3.5
- `typescript` ^5
- `tailwindcss` ^4

## Architecture Patterns
- **Custom Hooks** for reusable logic (`useLocalStorage`, `useTheme`)
- **Context API** for global state (theme management)
- **Component Composition** with TypeScript interfaces
- **CSS-in-JS** via CSS custom properties
- **Progressive Enhancement** with client-side hydration

## Performance Considerations
- `useCallback` and `useMemo` for optimization
- Proper dependency arrays in useEffect
- Immutable state updates
- Efficient list rendering with keys