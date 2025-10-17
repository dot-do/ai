# .org.ai Website Template Research

**Date**: 2025-10-16
**Status**: Completed
**Decision**: **Astro Spaceship** (primary) with **Quartz** as alternative

## Requirements

1. ✅ **Obsidian-style UI** - Clean, minimal, knowledge base aesthetic
2. ✅ **[[Bracket Links]]** - Internal wikilinks for .org.ai references
3. ✅ **Multi-format support** - .html, .md, .mdx, .mdxld, .json
4. ✅ **Fast static generation** - Pre-render all 19 packages
5. ✅ **Tree navigation** - Folder structure visibility
6. ✅ **Backlinks** - Show what links to each page
7. ✅ **Search** - Full-text and semantic search
8. ✅ **Free/Open Source** - MIT/CC licensing

## Evaluated Solutions

### 1. Astro Spaceship ⭐ **RECOMMENDED**

**Website**: https://aitorllamas.com/astro-theme-spaceship/
**GitHub**: https://github.com/aitorllj93/astro-theme-spaceship
**License**: MIT (Free)

#### Strengths

- ✅ **Native [[wikilinks]]** - `[[Python]]` → `/tech.org.ai/Python`
- ✅ **Image embeds** - `![[image.png]]` Obsidian-style
- ✅ **Tree navigation** - Collapsible file tree matching vault structure
- ✅ **Backlinks** - Automatic bidirectional linking
- ✅ **ToC generation** - Auto table of contents from headings
- ✅ **Frontmatter control** - YAML for visibility, tags, metadata
- ✅ **Astro ecosystem** - Access to 2000+ integrations
- ✅ **Easy setup** - `npm create astro@latest -- --template aitorllj93/astro-theme-spaceship`

#### Limitations

- Requires Astro knowledge for customization
- May need custom remark plugin for cross-package [[links]]

#### Why Astro Spaceship?

1. **Perfect fit for multi-package architecture**: Each .org.ai package becomes a separate Astro site
2. **Astro's performance**: Islands architecture = minimal JS
3. **Content collections**: Natural fit for our MDXLD Thing files
4. **API routes**: Can serve .json/.mdxld formats
5. **Cloudflare Pages integration**: Deploy directly to Cloudflare

### 2. Quartz v4 (Alternative)

**Website**: https://quartz.jzhao.xyz/
**GitHub**: https://github.com/jackyzha0/quartz
**License**: MIT (Free)

#### Strengths

- ✅ **Built for Obsidian** - Designed specifically for Obsidian vaults
- ✅ **Graph view** - Visual network of connections
- ✅ **Full-text search** - Built-in search functionality
- ✅ **LaTeX support** - Math rendering
- ✅ **Syntax highlighting** - Code blocks
- ✅ **Popover previews** - Hover to preview linked notes
- ✅ **Transclusions** - Embed note content
- ✅ **Fast rebuilds** - Incremental compilation

#### Limitations

- ❌ **Strict Node requirements** - Node v22, npm v10.9.2+
- ⚠️ **Single-vault design** - Would need 19 separate Quartz instances
- ⚠️ **Less flexible** - More opinionated than Astro

#### Why NOT Quartz (for us)?

While Quartz is excellent for a single knowledge base, our multi-package architecture (19 .org.ai packages) makes Astro's flexibility more suitable. We'd need to run 19 Quartz instances vs. 19 Astro sites with shared components.

### 3. MkDocs with Plugins (Considered, Not Recommended)

**Pros**: Easy, Python-based, roamlinks plugin for wikilinks
**Cons**: Python dependency, less modern UI, limited customization

### 4. Jekyll/Hugo with Plugins (Considered, Not Recommended)

**Pros**: Mature, battle-tested
**Cons**: Requires custom plugins for [[wikilinks]], slower builds, less modern

## Recommended Architecture

### Structure

```
sites/
├── tech.org.ai/          # Astro Spaceship site
│   ├── src/
│   │   ├── content/
│   │   │   └── wiki/     # Symlink → ../../things/tech.org.ai/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   ├── astro.config.mjs
│   └── package.json
├── soc.org.ai/           # Astro Spaceship site
├── process.org.ai/       # Astro Spaceship site
└── ...                   # 16 more .org.ai sites
```

### Shared Components

Create `sites/_shared/` with common Astro components:

```
sites/_shared/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Search.astro      # Cloudflare Vectorize search
│   ├── WikiLink.astro    # [[link]] renderer
│   └── Navigation.astro
├── layouts/
│   └── ThingLayout.astro
└── utils/
    ├── wikilinks.ts      # [[Python]] → /tech.org.ai/Python
    └── frontmatter.ts    # MDXLD parser
```

### Wikilinks Resolution

```typescript
// sites/_shared/utils/wikilinks.ts
export function resolveWikilink(link: string, currentPackage: string): string {
  // [[Python]] from tech.org.ai → /Python
  if (!link.includes('.')) {
    return `/${link}`
  }

  // [[soc.org.ai/Software Developer]] from any package → /soc.org.ai/Software-Developer
  const [pkg, ...rest] = link.split('/')
  const slug = rest.join('/').replace(/\s+/g, '-')
  return `/${pkg}/${slug}`
}

// Remark plugin
export function remarkWikilinks() {
  return (tree, file) => {
    visit(tree, 'text', (node, index, parent) => {
      const wikilinkRegex = /\[\[([^\]]+)\]\]/g
      const matches = [...node.value.matchAll(wikilinkRegex)]

      if (matches.length === 0) return

      const children = []
      let lastIndex = 0

      for (const match of matches) {
        const [fullMatch, link] = match
        const url = resolveWikilink(link, file.data.packageName)

        // Text before link
        if (match.index > lastIndex) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          })
        }

        // Link
        children.push({
          type: 'link',
          url,
          children: [{ type: 'text', value: link }],
        })

        lastIndex = match.index + fullMatch.length
      }

      // Remaining text
      if (lastIndex < node.value.length) {
        children.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        })
      }

      parent.children.splice(index, 1, ...children)
    })
  }
}
```

### Multi-Format Support

```typescript
// sites/tech.org.ai/src/pages/[...slug].astro
---
import { getCollection } from 'astro:content'

export async function getStaticPaths() {
  const wiki = await getCollection('wiki')

  return wiki.flatMap((entry) => {
    const slug = entry.slug
    return [
      { params: { slug }, props: { entry, format: 'html' } },
      { params: { slug: `${slug}.md` }, props: { entry, format: 'md' } },
      { params: { slug: `${slug}.mdx` }, props: { entry, format: 'mdx' } },
      { params: { slug: `${slug}.mdxld` }, props: { entry, format: 'mdxld' } },
      { params: { slug: `${slug}.json` }, props: { entry, format: 'json' } },
    ]
  })
}

const { entry, format } = Astro.props

if (format === 'json') {
  return new Response(JSON.stringify({
    ...entry.data,
    content: entry.body,
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

if (format === 'md' || format === 'mdx') {
  return new Response(entry.body, {
    headers: { 'Content-Type': 'text/markdown' },
  })
}

if (format === 'mdxld') {
  const mdxld = `---\n${YAML.stringify(entry.data)}---\n\n${entry.body}`
  return new Response(mdxld, {
    headers: { 'Content-Type': 'text/markdown' },
  })
}

// HTML (default)
const { Content } = await entry.render()
---

<ThingLayout frontmatter={entry.data}>
  <Content />
</ThingLayout>
```

### Analytics Integration

```typescript
// sites/_shared/components/AnalyticsPixel.astro
---
const { slug, package: pkg } = Astro.props
---

<img
  src={`https://api.do/analytics/pixel?page=${pkg}/${slug}`}
  alt=""
  width="1"
  height="1"
  style="position:absolute;opacity:0;"
/>

<script>
  // Send to Pipelines → Streams → R2 SQL
  fetch('https://api.do/analytics/event', {
    method: 'POST',
    body: JSON.stringify({
      event: 'pageview',
      package: '${pkg}',
      slug: '${slug}',
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
    }),
  })
</script>
```

## Implementation Plan

### Phase 1: Prototype (Week 1)

- [ ] Install Astro Spaceship for tech.org.ai
- [ ] Implement wikilinks remark plugin
- [ ] Test [[Python]] → [[soc.org.ai/Software Developer]] cross-package links
- [ ] Add multi-format support (.md, .mdx, .mdxld, .json)
- [ ] Deploy to Cloudflare Pages

### Phase 2: Shared Components (Week 1-2)

- [ ] Create sites/_shared/ with common components
- [ ] Build semantic search component (Cloudflare Vectorize)
- [ ] Implement analytics pixel
- [ ] Add backlinks component

### Phase 3: Rollout (Week 2-4)

- [ ] Deploy all 19 .org.ai sites
- [ ] Configure domains (tech.org.ai, soc.org.ai, etc.)
- [ ] Test cross-package navigation
- [ ] Monitor performance and analytics

### Phase 4: Enhancement (Week 4+)

- [ ] Graph view visualization
- [ ] Advanced search (filters, facets)
- [ ] Related content recommendations
- [ ] RSS feeds per package

## Cost Analysis

### Free Tier (Cloudflare)

- **Hosting**: Free (Cloudflare Pages, 500 builds/month)
- **Bandwidth**: Free (unlimited on Pages)
- **Analytics**: Free (Streams → R2 SQL)
- **Search**: $0.04/1M queries (Vectorize)
- **Embeddings**: Free (Workers AI credits)

**Total**: ~$0-5/month for all 19 sites

### Comparison to Alternatives

- **Obsidian Publish**: $8/month per site = $152/month for 19 sites ❌
- **Netlify**: $19/month for multiple sites ❌
- **Vercel**: Free tier limits would be exceeded ❌
- **GitHub Pages**: Free but no dynamic features ⚠️

## Decision Matrix

| Criteria | Astro Spaceship | Quartz | MkDocs | Score |
|----------|----------------|--------|--------|-------|
| [[Wikilinks]] support | ✅ Native | ✅ Native | ⚠️ Plugin | Astro |
| Multi-package arch | ✅ Flexible | ❌ Single vault | ⚠️ OK | Astro |
| Performance | ✅ Fast | ✅ Fast | ⚠️ OK | Tie |
| Customization | ✅ High | ⚠️ Medium | ❌ Low | Astro |
| Multi-format | ✅ Easy | ⚠️ Manual | ❌ No | Astro |
| Setup difficulty | ⚠️ Medium | ✅ Easy | ✅ Easy | Quartz |
| Modern UI | ✅ Yes | ✅ Yes | ❌ No | Tie |
| Community | ✅ Large | ✅ Active | ⚠️ OK | Tie |

**Winner**: Astro Spaceship (7/8 criteria)

## Next Steps

1. **Create GitHub issue** for Astro Spaceship implementation (relates to #3487)
2. **Prototype** tech.org.ai site with wikilinks
3. **Test** cross-package navigation
4. **Document** setup process for all 19 packages
5. **Deploy** to Cloudflare Pages

## References

- **Astro Spaceship**: https://github.com/aitorllj93/astro-theme-spaceship
- **Quartz v4**: https://quartz.jzhao.xyz/
- **Astro Docs**: https://docs.astro.build/
- **Obsidian**: https://obsidian.md/
- **remark-wiki-link**: https://github.com/datopian/portaljs/tree/main/packages/remark-wiki-link

## Related

- Issue #3487 - Research Obsidian-style website template
- HuggingFace datasets epic (all 19 packages)
- JSON API infrastructure
- R2 SQL + Vectorize integration
