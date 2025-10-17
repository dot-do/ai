/**
 * Tests for mdxld MDX parsing
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import { parseMDXLD, parse, mdxToObject, mdxToFlat, objectToMDX, flatToMDX } from '../index'

describe('parse', () => {
  it('should parse MDX with linked data frontmatter', () => {
    const mdx = `---
$id: blog-post-1
$type: BlogPosting
title: Hello World
---
# Hello World

This is content.
`
    const result = parse(mdx)

    expect(result.data.$id).toBe('blog-post-1')
    expect(result.data.$type).toBe('BlogPosting')
    expect(result.data.title).toBe('Hello World')
    expect(result.content).toContain('# Hello World')
    expect(result.isEmpty).toBe(false)
  })

  it('should work identically to parseMDXLD', () => {
    const mdx = `---
$id: test-1
$type: Article
author: Jane Doe
---
Content here
`
    const resultParse = parse(mdx)
    const resultParseMDXLD = parseMDXLD(mdx)

    expect(resultParse).toEqual(resultParseMDXLD)
  })

  it('should support options like parseMDXLD', () => {
    const mdx = `---
$id: test
$type: Thing
---
Content
`
    const result = parse(mdx, {
      defaultContext: 'https://schema.org',
    })

    expect(result.data.$context).toBe('https://schema.org')
  })
})

describe('parseMDXLD', () => {
  it('should parse MDX with linked data frontmatter', () => {
    const mdx = `---
$id: blog-post-1
$type: BlogPosting
title: Hello World
---
# Hello World

This is content.
`
    const result = parseMDXLD(mdx)

    expect(result.data.$id).toBe('blog-post-1')
    expect(result.data.$type).toBe('BlogPosting')
    expect(result.data.title).toBe('Hello World')
    expect(result.content).toContain('# Hello World')
    expect(result.isEmpty).toBe(false)
  })

  it('should parse MDX without frontmatter', () => {
    const mdx = `# Just Content

No frontmatter here.
`
    const result = parseMDXLD(mdx)

    expect(result.data).toEqual({})
    expect(result.content).toContain('# Just Content')
    expect(result.isEmpty).toBe(false)
  })

  it('should parse empty MDX', () => {
    const mdx = ''
    const result = parseMDXLD(mdx)

    expect(result.data).toEqual({})
    expect(result.content).toBe('')
  })

  it('should apply default context when provided', () => {
    const mdx = `---
$id: test
$type: Article
---
Content
`
    const result = parseMDXLD(mdx, {
      defaultContext: 'https://schema.org',
    })

    expect(result.data.$context).toBe('https://schema.org')
  })

  it('should not override existing context', () => {
    const mdx = `---
$id: test
$type: Article
$context: https://custom.org
---
Content
`
    const result = parseMDXLD(mdx, {
      defaultContext: 'https://schema.org',
    })

    expect(result.data.$context).toBe('https://custom.org')
  })

  it('should handle complex frontmatter', () => {
    const mdx = `---
$id: product-123
$type: Product
name: Widget
price: 29.99
tags:
  - electronics
  - gadgets
metadata:
  sku: WID-123
  inStock: true
---
Product description
`
    const result = parseMDXLD(mdx)

    expect(result.data.name).toBe('Widget')
    expect(result.data.price).toBe(29.99)
    expect(result.data.tags).toEqual(['electronics', 'gadgets'])
    expect(result.data.metadata).toEqual({ sku: 'WID-123', inStock: true })
  })

  it('should handle excerpt in data', () => {
    const mdx = `---
$id: test
excerpt: This is an excerpt
---
Content
`
    const result = parseMDXLD(mdx)

    // Excerpt is stored in data, not as separate property by default
    expect(result.data.excerpt).toBe('This is an excerpt')
  })
})

describe('mdxToObject', () => {
  it('should parse MDX to object format', () => {
    const mdx = `---
$id: doc-1
$type: Documentation
---
# Documentation
`
    const result = mdxToObject(mdx)

    expect(result.frontmatter.$id).toBe('doc-1')
    expect(result.frontmatter.$type).toBe('Documentation')
    expect(result.content).toContain('# Documentation')
  })

  it('should handle MDX without frontmatter', () => {
    const mdx = '# Just Content'
    const result = mdxToObject(mdx)

    expect(result.frontmatter).toEqual({})
    expect(result.content).toBe('# Just Content')
  })
})

describe('objectToMDX', () => {
  it('should convert object back to MDX', () => {
    const obj = {
      frontmatter: {
        $id: 'test-1',
        $type: 'Article',
        title: 'Test',
      },
      content: '# Test Content',
    }

    const result = objectToMDX(obj)

    expect(result).toContain('$id: test-1')
    expect(result).toContain('$type: Article')
    expect(result).toContain('title: Test')
    expect(result).toContain('# Test Content')
  })
})

describe('mdxToFlat', () => {
  it('should parse MDX to flattened format', () => {
    const mdx = `---
$id: user-1
$type: Person
name: John Doe
email: john@example.com
---
Biography
`
    const result = mdxToFlat(mdx)

    expect(result.id).toBe('user-1')
    expect(result.type).toBe('Person')
    expect(result.data.name).toBe('John Doe')
    expect(result.data.email).toBe('john@example.com')
    expect(result.content).toContain('Biography')
    // Special fields should be removed from data
    expect(result.data.$id).toBeUndefined()
    expect(result.data.$type).toBeUndefined()
  })

  it('should handle MDX without special fields', () => {
    const mdx = `---
title: Regular Document
author: Jane
---
Content
`
    const result = mdxToFlat(mdx)

    expect(result.id).toBeUndefined()
    expect(result.type).toBeUndefined()
    expect(result.data.title).toBe('Regular Document')
    expect(result.data.author).toBe('Jane')
  })

  it('should apply default context to flattened format', () => {
    const mdx = `---
$id: test
$type: Thing
---
Content
`
    const result = mdxToFlat(mdx, {
      defaultContext: 'https://schema.org',
    })

    expect(result.context).toBe('https://schema.org')
  })
})

describe('flatToMDX', () => {
  it('should convert flattened format back to MDX', () => {
    const flat = {
      id: 'product-1',
      type: 'Product',
      context: 'https://schema.org',
      data: {
        name: 'Widget',
        price: 19.99,
      },
      content: '# Product Details',
      isEmpty: false,
    }

    const result = flatToMDX(flat)

    expect(result).toContain('$id: product-1')
    expect(result).toContain('$type: Product')
    // YAML may quote URLs with single quotes
    expect(result).toMatch(/\$context: ['"]?https:\/\/schema\.org['"]?/)
    expect(result).toContain('name: Widget')
    expect(result).toContain('price: 19.99')
    expect(result).toContain('# Product Details')
  })

  it('should handle flattened format without special fields', () => {
    const flat = {
      data: {
        title: 'Plain Doc',
      },
      content: 'Content here',
      isEmpty: false,
    }

    const result = flatToMDX(flat)

    expect(result).toContain('title: Plain Doc')
    expect(result).toContain('Content here')
    expect(result).not.toContain('$id')
    expect(result).not.toContain('$type')
  })
})

describe('Round-trip conversions', () => {
  it('should maintain data integrity through parse-stringify cycle', () => {
    const original = `---
$id: test-1
$type: Article
title: Original
tags:
  - test
  - mdx
---
# Content

Original content.
`
    const parsed = mdxToObject(original)
    const reconstructed = objectToMDX(parsed)
    const reparsed = mdxToObject(reconstructed)

    expect(reparsed.frontmatter.$id).toBe('test-1')
    expect(reparsed.frontmatter.$type).toBe('Article')
    expect(reparsed.frontmatter.title).toBe('Original')
    expect(reparsed.frontmatter.tags).toEqual(['test', 'mdx'])
  })

  it('should maintain data through flatten-unflatten cycle', () => {
    const original = `---
$id: doc-1
$type: Document
title: Test
---
Content
`
    const flattened = mdxToFlat(original)
    const reconstructed = flatToMDX(flattened)
    const reflattened = mdxToFlat(reconstructed)

    expect(reflattened.id).toBe(flattened.id)
    expect(reflattened.type).toBe(flattened.type)
    expect(reflattened.data).toEqual(flattened.data)
  })
})
