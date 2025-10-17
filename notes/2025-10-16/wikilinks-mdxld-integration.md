# Wikilinks Integration into mdxld Package

**Date**: 2025-10-16
**Status**: Planning
**Priority**: High - Needed across entire platform

## Why Integrate into mdxld?

Wikilinks are needed **everywhere** in the platform:

1. **App templates** - static/dynamic .org.ai and .sites.as sites
2. **Payload CMS** - Things and Relationships collections
3. **MDXLD content** - Thing descriptions and documentation
4. **API responses** - Automatic wikilink resolution in JSON
5. **Worker processing** - Content transformation pipeline

**Current State**: Wikilinks are implemented in `ai/apps/_shared/lib/wikilinks.ts`

**Target State**: Move to `ai/packages/mdxld` as core functionality

## Proposed Integration

### 1. Move Utilities to mdxld

```
ai/packages/mdxld/
├── src/
│   ├── wikilinks/
│   │   ├── parser.ts          # [[wikilink]] parser
│   │   ├── resolver.ts        # URL resolution
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── index.ts           # Exports
│   ├── remark/
│   │   └── wikilinks.ts       # Remark plugin
│   └── index.ts               # Main exports
```

### 2. Remark Plugin for Automatic Transformation

```typescript
// ai/packages/mdxld/src/remark/wikilinks.ts
import { visit } from 'unist-util-visit'
import { resolveWikilinkUrl } from '../wikilinks'

export function remarkWikilinks(options = {}) {
  return (tree, file) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
      const matches = [...node.value.matchAll(regex)]

      if (matches.length === 0) return

      const children = []
      let lastIndex = 0

      for (const match of matches) {
        const [fullMatch, link, alias] = match
        const url = resolveWikilinkUrl(link, options)

        // Text before link
        if (match.index > lastIndex) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          })
        }

        // Link node
        children.push({
          type: 'link',
          url,
          data: {
            hProperties: {
              className: 'wikilink',
            },
          },
          children: [{ type: 'text', value: alias || link }],
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

### 3. Usage in mdxld

```typescript
// ai/packages/mdxld/src/index.ts
import { remarkWikilinks } from './remark/wikilinks'

export function compileMDXLD(content: string, options = {}) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkWikilinks, options.wikilinks) // Add wikilinks plugin
    .use(remarkMdx)
    .use(remarkFrontmatter)
    .use(remarkMdxFrontmatter)

  return processor.process(content)
}

// Re-export wikilink utilities
export { parseWikilink, resolveWikilinkUrl, findWikilinks } from './wikilinks'
export type { WikilinkMatch, Backlink } from './wikilinks/types'
```

## Use Cases

### 1. In App Templates

```typescript
// ai/apps/static.org.ai/app/lib/markdown.ts
import { compileMDXLD } from 'mdxld'

export function parseMarkdown(content: string) {
  return compileMDXLD(content, {
    wikilinks: {
      currentPackage: 'static.org.ai',
      crossPackageNewTab: true,
    },
  })
}
```

### 2. In Payload Collections

```typescript
// platform/collections/Things.ts
import { parseWikilink, resolveWikilinkUrl } from 'mdxld'

export const Things: CollectionConfig = {
  slug: 'things',
  fields: [
    {
      name: 'description',
      type: 'richText',
      admin: {
        // Custom component that supports [[wikilinks]]
        components: {
          Field: WikilinkRichTextField,
        },
      },
      hooks: {
        afterRead: [
          ({ value }) => {
            // Automatically resolve wikilinks in API responses
            return replaceWikilinks(value)
          },
        ],
      },
    },
  ],
}
```

### 3. In Thing Descriptions

```yaml
---
$type: Thing
$id: https://schema.org.ai/Person
name: Person
description: >
  A person (alive, dead, undead, or fictional).
  See also [[Organization]] and [[CreativeWork]].
---

# Person

A **Person** is a fundamental type in Schema.org representing individuals.

## Related Types

- [[Organization]] - Groups of people
- [[CreativeWork]] - Works created by persons
- [[soc.org.ai/Software Developer]] - Occupation type

## Properties

...
```

### 4. In Worker Processing

```typescript
// workers/ai/src/index.ts
import { findWikilinks, resolveWikilinkUrl } from 'mdxld'

export default {
  async fetch(request, env) {
    const thing = await env.DB.prepare('SELECT * FROM things WHERE id = ?').bind(id).first()

    // Extract wikilinks for relationship mapping
    const wikilinks = findWikilinks(thing.description)

    // Create relationships
    for (const link of wikilinks) {
      await createRelationship(thing.$id, link.url, 'references')
    }

    return Response.json(thing)
  },
}
```

## Implementation Plan

### Phase 1: Move Core Utilities (1 hour)
- [ ] Create `ai/packages/mdxld/src/wikilinks/` directory
- [ ] Move parser, resolver, types from `ai/apps/_shared`
- [ ] Update exports in `ai/packages/mdxld/src/index.ts`
- [ ] Update `ai/apps/_shared` to import from mdxld

### Phase 2: Remark Plugin (2 hours)
- [ ] Create `ai/packages/mdxld/src/remark/wikilinks.ts`
- [ ] Integrate into mdxld compiler
- [ ] Add tests for remark plugin
- [ ] Document usage

### Phase 3: Update App Templates (1 hour)
- [ ] Update `static.org.ai` to use mdxld wikilinks
- [ ] Update `static.sites.as` to use mdxld wikilinks
- [ ] Update `dynamic.org.ai` to use mdxld wikilinks
- [ ] Update `dynamic.sites.as` to use mdxld wikilinks
- [ ] Remove duplicate code from templates

### Phase 4: Payload Integration (2 hours)
- [ ] Create WikilinkRichTextField component
- [ ] Add wikilink hooks to Things collection
- [ ] Add wikilink hooks to Relationships collection
- [ ] Test in Payload admin UI

### Phase 5: Documentation (1 hour)
- [ ] Update mdxld README with wikilinks section
- [ ] Add JSDoc comments to all functions
- [ ] Create examples in mdxld docs
- [ ] Update app template READMEs

**Total Effort**: ~7 hours

## Benefits

1. **DRY Principle** - Single source of truth for wikilinks
2. **Consistency** - Same behavior everywhere
3. **Maintainability** - Update once, works everywhere
4. **Type Safety** - Shared TypeScript interfaces
5. **Testing** - Test once, confident everywhere
6. **Performance** - Optimized parser used universally

## Migration Strategy

### Step 1: Add to mdxld (Non-breaking)
- Add wikilinks to mdxld without removing from apps
- Both can coexist temporarily

### Step 2: Update Apps (Non-breaking)
- Update apps to import from mdxld
- Keep `_shared` as fallback during transition

### Step 3: Update Payload (Non-breaking)
- Add wikilink support to collections
- Existing content continues working

### Step 4: Remove Duplicates (Breaking)
- Remove `ai/apps/_shared/lib/wikilinks.ts`
- Update all imports to use mdxld

## Testing Checklist

- [ ] Unit tests for parser
- [ ] Unit tests for resolver
- [ ] Remark plugin tests
- [ ] Cross-package link tests
- [ ] Internal link tests
- [ ] Alias tests
- [ ] Edge cases (malformed wikilinks)
- [ ] Integration tests with mdxld
- [ ] Integration tests with Payload

## Open Questions

1. **Should wikilinks be enabled by default in mdxld?**
   - Proposal: Yes, but allow opt-out via options

2. **How to handle ambiguous wikilinks?**
   - [[Python]] could be tech.org.ai/Python or other Python-related Things
   - Proposal: Resolve to current package first, then search globally

3. **Should we support image wikilinks?**
   - `![[image.png]]` for embedding images
   - Proposal: Yes, in Phase 2

4. **How to handle backlinks in Payload?**
   - Automatically create Relationship entries?
   - Proposal: Yes, via afterChange hook

## Next Steps

1. **Create GitHub issue** for wikilinks integration
2. **Get approval** for approach
3. **Start Phase 1** - Move utilities to mdxld
4. **Deploy schema.org.ai** with current wikilinks (from _shared)
5. **Migrate to mdxld** after schema.org.ai is stable

## Related Work

- Issue #3487 - Research Obsidian-style website template (completed)
- `ai/notes/2025-10-16/wikilinks-implementation-spec.md` - Original spec
- `ai/apps/_shared/lib/wikilinks.ts` - Current implementation
- `ai/notes/2025-10-16/app-templates-summary.md` - Templates summary
