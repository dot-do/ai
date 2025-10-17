import type { Route } from './+types/home'
import { Header } from '~/components/layout/Header'
import { Sidebar } from '~/components/layout/Sidebar'
import { TOC } from '~/components/layout/TOC'
import { Footer } from '~/components/layout/Footer'
import { useState } from 'react'

// Sample navigation structure
const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/' },
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Introduction | dynamic.sites.as' },
    { name: 'description', content: 'Dynamic semantic proxy template for .sites.as domains' },
  ]
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const packageName = 'dynamic.sites.as'

  return (
    <div className="min-h-screen">
      <Header packageName={packageName} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      <div className="flex">
        <Sidebar
          navigation={navigation}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 md:ml-64 xl:mr-50">
          <div className="mx-auto max-w-4xl px-6 py-6">
            <article className="prose dark:prose-invert max-w-none">
              <h1 id="overview">Welcome to {packageName}</h1>

              <p className="text-lg text-muted-foreground">
                A dynamic, SSR-enabled documentation template built with React Router v7 and Tailwind CSS v4.
                Perfect for massive knowledge bases that need on-demand rendering.
              </p>

              <h2 id="features">Features</h2>

              <ul>
                <li>
                  <strong>Server-Side Rendering</strong> - On-demand rendering for millions of pages
                </li>
                <li>
                  <strong>React Router v7</strong> - Full-stack React framework with Cloudflare support
                </li>
                <li>
                  <strong>[[Wikilinks]]</strong> - Obsidian-style internal linking with cross-package support
                </li>
                <li>
                  <strong>shadcn/ui</strong> - Beautiful, accessible component library
                </li>
                <li>
                  <strong>R2 SQL Integration</strong> - Query large datasets with Apache Iceberg
                </li>
                <li>
                  <strong>Vectorize Search</strong> - Semantic search powered by embeddings
                </li>
                <li>
                  <strong>Dark Mode</strong> - Beautiful theme with smooth transitions
                </li>
                <li>
                  <strong>Streaming SSR</strong> - Fast initial page loads with React Suspense
                </li>
              </ul>

              <h2 id="getting-started">Getting Started</h2>

              <p>
                This template is designed for building massive knowledge bases that require
                server-side rendering for optimal performance.
              </p>

              <h3 id="installation">Installation</h3>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>pnpm install</code>
              </pre>

              <h3 id="usage">Usage</h3>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>pnpm dev</code>
              </pre>

              <p>
                Your site will be available at{' '}
                <a href="http://localhost:5173" className="text-primary hover:underline">
                  http://localhost:5173
                </a>
              </p>
            </article>

            <Footer
              packageName={packageName}
              editUrl="https://github.com/dot-do/ai/edit/main/apps/dynamic.org.ai/app/routes/home.tsx"
            />
          </div>
        </main>

        <TOC items={toc} />
      </div>
    </div>
  )
}
