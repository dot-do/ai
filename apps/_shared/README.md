# @dotdo/apps-shared

Shared utilities and components for .org.ai and .sites.as app templates.

## Purpose

This package provides framework-agnostic utilities that work across all app templates:
- `static.org.ai` (HonoX)
- `static.sites.as` (HonoX)
- `dynamic.org.ai` (React Router v7)
- `dynamic.sites.as` (React Router v7)

## Contents

### Types (`types/`)
- `wikilinks.ts` - TypeScript interfaces for wikilinks

### Lib (`lib/`)
- `wikilinks.ts` - Framework-agnostic wikilink parser and resolver

### Components (`components/`)
- Coming soon: React components for shared UI elements

### Utils (`utils/`)
- Coming soon: Utility functions

## Usage

### In HonoX Templates (static.org.ai, static.sites.as)

```typescript
import { parseWikilink, resolveWikilinkUrl } from '../_shared/lib/wikilinks'

const match = parseWikilink('[[tech.org.ai/Python]]')
// { raw: '[[tech.org.ai/Python]]', link: 'tech.org.ai/Python', url: 'https://tech.org.ai/Python' }
```

### In React Router Templates (dynamic.org.ai, dynamic.sites.as)

```typescript
import { findWikilinks, isCrossPackageLink } from '~/../../_shared/lib/wikilinks'

const links = findWikilinks(content)
links.forEach(link => {
  console.log(`${link.link} -> ${link.url}`)
})
```

## Design Principles

1. **Framework-agnostic** - Works with any JS framework
2. **Zero dependencies** - Pure TypeScript
3. **Type-safe** - Full TypeScript support
4. **Tested** - Unit tests for all utilities
5. **Documented** - JSDoc comments for all exports

## Contributing

When adding new shared utilities:
1. Keep them framework-agnostic
2. Add TypeScript types
3. Document with JSDoc
4. Add unit tests
5. Update this README
