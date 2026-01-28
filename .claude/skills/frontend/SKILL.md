---
name: frontend
description: Build responsive, accessible, production-ready frontend components. Use when creating or reviewing UI components, layouts, or pages.
---

# Frontend Development Skill

## Responsive Design Requirements

### Breakpoints (Tailwind defaults)
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)  
- `lg`: 1024px (laptop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (large screens)

### Mobile-First Approach
Always design mobile-first. Start with base styles, then add responsive modifiers:
```tsx
// ✅ Correct - mobile first
<div className="p-4 md:p-6 lg:p-8">

// ❌ Wrong - desktop first  
<div className="p-8 sm:p-4">
```

### Touch Targets
- Minimum 44x44px for interactive elements on mobile
- Use `min-h-11 min-w-11` or `p-3` on buttons/links

### Fluid Typography
```tsx
// Use clamp for fluid text
className="text-base md:text-lg lg:text-xl"
```

## Component Patterns

### Layout Components
```tsx
// Responsive container with max-width
<div className="container mx-auto px-4 sm:px-6 lg:px-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

// Sidebar layout (collapsible on mobile)
<div className="flex flex-col lg:flex-row">
  <aside className="w-full lg:w-64 lg:shrink-0">
  <main className="flex-1">
</div>
```

### Form Inputs
```tsx
// Properly sized inputs
<input className="w-full h-11 px-4 text-base rounded-lg border focus:ring-2 focus:ring-primary/50" />
```

### Navigation
```tsx
// Mobile menu pattern
<nav className="hidden md:flex"> {/* Desktop nav */}
<Sheet> {/* Mobile nav in sheet/drawer */}
```

## Accessibility Checklist

- [ ] All images have `alt` text
- [ ] Interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] Focus states are visible
- [ ] Form inputs have labels
- [ ] Use semantic HTML (`<main>`, `<nav>`, `<article>`, etc.)
- [ ] ARIA attributes where needed

## Performance

- Use `next/image` for images (auto optimization)
- Lazy load below-fold content
- Use `loading="lazy"` for iframes
- Minimize client-side JavaScript
- Use Server Components by default (Next.js 15)

## Dark Mode

Always support dark mode with Tailwind's `dark:` modifier:
```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

## Animation Guidelines

- Use `transition-all duration-200` for micro-interactions
- Respect `prefers-reduced-motion`:
```tsx
className="motion-safe:transition-transform motion-safe:hover:scale-105"
```

## Testing Responsiveness

Before marking complete:
1. Test at 320px width (small mobile)
2. Test at 768px (tablet)
3. Test at 1024px (laptop)
4. Test at 1440px+ (desktop)
5. Test with keyboard navigation
6. Test dark mode toggle
