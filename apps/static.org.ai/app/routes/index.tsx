import { createRoute } from 'honox/factory'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { TOC } from '@/components/layout/TOC'
import { Footer } from '@/components/layout/Footer'

// Sample navigation structure
const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/', active: true },
      { title: 'Installation', href: '/installation' },
      { title: 'Quick Start', href: '/quick-start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Things', href: '/things' },
      { title: 'Wikilinks', href: '/wikilinks' },
      {
        title: 'Components',
        defaultOpen: true,
        items: [
          { title: 'Layout', href: '/components/layout' },
          { title: 'Wiki', href: '/components/wiki' },
        ],
      },
    ],
  },
]

// Sample TOC
const toc = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'features', text: 'Features', level: 2 },
  { id: 'getting-started', text: 'Getting Started', level: 2 },
  { id: 'installation', text: 'Installation', level: 3 },
  { id: 'usage', text: 'Usage', level: 3 },
]

export default createRoute((c) => {
  const packageName = 'static.org.ai'

  return c.render(
    <div class="min-h-screen">
      <Header packageName={packageName} />

      <div class="flex">
        <Sidebar navigation={navigation} currentPath="/" />

        <main class="flex-1 md:ml-64 xl:mr-50">
          <div class="mx-auto max-w-4xl px-6 py-6">
            <article class="prose dark:prose-invert max-w-none">
              <h1 id="overview">Welcome to {packageName}</h1>

              <p class="text-lg text-muted-foreground">
                A minimal, Obsidian-style documentation template built with HonoX and Tailwind CSS v4.
              </p>

              <h2 id="features">Features</h2>

              <ul>
                <li>
                  <strong>3-Column Layout</strong> - Fixed header, collapsible sidebar, table of contents
                </li>
                <li>
                  <strong>[[Wikilinks]]</strong> - Obsidian-style internal linking with cross-package support
                </li>
                <li>
                  <strong>Dark Mode</strong> - Beautiful theme with smooth transitions
                </li>
                <li>
                  <strong>Tree Navigation</strong> - File tree structure with folders and nesting
                </li>
                <li>
                  <strong>Semantic Search</strong> - Powered by Cloudflare Vectorize
                </li>
                <li>
                  <strong>Ultra-Fast</strong> - 12KB bundle, 0.5ms CPU per request
                </li>
              </ul>

              <h2 id="getting-started">Getting Started</h2>

              <p>
                This template is designed for building knowledge bases and documentation sites
                with the .org.ai package ecosystem.
              </p>

              <h3 id="installation">Installation</h3>

              <pre>
                <code>pnpm install</code>
              </pre>

              <h3 id="usage">Usage</h3>

              <pre>
                <code>pnpm dev</code>
              </pre>

              <p>
                Your site will be available at{' '}
                <a href="http://localhost:5173">http://localhost:5173</a>
              </p>
            </article>

            <Footer packageName={packageName} editUrl="https://github.com/dot-do/ai/edit/main/apps/static.org.ai/app/routes/index.tsx" />
          </div>
        </main>

        <TOC items={toc} />
      </div>
    </div>,
    { title: 'Introduction' }
  )
})
