# Fumadocs Layout Specification

**Date**: 2025-10-16
**Purpose**: Document Fumadocs layout/style for our custom .org.ai and .sites.as templates

## Layout Structure

Based on Fumadocs documentation site analysis, here's the exact layout we'll implement:

### Overall Layout

```
┌────────────────────────────────────────────────────────────┐
│                     Fixed Header (56px)                     │
│  [Logo] [Nav Items...]              [Search] [Theme] [≡]   │
└────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────┬────────────────────┐
│          │                          │                    │
│  Left    │    Main Content          │   Right TOC        │
│  Sidebar │    (max-width: 1120px)   │   (sticky)         │
│  (tree)  │                          │                    │
│          │                          │                    │
│  256px   │    Flexible              │   200px            │
│          │                          │                    │
└──────────┴──────────────────────────┴────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, hamburger menu |
| Tablet | 640px - 1024px | Content + One sidebar |
| Desktop | > 1024px | Full 3-column layout |

## CSS Variables (Fumadocs-inspired)

### Color System

```css
@theme {
  /* Background */
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);

  /* Muted (secondary text, borders) */
  --color-muted: hsl(210 40% 96.1%);
  --color-muted-foreground: hsl(215.4 16.3% 46.9%);

  /* Card */
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(222.2 84% 4.9%);

  /* Popover */
  --color-popover: hsl(0 0% 100%);
  --color-popover-foreground: hsl(222.2 84% 4.9%);

  /* Primary (brand color) */
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-primary-foreground: hsl(210 40% 98%);

  /* Secondary */
  --color-secondary: hsl(210 40% 96.1%);
  --color-secondary-foreground: hsl(222.2 47.4% 11.2%);

  /* Accent */
  --color-accent: hsl(210 40% 96.1%);
  --color-accent-foreground: hsl(222.2 47.4% 11.2%);

  /* Destructive */
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-destructive-foreground: hsl(210 40% 98%);

  /* Border */
  --color-border: hsl(214.3 31.8% 91.4%);

  /* Input */
  --color-input: hsl(214.3 31.8% 91.4%);

  /* Ring (focus) */
  --color-ring: hsl(221.2 83.2% 53.3%);

  /* Spacing */
  --spacing-container: 1120px;
  --spacing-sidebar-left: 256px;
  --spacing-sidebar-right: 200px;

  /* Border radius */
  --radius: 0.5rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
}

/* Dark mode */
.dark {
  --color-background: hsl(222.2 84% 4.9%);
  --color-foreground: hsl(210 40% 98%);

  --color-muted: hsl(217.2 32.6% 17.5%);
  --color-muted-foreground: hsl(215 20.2% 65.1%);

  --color-card: hsl(222.2 84% 4.9%);
  --color-card-foreground: hsl(210 40% 98%);

  --color-popover: hsl(222.2 84% 4.9%);
  --color-popover-foreground: hsl(210 40% 98%);

  --color-primary: hsl(217.2 91.2% 59.8%);
  --color-primary-foreground: hsl(222.2 47.4% 11.2%);

  --color-secondary: hsl(217.2 32.6% 17.5%);
  --color-secondary-foreground: hsl(210 40% 98%);

  --color-accent: hsl(217.2 32.6% 17.5%);
  --color-accent-foreground: hsl(210 40% 98%);

  --color-destructive: hsl(0 62.8% 30.6%);
  --color-destructive-foreground: hsl(210 40% 98%);

  --color-border: hsl(217.2 32.6% 17.5%);
  --color-input: hsl(217.2 32.6% 17.5%);
  --color-ring: hsl(224.3 76.3% 48%);
}
```

## Component Specifications

### Header

**Height**: 56px (fixed)
**Position**: sticky top-0
**Layout**: flex justify-between items-center
**Padding**: px-6

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
  <div className="container flex h-14 items-center">
    <div className="mr-4 flex">
      <Logo />
    </div>
    <nav className="flex items-center gap-6">
      <NavItem href="/docs">Documentation</NavItem>
      <NavItem href="/blog">Blog</NavItem>
    </nav>
    <div className="ml-auto flex items-center gap-2">
      <SearchButton />
      <ThemeToggle />
      <MobileMenuButton />
    </div>
  </div>
</header>
```

### Left Sidebar (Navigation Tree)

**Width**: 256px on desktop, full-width drawer on mobile
**Position**: sticky top-14 (below header)
**Height**: calc(100vh - 56px)
**Overflow**: overflow-y-auto
**Padding**: p-6

```tsx
<aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r">
  <nav className="space-y-1 py-6 px-4">
    <NavSection title="Getting Started">
      <NavItem href="/docs/installation">Installation</NavItem>
      <NavItem href="/docs/quick-start">Quick Start</NavItem>
    </NavSection>

    <NavSection title="Components" defaultOpen>
      <NavItem href="/docs/button">Button</NavItem>
      <NavItem href="/docs/card">Card</NavItem>
      <NavFolder title="Forms">
        <NavItem href="/docs/input">Input</NavItem>
        <NavItem href="/docs/select">Select</NavItem>
      </NavFolder>
    </NavSection>
  </nav>
</aside>
```

### Main Content Area

**Max-width**: 1120px
**Padding**: py-6 px-6
**Margin**: Left: 256px (desktop), auto-centered when no sidebar
**Min-height**: calc(100vh - 56px)

```tsx
<main className="flex-1 px-6 py-6">
  <div className="mx-auto max-w-4xl">
    <article className="prose dark:prose-invert">
      {/* Markdown content */}
      <h1>Page Title</h1>
      <p>Content...</p>
    </article>

    <footer className="mt-12 border-t pt-6">
      <div className="flex items-center justify-between">
        <PrevNextNav />
        <EditOnGitHub />
      </div>
    </footer>
  </div>
</main>
```

### Right Sidebar (Table of Contents)

**Width**: 200px
**Position**: sticky top-14
**Height**: calc(100vh - 56px)
**Hidden**: On mobile/tablet (< 1024px)

```tsx
<aside className="fixed right-0 top-14 hidden h-[calc(100vh-3.5rem)] w-50 overflow-y-auto xl:block">
  <div className="py-6 px-4">
    <h4 className="mb-4 text-sm font-semibold">On this page</h4>
    <nav className="text-sm">
      <ul className="space-y-2">
        <li>
          <a href="#overview" className="text-muted-foreground hover:text-foreground">
            Overview
          </a>
        </li>
        <li className="pl-4">
          <a href="#installation" className="text-muted-foreground hover:text-foreground">
            Installation
          </a>
        </li>
      </ul>
    </nav>
  </div>
</aside>
```

## Typography

### Prose Styling

Fumadocs uses Tailwind Typography plugin with custom overrides:

```css
.prose {
  --tw-prose-body: theme(colors.foreground);
  --tw-prose-headings: theme(colors.foreground);
  --tw-prose-links: theme(colors.primary);
  --tw-prose-bold: theme(colors.foreground);
  --tw-prose-code: theme(colors.foreground);
  --tw-prose-pre-bg: theme(colors.muted);
}

.dark .prose {
  --tw-prose-body: theme(colors.muted-foreground);
  --tw-prose-headings: theme(colors.foreground);
  --tw-prose-links: theme(colors.primary);
}
```

### Font Sizes

```css
h1: 2.25rem (36px), font-bold
h2: 1.875rem (30px), font-semibold
h3: 1.5rem (24px), font-semibold
h4: 1.25rem (20px), font-medium
body: 1rem (16px), font-normal
small: 0.875rem (14px)
```

## Spacing System

Fumadocs uses Tailwind's default spacing scale:

```
px-6 = 1.5rem = 24px
py-6 = 1.5rem = 24px
py-16 = 4rem = 64px
gap-4 = 1rem = 16px
space-y-1 = 0.25rem = 4px vertical
space-y-2 = 0.5rem = 8px vertical
```

## Animation & Transitions

```css
/* Smooth transitions */
transition: all 0.2s ease;

/* Hover states */
hover:bg-accent
hover:text-accent-foreground

/* Focus ring */
focus:outline-none
focus:ring-2
focus:ring-ring
focus:ring-offset-2
```

## Responsive Grid

For card/content grids:

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card />
  <Card />
  <Card />
</div>
```

## Navigation Tree Structure

```typescript
interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
}

interface NavFolder {
  title: string
  icon?: React.ReactNode
  defaultOpen?: boolean
  items: (NavItem | NavFolder)[]
}

interface NavSection {
  title: string
  items: (NavItem | NavFolder)[]
}

const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', href: '/docs/button' },
      {
        title: 'Forms',
        defaultOpen: true,
        items: [
          { title: 'Input', href: '/docs/input' },
          { title: 'Select', href: '/docs/select' },
        ],
      },
    ],
  },
]
```

## Implementation Notes

### For HonoX Templates (static.org.ai, static.sites.as)
- Use native JSX components
- No React hooks (use vanilla JS for interactivity)
- Server-render all navigation
- Static file tree generation

### For React Router v7 Templates (dynamic.org.ai, dynamic.sites.as)
- Full React components
- React hooks for state management
- Dynamic navigation via loaders
- Server-side rendering with streaming

## Key Differences from Fumadocs

What we're **keeping**:
- ✅ Layout structure (3-column)
- ✅ Color system and CSS variables
- ✅ Typography and spacing
- ✅ Navigation tree pattern
- ✅ Responsive breakpoints

What we're **not using**:
- ❌ Fumadocs framework/dependencies
- ❌ Content source adapters
- ❌ Built-in search (we'll use Vectorize)
- ❌ MDX processing (we'll use remark)
- ❌ Next.js specific features

## Summary

This specification provides the exact visual design and layout structure from Fumadocs while keeping our templates lightweight and framework-agnostic. The implementation will be 100% custom code using only Tailwind CSS and basic HTML/JSX components.
