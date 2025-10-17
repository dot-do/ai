# mdxdb

MDX-powered database with schema validation, linked data support, and CMS integration.

## Features

- **MDX-First**: Store and query content as MDX documents
- **Schema Validation**: Zod-based schema validation for frontmatter
- **Linked Data**: MDXLD support for semantic relationships
- **CMS Integration**: Payload CMS integration for content management
- **OAuth Authentication**: Secure authentication via oauth.do
- **CLI Tool**: Powerful command-line interface for database operations

## Installation

```bash
pnpm add mdxdb
```

## CLI Usage

### Authentication

```bash
# Login with OAuth
mdxdb auth login

# Check authentication status
mdxdb auth status

# Validate token
mdxdb auth validate

# Set API key
mdxdb auth set-token <token>

# Set admin token
mdxdb auth set-admin-token <token>

# Logout
mdxdb auth logout
```

### Database Operations

```bash
# Initialize new database
mdxdb db init --dir ./content --schema ./schema.ts

# Query documents
mdxdb db query "type:post" --filter '{"status":"published"}' --limit 20

# Create document
mdxdb db create ./content/post.mdx --validate

# Update document
mdxdb db update doc_123 ./content/updated.mdx --validate

# Delete document
mdxdb db delete doc_123 --force

# List documents
mdxdb db list --type post --limit 50

# Validate file
mdxdb db validate ./content/post.mdx --schema BlogPost

# Manage schemas
mdxdb db schema --list
mdxdb db schema --add ./schemas/post.ts
```

## SDK Usage

```typescript
import {
  createDocument,
  updateDocument,
  queryDocuments,
  getDocument,
  deleteDocument,
  validateDocument,
  parseMDX,
} from 'mdxdb'
import { z } from 'mdxdb'

// Define schema
const PostSchema = z.object({
  title: z.string(),
  author: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
})

// Parse MDX
const { data, content } = parseMDX(mdxContent)

// Create document
const doc = await createDocument(mdxContent, {
  schemas: { post: PostSchema },
  validateOnWrite: true,
  autoTimestamps: true,
})

// Validate document
const validation = validateDocument(doc, PostSchema)
if (!validation.valid) {
  console.error('Validation errors:', validation.errors)
}

// Query documents
const posts = await queryDocuments({ type: 'post', status: 'published' })

// Get document by ID
const post = await getDocument('doc_123')

// Update document
const updated = await updateDocument('doc_123', updatedContent, {
  validateOnWrite: true,
})

// Delete document
await deleteDocument('doc_123')
```

## Payload CMS Integration

```typescript
import { PayloadConfig } from 'payload/config'
import { mdxdbPlugin } from 'mdxdb/payload'

export default buildConfig({
  plugins: [
    mdxdbPlugin({
      schemas: {
        posts: PostSchema,
        pages: PageSchema,
      },
      validateOnSave: true,
      autoSync: true,
    }),
  ],
})
```

## Schema Definition

```typescript
import { z } from 'mdxdb'

// Define schema with Zod
export const BlogPostSchema = z.object({
  // Required fields
  title: z.string().min(1).max(200),
  author: z.string(),
  date: z.string().datetime(),

  // Optional fields
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),

  // Arrays
  tags: z.array(z.string()),
  categories: z.array(z.string()),

  // Nested objects
  metadata: z.object({
    readTime: z.number(),
    wordCount: z.number(),
  }),

  // Enums
  status: z.enum(['draft', 'published', 'archived']),

  // Linked data
  '@type': z.literal('BlogPosting'),
  '@context': z.literal('https://schema.org'),
})
```

## Environment Variables

```bash
DO_TOKEN=your_api_key
DO_ADMIN_TOKEN=your_admin_token
```

Or use OAuth authentication with `mdxdb auth login`.

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Architecture

mdxdb consists of:

1. **Core Package** (`mdxdb`) - Database operations and schema validation
2. **Payload Integration** (`mdxdb/payload`) - Payload CMS plugin
3. **CLI Tool** (`mdxdb` command) - Command-line interface

## Related Packages

- `mdxld` - Linked data support for MDX
- `oauth.do` - OAuth authentication
- `payload` - Headless CMS

## License

MIT

## Links

- [Documentation](https://mdxdb.do)
- [GitHub](https://github.com/dot-do/platform)
- [Issue #2363](https://github.com/dot-do/platform/issues/2363)
