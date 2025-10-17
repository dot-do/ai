/**
 * Tests for mdxld $id and $type frontmatter handling
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import { parseMDXLD, parseYAMLFrontmatter, stringifyYAMLFrontmatter } from '../index'

describe('$id frontmatter', () => {
  it('should parse $id from frontmatter', () => {
    const mdx = `---
$id: unique-identifier-123
$type: Article
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$id).toBe('unique-identifier-123')
  })

  it('should handle URI format $id', () => {
    const mdx = `---
$id: https://example.com/articles/123
$type: Article
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$id).toBe('https://example.com/articles/123')
  })

  it('should handle relative URI $id', () => {
    const mdx = `---
$id: /articles/my-post
$type: BlogPosting
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$id).toBe('/articles/my-post')
  })

  it('should handle UUID format $id', () => {
    const mdx = `---
$id: 550e8400-e29b-41d4-a716-446655440000
$type: Document
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$id).toBe('550e8400-e29b-41d4-a716-446655440000')
  })
})

describe('$type frontmatter', () => {
  it('should parse $type from frontmatter', () => {
    const mdx = `---
$id: test
$type: BlogPosting
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$type).toBe('BlogPosting')
  })

  it('should handle Schema.org types', () => {
    const types = ['Article', 'Product', 'Person', 'Organization', 'Event']

    types.forEach((type) => {
      const mdx = `---
$id: test
$type: ${type}
---
Content
`
      const result = parseMDXLD(mdx)
      expect(result.data.$type).toBe(type)
    })
  })

  it('should handle custom types', () => {
    const mdx = `---
$id: test
$type: CustomEntity
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$type).toBe('CustomEntity')
  })

  it('should handle namespaced types', () => {
    const mdx = `---
$id: test
$type: gs1:Product
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$type).toBe('gs1:Product')
  })
})

describe('$context frontmatter', () => {
  it('should parse $context from frontmatter', () => {
    const mdx = `---
$id: test
$type: Article
$context: https://schema.org
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$context).toBe('https://schema.org')
  })

  it('should handle custom context', () => {
    const mdx = `---
$id: test
$type: CustomType
$context: https://mycompany.com/context
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$context).toBe('https://mycompany.com/context')
  })

  it('should handle context as object', () => {
    const mdx = `---
$id: test
$type: Article
$context:
  schema: https://schema.org
  custom: https://example.com/vocab
---
Content
`
    const result = parseMDXLD(mdx)
    expect(result.data.$context).toEqual({
      schema: 'https://schema.org',
      custom: 'https://example.com/vocab',
    })
  })
})

describe('Combined frontmatter fields', () => {
  it('should parse all linked data fields together', () => {
    const mdx = `---
$id: https://example.com/article/123
$type: Article
$context: https://schema.org
title: My Article
author: John Doe
---
Content
`
    const result = parseMDXLD(mdx)

    expect(result.data.$id).toBe('https://example.com/article/123')
    expect(result.data.$type).toBe('Article')
    expect(result.data.$context).toBe('https://schema.org')
    expect(result.data.title).toBe('My Article')
    expect(result.data.author).toBe('John Doe')
  })

  it('should handle minimal linked data', () => {
    const mdx = `---
$id: minimal
---
Content
`
    const result = parseMDXLD(mdx)

    expect(result.data.$id).toBe('minimal')
    expect(result.data.$type).toBeUndefined()
    expect(result.data.$context).toBeUndefined()
  })
})

describe('parseYAMLFrontmatter', () => {
  it('should parse YAML string to object', () => {
    const yaml = `$id: test-1
$type: Article
title: Test
tags:
  - one
  - two
`
    const result = parseYAMLFrontmatter(yaml)

    expect(result.$id).toBe('test-1')
    expect(result.$type).toBe('Article')
    expect(result.title).toBe('Test')
    expect(result.tags).toEqual(['one', 'two'])
  })

  it('should handle empty YAML', () => {
    const yaml = ''
    const result = parseYAMLFrontmatter(yaml)

    expect(result).toBeNull()
  })

  it('should handle complex nested structures', () => {
    const yaml = `$id: complex
metadata:
  nested:
    deep: value
  array:
    - item1
    - item2
`
    const result = parseYAMLFrontmatter(yaml)

    expect(result.metadata.nested.deep).toBe('value')
    expect(result.metadata.array).toEqual(['item1', 'item2'])
  })
})

describe('stringifyYAMLFrontmatter', () => {
  it('should stringify object to YAML', () => {
    const data = {
      $id: 'test-1',
      $type: 'Article',
      title: 'Test',
    }

    const result = stringifyYAMLFrontmatter(data)

    expect(result).toContain('$id: test-1')
    expect(result).toContain('$type: Article')
    expect(result).toContain('title: Test')
  })

  it('should handle arrays in YAML', () => {
    const data = {
      $id: 'test',
      tags: ['one', 'two', 'three'],
    }

    const result = stringifyYAMLFrontmatter(data)

    expect(result).toContain('tags:')
    expect(result).toContain('- one')
    expect(result).toContain('- two')
    expect(result).toContain('- three')
  })

  it('should handle nested objects', () => {
    const data = {
      $id: 'test',
      metadata: {
        author: 'John',
        date: '2024-01-01',
      },
    }

    const result = stringifyYAMLFrontmatter(data)

    expect(result).toContain('metadata:')
    expect(result).toContain('author: John')
    // YAML may or may not quote date strings
    expect(result).toMatch(/date: ['"]?2024-01-01['"]?/)
  })
})

describe('Frontmatter round-trip', () => {
  it('should maintain data through parse-stringify cycle', () => {
    const original = {
      $id: 'round-trip-test',
      $type: 'Article',
      $context: 'https://schema.org',
      title: 'Test Article',
      tags: ['test', 'mdx'],
      metadata: {
        version: '1.0',
      },
    }

    const yaml = stringifyYAMLFrontmatter(original)
    const parsed = parseYAMLFrontmatter(yaml)

    expect(parsed.$id).toBe(original.$id)
    expect(parsed.$type).toBe(original.$type)
    expect(parsed.$context).toBe(original.$context)
    expect(parsed.title).toBe(original.title)
    expect(parsed.tags).toEqual(original.tags)
    expect(parsed.metadata).toEqual(original.metadata)
  })
})

describe('Edge cases', () => {
  it('should handle frontmatter with special characters', () => {
    const mdx = `---
$id: test/with/slashes
$type: Type-With-Dashes
title: "Title with: colon"
---
Content
`
    const result = parseMDXLD(mdx)

    expect(result.data.$id).toBe('test/with/slashes')
    expect(result.data.$type).toBe('Type-With-Dashes')
    expect(result.data.title).toBe('Title with: colon')
  })

  it('should handle numeric values', () => {
    const mdx = `---
$id: test
count: 42
price: 19.99
---
Content
`
    const result = parseMDXLD(mdx)

    expect(result.data.count).toBe(42)
    expect(result.data.price).toBe(19.99)
  })

  it('should handle boolean values', () => {
    const mdx = `---
$id: test
published: true
draft: false
---
Content
`
    const result = parseMDXLD(mdx)

    expect(result.data.published).toBe(true)
    expect(result.data.draft).toBe(false)
  })

  it('should handle null values', () => {
    const mdx = `---
$id: test
optional: null
---
Content
`
    const result = parseMDXLD(mdx)

    expect(result.data.optional).toBeNull()
  })
})
