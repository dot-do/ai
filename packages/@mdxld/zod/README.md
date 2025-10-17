# @mdxld/zod

Zod schemas and validation utilities for [MDXLD](https://github.com/dot-do/platform/tree/main/ai/packages/mdxld).

## Installation

```bash
pnpm add @mdxld/zod mdxld zod
```

## Features

- 🔒 **Type-safe validation** - Validate MDX frontmatter with Zod schemas
- 🏗️ **Schema builders** - Fluent API for building custom schemas
- 📦 **Pre-built schemas** - Common schema.org types included
- 🎯 **TypeScript-first** - Full type inference and autocomplete
- 🔄 **Compatible** - Works seamlessly with existing `mdxld` API

## Usage

### Basic Validation

```typescript
import { parseMDXLD } from 'mdxld'
import { validateWithSchema, createTypedSchema } from '@mdxld/zod'
import { z } from 'zod'

// Define your schema
const BlogPostSchema = createTypedSchema(
  'BlogPost',
  z.object({
    title: z.string(),
    author: z.string(),
    publishedAt: z.string().datetime(),
  })
)

// Parse and validate
const mdx = parseMDXLD(content)
const result = validateWithSchema(mdx.data, BlogPostSchema)

if (result.success) {
  console.log(result.data.title) // Type-safe!
} else {
  console.error(result.error.errors)
}
```

### Parse and Validate in One Step

```typescript
import { parseAndValidate, createTypedSchema } from '@mdxld/zod'
import { z } from 'zod'

const ArticleSchema = createTypedSchema(
  'Article',
  z.object({
    headline: z.string(),
    author: z.string(),
  })
)

const result = parseAndValidate(mdxContent, ArticleSchema)

if (result.success) {
  console.log(result.data.data.headline) // Type-safe frontmatter
  console.log(result.data.content) // MDX content
}
```

### Schema Builder

```typescript
import { createSchemaBuilder } from '@mdxld/zod'
import { z } from 'zod'

const schema = createSchemaBuilder(
  z.object({
    title: z.string(),
    description: z.string().optional(),
  })
)
  .withId() // Require $id
  .withType('WebPage') // Require $type: 'WebPage'
  .withContext('https://schema.org') // Require $context
  .build()
```

### Pre-built Schemas

```typescript
import { BlogPostSchema, ArticleSchema, PersonSchema } from '@mdxld/zod/schemas'

// Use directly
const result = validateWithSchema(frontmatter, BlogPostSchema)
```

Available pre-built schemas:

- `BlogPostSchema` - Blog posts
- `ArticleSchema` - Articles
- `WebPageSchema` - Web pages
- `PersonSchema` - People/authors
- `OrganizationSchema` - Organizations
- `ProductSchema` - Products
- `EventSchema` - Events

## API

### Core Schemas

- `LinkedDataFrontmatterSchema` - Schema for basic linked data frontmatter
- `MDXWithLinkedDataSchema` - Schema for nested format
- `MDXFlattenedSchema` - Schema for flattened format

### Functions

#### `createTypedSchema(type, schema)`

Create a schema with a required `$type` field.

```typescript
const BlogPostSchema = createTypedSchema(
  'BlogPost',
  z.object({
    title: z.string(),
  })
)
```

#### `createSchemaBuilder(baseSchema)`

Create a fluent schema builder.

```typescript
const schema = createSchemaBuilder(
  z.object({
    title: z.string(),
  })
)
  .withId()
  .withType('Article')
  .build()
```

#### `validateWithSchema(data, schema)`

Validate frontmatter data against a Zod schema.

```typescript
const result = validateWithSchema(frontmatter, BlogPostSchema)
```

#### `parseAndValidate(content, schema)`

Parse MDX content and validate in one step.

```typescript
const result = parseAndValidate(mdxContent, BlogPostSchema)
```

## Examples

### Custom Schema with Validation

```typescript
import { createTypedSchema, parseAndValidate } from '@mdxld/zod'
import { z } from 'zod'

const TutorialSchema = createTypedSchema(
  'Tutorial',
  z.object({
    title: z.string().min(1).max(100),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    duration: z.number().positive(),
    prerequisites: z.array(z.string()).optional(),
    tags: z.array(z.string()).min(1),
  })
)

const mdxContent = `---
$id: https://example.com/tutorials/intro-to-typescript
$type: Tutorial
title: Introduction to TypeScript
difficulty: beginner
duration: 30
tags: [typescript, programming]
---

# Introduction to TypeScript

Your tutorial content here...
`

const result = parseAndValidate(mdxContent, TutorialSchema)

if (result.success) {
  const { data, content } = result.data
  console.log(`Tutorial: ${data.title}`)
  console.log(`Difficulty: ${data.difficulty}`)
  console.log(`Duration: ${data.duration} minutes`)
}
```

### Extending Pre-built Schemas

```typescript
import { BlogPostSchema } from '@mdxld/zod/schemas'
import { z } from 'zod'

const ExtendedBlogPostSchema = BlogPostSchema.extend({
  category: z.enum(['tech', 'design', 'business']),
  featured: z.boolean().default(false),
  views: z.number().int().nonnegative().default(0),
})
```

### Dynamic Schema Selection

```typescript
import { BlogPostSchema, ArticleSchema, WebPageSchema } from '@mdxld/zod/schemas'
import { parseAndValidate } from '@mdxld/zod'

const schemaMap = {
  BlogPost: BlogPostSchema,
  Article: ArticleSchema,
  WebPage: WebPageSchema,
}

function validateMDX(content: string, type: string) {
  const schema = schemaMap[type]
  if (!schema) {
    throw new Error(`Unknown type: ${type}`)
  }
  return parseAndValidate(content, schema)
}
```

## TypeScript

This package is fully typed and provides type inference for validated data:

```typescript
import { createTypedSchema, validateWithSchema } from '@mdxld/zod'
import { z } from 'zod'

const schema = createTypedSchema(
  'Post',
  z.object({
    title: z.string(),
    count: z.number(),
  })
)

const result = validateWithSchema(data, schema)

if (result.success) {
  // result.data is fully typed!
  const title: string = result.data.title
  const count: number = result.data.count
}
```

## License

MIT
