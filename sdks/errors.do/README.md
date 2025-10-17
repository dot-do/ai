# errors.do SDK

TypeScript SDK for errors.do - Error tracking and monitoring client library

## Overview

The errors.do SDK provides a comprehensive error tracking solution for TypeScript/JavaScript applications. It includes:

- **Error Capture**: Track exceptions, errors, and messages
- **Context & Breadcrumbs**: Add user context, tags, and action trails
- **Batch Processing**: Efficient error batching and automatic flushing
- **Error Grouping**: Automatic fingerprinting and grouping of similar errors
- **Stack Traces**: Parse and capture detailed stack traces
- **Auto-capture**: Automatic capturing of unhandled errors and promise rejections
- **Error Analytics**: Query errors, groups, and statistics

## Installation

```bash
pnpm add errors.do
```

## Quick Start

```typescript
import { createClient } from 'errors.do'

// Initialize the client
const errors = createClient({
  apiKey: 'your-api-key',
  environment: 'production',
  release: '1.0.0',
})

// Capture an error
try {
  throw new Error('Something went wrong')
} catch (error) {
  await errors.captureException(error)
}

// Capture a message
await errors.captureMessage('User login failed', 'warning')

// Always close the client when done to flush remaining errors
await errors.close()
```

## Configuration

```typescript
interface ErrorClientConfig {
  baseUrl?: string           // Default: 'https://errors.do'
  apiKey?: string            // Your API key
  timeout?: number           // Request timeout in ms (default: 10000)
  headers?: Record<string, string>
  environment?: string       // e.g., 'production', 'staging', 'development'
  release?: string           // Release version
  enableAutoCapture?: boolean // Auto-capture unhandled errors (default: true)
  batchSize?: number         // Batch size before auto-flush (default: 50)
  flushInterval?: number     // Auto-flush interval in ms (default: 5000)
}
```

## API Reference

### Error Capture

#### `captureError(error, context?)`

Capture an error (string or Error object) with optional context.

```typescript
// Capture a string error
await errors.captureError('Database connection failed')

// Capture an Error object
await errors.captureError(new Error('Network timeout'))

// Capture with context
await errors.captureError('Payment processing failed', {
  user: { id: 'user-123', email: 'user@example.com' },
  tags: { component: 'payment', provider: 'stripe' },
  extra: { amount: 99.99, currency: 'USD' },
})
```

#### `captureException(error, context?)`

Capture an exception (Error object only) with stack trace.

```typescript
try {
  // Some code that might throw
} catch (error) {
  await errors.captureException(error, {
    tags: { module: 'checkout' },
  })
}
```

#### `captureMessage(message, level?, context?)`

Capture a message with severity level.

```typescript
await errors.captureMessage('User logged in', 'info')
await errors.captureMessage('API rate limit approaching', 'warning')
await errors.captureMessage('Service unavailable', 'error')
await errors.captureMessage('Database corrupted', 'fatal')
```

**Severity Levels**: `debug`, `info`, `warning`, `error`, `fatal`

### Context Management

#### `setUser(user)`

Set user context for all subsequent errors.

```typescript
errors.setUser({
  id: 'user-123',
  email: 'john@example.com',
  username: 'john_doe',
  customField: 'value',
})
```

#### `setTags(tags)`

Set tags for categorizing errors.

```typescript
errors.setTags({
  component: 'auth',
  version: '2.0.1',
  region: 'us-east-1',
})
```

#### `addBreadcrumb(breadcrumb)`

Add breadcrumbs to track user actions leading to an error.

```typescript
errors.addBreadcrumb({
  category: 'navigation',
  message: 'User navigated to /checkout',
  level: 'info',
  data: { from: '/cart', to: '/checkout' },
})

errors.addBreadcrumb({
  category: 'user',
  message: 'User clicked "Complete Purchase"',
  level: 'info',
})

// When an error occurs, all breadcrumbs are included
await errors.captureError('Payment validation failed')
```

### Batch Operations

#### `flush()`

Manually flush queued errors to the server.

```typescript
// Capture multiple errors
await errors.captureMessage('Error 1')
await errors.captureMessage('Error 2')
await errors.captureMessage('Error 3')

// Force flush
await errors.flush()
```

#### `close()`

Close the client and flush all remaining errors.

```typescript
// At application shutdown
await errors.close()
```

### Error Retrieval

#### `getError(id)`

Get a specific error by ID.

```typescript
const error = await errors.getError('error-id-123')
console.log(error.message, error.level, error.stacktrace)
```

#### `listErrors(options)`

List errors with filtering and pagination.

```typescript
const result = await errors.listErrors({
  limit: 50,
  offset: 0,
  level: 'error',
  environment: 'production',
  startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
})

console.log(`Found ${result.total} errors`)
result.errors.forEach((error) => {
  console.log(`${error.timestamp}: ${error.message}`)
})
```

#### `getErrorGroups(options)`

Get grouped errors by fingerprint.

```typescript
const result = await errors.getErrorGroups({
  limit: 20,
  environment: 'production',
})

result.groups.forEach((group) => {
  console.log(`${group.message}: ${group.count} occurrences`)
  console.log(`First seen: ${new Date(group.firstSeen)}`)
  console.log(`Last seen: ${new Date(group.lastSeen)}`)
})
```

#### `getStats(options)`

Get error statistics.

```typescript
const stats = await errors.getStats({
  environment: 'production',
  startDate: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
})

console.log(`Total errors: ${stats.total}`)
console.log('By level:', stats.byLevel)
console.log('By environment:', stats.byEnvironment)
console.log('Recent errors:', stats.recentErrors)
```

#### `resolveGroup(fingerprint)`

Mark an error group as resolved.

```typescript
await errors.resolveGroup('error-fingerprint')
```

#### `deleteError(id)`

Delete a specific error.

```typescript
await errors.deleteError('error-id-123')
```

### Health Check

#### `health()`

Check the health status of the error tracking service.

```typescript
const health = await errors.health()
console.log(health.status) // 'healthy'
```

## Error Context

Comprehensive context can be provided with each error:

```typescript
interface ErrorContext {
  user?: {
    id?: string
    email?: string
    username?: string
    [key: string]: any
  }
  tags?: Record<string, string>
  extra?: Record<string, any>
  breadcrumbs?: Breadcrumb[]
  request?: {
    url?: string
    method?: string
    headers?: Record<string, string>
    body?: any
    query?: Record<string, string>
  }
  device?: {
    name?: string
    brand?: string
    model?: string
    os?: string
    osVersion?: string
    browser?: string
    browserVersion?: string
  }
}
```

## Auto-capture

When `enableAutoCapture: true` (default in browser), the SDK automatically captures:

- Unhandled errors (`window.onerror`)
- Unhandled promise rejections (`window.onunhandledrejection`)

```typescript
const errors = createClient({
  apiKey: 'your-api-key',
  enableAutoCapture: true, // Enabled by default in browser
})

// Unhandled errors are automatically captured
throw new Error('This will be captured automatically')

// Unhandled promise rejections are automatically captured
Promise.reject(new Error('This will also be captured'))
```

## Examples

### Express.js Error Handling

```typescript
import express from 'express'
import { createClient } from 'errors.do'

const app = express()
const errors = createClient({ apiKey: process.env.ERRORS_API_KEY })

// Error handler middleware
app.use(async (err, req, res, next) => {
  await errors.captureException(err, {
    request: {
      url: req.url,
      method: req.method,
      headers: req.headers,
      query: req.query,
    },
    user: req.user,
  })

  res.status(500).json({ error: 'Internal Server Error' })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  await errors.close()
  process.exit(0)
})
```

### Next.js Error Boundary

```typescript
'use client'

import { useEffect } from 'react'
import { createClient } from 'errors.do'

const errors = createClient({ apiKey: process.env.NEXT_PUBLIC_ERRORS_API_KEY })

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    errors.captureException(error, {
      tags: { boundary: 'app' },
      extra: { digest: error.digest },
    })
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Async Error Tracking

```typescript
import { createClient } from 'errors.do'

const errors = createClient({ apiKey: 'your-api-key' })

async function processData() {
  errors.addBreadcrumb({ category: 'process', message: 'Starting data processing' })

  try {
    const data = await fetchData()
    errors.addBreadcrumb({ category: 'process', message: 'Data fetched successfully' })

    const result = await transformData(data)
    errors.addBreadcrumb({ category: 'process', message: 'Data transformed' })

    return result
  } catch (error) {
    // All breadcrumbs will be included
    await errors.captureException(error, {
      tags: { operation: 'data-processing' },
    })
    throw error
  }
}
```

## Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests (requires errors.do worker)
pnpm test:e2e

# Run E2E tests against local worker
pnpm test:e2e:local
```

## TypeScript

The SDK is written in TypeScript and includes full type definitions.

```typescript
import type { ErrorEvent, ErrorContext, ErrorStats } from 'errors.do'
```

## Semantic Patterns

The errors.do SDK follows the `.do` platform semantic patterns:

```typescript
import { $ } from 'sdk.do'
import { createClient } from 'errors.do'

// Semantic error tracking
const errors = createClient()

// Track business errors semantically
await $.Order.create({ ... }).catch(async (error) => {
  await errors.captureException(error, {
    tags: { subject: 'Order', predicate: 'create' },
  })
})
```

## License

MIT

---

Part of the [`.do` platform](https://github.com/dot-do/platform) open-source ecosystem.
