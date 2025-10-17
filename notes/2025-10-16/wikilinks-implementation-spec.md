# [[Wikilinks]] Implementation Specification

**Date**: 2025-10-16
**Status**: Specification
**Purpose**: Define how [[bracket links]] work across all .org.ai packages

## Overview

All .org.ai sites use [[bracket links]] for internal references. External links use standard markdown `[text](url)`.

## Link Types

### 1. Same-Package Links

Within the same package, use simple bracket links:

```markdown
<!-- In tech.org.ai/Python.mdx -->
[[JavaScript]] is similar to [[Python]] but runs in browsers.
See also [[React]], [[Node.js]], and [[TypeScript]].
```

**Resolution**: `[[JavaScript]]` → `/JavaScript`

### 2. Cross-Package Links

Reference entities from other packages using full package paths:

```markdown
<!-- In soc.org.ai/Software-Developer.mdx -->
Software Developers use [[tech.org.ai/Python]], [[tech.org.ai/JavaScript]],
and [[tools.org.ai/Git]] in their daily work.

They perform [[tasks.org.ai/Write-Code]] and [[tasks.org.ai/Debug-Software]].
```

**Resolution**: `[[tech.org.ai/Python]]` → `https://tech.org.ai/Python`

### 3. External Links (NOT Wikilinks)

Use standard markdown for external references:

```markdown
<!-- In tech.org.ai/Python.mdx -->
Python was created by [Guido van Rossum](https://en.wikipedia.org/wiki/Guido_van_Rossum)
and is maintained by the [Python Software Foundation](https://www.python.org/).
```

**Resolution**: Standard markdown rendering

### 4. Display Text Override

Use pipe syntax for custom display text:

```markdown
<!-- In tech.org.ai/Python.mdx -->
[[JavaScript|JS]] and [[TypeScript|TS]] are both used for web development.

[[soc.org.ai/Software-Developer|Software Developers]] use many [[tech.org.ai/Python|programming languages]].
```

**Resolution**:
- `[[JavaScript|JS]]` → `<a href="/JavaScript">JS</a>`
- `[[tech.org.ai/Python|programming languages]]` → `<a href="https://tech.org.ai/Python">programming languages</a>`

## Syntax Rules

### Valid Wikilinks

✅ **Simple (same package)**
```markdown
[[Python]]
[[Software Developer]]
[[Customer Onboarding]]
```

✅ **With display text**
```markdown
[[Python|the Python language]]
[[Software Developer|developers]]
```

✅ **Cross-package**
```markdown
[[tech.org.ai/Python]]
[[soc.org.ai/Software Developer]]
[[process.org.ai/Customer Onboarding]]
```

✅ **Cross-package with display text**
```markdown
[[tech.org.ai/Python|Python programming]]
[[soc.org.ai/Software Developer|software engineers]]
```

### Invalid Wikilinks

❌ **External URLs**
```markdown
[[https://python.org]]  # Use [Python](https://python.org) instead
```

❌ **Relative paths**
```markdown
[[./Python]]  # Use [[Python]] instead
[[../tech.org.ai/Python]]  # Use [[tech.org.ai/Python]] instead
```

❌ **File extensions**
```markdown
[[Python.mdx]]  # Use [[Python]] instead
[[Python.html]]  # Use [[Python]] instead
```

❌ **Anchor links**
```markdown
[[Python#installation]]  # Not supported yet (future feature)
```

## Resolution Algorithm

```typescript
interface WikilinkResolver {
  resolve(link: string, context: ResolverContext): ResolvedLink
}

interface ResolverContext {
  currentPackage: string // e.g., "tech.org.ai"
  currentSlug: string // e.g., "Python"
}

interface ResolvedLink {
  url: string // Final URL
  text: string // Display text
  package: string // Target package
  slug: string // Target slug
  exists: boolean // Does target exist?
  external: boolean // Is it cross-package?
}

function resolveWikilink(
  link: string,
  context: ResolverContext
): ResolvedLink {
  // Parse [[link|text]] syntax
  const [target, displayText] = link.split('|').map(s => s.trim())

  // Check if cross-package link
  if (target.includes('.org.ai/')) {
    const [pkg, ...rest] = target.split('/')
    const slug = rest.join('/').replace(/\s+/g, '-')

    return {
      url: `https://${pkg}/${slug}`,
      text: displayText || rest.join('/'),
      package: pkg,
      slug,
      exists: checkExists(pkg, slug),
      external: pkg !== context.currentPackage,
    }
  }

  // Same-package link
  const slug = target.replace(/\s+/g, '-')

  return {
    url: `/${slug}`,
    text: displayText || target,
    package: context.currentPackage,
    slug,
    exists: checkExists(context.currentPackage, slug),
    external: false,
  }
}

function checkExists(pkg: string, slug: string): boolean {
  // Check if Thing file exists
  // This should be done at build time, not runtime
  return fs.existsSync(`ai/things/${pkg}/${slug}.mdx`)
}
```

## Remark Plugin Implementation

```typescript
// sites/_shared/utils/remark-wikilinks.ts
import { visit } from 'unist-util-visit'
import type { Node, Parent } from 'unist'

export interface WikilinksOptions {
  currentPackage: string
  resolver?: (link: string) => ResolvedLink
}

export function remarkWikilinks(options: WikilinksOptions) {
  const { currentPackage, resolver = resolveWikilink } = options

  return (tree: Node) => {
    visit(tree, 'text', (node: any, index: number, parent: Parent) => {
      const wikilinkRegex = /\[\[([^\]]+)\]\]/g
      const matches = [...node.value.matchAll(wikilinkRegex)]

      if (matches.length === 0) return

      const children: Node[] = []
      let lastIndex = 0

      for (const match of matches) {
        const [fullMatch, link] = match
        const resolved = resolver(link, { currentPackage, currentSlug: '' })

        // Text before link
        if (match.index! > lastIndex) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          })
        }

        // Create link node
        children.push({
          type: 'link',
          url: resolved.url,
          data: {
            hProperties: {
              'data-wikilink': true,
              'data-package': resolved.package,
              'data-exists': resolved.exists,
              'data-external': resolved.external,
            },
          },
          children: [{ type: 'text', value: resolved.text }],
        })

        lastIndex = match.index! + fullMatch.length
      }

      // Remaining text
      if (lastIndex < node.value.length) {
        children.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        })
      }

      // Replace text node with new children
      parent.children.splice(index, 1, ...children)
    })
  }
}
```

## Astro Configuration

```typescript
// sites/tech.org.ai/astro.config.mjs
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import { remarkWikilinks } from '../_shared/utils/remark-wikilinks'

export default defineConfig({
  markdown: {
    remarkPlugins: [
      [remarkWikilinks, { currentPackage: 'tech.org.ai' }],
    ],
  },
  integrations: [mdx()],
})
```

## CSS Styling

```css
/* sites/_shared/styles/wikilinks.css */

/* Internal wikilinks */
a[data-wikilink="true"] {
  color: var(--color-link);
  text-decoration: none;
  border-bottom: 1px dotted var(--color-link);
  transition: all 0.2s;
}

a[data-wikilink="true"]:hover {
  color: var(--color-link-hover);
  border-bottom-style: solid;
}

/* Broken wikilinks */
a[data-wikilink="true"][data-exists="false"] {
  color: var(--color-error);
  border-bottom-color: var(--color-error);
}

a[data-wikilink="true"][data-exists="false"]::after {
  content: "?";
  font-size: 0.8em;
  vertical-align: super;
  opacity: 0.6;
}

/* Cross-package links */
a[data-wikilink="true"][data-external="true"] {
  color: var(--color-external-link);
}

a[data-wikilink="true"][data-external="true"]::before {
  content: "→";
  margin-right: 0.2em;
  opacity: 0.5;
}
```

## Build-Time Validation

```typescript
// sites/_shared/utils/validate-wikilinks.ts

interface ValidationResult {
  valid: boolean
  errors: WikilinkError[]
  warnings: WikilinkWarning[]
}

interface WikilinkError {
  file: string
  line: number
  link: string
  message: string
}

interface WikilinkWarning {
  file: string
  line: number
  link: string
  message: string
}

export async function validateWikilinks(
  pkg: string
): Promise<ValidationResult> {
  const errors: WikilinkError[] = []
  const warnings: WikilinkWarning[] = []

  const files = await glob(`ai/things/${pkg}/*.mdx`)

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, lineNum) => {
      const wikilinkRegex = /\[\[([^\]]+)\]\]/g
      const matches = [...line.matchAll(wikilinkRegex)]

      for (const match of matches) {
        const [, link] = match
        const resolved = resolveWikilink(link, {
          currentPackage: pkg,
          currentSlug: '',
        })

        // Error: Broken link
        if (!resolved.exists) {
          errors.push({
            file,
            line: lineNum + 1,
            link,
            message: `Broken wikilink: [[${link}]] resolves to ${resolved.url} which does not exist`,
          })
        }

        // Warning: Could be external link
        if (link.startsWith('http://') || link.startsWith('https://')) {
          warnings.push({
            file,
            line: lineNum + 1,
            link,
            message: `Wikilink contains URL: [[${link}]]. Consider using standard markdown [text](${link}) instead`,
          })
        }

        // Warning: Has file extension
        if (link.match(/\.(mdx|html|md)$/)) {
          warnings.push({
            file,
            line: lineNum + 1,
            link,
            message: `Wikilink has file extension: [[${link}]]. Remove extension.`,
          })
        }
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
```

## CLI Tool

```typescript
// ai/scripts/validate-wikilinks.ts
import { validateWikilinks } from '../sites/_shared/utils/validate-wikilinks'

const packages = [
  'tech.org.ai',
  'soc.org.ai',
  'tools.org.ai',
  'tasks.org.ai',
  'jobs.org.ai',
  'process.org.ai',
  'industries.org.ai',
  'events.org.ai',
  'vc.org.ai',
  'enterprises.org.ai',
  'wikipedia.org.ai',
  'startups.org.ai',
  'services.org.ai',
  'markdown.org.ai',
  'business.org.ai',
  'onet.org.ai',
  'naics.org.ai',
  'gs1.org.ai',
  'apqc.org.ai',
]

async function main() {
  let totalErrors = 0
  let totalWarnings = 0

  for (const pkg of packages) {
    console.log(`\nValidating ${pkg}...`)
    const result = await validateWikilinks(pkg)

    if (result.errors.length > 0) {
      console.error(`  ❌ ${result.errors.length} errors:`)
      result.errors.forEach((err) => {
        console.error(`    ${err.file}:${err.line} - ${err.message}`)
      })
      totalErrors += result.errors.length
    }

    if (result.warnings.length > 0) {
      console.warn(`  ⚠️  ${result.warnings.length} warnings:`)
      result.warnings.forEach((warn) => {
        console.warn(`    ${warn.file}:${warn.line} - ${warn.message}`)
      })
      totalWarnings += result.warnings.length
    }

    if (result.valid) {
      console.log(`  ✅ All wikilinks valid`)
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Total: ${totalErrors} errors, ${totalWarnings} warnings`)

  if (totalErrors > 0) {
    process.exit(1)
  }
}

main()
```

Run validation:

```bash
# Validate all packages
pnpm validate:wikilinks

# Validate specific package
pnpm validate:wikilinks tech.org.ai
```

## Examples

### tech.org.ai/Python.mdx

```markdown
---
$type: Technology
$id: https://tech.org.ai/Python
$context: https://schema.org
name: Python
description: High-level programming language
---

# Python

Python is a high-level programming language used by [[soc.org.ai/Software Developer|software developers]]
for web development, data analysis, and automation.

## Related Technologies

- [[JavaScript]] - Another popular language
- [[TypeScript]] - Typed superset of JavaScript
- [[React]] - JavaScript library for UIs
- [[Django]] - Python web framework

## Used By

Python is used by [[soc.org.ai/Software Developer|Software Developers]],
[[soc.org.ai/Data Scientist|Data Scientists]], and
[[soc.org.ai/Machine Learning Engineer|ML Engineers]].

## Common Tasks

Developers using Python typically perform these tasks:

- [[tasks.org.ai/Write-Code|Write code]]
- [[tasks.org.ai/Debug-Software|Debug programs]]
- [[tasks.org.ai/Test-Software|Test applications]]
- [[tasks.org.ai/Deploy-Software|Deploy to production]]

## Tools

Python developers use tools like:

- [[tools.org.ai/Git|Git]] for version control
- [[tools.org.ai/VS-Code|VS Code]] as an editor
- [[tools.org.ai/Docker|Docker]] for containerization

## External Resources

For more information, see the [official Python documentation](https://docs.python.org/)
and the [Python Package Index](https://pypi.org/).
```

### soc.org.ai/Software-Developer.mdx

```markdown
---
$type: Occupation
$id: https://soc.org.ai/Software-Developer
socCode: '15-1252.00'
name: Software Developers
---

# Software Developers

Research, design, and develop computer and network software or specialized utility programs.

## Technologies

Software Developers typically use:

**Programming Languages**:
- [[tech.org.ai/Python|Python]]
- [[tech.org.ai/JavaScript|JavaScript]]
- [[tech.org.ai/TypeScript|TypeScript]]
- [[tech.org.ai/Java|Java]]

**Frameworks**:
- [[tech.org.ai/React|React]]
- [[tech.org.ai/Node.js|Node.js]]
- [[tech.org.ai/Django|Django]]

## Tasks

Key tasks include:

- [[tasks.org.ai/Write-Code|Write and test code]]
- [[tasks.org.ai/Debug-Software|Debug applications]]
- [[tasks.org.ai/Design-Software|Design software architecture]]
- [[tasks.org.ai/Collaborate|Collaborate with team members]]

## Tools

Common tools used:

- [[tools.org.ai/Git|Git]] - Version control
- [[tools.org.ai/VS-Code|VS Code]] - Code editor
- [[tools.org.ai/GitHub|GitHub]] - Code hosting
- [[tools.org.ai/Jira|Jira]] - Project management

## Industries

Software Developers work across many industries:

- [[industries.org.ai/Artificial-Intelligence|Artificial Intelligence]]
- [[industries.org.ai/Cloud-Computing|Cloud Computing]]
- [[industries.org.ai/Financial-Technology|Financial Technology]]
```

## Testing Strategy

### Unit Tests

```typescript
// sites/_shared/utils/__tests__/wikilinks.test.ts
import { describe, it, expect } from 'vitest'
import { resolveWikilink } from '../remark-wikilinks'

describe('resolveWikilink', () => {
  const context = { currentPackage: 'tech.org.ai', currentSlug: 'Python' }

  it('resolves same-package link', () => {
    const result = resolveWikilink('JavaScript', context)
    expect(result).toEqual({
      url: '/JavaScript',
      text: 'JavaScript',
      package: 'tech.org.ai',
      slug: 'JavaScript',
      exists: true,
      external: false,
    })
  })

  it('resolves cross-package link', () => {
    const result = resolveWikilink('soc.org.ai/Software Developer', context)
    expect(result).toEqual({
      url: 'https://soc.org.ai/Software-Developer',
      text: 'Software Developer',
      package: 'soc.org.ai',
      slug: 'Software-Developer',
      exists: true,
      external: true,
    })
  })

  it('handles custom display text', () => {
    const result = resolveWikilink('JavaScript|JS', context)
    expect(result.text).toBe('JS')
  })

  it('converts spaces to hyphens in slugs', () => {
    const result = resolveWikilink('Machine Learning Engineer', context)
    expect(result.slug).toBe('Machine-Learning-Engineer')
  })
})
```

### Integration Tests

```typescript
// sites/tech.org.ai/__tests__/wikilinks.test.ts
import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../utils/markdown'

describe('Wikilinks in Markdown', () => {
  it('renders same-package wikilink', async () => {
    const md = 'See [[JavaScript]] for details'
    const html = await renderMarkdown(md, 'tech.org.ai')

    expect(html).toContain('<a href="/JavaScript"')
    expect(html).toContain('data-wikilink="true"')
    expect(html).toContain('>JavaScript</a>')
  })

  it('renders cross-package wikilink', async () => {
    const md = 'Used by [[soc.org.ai/Software Developer|developers]]'
    const html = await renderMarkdown(md, 'tech.org.ai')

    expect(html).toContain('<a href="https://soc.org.ai/Software-Developer"')
    expect(html).toContain('data-external="true"')
    expect(html).toContain('>developers</a>')
  })

  it('preserves standard markdown links', async () => {
    const md = 'Visit [Python.org](https://python.org)'
    const html = await renderMarkdown(md, 'tech.org.ai')

    expect(html).toContain('<a href="https://python.org"')
    expect(html).not.toContain('data-wikilink')
  })
})
```

## Performance Considerations

### Build-Time Resolution

All wikilinks should be resolved at build time, not runtime:

```typescript
// ✅ Good: Build-time resolution
const resolved = resolveWikilink(link, context) // During Astro build

// ❌ Bad: Runtime resolution
<script>
  document.querySelectorAll('a[data-wikilink]').forEach(link => {
    // Don't do this - too slow!
  })
</script>
```

### Caching

Cache wikilink resolutions during build:

```typescript
const wikilinkCache = new Map<string, ResolvedLink>()

function resolveWikilink(link: string, context: ResolverContext): ResolvedLink {
  const cacheKey = `${context.currentPackage}:${link}`

  if (wikilinkCache.has(cacheKey)) {
    return wikilinkCache.get(cacheKey)!
  }

  const resolved = performResolution(link, context)
  wikilinkCache.set(cacheKey, resolved)
  return resolved
}
```

## Summary

- ✅ **[[Simple]]** for same-package links
- ✅ **[[package.org.ai/Entity]]** for cross-package links
- ✅ **[[Link|Display Text]]** for custom text
- ❌ **No external URLs** in wikilinks (use markdown)
- ✅ **Build-time resolution** for performance
- ✅ **Validation** catches broken links
- ✅ **CSS styling** distinguishes link types

## Related

- Issue #3487 - Website template research (Astro Spaceship selected)
- ai/notes/2025-10-16/org-ai-website-template-research.md
- Astro Spaceship: https://github.com/aitorllj93/astro-theme-spaceship
