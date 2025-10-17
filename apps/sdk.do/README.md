# SDK.do Documentation Site

Interactive documentation site for the `.do` platform TypeScript SDK, featuring Code Hike scrollycoding and Monaco editor playgrounds.

## Features

### 🎨 Code Hike Scrollycoding

- **Narrative-driven code explanations** - Tell the SDK story as users scroll
- **Synchronized code display** - Code examples update automatically based on scroll position
- **Smooth transitions** - Professional animations between code examples

### 💻 Monaco Editor Playgrounds

- **Interactive code editing** - Full Monaco editor (VS Code) in the browser
- **Tabbed examples** - Multiple code samples with easy tab switching
- **Syntax highlighting** - TypeScript, JavaScript, and more
- **Live editing** - Users can modify and experiment with code

### 🚀 SDK Coverage

Landing pages for all 9 core SDKs:

1. **AI Services** (`/ai`) - GPT-5, Claude Sonnet 4.5, embeddings, streaming
2. **Database** (`/database`) - CRUD, relationships, transactions, graph queries
3. **Events** (`/events`) - Pub/sub, streaming, pattern matching
4. **OAuth** (`/oauth`) - OAuth 2.0, PKCE, sessions, API keys
5. **Functions** (`/functions`) - Serverless functions, edge deployment
6. **Workflows** (`/workflows`) - Multi-step processes, state management
7. **Agents** (`/agents`) - Autonomous AI agents with tools
8. **Actions** (`/actions`) - Reusable workflow actions
9. **Triggers** (`/triggers`) - Event-driven automation

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Full type safety
- **Code Hike** - Scrollycoding and code highlighting
- **Monaco Editor** - Browser-based code editor
- **Tailwind CSS** - Utility-first styling
- **OpenNext.js** - Deploy to Cloudflare Workers

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare
pnpm deploy
```

## Project Structure

```
ai/apps/sdk.do/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Main landing page
│   ├── ai/page.tsx          # AI SDK page
│   ├── database/page.tsx    # Database SDK page
│   ├── workflows/page.tsx   # Workflows SDK page
│   └── ...                  # Other SDK pages
├── components/
│   ├── ScrollyCode.tsx      # Code Hike scrollycoding components
│   ├── CodePlayground.tsx   # Monaco editor with tabs
│   └── Hero.tsx             # Hero section with install CTA
├── lib/                     # Utilities
├── public/                  # Static assets
├── next.config.ts           # Next.js + MDX config
├── tailwind.config.ts       # Tailwind config
└── package.json
```

## Component Usage

### Hero Section

```tsx
import { Hero } from '@/components/Hero'
;<Hero
  title="SDK.do"
  description="Build autonomous Business-as-Code with AI-native TypeScript SDKs"
  packageName="@dotdo/sdk.do"
  gradient="from-blue-500 to-purple-600"
/>
```

### Scrolly Code Layout

```tsx
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'
;<ScrollyLayout
  steps={[
    <Selectable key={0} index={0}>
      <div>
        <h2>Step 1: Installation</h2>
        <p>Install the SDK with pnpm...</p>
      </div>
    </Selectable>,
    // More steps...
  ]}
  code={
    <CodePlayground
      examples={[
        { title: 'Installation', code: 'pnpm add @dotdo/sdk.do' },
        // More examples...
      ]}
    />
  }
/>
```

### Code Playground

```tsx
import { CodePlayground } from '@/components/CodePlayground'
;<CodePlayground
  examples={[
    {
      title: 'Basic Usage',
      code: `import { $ } from '@dotdo/sdk.do'
const user = await $.db.get('users', 'user_123')`,
      language: 'typescript',
    },
    // More tabs...
  ]}
/>
```

## Adding New SDK Pages

1. Create directory: `app/[sdk-name]/page.tsx`
2. Import components: `Hero`, `ScrollyLayout`, `Selectable`, `CodePlayground`
3. Define code examples with titles and code
4. Create narrative steps with `<Selectable>` components
5. Combine in `<ScrollyLayout>`

See existing pages (AI, Database, Workflows) for patterns.

## Code Hike Configuration

MDX plugins configured in `next.config.ts`:

```ts
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx'

const chConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: {
    theme: 'github-dark',
  },
}
```

## Monaco Editor Configuration

Optimized for Next.js with webpack fallbacks:

```ts
webpack: (config) => {
  config.resolve.fallback = {
    fs: false,
    net: false,
    tls: false,
  }
  return config
}
```

Editor options in `CodePlayground.tsx`:

```ts
{
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  readOnly: false,
  fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  fontLigatures: true,
}
```

## Design System

### Colors

- **Background**: `hsl(0 0% 5%)` - Near black
- **Foreground**: `hsl(0 0% 95%)` - Near white
- **Primary**: `hsl(222 84% 55%)` - Blue
- **Border**: `hsl(0 0% 20%)` - Dark gray

### Gradients

Each SDK has a unique gradient:

- AI: `from-purple-500 to-pink-600`
- Database: `from-green-500 to-teal-600`
- Workflows: `from-cyan-500 to-blue-600`
- Events: `from-orange-500 to-red-600`

## Deployment

Deploy to Cloudflare Workers using OpenNext.js:

```bash
pnpm build
npx @opennextjs/cloudflare deploy
```

Or use the deploy script:

```bash
pnpm deploy
```

## Contributing

1. Follow existing component patterns
2. Keep narratives focused and progressive
3. Ensure code examples are complete and runnable
4. Test scrollycoding transitions
5. Verify Monaco editor tab switching

## License

Private - Part of the `.do` platform monorepo
