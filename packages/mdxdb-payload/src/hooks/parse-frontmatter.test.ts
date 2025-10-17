/**
 * Tests for frontmatter parsing hooks
 */

import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { parseFrontmatter, createParseFrontmatterHook, createLinkedDataHook } from './parse-frontmatter.js'

describe('parseFrontmatter', () => {
  it('parses basic frontmatter', () => {
    const mdx = `---
title: Hello World
date: "2025-10-14"
---

# Hello World

This is content.`

    const result = parseFrontmatter(mdx)

    expect(result.data).toEqual({
      title: 'Hello World',
      date: '2025-10-14',
    })
    expect(result.content).toContain('# Hello World')
    expect(result.content).toContain('This is content.')
  })

  it('parses nested frontmatter', () => {
    const mdx = `---
title: Test Post
author:
  name: John Doe
  email: john@example.com
tags: [typescript, mdx]
---

Content here.`

    const result = parseFrontmatter(mdx)

    expect(result.data).toEqual({
      title: 'Test Post',
      author: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      tags: ['typescript', 'mdx'],
    })
  })

  it('handles MDX without frontmatter', () => {
    const mdx = `# Hello World

No frontmatter here.`

    const result = parseFrontmatter(mdx)

    expect(result.data).toEqual({})
    expect(result.content).toContain('# Hello World')
  })

  it('parses linked data frontmatter', () => {
    const mdx = `---
$id: https://example.com/posts/hello
$type: BlogPosting
title: Hello World
---

Content.`

    const result = parseFrontmatter(mdx)

    expect(result.data).toEqual({
      $id: 'https://example.com/posts/hello',
      $type: 'BlogPosting',
      title: 'Hello World',
    })
  })

  it('handles empty frontmatter', () => {
    const mdx = `---
---

Content only.`

    const result = parseFrontmatter(mdx)

    expect(result.data).toEqual({})
    expect(result.content).toContain('Content only.')
  })

  it('preserves content after frontmatter', () => {
    const mdx = `---
title: Test
---

# Title

Paragraph 1.

Paragraph 2.`

    const result = parseFrontmatter(mdx)

    expect(result.content).toContain('# Title')
    expect(result.content).toContain('Paragraph 1.')
    expect(result.content).toContain('Paragraph 2.')
  })
})

describe('createParseFrontmatterHook', () => {
  it('parses and stores frontmatter in data', async () => {
    const hook = createParseFrontmatterHook('content')
    const mdx = `---
title: Test Post
date: "2025-10-14"
---

# Content`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_frontmatter).toEqual({
      title: 'Test Post',
      date: '2025-10-14',
    })
  })

  it('validates frontmatter against schema', async () => {
    const schema = z.object({
      title: z.string(),
      date: z.string(),
    })

    const hook = createParseFrontmatterHook('content', schema)
    const mdx = `---
title: Test Post
date: "2025-10-14"
---

# Content`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_frontmatter).toEqual({
      title: 'Test Post',
      date: '2025-10-14',
    })
  })

  it('throws error for invalid schema validation', async () => {
    const schema = z.object({
      title: z.string(),
      date: z.string(),
      required: z.string(), // This field is missing
    })

    const hook = createParseFrontmatterHook('content', schema)
    const mdx = `---
title: Test Post
date: "2025-10-14"
---

# Content`

    await expect(
      hook({
        data: { content: mdx },
      })
    ).rejects.toThrow(/Field 'content' frontmatter validation failed/)
  })

  it('handles non-string field values', async () => {
    const hook = createParseFrontmatterHook('content')

    const result = await hook({
      data: { content: 123 },
    })

    // Should return data unchanged for non-string values
    expect(result).toEqual({ content: 123 })
  })

  it('handles MDX without frontmatter', async () => {
    const hook = createParseFrontmatterHook('content')
    const mdx = `# Hello World

No frontmatter here.`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_frontmatter).toEqual({})
  })

  it('includes field name in error messages', async () => {
    const schema = z.object({
      required: z.string(),
    })

    const hook = createParseFrontmatterHook('myField', schema)
    const mdx = `---
title: Test
---

# Content`

    await expect(
      hook({
        data: { myField: mdx },
      })
    ).rejects.toThrow(/Field 'myField'/)
  })
})

describe('createLinkedDataHook', () => {
  it('parses and stores linked data', async () => {
    const hook = createLinkedDataHook('content')
    const mdx = `---
$id: https://example.com/posts/hello
$type: BlogPosting
title: Hello World
---

Content.`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_linked_data).toEqual({
      id: 'https://example.com/posts/hello',
      type: 'BlogPosting',
      data: {
        $id: 'https://example.com/posts/hello',
        $type: 'BlogPosting',
        title: 'Hello World',
      },
    })
  })

  it('validates $id is a valid URL', async () => {
    const hook = createLinkedDataHook('content')
    const mdx = `---
$id: not-a-valid-url
$type: BlogPosting
---

Content.`

    await expect(
      hook({
        data: { content: mdx },
      })
    ).rejects.toThrow(/Field 'content'.*\$id must be a valid URL/)
  })

  it('validates $type is a string', async () => {
    const hook = createLinkedDataHook('content')
    const mdx = `---
$id: https://example.com/post
$type: 123
---

Content.`

    await expect(
      hook({
        data: { content: mdx },
      })
    ).rejects.toThrow(/Field 'content'.*\$type must be a string/)
  })

  it('allows missing $id and $type', async () => {
    const hook = createLinkedDataHook('content')
    const mdx = `---
title: Hello World
---

Content.`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_linked_data).toEqual({
      id: undefined,
      type: undefined,
      data: {
        title: 'Hello World',
      },
    })
  })

  it('validates against schema if provided', async () => {
    const schema = z.object({
      $id: z.string().url(),
      $type: z.string(),
      title: z.string(),
    })

    const hook = createLinkedDataHook('content', schema)
    const mdx = `---
$id: https://example.com/post
$type: BlogPosting
title: Hello World
---

Content.`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_linked_data.data).toEqual({
      $id: 'https://example.com/post',
      $type: 'BlogPosting',
      title: 'Hello World',
    })
  })

  it('throws error for invalid schema validation', async () => {
    const schema = z.object({
      $id: z.string().url(),
      $type: z.string(),
      requiredField: z.string(),
    })

    const hook = createLinkedDataHook('content', schema)
    const mdx = `---
$id: https://example.com/post
$type: BlogPosting
---

Content.`

    await expect(
      hook({
        data: { content: mdx },
      })
    ).rejects.toThrow(/Field 'content' linked data validation failed/)
  })

  it('handles non-string field values', async () => {
    const hook = createLinkedDataHook('content')

    const result = await hook({
      data: { content: null },
    })

    // Should return data unchanged for non-string values
    expect(result).toEqual({ content: null })
  })

  it('includes field name in error messages', async () => {
    const hook = createLinkedDataHook('myField')
    const mdx = `---
$id: invalid-url
---

Content.`

    await expect(
      hook({
        data: { myField: mdx },
      })
    ).rejects.toThrow(/Field 'myField'/)
  })

  it('handles quoted URLs in frontmatter', async () => {
    const hook = createLinkedDataHook('content')
    const mdx = `---
$id: "https://example.com/post"
$type: BlogPosting
---

Content.`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_linked_data.id).toBe('https://example.com/post')
  })

  it('handles URLs with comments in frontmatter', async () => {
    const hook = createLinkedDataHook('content')
    const mdx = `---
$id: https://example.com/post # This is a comment
$type: BlogPosting
---

Content.`

    const result = await hook({
      data: { content: mdx },
    })

    expect(result.content_linked_data.id).toBe('https://example.com/post')
  })
})
