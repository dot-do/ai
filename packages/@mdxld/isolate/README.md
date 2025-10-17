# @mdxld/isolate

Secure MDX evaluation in isolated environments for Node.js, Cloudflare Workers, and browsers.

## Overview

`@mdxld/isolate` provides a secure way to compile and evaluate MDX content in sandboxed environments. It uses [@mdx-js/mdx](https://mdxjs.com/packages/mdx/) for compilation and runtime-specific isolation mechanisms for safe evaluation.

## Features

- **Multi-Runtime Support**: Works in Node.js, Cloudflare Workers, and browsers
- **Secure Isolation**: Evaluates MDX in sandboxed environments
- **Simple API**: Similar to MDX's `evaluate()` but with security hardening
- **TypeScript Support**: Full type definitions included
- **Flexible Compilation**: Compile and evaluate separately or together

## Installation

```bash
pnpm add @mdxld/isolate
```

## Quick Start

```typescript
import { evaluate } from '@mdxld/isolate'

// Evaluate MDX content
const result = await evaluate('# Hello World\n\nThis is **MDX**!')

// Use the compiled component
console.log(result.default) // MDX component function
```

## API

### `evaluate(mdxContent, options?)`

Compile and evaluate MDX content in an isolated environment.

```typescript
import { evaluate } from '@mdxld/isolate'

const result = await evaluate('# Hello {name}', {
  scope: { name: 'World' },
  components: {
    CustomComponent: ({ children }) => `<div class="custom">${children}</div>`,
  },
})
```

**Parameters:**

- `mdxContent` (string): The MDX content to evaluate
- `options` (EvaluateOptions): Evaluation options

**Returns:** `Promise<EvaluateResult>` - The evaluated module with `default` export and any named exports

### `compileOnly(mdxContent, options?)`

Compile MDX to JavaScript without evaluating it.

```typescript
import { compileOnly } from '@mdxld/isolate'

const code = await compileOnly('# Hello World')
console.log(code) // Compiled JavaScript code
```

**Use Cases:**

- Pre-compile MDX for faster evaluation
- Inspect compiled output
- Cache compiled code
- Separate compilation and evaluation steps

### `evaluateCompiled(compiledCode, options?)`

Evaluate pre-compiled MDX code.

```typescript
import { compileOnly, evaluateCompiled } from '@mdxld/isolate'

// Compile once
const code = await compileOnly('# Hello World')

// Evaluate multiple times (e.g., with different scopes)
const result1 = await evaluateCompiled(code, { scope: { name: 'Alice' } })
const result2 = await evaluateCompiled(code, { scope: { name: 'Bob' } })
```

### `detectRuntime()`

Detect the current runtime environment.

```typescript
import { detectRuntime } from '@mdxld/isolate'

const runtime = detectRuntime()
console.log(runtime) // 'nodejs' | 'cloudflare-workers' | 'browser'
```

## Options

### `EvaluateOptions`

```typescript
interface EvaluateOptions {
  // Runtime environment (auto-detected if not specified)
  runtime?: 'nodejs' | 'cloudflare-workers' | 'browser'

  // Variables to make available in MDX scope
  scope?: Record<string, any>

  // Custom components for MDX
  components?: Record<string, any>

  // MDX compile options
  compileOptions?: {
    jsxRuntime?: 'automatic' | 'classic' // JSX runtime mode (default: 'automatic')
    development?: boolean // Development mode with better errors
    pragma?: string // Custom JSX pragma
    pragmaFrag?: string // Custom JSX fragment pragma
  }

  // Node.js-specific options
  timeout?: number // Timeout in milliseconds
  memoryLimit?: number // Memory limit in MB
}
```

## Runtime-Specific Behavior

### Node.js

Uses dynamic imports with data URLs for ESM support.

**Security Features:**

- Isolated from direct file system access
- No access to `require()` by default
- Configurable timeout (memory limit not yet supported)
- Variables passed via protected scope to prevent prototype pollution

**Important Limitations:**

- ESM imports in compiled MDX are evaluated using Node.js dynamic imports
- This provides functional isolation but not VM-level sandboxing
- Code has access to Node.js built-in modules via dynamic imports
- Suitable for trusted or validated content, not untrusted user input
- For stronger isolation, consider running in a separate process or container

### Cloudflare Workers

Uses dynamic imports with data URLs for evaluation.

**Characteristics:**

- Leverages Cloudflare's built-in isolation
- No timeout/memory limit options (managed by Workers runtime)
- Full access to Workers APIs when provided in scope

### Browser

Uses Blob URLs with dynamic imports for evaluation.

**Characteristics:**

- Creates temporary blob URLs (automatically cleaned up)
- Sandboxed by browser security model
- Works with bundlers (Webpack, Vite, etc.)

## Examples

### Basic Usage

```typescript
import { evaluate } from '@mdxld/isolate'

const mdx = `
# Hello {name}

Welcome to **MDX**!
`

const result = await evaluate(mdx, {
  scope: { name: 'World' },
})

console.log(result.default) // Component function
```

### Custom Components

```typescript
import { evaluate } from '@mdxld/isolate'

const CustomButton = ({ children }) => {
  return `<button class="custom-btn">${children}</button>`
}

const mdx = `
# My Page

<CustomButton>Click Me</CustomButton>
`

const result = await evaluate(mdx, {
  components: { CustomButton },
})
```

### Pre-compilation

```typescript
import { compileOnly, evaluateCompiled } from '@mdxld/isolate'

// Compile once
const compiled = await compileOnly('# Hello {name}')

// Evaluate with different scopes
const result1 = await evaluateCompiled(compiled, { scope: { name: 'Alice' } })
const result2 = await evaluateCompiled(compiled, { scope: { name: 'Bob' } })
```

### With MDXLD (Linked Data)

```typescript
import { evaluate } from '@mdxld/isolate'
import { parseMDXLD } from 'mdxld'

const mdxldContent = `---
$id: https://example.com/posts/hello
$type: BlogPost
title: Hello World
author: John Doe
---

# {title}

By {author}
`

// Parse frontmatter
const parsed = parseMDXLD(mdxldContent)

// Evaluate with frontmatter in scope
const result = await evaluate(parsed.content, {
  scope: parsed.data,
})
```

### Node.js with Timeout

```typescript
import { evaluate } from '@mdxld/isolate'

try {
  const result = await evaluate('# Slow computation', {
    timeout: 5000, // 5 seconds
    scope: {
      expensiveFunction: () => {
        // Long-running operation
      },
    },
  })
} catch (error) {
  console.error('Evaluation timeout:', error)
}
```

## Security Considerations

### What's Isolated

- **Node.js**: Uses dynamic imports with data URLs (functional isolation, not VM sandboxing)
- **Cloudflare Workers**: Inherits Workers' built-in isolation
- **Browser**: Sandboxed by browser security model

### What's NOT Isolated

- Code can still consume CPU/memory (set timeouts in Node.js)
- Code has access to anything passed in `scope` or `components`
- Network requests are possible if fetch/APIs are in scope
- In Node.js, compiled MDX can import Node.js built-in modules

### Security Model

This package is designed for **controlled environments** where:

- MDX content is authored by trusted sources
- Content goes through validation/review before evaluation
- You control what's passed in `scope` and `components`

**NOT suitable for**:

- Executing arbitrary user-submitted MDX without review
- Multi-tenant systems where isolation is critical
- Security-sensitive applications without additional sandboxing

### JSX Runtime Handling

MDX uses JSX under the hood, which requires a JSX runtime (typically React). To avoid requiring React as a dependency and to support runtime-agnostic execution:

- **Node.js**: A minimal custom JSX runtime is automatically injected. This runtime replaces `react/jsx-runtime` imports with a lightweight implementation that returns plain objects with `{ type, props }` structure.
- **Cloudflare Workers & Browser**: These runtimes use the compiled MDX code as-is. If your MDX uses JSX features, you'll need to provide appropriate runtime support via the `scope` option.

This approach allows `@mdxld/isolate` to work without React dependencies while still supporting MDX's JSX-based syntax in Node.js environments.

### Timeout Limitations

The `timeout` option in Node.js has important limitations:

- ⚠️ **Does NOT stop execution**: Due to JavaScript's single-threaded nature and lack of thread termination APIs, the timeout only rejects the promise. The actual code execution continues in the background.
- ✅ **Does reject the promise**: Your code will receive a timeout error and can handle it appropriately.
- ⚠️ **Cannot prevent infinite loops**: Code with infinite loops will hang regardless of the timeout setting.
- ✅ **Useful for**: Protecting against slow computations by failing fast, even though execution continues.

For true execution termination, consider running evaluations in separate processes or using worker threads with termination capabilities.

### Best Practices

1. **Only evaluate trusted or reviewed MDX content**
2. **Validate and sanitize input** before passing to `evaluate()`
3. **Limit scope objects** to only what's necessary
4. **Set timeouts** (Node.js) for long-running evaluations - but understand their limitations
5. **Use pre-compilation** for frequently-used MDX
6. **For untrusted content**, use additional sandboxing (containers, separate processes)
7. **Never pass sensitive data** (credentials, tokens) in scope

## Comparison with MDX evaluate()

| Feature               | @mdxld/isolate   | @mdx-js/mdx evaluate() |
| --------------------- | ---------------- | ---------------------- |
| Multi-runtime support | ✅ Yes           | ❌ Node.js only        |
| Sandboxed evaluation  | ✅ Yes           | ⚠️ Limited             |
| Cloudflare Workers    | ✅ Yes           | ❌ No                  |
| Browser support       | ✅ Yes           | ❌ No                  |
| Pre-compilation       | ✅ Yes           | ❌ No                  |
| Timeout control       | ✅ Yes (Node.js) | ❌ No                  |

## Development

```bash
# Build package
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Watch tests
pnpm test:watch
```

## License

MIT

## Related Packages

- [mdxld](../mdxld) - MDX with Linked Data
- [mdxe](../mdxe) - MDX Execution Engine for Cloudflare Workers
- [@mdx-js/mdx](https://mdxjs.com/packages/mdx/) - MDX compiler
