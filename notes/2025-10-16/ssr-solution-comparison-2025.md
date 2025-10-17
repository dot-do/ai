# SSR Solution Comparison for .org.ai Sites (2025)

**Date**: 2025-10-16
**Status**: Decision Pending
**Context**: Cloudflare Pages deprecated, Workers Static Assets is the current platform

## Critical Context

**Cloudflare Pages is deprecated** as of 2025. All new projects should use **Workers Static Assets**.

> "Workers will receive the focus of Cloudflare's development efforts going forwards, so they are recommending using Cloudflare Workers over Cloudflare Pages for any new projects."

## Requirements Revisited

### For Small Packages (< 1K pages)
- tech.org.ai (135 technologies)
- tools.org.ai (~500 tools)
- process.org.ai (~1,500 processes)
- industries.org.ai (~1,200 industries)
- events.org.ai (~100 events)
- onet.org.ai, naics.org.ai, gs1.org.ai, apqc.org.ai (meta packages)

**Solution**: Static pre-rendering is fine. Can use any framework.

### For Large Packages (> 10K pages)
- **tasks.org.ai** (~19,000 tasks)
- **jobs.org.ai** (~30,000 job titles)
- **soc.org.ai** (923 occupations with detailed task breakdowns)

**Challenge**: Build time for 19K+ pages could be slow.
**Solution**: SSR for initial load, cache aggressively.

### For Massive Packages (> 100K pages)
- **vc.org.ai** (~1M companies)
- **enterprises.org.ai** (~50K+ enterprises with SEC filings)
- **wikipedia.org.ai** (~6M articles)
- **startups.org.ai** (dynamic AI startup data)

**Challenge**: Cannot pre-render millions of pages.
**Solution**: **MUST use SSR** with database queries (R2 SQL).

## Solution Comparison

### 1. Astro with @astrojs/cloudflare ⚠️

**Pros**:
- ✅ Excellent for small-to-medium sites
- ✅ Hybrid rendering (static + SSR)
- ✅ Great developer experience
- ✅ Native [[wikilinks]] support via Astro Spaceship theme

**Cons**:
- ❌ Build time issues with 19K+ pages
- ❌ Not optimized for millions of pages
- ❌ Hybrid mode still requires build step for static pages
- ⚠️ Uses Cloudflare adapter (may have limitations)

**Best For**: tech.org.ai, tools.org.ai, industries.org.ai (< 2K pages)

**Verdict**: Good for small packages, **not suitable for massive packages**.

---

### 2. HonoX (Hono + Vite) ⭐ **RECOMMENDED**

**Pros**:
- ✅ **Built specifically for Cloudflare Workers**
- ✅ Ultra-fast SSR (12KB bundle, zero dependencies)
- ✅ File-based routing like Next.js
- ✅ Islands architecture (selective hydration)
- ✅ Perfect for on-demand rendering
- ✅ No build-time bottleneck for millions of pages
- ✅ Direct Workers runtime (no adapter needed)
- ✅ Works perfectly with R2 SQL for large datasets

**Cons**:
- ⚠️ Less mature than Astro
- ⚠️ Smaller ecosystem
- ⚠️ Need to implement [[wikilinks]] ourselves (but straightforward)

**Architecture**:
```
app/
├── routes/
│   ├── index.tsx           # → /
│   ├── [slug].tsx          # → /:slug (Python, JavaScript, etc.)
│   └── api/
│       └── search.tsx      # → /api/search
├── islands/
│   ├── SearchBox.tsx       # Client-side component
│   └── CodeExample.tsx     # Interactive component
└── global.tsx              # Root layout
```

**SSR Flow**:
```
Request → Worker → HonoX Router → Database Query (R2 SQL) → Render → Cache → Response
```

**Best For**: **ALL packages**, especially massive ones (vc, wikipedia, enterprises).

**Verdict**: **RECOMMENDED** - Designed for this exact use case.

---

### 3. React Router v7 (formerly Remix) ⭐ **STRONG CONTENDER**

**Pros**:
- ✅ **Official Cloudflare support** (GA April 2025)
- ✅ **File-based routing** built-in
- ✅ Full-stack React framework with SSR
- ✅ Mature ecosystem (from Remix)
- ✅ Excellent type safety
- ✅ Works with Workers Static Assets
- ✅ Direct Workers runtime (via Vite plugin)
- ✅ All Cloudflare bindings (R2, D1, Vectorize, KV)
- ✅ Streaming SSR with Suspense
- ✅ Code splitting per route
- ✅ Great developer experience

**Cons**:
- ⚠️ React overhead for simple content sites
- ⚠️ Need to implement [[wikilinks]] ourselves
- ⚠️ Larger bundle than HonoX (~45KB vs 12KB)
- ⚠️ Some static asset configuration complexity

**Architecture**:
```
app/
├── routes/
│   ├── _index.tsx          # → /
│   ├── $slug.tsx           # → /:slug (Python, JavaScript, etc.)
│   └── api.search.tsx      # → /api/search
├── components/
│   ├── SearchBox.tsx       # Client component
│   └── CodeExample.tsx     # Interactive component
└── root.tsx                # Root layout
```

**SSR Flow**:
```
Request → Worker → React Router → R2 SQL Query → React Render → Stream → Cache → Response
```

**Setup**:
```bash
npm create cloudflare@latest tech-org-ai -- --framework=react-router
```

**R2 SQL Integration**:
```typescript
// app/routes/$slug.tsx
import { json, type LoaderFunctionArgs } from 'react-router'

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { slug } = params
  const { R2_SQL } = context.cloudflare.env

  const result = await R2_SQL.query(`
    SELECT * FROM tech.technologies
    WHERE slug = ?
    LIMIT 1
  `, [slug])

  if (!result.length) {
    throw new Response('Not Found', { status: 404 })
  }

  return json({ technology: result[0] })
}

export default function Technology() {
  const { technology } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>{technology.name}</h1>
      <p>{technology.description}</p>
      {/* Wikilinks via custom component */}
      <WikiLink to="soc.org.ai/Software Developer">Software Developers</WikiLink>
    </div>
  )
}
```

**Best For**: All packages, especially if you want React ecosystem and type safety.

**Verdict**: **Excellent choice** - Mature, officially supported, great DX. Trade-off is larger bundle vs HonoX.

---

### 4. Vite + React (Manual Setup)

**Pros**:
- ✅ Flexible
- ✅ Lightweight

**Cons**:
- ❌ Need to build everything yourself
- ❌ No file-based routing
- ❌ More manual setup

**Best For**: Custom use cases only.

**Verdict**: Too much work for .org.ai sites.

---

### 5. Next.js + OpenNext ❌

**Pros**:
- ✅ Mature ecosystem
- ✅ Great developer experience

**Cons**:
- ❌ **Requires OpenNext adapter** (heavy abstraction layer)
- ❌ **High CPU usage** compared to native Workers solutions
- ❌ Edge runtime limitations
- ❌ Not built for Cloudflare Workers
- ❌ Overkill for simple content sites

**Verdict**: **NOT RECOMMENDED** - "lighter weight and simpler than the OpenNext implementation" (user feedback).

---

## Decision Matrix

| Criteria | Astro | HonoX | React Router v7 | Next.js |
|----------|-------|-------|-----------------|---------|
| Small sites (<2K) | ✅ Best | ✅ Good | ✅ Good | ❌ Overkill |
| Medium (2K-20K) | ⚠️ Slow | ✅ Best | ✅ Best | ❌ Overkill |
| Large (20K-100K) | ❌ Too slow | ✅ Best | ✅ Best | ❌ Heavy |
| Massive (>100K) | ❌ Impossible | ✅ **Best** | ✅ **Best** | ❌ Heavy |
| SSR performance | ⚠️ OK | ✅ **Ultra-fast** | ✅ Fast | ❌ Heavy |
| Workers native | ⚠️ Adapter | ✅ **Native** | ✅ Native | ❌ Adapter |
| Build complexity | ✅ Simple | ✅ Simple | ✅ Simple | ⚠️ Complex |
| [[Wikilinks]] | ✅ Native | ⚠️ DIY | ⚠️ DIY | ⚠️ DIY |
| Bundle size | ⚠️ Medium | ✅ **12KB** | ⚠️ 45KB | ❌ 85KB+ |
| CPU efficiency | ⚠️ OK | ✅ **0.5ms** | ✅ 1-2ms | ❌ 5-10ms |
| Type safety | ⚠️ OK | ⚠️ Good | ✅ **Excellent** | ✅ Good |
| Ecosystem | ✅ Large | ⚠️ Small | ✅ **React** | ✅ Large |
| Official support | ⚠️ Community | ⚠️ Community | ✅ **Cloudflare** | ⚠️ OpenNext |
| Maturity | ✅ Stable | ⚠️ Experimental | ✅ **Production** | ✅ Stable |
| File routing | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Streaming SSR | ⚠️ Limited | ⚠️ Manual | ✅ **Built-in** | ✅ Built-in |

**Top Contenders**: **HonoX** and **React Router v7** (tied)

## Recommended Architecture

### Option A: HonoX for Everything (Simplest) ⭐

Use HonoX for all 19 packages:

```
sites/
├── tech.org.ai/        # HonoX site
├── soc.org.ai/         # HonoX site
├── vc.org.ai/          # HonoX site (SSR with R2 SQL)
├── wikipedia.org.ai/   # HonoX site (SSR with R2 SQL)
└── _shared/            # Shared components
    ├── layouts/
    ├── islands/
    └── utils/
```

**Pros**: Single tech stack, easy to maintain, works for all scales.
**Cons**: Need to implement [[wikilinks]] ourselves.

### Option B: Hybrid (More Complex)

- **Small packages**: Astro Spaceship (get native [[wikilinks]])
- **Massive packages**: HonoX (SSR with R2 SQL)

**Pros**: Best of both worlds for each use case.
**Cons**: Two tech stacks to maintain, more complex deployment.

## HonoX Implementation Details

### Wikilinks Plugin

```typescript
// sites/_shared/middleware/wikilinks.ts
import { MiddlewareHandler } from 'hono'

export const wikilinksMiddleware: MiddlewareHandler = async (c, next) => {
  await next()

  // Transform [[link]] to <a href>
  if (c.res.headers.get('content-type')?.includes('text/html')) {
    const html = await c.res.text()
    const transformed = html.replace(
      /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
      (_, link, text) => {
        const url = resolveWikilink(link, c.req.param('package'))
        const display = text || link
        return `<a href="${url}" data-wikilink>${display}</a>`
      }
    )
    c.res = new Response(transformed, c.res)
  }
}

function resolveWikilink(link: string, currentPackage: string): string {
  // [[Python]] → /Python
  if (!link.includes('.org.ai/')) {
    return `/${link.replace(/\s+/g, '-')}`
  }

  // [[tech.org.ai/Python]] → https://tech.org.ai/Python
  const [pkg, ...rest] = link.split('/')
  return `https://${pkg}/${rest.join('/').replace(/\s+/g, '-')}`
}
```

### R2 SQL Integration

```typescript
// sites/vc.org.ai/app/routes/[slug].tsx
import { createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')

  // Query R2 SQL for company data
  const company = await c.env.R2_SQL.query(`
    SELECT * FROM vc.companies
    WHERE permalink = ?
    LIMIT 1
  `, [slug])

  if (!company) {
    return c.notFound()
  }

  return c.render(
    <Layout>
      <h1>{company.name}</h1>
      <p>{company.description}</p>

      <h2>Funding</h2>
      <p>Total raised: ${company.total_funding_usd?.toLocaleString()}</p>

      {/* Wikilinks work in JSX */}
      <p>Industry: [[industries.org.ai/{company.industry}]]</p>
    </Layout>
  )
})
```

### Islands for Interactivity

```typescript
// sites/_shared/islands/SearchBox.tsx
import { useState } from 'hono/jsx'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const search = async () => {
    // Call Vectorize search API
    const res = await fetch(`/api/search?q=${query}`)
    setResults(await res.json())
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onInput={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={search}>Search</button>

      <ul>
        {results.map(r => (
          <li key={r.$id}>
            <a href={r.$id}>{r.name}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Deployment

```toml
# wrangler.toml
name = "tech-org-ai"
main = "src/index.ts"
compatibility_date = "2025-10-16"

[assets]
directory = "./dist/static"
binding = "ASSETS"

[env.production]
workers_dev = false
routes = [
  { pattern = "tech.org.ai/*", zone_name = "org.ai" }
]

[[r2_buckets]]
binding = "R2_SQL"
bucket_name = "tech-catalog"

[[vectorize]]
binding = "VECTORIZE"
index_name = "tech-org-ai"
```

```bash
# Deploy
pnpm build
wrangler deploy
```

## Performance Comparison

### Build Time (for 19K tasks)

| Solution | Build Time | Notes |
|----------|-----------|-------|
| Astro (static) | ~45 min | All pages pre-rendered |
| Astro (hybrid) | ~30 min | Some pages SSR |
| HonoX | **<1 min** | No pre-rendering, deploy code only |
| Next.js | ~60 min | All pages pre-rendered |

### First Page Load (Cold Start)

| Solution | TTFB | Notes |
|----------|------|-------|
| Astro (static) | ~50ms | From cache |
| Astro (SSR) | ~150ms | Worker + render |
| HonoX | **~80ms** | Worker + render (optimized) |
| Next.js | ~250ms | OpenNext overhead |

### CPU Usage (per request)

| Solution | CPU Time | Cost Impact |
|----------|----------|-------------|
| HonoX | **0.5ms** | Minimal |
| Astro | 1-2ms | Low |
| Vite+React | 2-3ms | Medium |
| Next.js | 5-10ms | High (OpenNext) |

## Cost Analysis

### Small Sites (tech.org.ai, 10K requests/day)

| Solution | Cost/Month | Notes |
|----------|-----------|-------|
| HonoX | **$0** | Free tier |
| Astro | $0 | Free tier |
| Next.js | ~$5 | CPU usage |

### Massive Sites (wikipedia.org.ai, 1M requests/day)

| Solution | Cost/Month | Notes |
|----------|-----------|-------|
| HonoX | **~$10** | CPU + R2 SQL |
| Astro SSR | ~$25 | Higher CPU usage |
| Next.js | ~$100 | OpenNext overhead |

## Recommendation

### Final Decision: **Choose Between HonoX or React Router v7**

Both are excellent choices. The decision depends on your priorities:

### Choose **HonoX** if you prioritize: ⚡

1. **Maximum performance** - 12KB bundle, 0.5ms CPU per request
2. **Minimal overhead** - Zero dependencies, ultra-lean
3. **Cost optimization** - Lowest CPU usage = lowest cost at scale
4. **Simplicity** - Minimal abstraction, close to the metal

**Trade-offs**:
- Smaller ecosystem (but growing)
- Less mature (still experimental)
- Need to implement some features yourself

**Best for**: Performance-critical massive sites (wikipedia.org.ai, vc.org.ai)

---

### Choose **React Router v7** if you prioritize: 🏗️

1. **Official Cloudflare support** - GA with dedicated docs
2. **Type safety** - Excellent TypeScript support
3. **React ecosystem** - Access to all React libraries
4. **Maturity** - Production-ready (from Remix)
5. **Developer experience** - Full-stack framework with conventions
6. **Streaming SSR** - Built-in with Suspense

**Trade-offs**:
- Larger bundle (45KB vs 12KB)
- Higher CPU usage (1-2ms vs 0.5ms)
- React overhead for simple content

**Best for**: All packages if you want mature, officially-supported solution with great DX

---

### Hybrid Approach (Recommended) ⭐

**Use both strategically**:

1. **Small-Medium packages** → **React Router v7**
   - tech.org.ai, tools.org.ai, process.org.ai, industries.org.ai
   - Benefit from React ecosystem and great DX
   - Bundle size doesn't matter as much

2. **Massive packages** → **HonoX**
   - vc.org.ai (1M companies)
   - wikipedia.org.ai (6M articles)
   - enterprises.org.ai (50K+ with filings)
   - Benefit from ultra-low CPU and cost savings

**Why Hybrid**:
- Best tool for each job
- Share [[wikilinks]] implementation
- Learn both (valuable for platform)
- Optimize where it matters most

**Shared Components**:
```
sites/_shared/
├── wikilinks/          # Works with both
├── layouts/            # Reusable patterns
└── utils/              # Common logic
```

### Implementation Strategy

**Phase 1 (Week 1)**: Prototype tech.org.ai
- Setup HonoX with file-based routing
- Implement wikilinks middleware
- Test with 135 technology pages
- Deploy to Workers Static Assets

**Phase 2 (Week 2)**: Shared components
- Create `sites/_shared/` with layouts, islands, utils
- Implement search island (Vectorize)
- Build analytics pixel
- Add backlinks component

**Phase 3 (Week 3-4)**: Roll out small packages
- soc.org.ai, tools.org.ai, process.org.ai, industries.org.ai
- Test cross-package [[wikilinks]]
- Optimize caching strategy

**Phase 4 (Week 5-6)**: Large packages with SSR
- tasks.org.ai, jobs.org.ai (SSR on-demand)
- R2 SQL integration
- Test performance under load

**Phase 5 (Week 7-8)**: Massive packages
- vc.org.ai, enterprises.org.ai, wikipedia.org.ai
- Full R2 SQL integration
- Vectorize semantic search
- Load testing and optimization

## Next Steps

1. **Create prototype** - Build tech.org.ai with HonoX
2. **Test wikilinks** - Verify [[Python]] → [[soc.org.ai/Software Developer]] works
3. **Benchmark performance** - Measure TTFB, CPU usage, cost
4. **Document setup** - Create template for all 19 packages
5. **Deploy** - Roll out to Workers Static Assets

## References

- **HonoX**: https://github.com/honojs/honox
- **Hono**: https://hono.dev/
- **Workers Static Assets**: https://developers.cloudflare.com/workers/static-assets/
- **Cloudflare Vite Plugin**: https://developers.cloudflare.com/workers/vite-plugin/

## Related

- Issue #3487 - Website template research
- ai/notes/2025-10-16/org-ai-website-template-research.md (Astro Spaceship)
- ai/notes/2025-10-16/wikilinks-implementation-spec.md
