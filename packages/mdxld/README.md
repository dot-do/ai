# mdxld

Enable `$id` and `$type` in MDX frontmatter for linked data.

## Installation

```bash
pnpm add mdxld
```

## CLI Usage

### Authentication

Authenticate with the .do platform:

```bash
# Login with OAuth
mdxld auth login

# Check authentication status
mdxld auth status

# Validate token
mdxld auth validate

# Set API key
mdxld auth set-token <token>

# Logout
mdxld auth logout
```

Or set environment variables:

```bash
export DO_TOKEN=sk_xxx
export DO_ADMIN_TOKEN=sk_admin_xxx
```

### Validate MDX Files

Validate MDX files for linked data compliance:

```bash
mdxld validate ./content/post.mdx
mdxld validate ./content/post.mdx --verbose
```

### Parse and Extract

Parse MDX files and extract linked data:

```bash
mdxld parse ./content/post.mdx
mdxld parse ./content/post.mdx --json
```

### Info

Show mdxld information:

```bash
mdxld info
```

## Programmatic Usage

```typescript
import { parse, validateLinkedData, toJSONLD } from 'mdxld'

const mdxContent = `---
$id: https://example.com/posts/hello
$type: BlogPost
title: Hello World
---

# Hello World
`

// Parse MDX with linked data
const parsed = parse(mdxContent)
console.log(parsed.data.$id) // https://example.com/posts/hello
console.log(parsed.data.$type) // BlogPost

// Validate linked data
const validation = validateLinkedData(parsed.data, {
  validateId: true,
  requireType: true,
})

if (!validation.valid) {
  console.error(validation.errors)
}

// Convert to JSON-LD (uses $ prefix for consistency)
const jsonld = toJSONLD(parsed.data)
console.log(jsonld)
// {
//   "$id": "https://example.com/posts/hello",
//   "$type": "BlogPost",
//   "title": "Hello World"
// }
```

## API

### `parse(content: string, options?: ParseOptions): MDXWithLinkedData`

Parse MDX content and extract linked data frontmatter. Clean alias for `parseMDXLD`.

### `parseMDXLD(content: string, options?: ParseOptions): MDXWithLinkedData`

Parse MDX content and extract linked data frontmatter. (Use `parse` for cleaner imports)

### `validateLinkedData(data: LinkedDataFrontmatter, options?: ParseOptions): ValidationResult`

Validate linked data frontmatter.

### `toJSONLD(data: LinkedDataFrontmatter): Record<string, any>`

Convert frontmatter to JSON-LD format.

### `fromJSONLD(jsonld: Record<string, any>): LinkedDataFrontmatter`

Convert JSON-LD to frontmatter format.

### `stringifyMDXLD(content: string, data: LinkedDataFrontmatter, options?): string`

Stringify frontmatter with linked data back to MDX.

### `mdxToObject(mdxString: string): { frontmatter, content }`

Parse MDX string to object with frontmatter and content.

### `objectToMDX(obj): string`

Convert object with frontmatter and content back to MDX string.

### `parseYAMLFrontmatter(yamlString: string): LinkedDataFrontmatter`

Parse YAML frontmatter string to object.

### `stringifyYAMLFrontmatter(data: LinkedDataFrontmatter): string`

Stringify object to YAML frontmatter.

## Flattened Format

mdxld supports two formats:

### Nested Format (with $id/$type in data)

```typescript
const nested = parse(mdxString)
// {
//   data: {
//     $id: 'https://example.com/post/1',
//     $type: 'BlogPost',
//     title: 'Hello',
//     author: 'John'
//   },
//   content: '# Content here'
// }
```

### Flattened Format (id, type, data separated)

```typescript
import { mdxToFlat, flatToMDX } from 'mdxld'

const flat = mdxToFlat(mdxString)
// {
//   id: 'https://example.com/post/1',
//   type: 'BlogPost',
//   data: {
//     title: 'Hello',
//     author: 'John'
//   },
//   content: '# Content here'
// }

// Convert back
const mdx = flatToMDX(flat)
```

### Converting Between Formats

```typescript
import { flatToNested, nestedToFlat } from 'mdxld'

// Flattened -> Nested
const nested = flatToNested(flat)

// Nested -> Flattened
const flat = nestedToFlat(nested)
```

### API Functions

- `mdxToFlat(mdxString, options?)` - Parse MDX to flattened format
- `flatToMDX(flat)` - Convert flattened back to MDX string
- `flatToNested(flat)` - Convert flattened to nested
- `nestedToFlat(nested)` - Convert nested to flattened

## License

MIT
