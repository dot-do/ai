# Enhanced SDK Types: Declarative API Patterns

> **⚠️ Implementation Status**: This document describes the proposed API design for enhanced SDK types. Implementation is tracked in [issue #267](https://github.com/dot-do/platform/issues/267). The declarative patterns shown here are not yet implemented in the codebase.

This document describes the enhanced type system for `sdk.do` that provides both imperative (lowercase) and declarative (uppercase) APIs for building autonomous workflows.

## Overview

The SDK provides two complementary patterns:

1. **Imperative API** (lowercase): `ai`, `db`, `api`, etc. - Direct function calls for immediate execution
2. **Declarative API** (uppercase): `AI()`, `DB()`, `API()`, etc. - Schema-first definitions that generate type-safe functions

Both patterns can be used together, with the declarative API providing strongly-typed schemas and automatic durability for complex workflows.

### Package Structure

All imports come from `sdk.do`:

```typescript
// Imperative API (lowercase)
import { ai, db, api } from 'sdk.do'

// Declarative API (uppercase)
import { AI, DB, API, on, every, send } from 'sdk.do'
```

## Imperative API (Current)

The lowercase exports provide direct access to platform services:

```typescript
import { ai, db } from 'sdk.do'

// Direct imperative calls
await db.ideas.create({ concept: 'Digital AI Workers' })
await db.ideas.create({ concept: 'Agentic Workflow Platform' })

const ideas = await db.ideas.search('AI Agents')

// Properly await all async operations
await Promise.all(
  ideas.map(async (idea) => {
    idea.status = 'Evaluating market potential'
    const leanCanvas = await ai.defineLeanCanvas({ idea })
    const marketResearch = await ai.research({ idea, leanCanvas })
    return db.ideas.update({ ...idea, leanCanvas, marketResearch })
  })
)
```

## Declarative API (Enhanced)

### AI Functions

Define AI functions with explicit schemas for structured outputs:

```typescript
import { AI } from 'sdk.do'

const ai = AI({
  // Schema-based function: strongly-typed output
  defineLeanCanvas: {
    productName: 'name of the product or service',
    problem: ['top 3 problems the product solves'],
    solution: ['top 3 solutions the product offers'],
    uniqueValueProposition: 'clear message that states the benefit of your product',
    unfairAdvantage: 'something that cannot be easily copied or bought',
    customerSegments: ['list of target customer segments'],
    keyMetrics: ['list of key numbers that tell you how your business is doing'],
    channels: ['path to acquire customers'],
    costStructure: ['list of operational costs'],
    revenueStreams: ['list of revenue sources'],
  },

  // String array: simple list generation
  brainstormIdeas: ['List 25 startup ideas leveraging AI Agents, Agentic Workflows, and/or Services delivered by AI Agents'],

  // Explicit configuration: full control over model and output
  research: {
    model: 'perplexity/sonar-deep-research',
    prompt: 'Research {input}',
    output: 'markdown',
  },

  // Durable workflow function: automatic retries and state management
  ideate: async (args, { ai, db }) => {
    const ideas = await ai.brainstormIdeas(args)

    const results = await Promise.all(
      ideas.map(async (idea) => {
        idea.status = 'Evaluating market potential'
        idea.leanCanvas = await ai.defineLeanCanvas({ idea })
        idea.marketResearch = await ai.research({ idea, leanCanvas: idea.leanCanvas })
        await db.ideas.update(idea.id, idea)
        return idea
      })
    )

    return results
  },
})

// Usage: fully type-safe with IntelliSense
const ideas = await ai.ideate({ icp: 'Early-stage Startup Founders' })
```

#### AI Function Types

**Schema Object** - Define structured output format:

```typescript
{
  functionName: {
    field1: 'description',
    field2: ['array', 'of', 'values'],
    nested: {
      subfield: 'description'
    }
  }
}
```

**String Array** - Simple prompt for list generation:

```typescript
{
  functionName: ['prompt describing what to generate']
}
```

**Explicit Config** - Full control over AI parameters:

```typescript
{
  functionName: {
    model: 'model-name',
    prompt: 'prompt with {variables}',
    output: 'json' | 'markdown' | 'text',
    temperature?: number,
    maxTokens?: number,
  }
}
```

**Workflow Function** - Durable execution with context:

```typescript
{
  functionName: async (args, context) => {
    // context provides: { ai, db, api, user, send, ... }
    // Automatic retries, state persistence, error recovery
    return result
  }
}
```

### Database Collections

Define data models with explicit schemas:

```typescript
import { DB } from 'sdk.do'

const db = DB({
  ideas: {
    concept: 'string',
    status: 'string',
    leanCanvas: {
      productName: 'string',
      problem: ['string'],
      solution: ['string'],
      uniqueValueProposition: 'string',
      unfairAdvantage: 'string',
      customerSegments: ['string'],
      keyMetrics: ['string'],
      channels: ['string'],
      costStructure: ['string'],
      revenueStreams: ['string'],
    },
    marketResearch: 'markdown',
    createdAt: 'datetime',
    updatedAt: 'datetime',
  },

  users: {
    email: 'string',
    name: 'string',
    role: 'string',
    permissions: ['string'],
  },
})

// Usage: type-safe CRUD operations
await db.ideas.create({
  concept: 'Digital AI Workers',
  status: 'New',
})

const idea = await db.ideas.get('idea_123')
await db.ideas.update('idea_123', { status: 'Active' })
await db.ideas.delete('idea_123')

const results = await db.ideas.search('AI Agents')
const all = await db.ideas.list({ limit: 100 })
```

#### Database Schema Types

The schema uses string literals to define types, which are then mapped to TypeScript types at compile time or runtime:

- `'string'` → `string` - Text field
- `'number'` → `number` - Numeric field
- `'boolean'` → `boolean` - Boolean field
- `'datetime'` → `Date` - ISO datetime
- `'json'` → `any` - Arbitrary JSON
- `'markdown'` → `string` - Markdown content
- `['type']` → `type[]` - Array of type
- `{ nested }` → nested object type

**Implementation Note**: The type system uses TypeScript template literal types and conditional types to map schema strings to TypeScript types without requiring a build step. Alternatively, runtime validation can be added using libraries like Zod or TypeBox.

### Event Listeners

Define event-driven workflows with `on`:

```typescript
import { on } from 'sdk.do'

// Listen for specific events
on('idea.created', async (event, { ai, db }) => {
  const idea = event.data
  idea.status = 'Evaluating'
  idea.leanCanvas = await ai.defineLeanCanvas({ idea })
  await db.ideas.update(idea.id, idea)
})

// Pattern matching with wildcards
on('idea.*', async (event, { send }) => {
  console.log(`Idea event: ${event.type}`, event.data)
  await send('analytics.track', event)
})

// Multiple events
on(['idea.created', 'idea.updated'], async (event, { db }) => {
  await db.eventLog.create({
    type: event.type,
    data: event.data,
    timestamp: new Date(),
  })
})
```

#### Event Pattern Matching

The `on()` function supports flexible pattern matching:

- **Exact match**: `'idea.created'` - Matches only `idea.created` events
- **Single wildcard**: `'idea.*'` - Matches `idea.created`, `idea.updated`, `idea.deleted`, etc.
- **Multi-segment wildcard**: `'idea.**'` - Matches `idea.created`, `idea.comment.added`, etc.
- **Multiple patterns**: `['idea.created', 'idea.updated']` - Matches any of the specified events

Pattern matching uses dot-separated event names for hierarchical organization.

### Scheduled Workflows

Define time-based workflows with `every`:

```typescript
import { every } from 'sdk.do'

// Simple interval (natural language)
every('1 hour', async (event, { ai, db }) => {
  const ideas = await db.ideas.list({ status: 'New' })
  for (const idea of ideas) {
    await ai.evaluateIdea(idea)
  }
})

// Cron expression (standard cron syntax)
every('0 9 * * 1-5', async (event, { db, send }) => {
  // Every weekday at 9am
  const report = await db.ideas.aggregate({ status: 'Active' })
  await send('email.weekly-report', report)
})

// Natural language with constraints
every('hour during business hours', async (event, { ai, db }) => {
  const pending = await db.ideas.list({ status: 'Pending Review' })
  for (const idea of pending) {
    const analysis = await ai.analyzeIdea(idea)
    await db.ideas.update(idea.id, { analysis })
  }
})
```

#### Schedule Expression Formats

The `every()` function accepts multiple schedule formats:

1. **Natural Language Intervals**:
   - `'1 hour'`, `'30 minutes'`, `'1 day'`, `'1 week'`
   - `'hour'`, `'day'`, `'week'` (equivalent to `'1 hour'`, etc.)

2. **Cron Expressions** (standard Unix cron syntax):
   - `'0 9 * * 1-5'` - Every weekday at 9am
   - `'*/15 * * * *'` - Every 15 minutes
   - `'0 0 * * 0'` - Every Sunday at midnight
   - Format: `minute hour day month weekday`

3. **Natural Language with Constraints** (planned):
   - `'hour during business hours'` - Every hour from 9am-5pm on weekdays
   - `'day at 9am on weekdays'` - Once per day at 9am, Monday-Friday

**Implementation Note**: Natural language parsing can use libraries like `chrono-node` or custom parsers. Cron expressions use standard cron syntax compatible with tools like `node-cron`.

### API Integrations

Define external API integrations:

```typescript
import { API } from 'sdk.do'

const api = API({
  stripe: {
    baseUrl: 'https://api.stripe.com/v1',
    auth: 'bearer',
    methods: {
      createCustomer: {
        method: 'POST',
        path: '/customers',
        body: {
          email: 'string',
          name: 'string',
        },
      },
      createSubscription: {
        method: 'POST',
        path: '/subscriptions',
        body: {
          customer: 'string',
          items: [{ price: 'string' }],
        },
      },
    },
  },

  github: {
    baseUrl: 'https://api.github.com',
    auth: 'bearer',
    methods: {
      createIssue: {
        method: 'POST',
        path: '/repos/{owner}/{repo}/issues',
        body: {
          title: 'string',
          body: 'string',
          labels: ['string'],
        },
      },
    },
  },
})

// Usage: type-safe API calls
const customer = await api.stripe.createCustomer({
  email: 'user@example.com',
  name: 'John Doe',
})

const issue = await api.github.createIssue({
  owner: 'dot-do',
  repo: 'platform',
  title: 'Bug report',
  body: 'Description',
  labels: ['bug'],
})
```

#### API Authentication & Security

API credentials are provided through environment variables bound to the worker:

```typescript
// Environment variables (configured in wrangler.toml or Cloudflare dashboard)
// STRIPE_API_KEY=sk_test_...
// GITHUB_TOKEN=ghp_...

const api = API({
  stripe: {
    baseUrl: 'https://api.stripe.com/v1',
    auth: 'bearer', // Uses env.STRIPE_API_KEY automatically
    methods: {
      /* ... */
    },
  },
  github: {
    baseUrl: 'https://api.github.com',
    auth: 'bearer', // Uses env.GITHUB_TOKEN automatically
    methods: {
      /* ... */
    },
  },
})
```

**Authentication Methods**:

- `'bearer'` - Bearer token in `Authorization` header (from `env.{SERVICE}_API_KEY` or `env.{SERVICE}_TOKEN`)
- `'basic'` - Basic auth (from `env.{SERVICE}_USERNAME` and `env.{SERVICE}_PASSWORD`)
- `'apikey'` - API key in header or query param (from `env.{SERVICE}_API_KEY`)
- Custom header - Specify exact header name: `auth: { header: 'X-API-Key' }`

**Security Best Practices**:

1. Never hardcode credentials in code
2. Use Cloudflare's encrypted environment variables for secrets
3. Rotate API keys regularly
4. Use least-privilege access tokens (scoped permissions)

## Complete Example: Idea Evaluation Workflow

This example demonstrates how declarative and imperative APIs work together:

```typescript
import { AI, DB, every, on, send } from 'sdk.do'

// 1. Define declarative AI functions (module-level)
export const ai = AI({
  defineLeanCanvas: {
    productName: 'string',
    problem: ['string'],
    solution: ['string'],
    uniqueValueProposition: 'string',
    unfairAdvantage: 'string',
    customerSegments: ['string'],
    keyMetrics: ['string'],
    channels: ['string'],
    costStructure: ['string'],
    revenueStreams: ['string'],
  },

  research: {
    model: 'perplexity/sonar-deep-research',
    prompt: 'Research the market potential for: {idea.concept}\n\nLean Canvas:\n{idea.leanCanvas}',
    output: 'markdown',
  },

  evaluateIdea: async (idea, { ai, db, send }) => {
    try {
      idea.status = 'Evaluating'
      await db.ideas.update(idea.id, idea)

      idea.leanCanvas = await ai.defineLeanCanvas({ idea })
      idea.marketResearch = await ai.research({ idea })

      idea.status = 'Evaluated'
      await db.ideas.update(idea.id, idea)

      // Emit success event
      await send('idea.evaluated', idea)

      return idea
    } catch (error) {
      idea.status = 'Evaluation Failed'
      idea.error = error.message
      await db.ideas.update(idea.id, idea)
      throw error
    }
  },
})

// 2. Define declarative data models (module-level)
export const db = DB({
  ideas: {
    concept: 'string',
    status: 'string',
    leanCanvas: 'json',
    marketResearch: 'markdown',
    error: 'string',
    createdAt: 'datetime',
    updatedAt: 'datetime',
  },
})

// 3. Set up event-driven workflows (module-level)
on('idea.created', async (event, { ai }) => {
  const idea = event.data
  await ai.evaluateIdea(idea)
})

// 4. Set up scheduled workflows (module-level)
every('1 hour', async (event, { ai, db }) => {
  const newIdeas = await db.ideas.list({ status: 'New' })
  for (const idea of newIdeas) {
    await ai.evaluateIdea(idea)
  }
})

// 5. Worker entrypoint using declarative functions
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Create idea using declarative db
    const idea = await db.ideas.create({
      concept: 'AI-powered code review',
      status: 'New',
      createdAt: new Date(),
    })

    // Emit event (triggers idea.created listener above)
    await send('idea.created', idea)

    // Alternatively, trigger evaluation directly using declarative ai
    // await ai.evaluateIdea(idea)

    return new Response(JSON.stringify(idea), {
      headers: { 'Content-Type': 'application/json' },
    })
  },
}
```

**How This Works**:

1. **Declarative definitions** (`AI()`, `DB()`) are created at module-level and exported
2. **Event listeners** (`on()`) and **schedulers** (`every()`) are registered at module-level
3. **Worker entrypoint** uses the declarative functions directly
4. **Event flow**: Creating an idea → `send('idea.created')` → triggers `on('idea.created')` → calls `ai.evaluateIdea()`
5. **Error handling**: The `evaluateIdea` function catches errors and updates the idea status accordingly
6. **Scheduled execution**: Every hour, new ideas are automatically evaluated

**Key Integration Points**:

- Declarative functions (`ai`, `db`) are used directly in the worker
- Events connect different parts of the workflow
- Scheduled tasks run independently of requests
- All operations benefit from type safety and durability

## Type Safety

All declarative APIs generate TypeScript types automatically:

```typescript
// AI function return types inferred from schema
const canvas: {
  productName: string
  problem: string[]
  solution: string[]
  // ... etc
} = await ai.defineLeanCanvas({ idea })

// Database operations fully typed
const idea: {
  concept: string
  status: string
  leanCanvas: any // json type from schema
  marketResearch: string
  createdAt: Date
  updatedAt: Date
} = await db.ideas.get('idea_123')

// Event types inferred from event name
on('idea.created', async (event: { type: 'idea.created'; data: Idea }, ctx) => {
  // event.data is typed as Idea
})
```

## Durability & Retries

Functions defined with the declarative API are automatically durable:

- **Automatic Retries**: Failed operations retry with exponential backoff
- **State Persistence**: Workflow state persists across executions
- **Error Recovery**: Partial failures don't lose progress
- **Idempotency**: Operations are safe to retry

```typescript
const ai = AI({
  // This function is automatically durable
  processIdea: async (idea, { ai, db }) => {
    // If this fails, it will retry automatically
    const canvas = await ai.defineLeanCanvas({ idea })

    // Progress is checkpointed here
    await db.ideas.update(idea.id, { leanCanvas: canvas })

    // If this fails, canvas is already saved
    const research = await ai.research({ idea, leanCanvas: canvas })

    return { canvas, research }
  },
})
```

## Migration Guide

### From Imperative to Declarative

**Before** (Imperative):

```typescript
import { ai, db } from 'sdk.do'

const canvas = await ai.generate({
  prompt: 'Create a lean canvas for: ' + idea.concept,
  schema: {
    /* ... */
  },
})
```

**After** (Declarative):

```typescript
import { AI } from 'sdk.do'

const ai = AI({
  defineLeanCanvas: {
    /* schema */
  },
})

const canvas = await ai.defineLeanCanvas({ idea })
```

### Benefits of Declarative API

1. **Type Safety**: Full TypeScript inference from schemas
2. **Durability**: Automatic retries and state management
3. **Documentation**: Self-documenting function definitions
4. **Testability**: Easy to mock and test
5. **Composability**: Functions can call other declared functions
6. **Performance**: Optimized execution with batching

## Best Practices

### 1. Use Declarative for Complex Workflows

```typescript
// Good: Complex workflow with multiple steps
const ai = AI({
  evaluateStartupIdea: async (idea, { ai, db }) => {
    const canvas = await ai.defineLeanCanvas({ idea })
    const research = await ai.research({ idea, canvas })
    const competition = await ai.analyzeCompetition({ idea, research })
    return { canvas, research, competition }
  },
})
```

### 2. Use Imperative for Simple Operations

```typescript
// Good: Simple one-off operation
import { db } from 'sdk.do'
await db.ideas.create({ concept: 'New idea' })
```

### 3. Combine Both Patterns

```typescript
// Define reusable functions
const ai = AI({
  defineLeanCanvas: {
    /* schema */
  },
})

// Use them imperatively when needed
import { db } from 'sdk.do'
const ideas = await db.ideas.list()
for (const idea of ideas) {
  await ai.defineLeanCanvas({ idea }) // Declarative function
}
```

### 4. Handle Errors Gracefully

```typescript
const ai = AI({
  processIdea: async (idea, { ai, db, send }) => {
    try {
      const result = await ai.analyze({ idea })
      await db.ideas.update(idea.id, { status: 'Completed', result })
      return result
    } catch (error) {
      // Log error and update status
      console.error('Failed to process idea:', error)
      await db.ideas.update(idea.id, { status: 'Failed', error: error.message })

      // Optionally emit error event for monitoring
      await send('idea.processing.failed', { idea, error: error.message })

      // Re-throw to trigger automatic retries
      throw error
    }
  },
})
```

### 5. Optimize Batch Processing

```typescript
// For large datasets, use batching to avoid overwhelming resources
every('1 hour', async (event, { ai, db }) => {
  const BATCH_SIZE = 10
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const batch = await db.ideas.list({
      status: 'New',
      limit: BATCH_SIZE,
      offset,
    })

    hasMore = batch.length === BATCH_SIZE
    offset += BATCH_SIZE

    // Process batch in parallel
    await Promise.all(
      batch.map((idea) =>
        ai.evaluateIdea(idea).catch((err) => {
          console.error(`Failed to evaluate idea ${idea.id}:`, err)
          // Continue processing other ideas even if one fails
        })
      )
    )
  }
})
```

### 6. Define Schemas at Module Level

```typescript
// Good: Centralized schemas
const schemas = {
  leanCanvas: {
    /* ... */
  },
  marketResearch: {
    /* ... */
  },
}

const ai = AI(schemas)
const db = DB(schemas)
```

## API Reference

### AI(definitions)

Creates AI function definitions.

**Parameters:**

- `definitions` - Object mapping function names to schemas, configs, or functions

**Returns:** Typed AI client with defined methods

### DB(collections)

Creates database collection definitions.

**Parameters:**

- `collections` - Object mapping collection names to schemas

**Returns:** Typed database client with collection methods

### API(integrations)

Creates external API integration definitions.

**Parameters:**

- `integrations` - Object mapping service names to API configs

**Returns:** Typed API client with integration methods

### on(event, handler)

Registers event listener.

**Parameters:**

- `event` - Event name or pattern
- `handler` - Async function receiving (event, context)

### every(schedule, handler)

Registers scheduled workflow.

**Parameters:**

- `schedule` - Cron expression or interval description
- `handler` - Async function receiving (event, context)

## Future Enhancements

Planned improvements to the declarative API:

1. **Validation**: Runtime schema validation with Zod
2. **Versioning**: Schema versioning for backwards compatibility
3. **Observability**: Built-in tracing and metrics
4. **Testing**: Test utilities for mocking declarative functions
5. **Documentation**: Auto-generated API docs from schemas
6. **IDE Support**: Enhanced IntelliSense and code completion

## Feedback

This is a proposal for enhanced SDK types. Please provide feedback on:

- API ergonomics and developer experience
- Type safety and TypeScript integration
- Missing features or use cases
- Documentation clarity

Open an issue or PR at: https://github.com/dot-do/platform (private repo)
