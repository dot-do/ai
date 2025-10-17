# @mdxdb/payload

Payload CMS integration for MDX content management with schema validation and linked data support.

## Features

- 🎯 **Custom MDX Field Type** - Native Payload field for MDX content
- ✅ **Schema Validation** - Validate frontmatter with Zod schemas
- 🔗 **Linked Data Support** - `$id` and `$type` in frontmatter for JSON-LD
- 🎨 **Frontmatter Parsing** - Automatic frontmatter extraction and validation
- 🔧 **Hooks System** - Payload hooks for MDX processing
- 📝 **TypeScript First** - Fully typed API with excellent IDE support

## Installation

```bash
pnpm add @mdxdb/payload
```

## Quick Start

### Basic MDX Field

```typescript
import { createMDXField } from '@mdxdb/payload'

export const BlogPosts = {
  slug: 'blog-posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    createMDXField({
      name: 'content',
      label: 'Blog Content',
      required: true,
      enableFrontmatter: true,
    }),
  ],
}
```

### With Schema Validation

```typescript
import { createMDXField, createParseFrontmatterHook } from '@mdxdb/payload'
import { z } from 'zod'

// Define frontmatter schema
const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  tags: z.array(z.string()),
  published: z.boolean(),
  author: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
})

export const BlogPosts = {
  slug: 'blog-posts',
  fields: [
    createMDXField({
      name: 'content',
      label: 'Content',
      required: true,
      enableFrontmatter: true,
      schema: PostSchema,
      defaultFrontmatter: {
        title: '',
        published: false,
        tags: [],
      },
    }),
  ],
  hooks: {
    beforeValidate: [createParseFrontmatterHook('content', PostSchema)],
  },
}
```

### With Linked Data

```typescript
import { createMDXField, createLinkedDataHook } from '@mdxdb/payload'
import { z } from 'zod'

const ArticleSchema = z.object({
  $id: z.string().url(),
  $type: z.literal('BlogPosting'),
  title: z.string(),
  datePublished: z.date(),
})

export const Articles = {
  slug: 'articles',
  fields: [
    createMDXField({
      name: 'content',
      label: 'Article Content',
      required: true,
      enableFrontmatter: true,
      enableLinkedData: true,
      schema: ArticleSchema,
    }),
  ],
  hooks: {
    beforeValidate: [createLinkedDataHook('content', ArticleSchema)],
  },
}
```

## API Reference

### Fields

#### `createMDXField(config: MDXFieldConfig)`

Creates a Payload field for MDX content.

**Options:**

```typescript
interface MDXFieldConfig {
  name: string // Field name
  label?: string // Field label
  required?: boolean // Is field required
  enableFrontmatter?: boolean // Enable frontmatter parsing (default: true)
  enableLinkedData?: boolean // Enable $id/$type validation (default: false)
  schema?: z.ZodType<any> // Zod schema for validation
  defaultFrontmatter?: Record<string, unknown> // Default frontmatter values
  admin?: {
    description?: string // Field description
    language?: string // Editor language (default: 'markdown')
    readOnly?: boolean // Read-only mode (default: false)
  }
}
```

**Example:**

```typescript
createMDXField({
  name: 'content',
  label: 'Blog Content',
  required: true,
  enableFrontmatter: true,
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
})
```

#### `createMDXFields(baseConfig, fields)`

Creates multiple MDX fields with shared configuration.

**Example:**

```typescript
createMDXFields(
  {
    enableFrontmatter: true,
    enableLinkedData: true,
  },
  [
    { name: 'content', label: 'Main Content', required: true },
    { name: 'excerpt', label: 'Excerpt' },
  ]
)
```

### Hooks

#### `parseFrontmatter(mdxContent: string)`

Parses MDX frontmatter from content string.

**Returns:**

```typescript
{
  data: Record<string, unknown>,  // Frontmatter data
  content: string,                // Content without frontmatter
  frontmatter: string            // Raw frontmatter string
}
```

**Example:**

```typescript
import { parseFrontmatter } from '@mdxdb/payload/hooks'

const mdx = `---
title: Hello World
date: 2025-10-14
---

# Hello World

This is my blog post.
`

const parsed = parseFrontmatter(mdx)
// {
//   data: { title: 'Hello World', date: '2025-10-14' },
//   content: '# Hello World\n\nThis is my blog post.',
//   frontmatter: 'title: Hello World\ndate: 2025-10-14'
// }
```

#### `createParseFrontmatterHook(fieldName, schema?)`

Creates a Payload `beforeValidate` hook that parses and validates frontmatter.

**Example:**

```typescript
import { createParseFrontmatterHook } from '@mdxdb/payload/hooks'
import { z } from 'zod'

const schema = z.object({
  title: z.string(),
  date: z.date(),
})

export const Collection = {
  hooks: {
    beforeValidate: [createParseFrontmatterHook('content', schema)],
  },
}
```

The hook automatically stores parsed frontmatter in a field named `${fieldName}_frontmatter`.

#### `createLinkedDataHook(fieldName, schema?)`

Creates a Payload `beforeValidate` hook for linked data validation.

**Example:**

```typescript
import { createLinkedDataHook } from '@mdxdb/payload/hooks'

export const Collection = {
  hooks: {
    beforeValidate: [createLinkedDataHook('content')],
  },
}
```

The hook validates `$id` (must be valid URL) and `$type` (must be string), and stores linked data in `${fieldName}_linked_data`.

## MDX Frontmatter Format

### Standard Frontmatter

```yaml
---
title: My Blog Post
description: A great post about TypeScript
date: 2025-10-14
tags: [typescript, mdx, payload]
published: true
author:
  name: John Doe
  email: john@example.com
---
# My Blog Post

Content goes here...
```

### Linked Data Frontmatter

```yaml
---
$id: https://example.com/posts/my-blog-post
$type: BlogPosting
title: My Blog Post
datePublished: 2025-10-14
author:
  $type: Person
  name: John Doe
---
# My Blog Post

Content with semantic web support...
```

## Type Definitions

### `MDXDocument`

```typescript
interface MDXDocument {
  data: Record<string, unknown> // Frontmatter data
  content: string // MDX content body
  compiled?: string // Optional compiled output
  excerpt?: string // Optional excerpt
}
```

### `MDXLinkedDocument`

```typescript
interface MDXLinkedDocument extends MDXDocument {
  data: {
    $id?: string // Unique identifier (URI)
    $type?: string // Schema.org type
    [key: string]: unknown
  }
}
```

### `ParsedFrontmatter`

```typescript
interface ParsedFrontmatter {
  data: Record<string, unknown> // Frontmatter data
  content: string // Content without frontmatter
  frontmatter: string // Frontmatter as string
}
```

## Usage Patterns

### Blog Collection

```typescript
import { createMDXField, createParseFrontmatterHook } from '@mdxdb/payload'
import { z } from 'zod'

const BlogPostSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500),
  date: z.date(),
  tags: z.array(z.string()).max(10),
  published: z.boolean(),
  featuredImage: z.string().url().optional(),
})

export const BlogPosts = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    createMDXField({
      name: 'content',
      label: 'Blog Content',
      required: true,
      enableFrontmatter: true,
      schema: BlogPostSchema,
      defaultFrontmatter: {
        published: false,
        tags: [],
      },
      admin: {
        description: 'Write your blog post in MDX with frontmatter',
      },
    }),
    {
      name: 'content_frontmatter',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Parsed frontmatter from MDX content',
      },
    },
  ],
  hooks: {
    beforeValidate: [createParseFrontmatterHook('content', BlogPostSchema)],
  },
}
```

### Documentation Collection with Linked Data

```typescript
import { createMDXField, createLinkedDataHook } from '@mdxdb/payload'
import { z } from 'zod'

const DocSchema = z.object({
  $id: z.string().url(),
  $type: z.literal('TechArticle'),
  title: z.string(),
  description: z.string(),
  category: z.enum(['guide', 'reference', 'tutorial']),
})

export const Documentation = {
  slug: 'documentation',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    createMDXField({
      name: 'content',
      label: 'Documentation Content',
      required: true,
      enableFrontmatter: true,
      enableLinkedData: true,
      schema: DocSchema,
    }),
    {
      name: 'content_linked_data',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Parsed linked data from MDX',
      },
    },
  ],
  hooks: {
    beforeValidate: [createLinkedDataHook('content', DocSchema)],
  },
}
```

## Integration with mdxld

For full linked data support, use with the `mdxld` package:

```typescript
import { parseMDXLD, toJSONLD } from 'mdxld'
import { parseFrontmatter } from '@mdxdb/payload/hooks'

// Parse MDX with linked data
const mdx = `---
$id: https://example.com/posts/hello
$type: BlogPosting
title: Hello World
---

# Hello`

const parsed = parseFrontmatter(mdx)
const jsonld = toJSONLD(parsed.data)

// Use in HTML for SEO
const html = `
<script type="application/ld+json">
  ${JSON.stringify(jsonld)}
</script>
`
```

## Best Practices

1. **Always validate frontmatter** - Use Zod schemas to ensure data quality
2. **Store parsed data separately** - Use `_frontmatter` and `_linked_data` fields for parsed data
3. **Provide defaults** - Use `defaultFrontmatter` to help content editors
4. **Use linked data for SEO** - Enable `$id` and `$type` for better search engine visibility
5. **Keep schemas focused** - Define clear, minimal schemas for each content type

## Security

### YAML Parsing Safety

This package uses **safe YAML parsing** by default to prevent security vulnerabilities:

- All YAML frontmatter is parsed using `js-yaml` with `CORE_SCHEMA`
- This prevents arbitrary code execution through YAML deserialization attacks
- Supports basic YAML types: strings, numbers, booleans, null, arrays, and objects
- Complex YAML features (custom tags, arbitrary object instantiation) are blocked for security

### Trusted Content Sources

While safe YAML parsing protects against many attacks, you should still:

- **Only allow trusted users** to create or edit MDX content
- **Validate all frontmatter** using Zod schemas to ensure data integrity
- **Sanitize user input** before displaying it in your application
- **Review content changes** before publishing to production

### Reporting Security Issues

If you discover a security vulnerability, please email security@dotdo.com instead of using the public issue tracker.

## License

MIT

## Repository

[github.com/dot-do/platform](https://github.com/dot-do/platform/tree/main/ai/packages/mdxdb-payload)

## Related Packages

- [`mdxld`](../mdxld) - Linked data support for MDX
- [`mdxai`](../mdxai) - AI-powered MDX generation
- [`ai-database`](../ai-database) - Semantic database operations
