# mdx.org.ai

MDX types and specifications with tree-shakeable exports for building MDX-based applications.

## Installation

```bash
pnpm add mdx.org.ai
```

## Overview

This package provides TypeScript types and constants for working with MDX (Markdown + JSX) documents. It includes:

- Type definitions for MDX documents, components, and AST nodes
- Standard MDX component names and conventions
- Frontmatter schema with `$` prefix for linked data compatibility
- Import/export definitions for MDX modules

## Usage

### Basic Types

```typescript
import type { MDXDocument, MDXComponent, Frontmatter } from 'mdx.org.ai'

const doc: MDXDocument = {
  $type: 'MDXDocument',
  $id: 'https://example.com/docs/intro',
  content: '# Hello World\n\nThis is MDX!',
  frontmatter: {
    $type: 'Article',
    title: 'Introduction',
    author: 'John Doe',
  },
}

const component: MDXComponent = {
  name: 'Button',
  type: 'function',
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      default: 'primary',
    },
  ],
  children: true,
}
```

### Standard Components

```typescript
import { STANDARD_COMPONENTS, RESERVED_PROPS, MDX_EXTENSIONS } from 'mdx.org.ai'

console.log(STANDARD_COMPONENTS)
// ['a', 'blockquote', 'code', 'em', 'h1', 'h2', ...]

console.log(RESERVED_PROPS)
// ['children', 'components', 'key', 'ref']

console.log(MDX_EXTENSIONS)
// ['.mdx', '.md']
```

### Frontmatter with Linked Data

```typescript
import type { Frontmatter } from 'mdx.org.ai'
import { FRONTMATTER_FIELDS } from 'mdx.org.ai'

const frontmatter: Frontmatter = {
  $context: 'https://schema.org',
  $type: 'BlogPosting',
  $id: 'https://example.com/blog/my-post',
  title: 'My Blog Post',
  description: 'A great post about TypeScript',
  author: 'Jane Developer',
  date: '2025-01-15',
  tags: ['typescript', 'mdx', 'tutorial'],
}
```

### AST Node Types

```typescript
import type { MDXNode, MDXElement } from 'mdx.org.ai'

const heading: MDXNode = {
  type: 'heading',
  depth: 1,
  children: [
    {
      type: 'text',
      value: 'Hello World',
    },
  ],
}

const jsxElement: MDXElement = {
  type: 'Button',
  props: {
    variant: 'primary',
    size: 'large',
  },
  children: ['Click me'],
}
```

## API Reference

### Types

#### `MDXDocument`

Represents a complete MDX document with content, frontmatter, and metadata.

```typescript
interface MDXDocument {
  $context?: string | Record<string, any>
  $type: 'MDXDocument'
  $id?: string
  content: string
  frontmatter?: Record<string, any>
  components?: MDXComponent[]
  imports?: MDXImport[]
  exports?: MDXExport[]
}
```

#### `MDXComponent`

Defines an MDX component with its props and metadata.

```typescript
interface MDXComponent {
  name: string
  type: 'function' | 'class' | 'builtin'
  props?: ComponentProp[]
  children?: boolean
  description?: string
}
```

#### `Frontmatter`

Standard frontmatter schema with linked data support.

```typescript
interface Frontmatter {
  $id?: string
  $type?: string | string[]
  $context?: string | Record<string, any>
  title?: string
  description?: string
  author?: string
  date?: string
  tags?: string[]
  [key: string]: any
}
```

#### `MDXNode`

Represents a node in the MDX abstract syntax tree.

```typescript
interface MDXNode {
  type: MDXNodeType
  children?: MDXNode[]
  value?: string
  // ... other properties based on node type
}
```

### Constants

#### `STANDARD_COMPONENTS`

Array of standard HTML elements that MDX supports:

```typescript
const STANDARD_COMPONENTS = ['a', 'blockquote', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'li', 'ol', 'p', 'pre', 'strong', 'ul']
```

#### `RESERVED_PROPS`

Props that have special meaning in MDX:

```typescript
const RESERVED_PROPS = ['children', 'components', 'key', 'ref']
```

#### `FRONTMATTER_FIELDS`

Common frontmatter field mappings:

```typescript
const FRONTMATTER_FIELDS = {
  id: '$id',
  type: '$type',
  context: '$context',
  title: 'title',
  description: 'description',
  // ...
}
```

## Integration

This package is designed to work seamlessly with:

- **mdxld** - MDX with linked data support
- **mdxdb** - MDX as a database
- **graphdl** - Semantic graph types
- **schema.org.ai** - Schema.org types

## Use Cases

- Building MDX-based content management systems
- Type-safe MDX document processing
- MDX component libraries with type safety
- Content validation and transformation
- Static site generation with MDX
- Documentation systems

## License

MIT
