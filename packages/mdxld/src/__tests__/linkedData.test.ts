/**
 * Tests for mdxld linked data extraction and conversion
 * Run: pnpm test
 */

import { describe, it, expect } from 'vitest'
import { toJSONLD, fromJSONLD, validateLinkedData, flatToNested, nestedToFlat, stringifyMDXLD } from '../index'

describe('toJSONLD', () => {
  it('should convert frontmatter to JSON-LD format', () => {
    const frontmatter = {
      $id: 'article-1',
      $type: 'Article',
      $context: 'https://schema.org',
      title: 'My Article',
    }

    const result = toJSONLD(frontmatter)

    expect(result.$id).toBe('article-1')
    expect(result.$type).toBe('Article')
    expect(result.$context).toBe('https://schema.org')
    expect(result.title).toBe('My Article')
  })

  it('should handle frontmatter without linked data fields', () => {
    const frontmatter = {
      title: 'Plain Document',
      author: 'John',
    }

    const result = toJSONLD(frontmatter)

    expect(result.$id).toBeUndefined()
    expect(result.$type).toBeUndefined()
    expect(result.title).toBe('Plain Document')
    expect(result.author).toBe('John')
  })

  it('should preserve nested structures', () => {
    const frontmatter = {
      $id: 'test',
      metadata: {
        tags: ['one', 'two'],
        info: {
          nested: 'value',
        },
      },
    }

    const result = toJSONLD(frontmatter)

    expect(result.metadata.tags).toEqual(['one', 'two'])
    expect(result.metadata.info.nested).toBe('value')
  })
})

describe('fromJSONLD', () => {
  it('should convert JSON-LD with @ prefix to frontmatter with $ prefix', () => {
    const jsonld = {
      '@id': 'https://example.com/article/1',
      '@type': 'Article',
      '@context': 'https://schema.org',
      title: 'Test',
    }

    const result = fromJSONLD(jsonld)

    expect(result.$id).toBe('https://example.com/article/1')
    expect(result.$type).toBe('Article')
    expect(result.$context).toBe('https://schema.org')
    expect(result.title).toBe('Test')
    // @ fields should not be present
    expect(result['@id']).toBeUndefined()
  })

  it('should handle JSON-LD with $ prefix', () => {
    const jsonld = {
      $id: 'test-1',
      $type: 'Document',
      content: 'Test content',
    }

    const result = fromJSONLD(jsonld)

    expect(result.$id).toBe('test-1')
    expect(result.$type).toBe('Document')
    expect(result.content).toBe('Test content')
  })

  it('should prefer @ prefix over $ prefix when both exist', () => {
    const jsonld = {
      '@id': 'at-id',
      $id: 'dollar-id',
      '@type': 'AtType',
      $type: 'DollarType',
    }

    const result = fromJSONLD(jsonld)

    // @ prefix takes precedence
    expect(result.$id).toBe('at-id')
    expect(result.$type).toBe('AtType')
  })

  it('should copy non-LD properties', () => {
    const jsonld = {
      '@id': 'test',
      title: 'Title',
      author: 'Author',
      metadata: {
        key: 'value',
      },
    }

    const result = fromJSONLD(jsonld)

    expect(result.title).toBe('Title')
    expect(result.author).toBe('Author')
    expect(result.metadata).toEqual({ key: 'value' })
  })
})

describe('validateLinkedData', () => {
  it('should validate valid linked data', () => {
    const data = {
      $id: 'https://example.com/article/1',
      $type: 'Article',
    }

    const result = validateLinkedData(data)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should validate $id as URI when requested', () => {
    const data = {
      $id: 'https://example.com/test',
      $type: 'Article',
    }

    const result = validateLinkedData(data, { validateId: true })

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should error on invalid $id URI when validation requested', () => {
    const data = {
      $id: 'not a valid uri!!!',
      $type: 'Article',
    }

    const result = validateLinkedData(data, { validateId: true })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toContain('$id must be a valid URI')
  })

  it('should error when $type is required but missing', () => {
    const data = {
      $id: 'test',
    }

    const result = validateLinkedData(data, { requireType: true })

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('$type is required but not provided')
  })

  it('should warn when $type exists but $id is missing', () => {
    const data = {
      $type: 'Article',
    }

    const result = validateLinkedData(data)

    expect(result.valid).toBe(true) // Warnings don't invalidate
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]).toContain('$id is missing')
  })

  it('should pass validation without validation options', () => {
    const data = {
      $id: 'simple-id',
      $type: 'Document',
    }

    const result = validateLinkedData(data)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should handle empty data', () => {
    const data = {}

    const result = validateLinkedData(data)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

describe('flatToNested', () => {
  it('should convert flattened format to nested format', () => {
    const flat = {
      id: 'article-1',
      type: 'Article',
      context: 'https://schema.org',
      data: {
        title: 'Test',
        author: 'John',
      },
      content: '# Content',
      isEmpty: false,
    }

    const result = flatToNested(flat)

    expect(result.data.$id).toBe('article-1')
    expect(result.data.$type).toBe('Article')
    expect(result.data.$context).toBe('https://schema.org')
    expect(result.data.title).toBe('Test')
    expect(result.data.author).toBe('John')
    expect(result.content).toBe('# Content')
    expect(result.isEmpty).toBe(false)
  })

  it('should handle flat format without special fields', () => {
    const flat = {
      data: {
        title: 'Plain',
      },
      content: 'Content',
      isEmpty: false,
    }

    const result = flatToNested(flat)

    expect(result.data.$id).toBeUndefined()
    expect(result.data.$type).toBeUndefined()
    expect(result.data.title).toBe('Plain')
  })
})

describe('nestedToFlat', () => {
  it('should convert nested format to flattened format', () => {
    const nested = {
      data: {
        $id: 'doc-1',
        $type: 'Document',
        $context: 'https://schema.org',
        title: 'Test',
      },
      content: '# Content',
      isEmpty: false,
    }

    const result = nestedToFlat(nested)

    expect(result.id).toBe('doc-1')
    expect(result.type).toBe('Document')
    expect(result.context).toBe('https://schema.org')
    expect(result.data.title).toBe('Test')
    expect(result.content).toBe('# Content')
    // Special fields should not be in data
    expect(result.data.$id).toBeUndefined()
    expect(result.data.$type).toBeUndefined()
  })

  it('should handle nested format without special fields', () => {
    const nested = {
      data: {
        title: 'Plain',
      },
      content: 'Content',
      isEmpty: false,
    }

    const result = nestedToFlat(nested)

    expect(result.id).toBeUndefined()
    expect(result.type).toBeUndefined()
    expect(result.data.title).toBe('Plain')
  })
})

describe('stringifyMDXLD', () => {
  it('should stringify content and frontmatter to MDX', () => {
    const content = '# Hello World'
    const data = {
      $id: 'post-1',
      $type: 'BlogPosting',
      title: 'Hello',
    }

    const result = stringifyMDXLD(content, data)

    expect(result).toContain('$id: post-1')
    expect(result).toContain('$type: BlogPosting')
    expect(result).toContain('title: Hello')
    expect(result).toContain('# Hello World')
  })

  it('should support custom language option', () => {
    const content = 'Content'
    const data = { title: 'Test' }

    const result = stringifyMDXLD(content, data, { language: 'yaml' })

    expect(result).toContain('---')
    expect(result).toContain('title: Test')
  })

  it('should handle empty data', () => {
    const content = '# Just Content'
    const data = {}

    const result = stringifyMDXLD(content, data)

    expect(result).toContain('# Just Content')
  })
})

describe('Round-trip conversions', () => {
  it('should maintain data through toJSONLD-fromJSONLD cycle', () => {
    const original = {
      $id: 'test-1',
      $type: 'Article',
      $context: 'https://schema.org',
      title: 'Test',
    }

    const jsonld = toJSONLD(original)
    const restored = fromJSONLD(jsonld)

    expect(restored.$id).toBe(original.$id)
    expect(restored.$type).toBe(original.$type)
    expect(restored.$context).toBe(original.$context)
    expect(restored.title).toBe(original.title)
  })

  it('should maintain data through nested-flat-nested cycle', () => {
    const original = {
      data: {
        $id: 'test',
        $type: 'Document',
        title: 'Test',
      },
      content: 'Content',
      isEmpty: false,
    }

    const flat = nestedToFlat(original)
    const restored = flatToNested(flat)

    expect(restored.data.$id).toBe(original.data.$id)
    expect(restored.data.$type).toBe(original.data.$type)
    expect(restored.data.title).toBe(original.data.title)
    expect(restored.content).toBe(original.content)
  })

  it('should handle @ to $ prefix conversion', () => {
    const jsonld = {
      '@id': 'https://example.com/1',
      '@type': 'Article',
      '@context': 'https://schema.org',
      title: 'Test',
    }

    const frontmatter = fromJSONLD(jsonld)
    const backToJsonld = toJSONLD(frontmatter)

    // Should now use $ prefix
    expect(backToJsonld.$id).toBe(jsonld['@id'])
    expect(backToJsonld.$type).toBe(jsonld['@type'])
    expect(backToJsonld.$context).toBe(jsonld['@context'])
  })
})
