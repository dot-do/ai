import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import {
  LinkedDataFrontmatterSchema,
  MDXWithLinkedDataSchema,
  MDXFlattenedSchema,
  createTypedSchema,
  createSchemaBuilder,
  validateWithSchema,
} from '../index.js'

describe('Core Schemas', () => {
  describe('LinkedDataFrontmatterSchema', () => {
    it('should validate basic frontmatter', () => {
      const data = {
        $id: 'https://example.com/post',
        $type: 'BlogPost',
        title: 'Hello World',
      }

      const result = LinkedDataFrontmatterSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should allow optional fields', () => {
      const data = {
        title: 'Hello World',
      }

      const result = LinkedDataFrontmatterSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate $id as URL', () => {
      const data = {
        $id: 'not-a-url',
        $type: 'BlogPost',
      }

      const result = LinkedDataFrontmatterSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should accept array of types', () => {
      const data = {
        $id: 'https://example.com/post',
        $type: ['BlogPost', 'Article'],
      }

      const result = LinkedDataFrontmatterSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept string context', () => {
      const data = {
        $context: 'https://schema.org',
        $type: 'Article',
      }

      const result = LinkedDataFrontmatterSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept object context', () => {
      const data = {
        $context: {
          '@vocab': 'https://schema.org',
        },
        $type: 'Article',
      }

      const result = LinkedDataFrontmatterSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should allow additional properties', () => {
      const data = {
        $id: 'https://example.com/post',
        $type: 'BlogPost',
        title: 'Hello',
        author: 'John',
        custom: 'field',
      }

      const result = LinkedDataFrontmatterSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Hello')
        expect(result.data.author).toBe('John')
        expect(result.data.custom).toBe('field')
      }
    })
  })

  describe('MDXWithLinkedDataSchema', () => {
    it('should validate nested format', () => {
      const data = {
        content: '# Hello World',
        data: {
          $id: 'https://example.com/post',
          $type: 'BlogPost',
          title: 'Hello',
        },
        isEmpty: false,
      }

      const result = MDXWithLinkedDataSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate with excerpt', () => {
      const data = {
        content: '# Hello World',
        data: {
          title: 'Hello',
        },
        isEmpty: false,
        excerpt: 'Summary',
      }

      const result = MDXWithLinkedDataSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('MDXFlattenedSchema', () => {
    it('should validate flattened format', () => {
      const data = {
        id: 'https://example.com/post',
        type: 'BlogPost',
        data: {
          title: 'Hello',
        },
        content: '# Hello World',
        isEmpty: false,
      }

      const result = MDXFlattenedSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate without id and type', () => {
      const data = {
        data: {
          title: 'Hello',
        },
        content: '# Hello World',
        isEmpty: false,
      }

      const result = MDXFlattenedSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })
})

describe('createTypedSchema', () => {
  it('should create schema with required type', () => {
    const BlogPostSchema = createTypedSchema(
      'BlogPost',
      z.object({
        title: z.string(),
      })
    )

    const validData = {
      $type: 'BlogPost',
      title: 'Hello World',
    }

    const result = BlogPostSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject wrong type', () => {
    const BlogPostSchema = createTypedSchema(
      'BlogPost',
      z.object({
        title: z.string(),
      })
    )

    const invalidData = {
      $type: 'Article',
      title: 'Hello World',
    }

    const result = BlogPostSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should enforce custom properties', () => {
    const BlogPostSchema = createTypedSchema(
      'BlogPost',
      z.object({
        title: z.string(),
        author: z.string(),
      })
    )

    const invalidData = {
      $type: 'BlogPost',
      title: 'Hello World',
      // missing author
    }

    const result = BlogPostSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('createSchemaBuilder', () => {
  it('should build basic schema', () => {
    const schema = createSchemaBuilder(
      z.object({
        title: z.string(),
      })
    ).build()

    const data = {
      title: 'Hello',
    }

    const result = schema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should require id', () => {
    const schema = createSchemaBuilder(
      z.object({
        title: z.string(),
      })
    )
      .withId()
      .build()

    const invalidData = {
      title: 'Hello',
    }

    const result = schema.safeParse(invalidData)
    expect(result.success).toBe(false)

    const validData = {
      $id: 'https://example.com/post',
      title: 'Hello',
    }

    const result2 = schema.safeParse(validData)
    expect(result2.success).toBe(true)
  })

  it('should require specific type', () => {
    const schema = createSchemaBuilder(
      z.object({
        title: z.string(),
      })
    )
      .withType('Article')
      .build()

    const invalidData = {
      $type: 'BlogPost',
      title: 'Hello',
    }

    const result = schema.safeParse(invalidData)
    expect(result.success).toBe(false)

    const validData = {
      $type: 'Article',
      title: 'Hello',
    }

    const result2 = schema.safeParse(validData)
    expect(result2.success).toBe(true)
  })

  it('should require context', () => {
    const schema = createSchemaBuilder(
      z.object({
        title: z.string(),
      })
    )
      .withContext()
      .build()

    const invalidData = {
      title: 'Hello',
    }

    const result = schema.safeParse(invalidData)
    expect(result.success).toBe(false)

    const validData = {
      $context: 'https://schema.org',
      title: 'Hello',
    }

    const result2 = schema.safeParse(validData)
    expect(result2.success).toBe(true)
  })

  it('should require specific context', () => {
    const schema = createSchemaBuilder(
      z.object({
        title: z.string(),
      })
    )
      .withContext('https://schema.org')
      .build()

    const invalidData = {
      $context: 'https://other.org',
      title: 'Hello',
    }

    const result = schema.safeParse(invalidData)
    expect(result.success).toBe(false)

    const validData = {
      $context: 'https://schema.org',
      title: 'Hello',
    }

    const result2 = schema.safeParse(validData)
    expect(result2.success).toBe(true)
  })

  it('should chain multiple requirements', () => {
    const schema = createSchemaBuilder(
      z.object({
        title: z.string(),
      })
    )
      .withId()
      .withType('Article')
      .withContext('https://schema.org')
      .build()

    const invalidData = {
      title: 'Hello',
    }

    const result = schema.safeParse(invalidData)
    expect(result.success).toBe(false)

    const validData = {
      $id: 'https://example.com/article',
      $type: 'Article',
      $context: 'https://schema.org',
      title: 'Hello',
    }

    const result2 = schema.safeParse(validData)
    expect(result2.success).toBe(true)
  })
})

describe('validateWithSchema', () => {
  it('should validate with schema', () => {
    const schema = createTypedSchema(
      'BlogPost',
      z.object({
        title: z.string(),
      })
    )

    const data = {
      $type: 'BlogPost',
      title: 'Hello',
    }

    const result = validateWithSchema(data, schema)
    expect(result.success).toBe(true)
  })

  it('should return errors on validation failure', () => {
    const schema = createTypedSchema(
      'BlogPost',
      z.object({
        title: z.string(),
      })
    )

    const data = {
      $type: 'BlogPost',
      // missing title
    }

    const result = validateWithSchema(data, schema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors.length).toBeGreaterThan(0)
    }
  })
})
