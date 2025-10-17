# Apps

Full-stack applications that consume content from `content/`, `docs/`, and `sites/` folders.

## Overview

This folder contains complete applications (Next.js, Vite, Hono, etc.) that render MDX content into websites, APIs, dashboards, and other interactive experiences. These apps consume the content and documentation from other folders and provide the user-facing interface.

## Existing Apps

**[chatkit](./chatkit/)** - Chat interface kit

- Purpose: Reusable chat UI components and patterns
- Technology: React components
- Status: ✅ Exists

## App Categories

### Documentation Sites

Applications that render documentation from `sites/` and `docs/`:

**Planned: docs-site** - Universal documentation site generator

- Purpose: Render any `.do` domain documentation
- Technology: Next.js with MDX
- Consumes: `sites/{domain}/`, `docs/{domain}/`
- Features:
  - Automatic navigation from folder structure
  - Search across all documentation
  - Code syntax highlighting
  - Live code examples
  - API reference generation

### Marketing Sites

Applications that render marketing content from `content/`:

**Planned: marketing-site** - Universal marketing site generator

- Purpose: Render domain marketing pages
- Technology: Next.js with MDX
- Consumes: `content/{domain}/`
- Features:
  - Homepage, features, pricing pages
  - Blog with RSS feed
  - SEO optimization
  - Analytics integration

### Developer Tools

Applications for developers building with the platform:

**Planned: playground** - Interactive code playground

- Purpose: Try SDK.do in the browser
- Technology: Vite + Monaco Editor
- Features:
  - Live code editing
  - Instant feedback
  - Example library
  - Share code snippets

**Planned: studio** - Visual development environment

- Purpose: Build workflows visually
- Technology: Next.js + React Flow
- Features:
  - Visual workflow builder
  - Schema explorer
  - Database browser
  - Agent designer

### Admin Interfaces

Applications for managing platform resources:

**Planned: admin-dashboard** - Platform administration

- Purpose: Manage users, content, services
- Technology: Next.js + Payload CMS
- Features:
  - User management
  - Content editing
  - Service monitoring
  - Analytics dashboard

## App Structure

Each app follows this structure:

```
{app-name}/
├── src/
│   ├── app/              → Next.js app directory (or pages/)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [...slug]/
│   ├── components/       → React components
│   │   ├── mdx/         → MDX components
│   │   └── ui/          → UI components
│   ├── lib/             → Utility functions
│   │   ├── content.ts   → Content loading
│   │   ├── mdx.ts       → MDX processing
│   │   └── utils.ts     → Helpers
│   └── styles/          → Global styles
├── public/              → Static assets
├── .env.example         → Environment variables template
├── next.config.js       → Next.js config (or vite.config.ts)
├── package.json         → Dependencies
├── README.md            → App documentation
└── tsconfig.json        → TypeScript config
```

## Content Loading

Apps load content from sibling folders:

```typescript
// lib/content.ts
import { readFile } from 'fs/promises'
import { join } from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'

export async function getContent(path: string) {
  // Load from ai/content/
  const contentPath = join(process.cwd(), '../content', path)
  const source = await readFile(contentPath, 'utf-8')

  const { content, frontmatter } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
    },
  })

  return { content, frontmatter }
}

export async function getDocumentation(domain: string, slug: string) {
  // Load from ai/sites/
  const docPath = join(process.cwd(), '../sites', domain, `${slug}.mdx`)
  const source = await readFile(docPath, 'utf-8')
  return compileMDX({ source, options: { parseFrontmatter: true } })
}
```

## MDX Components

Apps provide custom MDX components:

```typescript
// components/mdx/MDXComponents.tsx
import { Code } from './Code'
import { Callout } from './Callout'
import { Example } from './Example'

export const mdxComponents = {
  // Custom components
  Code,
  Callout,
  Example,

  // Override HTML elements
  h1: (props) => <h1 className="text-4xl font-bold" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold mt-8" {...props} />,
  code: (props) => <Code {...props} />,

  // Add semantic components
  SemanticPath: ({ children }) => (
    <code className="semantic-path">${children}</code>
  )
}
```

## Dynamic Routing

Apps use dynamic routing to render any domain:

```typescript
// app/[domain]/[[...slug]]/page.tsx
interface Props {
  params: {
    domain: string
    slug?: string[]
  }
}

export default async function DomainPage({ params }: Props) {
  const { domain, slug = ['index'] } = params
  const path = `${domain}/${slug.join('/')}.mdx`

  const { content, frontmatter } = await getContent(path)

  return (
    <article>
      <h1>{frontmatter.title}</h1>
      <div>{content}</div>
    </article>
  )
}

// Generate static paths for all domains
export async function generateStaticParams() {
  const domains = await getAllDomains()
  return domains.map((domain) => ({ domain }))
}
```

## Development

### Run App Locally

```bash
cd apps/{app-name}
pnpm install
pnpm dev
# App runs on http://localhost:3000
```

### Build for Production

```bash
cd apps/{app-name}
pnpm build
pnpm start
```

### Deploy

```bash
cd apps/{app-name}
pnpm deploy
# Deploys to Cloudflare Pages, Vercel, or Netlify
```

## Adding a New App

1. **Create app folder**: `mkdir apps/{app-name}`
2. **Initialize app**: Choose framework (Next.js, Vite, etc.)
   ```bash
   cd apps/{app-name}
   pnpm create next-app@latest .
   # or
   pnpm create vite@latest . --template react-ts
   ```
3. **Configure content loading**: Set up content loading from `../content/`, `../sites/`, `../docs/`
4. **Create MDX components**: Build reusable MDX components
5. **Add routing**: Set up dynamic routing for domains
6. **Style app**: Add global styles and themes
7. **Test locally**: Run `pnpm dev` and test content rendering
8. **Update this README**: Document the app purpose and features

## App Templates

### Next.js Documentation Site Template

```typescript
// app/[domain]/[[...slug]]/page.tsx
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getDocumentation, getAllDomains } from '@/lib/content'
import { mdxComponents } from '@/components/mdx'

export async function generateStaticParams() {
  const domains = await getAllDomains()
  return domains.map((domain) => ({ domain }))
}

interface Props {
  params: { domain: string; slug?: string[] }
}

export default async function Page({ params }: Props) {
  const { domain, slug = ['index'] } = params

  try {
    const { content, frontmatter } = await getDocumentation(
      domain,
      slug.join('/')
    )

    return (
      <div className="prose">
        <h1>{frontmatter.title}</h1>
        <p>{frontmatter.description}</p>
        <MDXRemote
          source={content}
          components={mdxComponents}
        />
      </div>
    )
  } catch (error) {
    notFound()
  }
}
```

### Vite Static Site Generator Template

```typescript
// build.ts
import { glob } from 'glob'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import { renderToString } from 'react-dom/server'

async function build() {
  const contentFiles = await glob('../content/**/*.mdx')

  for (const file of contentFiles) {
    const source = await readFile(file, 'utf-8')
    const { content, frontmatter } = await compileMDX({
      source,
      options: { parseFrontmatter: true }
    })

    const html = renderToString(
      <Layout frontmatter={frontmatter}>
        {content}
      </Layout>
    )

    const outputPath = file
      .replace('../content/', 'dist/')
      .replace('.mdx', '.html')

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html)
  }
}

build()
```

## Environment Variables

Apps typically need these environment variables:

```bash
# .env.example

# Content paths (relative to app)
CONTENT_PATH=../content
SITES_PATH=../sites
DOCS_PATH=../docs

# API endpoints
API_URL=https://api.do
DATABASE_URL=https://database.do

# Analytics
ANALYTICS_ID=...

# Feature flags
ENABLE_SEARCH=true
ENABLE_COMMENTS=true
```

## Performance Optimization

### Static Generation

Generate static HTML at build time for better performance:

```typescript
// next.config.js
module.exports = {
  output: 'export', // Static export
  images: {
    unoptimized: true,
  },
}
```

### Incremental Static Regeneration

Regenerate pages periodically:

```typescript
export const revalidate = 3600 // Revalidate every hour

export default async function Page({ params }) {
  const content = await getContent(params.slug)
  return <div>{content}</div>
}
```

### Content Caching

Cache compiled MDX for faster builds:

```typescript
const contentCache = new Map()

export async function getContent(path: string) {
  if (contentCache.has(path)) {
    return contentCache.get(path)
  }

  const content = await loadAndCompile(path)
  contentCache.set(path, content)
  return content
}
```

## Testing

### Content Loading Tests

```typescript
// __tests__/content.test.ts
import { getContent } from '@/lib/content'

describe('getContent', () => {
  it('loads content from content folder', async () => {
    const content = await getContent('sdk.do/index.mdx')
    expect(content.frontmatter.title).toBe('SDK.do')
  })

  it('throws error for missing content', async () => {
    await expect(getContent('invalid/path.mdx')).rejects.toThrow()
  })
})
```

### Component Tests

```typescript
// __tests__/MDXContent.test.tsx
import { render } from '@testing-library/react'
import { MDXContent } from '@/components/MDXContent'

describe('MDXContent', () => {
  it('renders MDX content', () => {
    const { getByText } = render(
      <MDXContent source="# Hello\n\nWorld" />
    )
    expect(getByText('Hello')).toBeInTheDocument()
  })
})
```

## App Types

### Next.js App

Full-featured Next.js application with SSR, ISR, and static export:

- **Use for**: Documentation sites, marketing sites, dashboards
- **Benefits**: SEO, fast page loads, great DX
- **Template**: `pnpm create next-app`

### Vite App

Fast, lightweight Vite application for SPAs:

- **Use for**: Playgrounds, tools, interactive experiences
- **Benefits**: Fast dev server, small bundle size
- **Template**: `pnpm create vite`

### Hono App

Edge-first API and server-side rendering with Hono:

- **Use for**: APIs, edge rendering, serverless functions
- **Benefits**: Fast, lightweight, edge-ready
- **Template**: `pnpm create hono`

## License

MIT (Open Source)

All applications in this folder are open-source and free to use, modify, and distribute.

---

Part of the [`.do` platform](https://github.com/dot-do/platform) open-source ecosystem.
