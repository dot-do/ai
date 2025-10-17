# sdk.do

TypeScript SDK for the `.do` platform with RPC client using CapnWeb.

## Installation

```bash
pnpm add sdk.do
```

## Documentation

- **[Enhanced Types](./ENHANCED-TYPES.md)** - Declarative API patterns with `AI()`, `DB()`, `on()`, `every()` for building autonomous workflows
- **[API Reference](#services)** - Imperative API reference for `ai`, `db`, `auth` services

## Usage

### RPC Client

```typescript
import { createClient } from 'sdk.do'

// Create a client
const client = createClient({
  baseUrl: 'https://apis.do',
  apiKey: 'your-api-key',
})

// Call database methods
const user = await client.db.get('users', 'user_123')
const users = await client.db.list('users')

// Call AI methods
const result = await client.ai.generateText('Write a haiku')

// Call auth methods
const valid = await client.auth.validateToken('token')
```

### Using Service Proxy

```typescript
// Get a typed service proxy
const db = client.service<DBService>('db')
await db.query('SELECT * FROM users WHERE id = ?', ['user_123'])
```

### Direct RPC Calls

```typescript
// Make direct RPC calls
const result = await client.call('db', 'query', {
  sql: 'SELECT * FROM users',
  params: [],
})
```

### Event Listeners

```typescript
import { $ } from 'sdk.do'

// Listen to semantic event patterns
$.on('Order.created', async (event) => {
  console.log('Order created:', event.what)
  // event follows 5W1H BusinessEvent pattern
})

// Filter by actor, method, purpose, location
$.on('Order.created', handler, {
  who: { $type: 'Agent' },
  how: { method: 'api' },
  why: { reason: 'customer-purchase' },
})

// Ontology-based patterns
$.on.zapier.trigger('gmail', 'New Email', handler)
$.on.naics.sector('52', handler) // Finance sector
$.on.onet.occupation('15-1252.00', handler) // Software Developers
```

## Architecture

This SDK uses CapnWeb (Cloudflare's RPC library) to communicate with `.do` platform services:

- **Client**: HTTP-based RPC client that calls `/rpc/:service/:method` endpoints
- **Server**: Workers expose RPC methods via WorkerEntrypoint
- **Type Safety**: Full TypeScript support with service interfaces

## Services

### Event Listeners (`on`)

Listen to semantic event patterns with filters and ontology integration.

**Basic usage:**

```typescript
// Listen to Order creation events
$.on('Order.created', async (event) => {
  console.log('New order:', event.what)
})

// Listen with filters
$.on('Payment.failed', handler, {
  why: { reason: 'insufficient-funds' },
})

// Regex patterns
$.on(/Order\.(created|updated)/, handler)

// Custom filter functions
$.on((event) => event.what.total > 1000, handler)
```

**Event Structure Requirements:**

Events must follow the BusinessEvent 5W1H pattern from `graphdl`. For semantic path matching to work correctly, events require:

- `what.$type` - The subject/entity type (e.g., 'Order', 'Payment', 'Customer')
- `metadata.action` or `metadata.verb` - The predicate/action (e.g., 'created', 'updated', 'deleted')

**Important**: If `metadata.action` or `metadata.verb` is missing, semantic path patterns will fail to match. The system constructs paths like `Order.created` from `what.$type` + `metadata.action`. Events without these fields will only match regex patterns or custom filter functions, not string patterns.

```typescript
import { createBusinessEvent, createPerson, createLocation } from 'graphdl'

const event = createBusinessEvent({
  who: createPerson({ id: 'user_123', name: 'John Doe' }),
  what: { $type: 'Order', id: 'order_456', total: 100 }, // Subject
  where: createLocation({ digital: { platform: 'web' } }),
  why: { reason: 'customer-purchase' },
  how: { method: 'api' },
})
event.metadata = { action: 'created' } // Predicate - REQUIRED for pattern matching

// This event will match pattern 'Order.created'
$.on.emit(event)

// ❌ This event will NOT match 'Order.created' (missing metadata.action)
const badEvent = createBusinessEvent({
  what: { $type: 'Order', id: 'order_789' },
  // metadata.action is missing!
})
$.on.emit(badEvent) // Won't trigger 'Order.created' listeners
```

For three-part patterns like `Order.created.Product`, the event should include:

```typescript
what: {
  $type: 'Order',
  object: { $type: 'Product' } // Object
}
```

**Ontology integrations:**

```typescript
// Zapier triggers
$.on.zapier.trigger('gmail', 'New Email', handler)

// NAICS industry sectors
$.on.naics.sector('52', handler) // Finance sector

// O*NET occupations
$.on.onet.occupation('15-1252.00', handler) // Software Developers
```

**Advanced features:**

```typescript
// Async filter functions
$.on(async (event) => {
  const user = await fetchUser(event.who.id)
  return user.isPremium
}, handler)

// Middleware hooks
$.on('Order.created', handler, {
  before: (event) => {
    // Transform event before handler
    event.metadata.processed = true
    return event
  },
  after: (event, result) => {
    // Run after handler completes
    console.log('Handler completed')
  },
})

// Error handling
$.on('Payment.failed', handler, {
  onError: (listenerId, error, event) => {
    console.error(`Listener ${listenerId} failed:`, error)
  },
})

// Timeout configuration
$.on('Order.created', slowHandler, {
  timeout: 5000, // 5 seconds
})

// Auto-cleanup on errors or timeouts
$.on('Payment.process', unreliableHandler, {
  removeOnError: true, // Auto-remove if handler throws
  removeOnTimeout: true, // Auto-remove if handler times out
  timeout: 10000,
})

// Listener groups for namespaced management
$.on('Order.created', handler1, { group: 'analytics' })
$.on('Payment.completed', handler2, { group: 'analytics' })
$.on.offGroup('analytics') // Remove all analytics listeners
```

**Listener management:**

```typescript
const id = $.on('Order.created', handler)
$.on.off(id) // Remove listener
$.on.offGroup('analytics') // Remove all listeners in group
$.on.clear() // Remove all listeners

// Emit events and get execution results
const results = await $.on.emit(event)
results.forEach((result) => {
  if (!result.success) {
    if (result.timedOut) {
      console.error(`Listener ${result.listenerId} timed out`)
    } else {
      console.error(`Listener ${result.listenerId} failed:`, result.error)
    }
  }
})
```

**Security configuration:**

```typescript
import { createOnService } from 'sdk.do/on'

// Configure limits and timeouts to prevent DoS attacks
const onService = createOnService({
  maxListenersPerPattern: 100, // Limit per pattern
  maxTotalListeners: 1000, // Global limit
  defaultTimeout: 30000, // 30 second default timeout
  maxRegexComplexity: 50, // Prevent ReDoS attacks
})
```

**Custom error handling:**

```typescript
import { createOnService } from 'sdk.do/on'

// Configure custom error logger (useful for production logging)
const onService = createOnService({
  errorLogger: (message, error) => {
    // Send to your logging service instead of console.error
    logger.error(message, { error, context: 'event-system' })
  },
})
```

**Telemetry and monitoring:**

```typescript
import { createOnService } from 'sdk.do/on'

const metrics = {
  eventsProcessed: 0,
  handlersExecuted: 0,
  handlerErrors: 0,
  totalDuration: 0,
}

const onService = createOnService({
  telemetry: {
    onEventEmit: (event) => {
      metrics.eventsProcessed++
    },
    onHandlerStart: (listenerId, event) => {
      console.log(`Handler ${listenerId} starting for ${event.what.$type}`)
    },
    onHandlerSuccess: (listenerId, event, durationMs) => {
      metrics.handlersExecuted++
      metrics.totalDuration += durationMs
      console.log(`Handler ${listenerId} completed in ${durationMs}ms`)
    },
    onHandlerError: (listenerId, event, error, durationMs) => {
      metrics.handlerErrors++
      console.error(`Handler ${listenerId} failed after ${durationMs}ms:`, error)
    },
    onHandlerTimeout: (listenerId, event, timeoutMs) => {
      console.warn(`Handler ${listenerId} timed out after ${timeoutMs}ms`)
    },
  },
})

// Later: Check metrics
console.log('Average handler duration:', metrics.totalDuration / metrics.handlersExecuted)
console.log('Error rate:', metrics.handlerErrors / metrics.handlersExecuted)
```

**Multi-tenant environments (Cloudflare Workers):**

For multi-tenant environments, create a new OnService instance per request to ensure isolation:

```typescript
import { createOnService } from 'sdk.do/on'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Create isolated instance per request
    const onService = createOnService()

    // Register listeners for this request
    onService('Order.created', async (event) => {
      // Handle event for this request only
    })

    // Process request...
    return new Response('OK')
  },
}
```

**Important Limitations:**

1. **Deep object comparison**: Filter options only perform shallow equality checks on top-level properties. Nested object filters will not match correctly:

   ```typescript
   // ❌ This won't work as expected (nested object)
   $.on('Order.created', handler, {
     why: { metadata: { campaign: { id: '123' } } },
   })

   // ✅ Use custom filter function instead
   $.on(
     'Order.created',
     (event) => {
       return event.why?.metadata?.campaign?.id === '123'
     },
     handler
   )
   ```

2. **Filter function errors**: Errors thrown in custom filter functions during pattern matching will cause the event emission to fail. Use try-catch within your filter if needed:
   ```typescript
   $.on(async (event) => {
     try {
       const user = await fetchUser(event.who.id)
       return user.isPremium
     } catch (error) {
       console.error('Filter error:', error)
       return false // Reject event on error
     }
   }, handler)
   ```

**Performance Characteristics:**

- **Pattern matching**: O(n) where n is the number of listeners for a given subject type
- **Subject-based indexing**: O(1) lookup for string patterns with known subjects
- **Regex patterns**: Tested against semantic path only (not entire event), minimizing overhead
- **Priority sorting**: Only performed on matched listeners, not all registered listeners

**Memory Considerations:**

- Each registered listener consumes memory for the lifetime of the registry
- Use `maxExecutions` for one-time handlers to enable automatic cleanup
- Use listener groups to bulk-remove related listeners when no longer needed
- Use `removeOnError` and `removeOnTimeout` for unreliable handlers
- In long-running processes, monitor listener count with security limits

See full documentation in the Usage section above.

### Database (`db`)

- `query(sql, params)` - Execute SQL
- `get(ns, id)` - Get entity
- `list(ns, options)` - List entities
- `upsert(ns, id, data)` - Create/update
- `delete(ns, id)` - Delete entity
- `search(ns, query, options)` - Search

### AI (`ai`)

- `generateText(prompt, options)` - Generate text
- `generate(prompt, options)` - Generate with options
- `embed(text, options)` - Create embeddings

### Auth (`auth`)

- `validateToken(token)` - Validate JWT
- `createSession(userId)` - Create session
- `createApiKey(name, permissions)` - Create API key
- `checkPermission(permission)` - Check permission

### Storage (`storage`)

R2 object storage for files and media.

**Basic operations:**

```typescript
// Upload file
const file = new File(['content'], 'document.pdf', { type: 'application/pdf' })
const result = await $.storage.upload('documents/report.pdf', file, {
  metadata: { author: 'John Doe', version: '1.0' },
})
console.log('Uploaded:', result.url)

// Download file
const download = await $.storage.download('documents/report.pdf')
const blob = new Blob([download.data], { type: download.contentType })

// Delete file
await $.storage.delete('documents/old-report.pdf')

// Generate pre-signed URL (expires in 1 hour)
const url = await $.storage.url('documents/report.pdf', { expiresIn: 3600 })
```

**Multipart uploads** (for large files >100MB):

```typescript
// Start multipart upload
const upload = await $.storage.multipart.start('videos/large-file.mp4', {
  contentType: 'video/mp4',
})

// Upload parts (5MB - 5GB each)
const part1 = await $.storage.multipart.uploadPart(upload, 1, chunk1Data)
const part2 = await $.storage.multipart.uploadPart(upload, 2, chunk2Data)

// Complete upload
const result = await $.storage.multipart.complete(upload, [part1, part2])
console.log('Uploaded:', result.size, 'bytes')
```

**Object management:**

```typescript
// Get metadata
const metadata = await $.storage.metadata('documents/report.pdf')
console.log('Size:', metadata.size, 'Created:', metadata.createdAt)

// List objects with pagination
const list = await $.storage.list({
  prefix: 'documents/',
  limit: 100,
  cursor: 'next-page-token',
})
list.objects.forEach((obj) => console.log(obj.key, obj.size))

// Copy object
await $.storage.copy('documents/report.pdf', 'archive/report-2025.pdf')
```

### Queue (`queue`)

Cloudflare Queues for async message processing across 5 queue types: `events`, `tasks`, `webhooks`, `emails`, `analytics`.

**Publish messages:**

```typescript
// Publish single message
await $.queue.publish('tasks', {
  type: 'process-order',
  orderId: '12345',
  priority: 'high',
})

// Publish with delay (send in 1 hour)
await $.queue.publish(
  'emails',
  {
    type: 'send-reminder',
    userId: '123',
    templateId: 'reminder-24h',
  },
  {
    delaySeconds: 3600,
  }
)

// Batch publish
const result = await $.queue.batch('events', [
  { type: 'user.created', userId: '1', timestamp: Date.now() },
  { type: 'user.created', userId: '2', timestamp: Date.now() },
  { type: 'user.created', userId: '3', timestamp: Date.now() },
])
console.log(`Published ${result.successCount} messages`)
if (result.failedCount > 0) {
  console.error('Failures:', result.failures)
}
```

**Queue monitoring:**

```typescript
// Get stats for specific queue
const stats = await $.queue.stats('tasks')
console.log('Pending:', stats.pending)
console.log('In flight:', stats.inFlight)
console.log('Rate:', stats.messagesPerSecond, 'msg/s')

// Get stats for all queues
const allStats = await $.queue.stats()
Object.entries(allStats).forEach(([name, stats]) => {
  console.log(`${name}: ${stats.pending} pending`)
})

// Health check
const health = await $.queue.health()
if (!health.healthy) {
  Object.entries(health.queues).forEach(([name, status]) => {
    if (!status.healthy) {
      console.warn(`Queue ${name} unhealthy:`, status.errors, 'errors')
    }
  })
}
```

## Configuration

```typescript
const client = createClient({
  baseUrl: 'https://apis.do', // API base URL
  apiKey: 'sk_...', // API key for authentication
  headers: {
    // Additional headers
    'X-Custom': 'value',
  },
})
```

## Migration Guide: RuntimeContext to BusinessContext

### Overview

As of version 2.0, `sdk.do` has been enhanced with full Business-as-Code support through the `BusinessContext` interface. This includes:

- **`$` proxy** from `graphdl` for semantic path construction
- **`ForEvery` semantic patterns** for database queries
- **Enhanced type safety** with graphdl types
- **Backward compatibility** with `RuntimeContext`

### What Changed?

#### 1. BusinessContext Replaces RuntimeContext

**Before (RuntimeContext):**

```typescript
import { type RuntimeContext } from 'sdk.do'

export default ($: RuntimeContext) => {
  const { ai, db, on, send } = $
  // ... your code
}
```

**After (BusinessContext):**

```typescript
import { type BusinessContext } from 'sdk.do'

export default ($: BusinessContext) => {
  const { $: path, ai, db, on, send } = $

  // Now you can use the $ proxy for semantic paths
  on(path.Order.created, async (event) => {
    // ...
  })
}
```

#### 2. $ Proxy for Semantic Paths

The `$` proxy from `graphdl` is now included in `BusinessContext`:

```typescript
import { type BusinessContext } from 'sdk.do'

export default ($: BusinessContext) => {
  const { $ } = $ // Extract the semantic path builder

  // Use $ for semantic path construction
  on($.Order.created, async (event) => {
    console.log('Order created:', event.what)
  })

  // Or use string patterns (still supported)
  on('Order.created', async (event) => {
    console.log('Order created:', event.what)
  })
}
```

#### 3. ForEvery Semantic Database Queries

> **Note**: The `forEvery` feature is currently in development and not yet implemented. The type definitions are in place to support future implementation. For now, continue using traditional database queries (`db.list()`, `db.get()`, etc.).

The `db` service will support semantic path queries through `forEvery` (coming soon):

```typescript
import { type BusinessContext } from 'sdk.do'

export default async ($: BusinessContext) => {
  const { db } = $

  // Semantic database queries (coming soon)
  // const orders = await db.forEvery.customer.orders.where({ status: 'pending' })
  // const tasks = await db.forEvery.industry.occupations.tasks.list()

  // Traditional queries (use these for now)
  const users = await db.list('users')
}
```

#### 4. Zod Validation Examples

Runtime validation with Zod schemas:

```typescript
import { z } from 'zod'
import { type BusinessContext } from 'sdk.do'

const OrderSchema = z.object({
  $type: z.literal('Order'),
  $id: z.string().min(1),
  total: z.number().positive(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
})

export default ($: BusinessContext) => {
  const { on } = $

  on('Order.created', async (event) => {
    // Validate at runtime
    const order = OrderSchema.parse(event.what)
    // Now order is fully typed and validated
  })
}
```

See `examples/zod-validation.ts` for complete examples.

### Backward Compatibility

**RuntimeContext is still supported** and extends BusinessContext:

```typescript
// This still works!
import { type RuntimeContext } from 'sdk.do'

export default ($: RuntimeContext) => {
  const { ai, db, on } = $
  // All existing code continues to work
}
```

However, `RuntimeContext` is marked as `@deprecated` and will be removed in a future major version. We recommend migrating to `BusinessContext` when possible.

### Migration Checklist

- [ ] Replace `RuntimeContext` imports with `BusinessContext`
- [ ] Destructure `$` from context if using semantic paths
- [ ] Update database queries to use `forEvery` patterns (coming soon - not yet implemented)
- [ ] Add Zod validation for runtime safety (optional)
- [ ] Test that all event listeners still work correctly
- [ ] Update type definitions if using custom metadata: `BusinessContext<MyMetadata>`

### Breaking Changes

None! This is a **backward-compatible** enhancement. All existing code using `RuntimeContext` will continue to work.

### Need Help?

- See `examples/zod-validation.ts` for complete validation examples
- Check the issue tracker: https://github.com/dot-do/platform/issues
- Read the graphdl documentation for `$` proxy patterns
