# JSON API for *.org.ai Packages

**Date**: 2025-10-16
**Epic**: Fully open and free JSON APIs for all *.org.ai semantic data
**Status**: Planning

## Overview

Enable all *.org.ai packages to provide free, open JSON APIs by:
1. Compiling MDXLD data to static JSON files
2. Publishing to Cloudflare Assets (free hosting)
3. Routing through sites.do with analytics capture
4. Supporting multiple formats: HTML, Markdown, MDXLD, JSON

## Architecture

```
Request Flow:
User → sites.do → Cloudflare Assets (static JSON)
       ↓
    Pipelines → Streams → R2 SQL (analytics)
```

### Components

1. **Build Step**: Compile MDXLD → JSON
2. **Cloudflare Assets**: Host static JSON files
3. **sites.do Proxy**: Route requests with analytics
4. **Analytics Pipeline**: Capture usage metrics

## URL Pattern

Every resource available in multiple formats:

```
https://tech.org.ai/Python          # HTML page (default, no extension)
https://tech.org.ai/Python.md       # Markdown source
https://tech.org.ai/Python.mdx      # MDX source
https://tech.org.ai/Python.mdxld    # MDXLD with frontmatter
https://tech.org.ai/Python.json     # Pure JSON data
```

### Format Specifications

#### 1. HTML (No Extension)
- Rendered page with navigation and styling
- SEO optimized
- Human-readable documentation

#### 2. Markdown (.md)
- Plain markdown without frontmatter
- Body content only
- Suitable for docs viewers

#### 3. MDX (.mdx)
- MDX with components but no frontmatter
- For use in MDX-enabled systems
- Includes React components

#### 4. MDXLD (.mdxld)
- Complete file with YAML frontmatter
- Full semantic metadata
- Machine-readable + human-readable

#### 5. JSON (.json)
- Pure JSON representation
- Frontmatter + parsed content
- API consumption

```json
{
  "$type": "Technology",
  "$id": "https://tech.org.ai/Python",
  "$context": "https://schema.org",
  "name": "Python",
  "description": "High-level, interpreted programming language...",
  "commodityCode": "2021-10-01",
  "category": "Programming Language",
  "hotTechnology": true,
  "license": "CC-BY-4.0",
  "source": "onetonline.org",
  "content": {
    "markdown": "# Python\n\nPython is...",
    "html": "<h1>Python</h1><p>Python is...</p>"
  },
  "usedBy": [
    { "$id": "https://soc.org.ai/15-1252.00" }
  ],
  "integrates": [
    { "$id": "https://tech.org.ai/JavaScript" }
  ]
}
```

## Implementation Plan

### Phase 1: Build Pipeline

Create build scripts for each *.org.ai package:

```typescript
// ai/packages/tech.org.ai/scripts/build-json.ts
import { glob } from 'glob'
import { readFile, writeFile, mkdir } from 'fs/promises'
import matter from 'gray-matter'
import { marked } from 'marked'

async function buildJSON() {
  const mdxFiles = await glob('../../things/tech.org.ai/*.mdx')

  for (const file of mdxFiles) {
    const content = await readFile(file, 'utf-8')
    const { data: frontmatter, content: body } = matter(content)

    // Generate JSON
    const json = {
      ...frontmatter,
      content: {
        markdown: body,
        html: marked(body),
      },
    }

    // Write to dist/json/
    const basename = path.basename(file, '.mdx')
    await writeFile(
      `dist/json/${basename}.json`,
      JSON.stringify(json, null, 2)
    )
  }
}
```

Add to package.json:
```json
{
  "scripts": {
    "build:json": "tsx scripts/build-json.ts",
    "build": "tsc && pnpm build:json"
  }
}
```

### Phase 2: Cloudflare Assets

Upload JSON files to Cloudflare Assets:

```bash
# wrangler.toml for each *.org.ai site worker
[[assets]]
directory = "../../packages/{package}.org.ai/dist/json"
binding = "ASSETS"
```

Or use R2 buckets:
```typescript
// Upload to R2 during build
await env.JSON_BUCKET.put('tech/Python.json', jsonContent, {
  httpMetadata: {
    contentType: 'application/json',
  },
})
```

### Phase 3: sites.do Routing

Create universal routing worker:

```typescript
// workers/sites/src/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname

    // Extract format from extension
    const ext = path.extname(pathname)
    const basePath = ext ? pathname.slice(0, -ext.length) : pathname
    const format = ext.slice(1) || 'html'

    // Determine package from hostname
    const hostname = url.hostname
    const packageName = hostname.replace('.do', '.org.ai')

    // Fetch from assets
    let response: Response

    if (format === 'json') {
      // Serve from Cloudflare Assets
      response = await env.ASSETS.fetch(
        new Request(`https://assets/${packageName}${basePath}.json`)
      )
    } else if (format === 'mdxld' || format === 'mdx' || format === 'md') {
      // Fetch original MDXLD from GitHub or R2
      response = await fetchMDXLD(packageName, basePath, format)
    } else {
      // HTML: render from JSON
      const jsonRes = await env.ASSETS.fetch(
        new Request(`https://assets/${packageName}${basePath}.json`)
      )
      const data = await jsonRes.json()
      response = new Response(renderHTML(data), {
        headers: { 'content-type': 'text/html' },
      })
    }

    // Capture analytics (fire and forget)
    captureAnalytics(request, env)

    return response
  },
}

async function captureAnalytics(request: Request, env: Env) {
  const event = {
    timestamp: new Date().toISOString(),
    url: request.url,
    method: request.method,
    cf: request.cf,
    headers: Object.fromEntries(request.headers),
  }

  // Send to Pipeline → Stream → R2 SQL
  await env.ANALYTICS_PIPELINE.send(event)
}
```

### Phase 4: Analytics Pipeline

Setup Cloudflare Pipeline:

```toml
# wrangler.toml
[[pipelines]]
name = "org-ai-analytics"
source = { binding = "ANALYTICS_PIPELINE" }
destination = { r2_bucket = "org-ai-analytics" }

[[streams]]
name = "org-ai-stream"
binding = "ANALYTICS_STREAM"
```

Apache Iceberg schema:
```sql
CREATE TABLE analytics.api_requests (
  timestamp TIMESTAMP,
  package STRING,
  resource STRING,
  format STRING,
  method STRING,
  status INT,
  user_agent STRING,
  country STRING,
  city STRING,
  referer STRING
)
USING iceberg
LOCATION 'r2://org-ai-analytics/requests'
PARTITIONED BY (days(timestamp), package)
```

## Packages to Enable

All *.org.ai packages get this treatment:

1. **tech.org.ai** - 135 technologies
2. **tools.org.ai** - Physical tools
3. **tasks.org.ai** - 19,000+ tasks
4. **jobs.org.ai** - Job titles
5. **soc.org.ai** - 923 occupations
6. **process.org.ai** - Business processes
7. **industries.org.ai** - Industries
8. **events.org.ai** - Business events
9. **services.org.ai** - Service abstractions
10. **startups.org.ai** - AI startup patterns
11. **markdown.org.ai** - Markdown ecosystem
12. **business.org.ai** - Business-as-Code
13. **wikipedia.org.ai** - Wikipedia entities
14. **vc.org.ai** - Crunchbase VC data
15. **apqc.org.ai** - APQC processes
16. **naics.org.ai** - NAICS industries
17. **gs1.org.ai** - GS1 standards

## Benefits

### For Users
- **Free access** to all semantic data
- **Multiple formats** for different use cases
- **No API keys** or authentication required
- **Static hosting** = fast, reliable, globally distributed

### For Platform
- **Analytics** on API usage patterns
- **Zero cost** hosting (Cloudflare Assets free)
- **SEO benefits** from HTML pages
- **Community adoption** through open APIs

### For Developers
- **JSON APIs** for programmatic access
- **MDXLD** for semantic applications
- **Markdown** for documentation
- **HTML** for human consumption

## Example Usage

### Fetch JSON Data

```typescript
// Client-side or server-side
const response = await fetch('https://tech.org.ai/Python.json')
const technology = await response.json()

console.log(technology.$id) // https://tech.org.ai/Python
console.log(technology.category) // Programming Language
console.log(technology.usedBy) // [{ $id: "https://soc.org.ai/15-1252.00" }]
```

### Fetch MDXLD

```typescript
const response = await fetch('https://tech.org.ai/Python.mdxld')
const mdxld = await response.text()

// Parse frontmatter
import matter from 'gray-matter'
const { data, content } = matter(mdxld)
```

### Direct Browser Access

```bash
# View in browser (HTML)
open https://tech.org.ai/Python

# Download JSON
curl https://tech.org.ai/Python.json

# Download MDXLD
curl https://tech.org.ai/Python.mdxld

# Download Markdown
curl https://tech.org.ai/Python.md
```

## Performance Considerations

### Caching Strategy

```typescript
// Set aggressive caching headers
response.headers.set('cache-control', 'public, max-age=31536000, immutable')
response.headers.set('cdn-cache-control', 'max-age=31536000')
```

### CDN Distribution
- Cloudflare Assets automatically distributed globally
- 200+ data centers
- Sub-50ms latency worldwide

### Cost
- **Cloudflare Assets**: Free (unlimited)
- **R2 Storage**: $0.015/GB/month
- **Egress**: Free (Cloudflare → Cloudflare)
- **Analytics Pipeline**: Included in Workers paid plan

## Security

### CORS Headers
```typescript
response.headers.set('access-control-allow-origin', '*')
response.headers.set('access-control-allow-methods', 'GET, HEAD, OPTIONS')
```

### Rate Limiting
```typescript
// Cloudflare Rate Limiting
if (await isRateLimited(request.cf.colo, ip)) {
  return new Response('Rate limit exceeded', { status: 429 })
}
```

### Content Validation
- All JSON validated against TypeScript types
- MDXLD frontmatter schema validation
- Content sanitization for XSS

## Monitoring

### Metrics to Track
- Requests per package
- Requests per resource
- Format distribution (JSON vs HTML vs MDXLD)
- Geographic distribution
- Error rates
- Response times

### Dashboards
```sql
-- Popular resources
SELECT package, resource, COUNT(*) as requests
FROM analytics.api_requests
WHERE timestamp > NOW() - INTERVAL 7 DAYS
GROUP BY package, resource
ORDER BY requests DESC
LIMIT 100

-- Format preference
SELECT format, COUNT(*) as requests
FROM analytics.api_requests
WHERE timestamp > NOW() - INTERVAL 7 DAYS
GROUP BY format

-- Geographic distribution
SELECT country, city, COUNT(*) as requests
FROM analytics.api_requests
WHERE timestamp > NOW() - INTERVAL 7 DAYS
GROUP BY country, city
ORDER BY requests DESC
```

## Implementation Timeline

### Week 1: Build Pipeline
- [ ] Create build-json.ts script template
- [ ] Add to all *.org.ai packages
- [ ] Test JSON generation
- [ ] Validate output structure

### Week 2: Cloudflare Assets
- [ ] Setup Assets binding for each package
- [ ] Upload JSON files during build
- [ ] Test asset serving
- [ ] Configure caching

### Week 3: sites.do Routing
- [ ] Create universal routing worker
- [ ] Implement format detection
- [ ] Add MDXLD/MD serving
- [ ] Test all formats

### Week 4: Analytics
- [ ] Setup Pipeline + Streams
- [ ] Create Iceberg schema
- [ ] Configure R2 SQL
- [ ] Build analytics dashboards

## Next Steps

1. **Create GitHub issue** for JSON API epic
2. **Prototype** with tech.org.ai
3. **Test** all formats
4. **Roll out** to remaining packages
5. **Document** API usage
6. **Promote** open APIs to community

## References

- **Cloudflare Assets**: https://developers.cloudflare.com/workers/static-assets/
- **Cloudflare Pipelines**: https://developers.cloudflare.com/pipelines/
- **Apache Iceberg**: https://iceberg.apache.org/
- **R2 SQL**: https://developers.cloudflare.com/r2/api/workers-api/
