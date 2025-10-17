# static.org.ai

Minimal, Obsidian-style documentation template built with HonoX and Tailwind CSS v4. Perfect for building knowledge bases and documentation sites for the .org.ai package ecosystem.

## Features

- **3-Column Layout** - Fixed header (56px), collapsible sidebar (256px), main content (max 1120px), table of contents (200px)
- **[[Wikilinks]]** - Obsidian-style internal linking with cross-package support
- **Dark Mode** - Beautiful light/dark theme with smooth transitions
- **Tree Navigation** - File tree structure with folders and nesting
- **Ultra-Fast** - 12KB bundle size, ~0.5ms CPU per request
- **Fumadocs Design** - Professional layout inspired by Fumadocs
- **Workers Static Assets** - Native Cloudflare Workers deployment
- **Responsive** - Mobile-first design with hamburger menu

## Tech Stack

- **HonoX** - Ultra-lightweight meta-framework (12KB)
- **Tailwind CSS v4** - Utility-first CSS with `@theme` support
- **Workers Static Assets** - Cloudflare Workers deployment target
- **TypeScript** - Full type safety
- **Vite** - Fast development and build

## Getting Started

### Installation

```bash
cd ai/apps/static.org.ai
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
pnpm build
```

### Deploy

```bash
pnpm deploy
```

## Project Structure

```
static.org.ai/
├── app/
│   ├── routes/              # HonoX file-based routes
│   │   └── index.tsx        # Homepage
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx   # Fixed header with logo, nav, search, theme toggle
│   │   │   ├── Sidebar.tsx  # Left navigation tree
│   │   │   ├── TOC.tsx      # Right table of contents
│   │   │   └── Footer.tsx   # Footer with edit link
│   │   └── wiki/            # Wiki-specific components
│   │       ├── Backlinks.tsx
│   │       └── WikiLink.tsx
│   ├── islands/             # Client-side interactivity
│   │   ├── theme-toggle.ts
│   │   ├── mobile-menu.ts
│   │   └── folder-toggle.ts
│   ├── lib/                 # Utilities
│   │   ├── wikilinks.ts     # Wikilink parser and resolver
│   │   └── markdown.ts      # Markdown parser
│   ├── styles/
│   │   └── global.css       # Tailwind CSS v4 with Fumadocs theme
│   └── global.tsx           # Root layout
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.toml            # Cloudflare Workers config
```

## Wikilinks

### Basic Syntax

```markdown
[[Page Name]]              → Internal link to /Page-Name
[[Page Name|Custom Text]]  → Link with custom text
```

### Cross-Package Links

```markdown
[[tech.org.ai/Python]]                    → https://tech.org.ai/Python
[[soc.org.ai/Software Developer]]         → https://soc.org.ai/Software-Developer
[[industries.org.ai/Healthcare|Health]]   → Custom text for cross-package link
```

### Implementation

Wikilinks are parsed by `app/lib/wikilinks.ts` and automatically converted to HTML links:

- **Internal links** - Stay on the same domain
- **Cross-package links** - Open in new tab with external icon
- **Space handling** - Spaces converted to hyphens in URLs

## Customization

### Colors

Edit `app/styles/global.css` to customize the Fumadocs-inspired color system:

```css
@theme {
  --color-primary: hsl(221.2 83.2% 53.3%);
  --color-background: hsl(0 0% 100%);
  /* ... more colors */
}
```

### Navigation

Edit navigation structure in route files (e.g., `app/routes/index.tsx`):

```typescript
const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/', active: true },
      { title: 'Installation', href: '/installation' },
    ],
  },
]
```

### Layout

The 3-column layout is responsive:

- **Desktop (>1024px)** - Full 3-column layout
- **Tablet (640-1024px)** - 2 columns (sidebar + content)
- **Mobile (<640px)** - Single column with hamburger menu

## Performance

### Bundle Size

- **Total JS**: ~12KB gzipped
- **CSS**: ~3KB gzipped
- **HTML**: Varies by page

### CPU Time

- **Cold start**: ~1-2ms
- **Warm requests**: ~0.3-0.5ms
- **Static assets**: Served from CDN

### Scalability

This template is designed for **small to medium** .org.ai packages:

- ✅ **< 2,000 pages** - Excellent performance
- ⚠️ **2K-20K pages** - Good, but consider caching strategies
- ❌ **> 20K pages** - Use `dynamic.org.ai` (React Router v7) instead

For massive packages (wikipedia.org.ai, vc.org.ai), use the `dynamic.org.ai` template.

## Deployment

### Cloudflare Workers

```bash
wrangler pages deploy ./dist
```

### Custom Domain

```bash
wrangler pages project create static-org-ai
wrangler pages deployment create dist --project-name=static-org-ai
wrangler pages domains add your-domain.org.ai --project-name=static-org-ai
```

## Related Templates

- **static.sites.as** - Identical template for .sites.as proxy domains
- **dynamic.org.ai** - React Router v7 template for massive sites
- **dynamic.sites.as** - React Router v7 template for .sites.as proxies

## License

MIT

## Resources

- [HonoX Documentation](https://hono.dev/guides/honox)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Fumadocs](https://fumadocs.vercel.app/) (design inspiration)
