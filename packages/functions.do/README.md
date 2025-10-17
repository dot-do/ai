# functions.do

Universal function abstraction for the .do platform. **Everything is a Function.**

## Overview

The .do platform treats everything as a function, supporting four fundamental function types:

1. **Code Functions** - Pure computation via `do eval` with Dynamic Worker Loader
2. **Generative Functions** - AI-powered generation via AI worker
3. **Agentic Functions** - Multi-step reasoning with tools via agents
4. **Human Functions** - Human-in-the-loop via Slack BlockKit, Discord, Email, etc.

## Installation

```bash
pnpm add functions.do
```

## Quick Start

### Code Function

Pure computation with optional eval-based execution:

```typescript
import { defineCodeFunction, execute } from 'functions.do'
import { z } from 'zod'

const addNumbers = defineCodeFunction({
  name: 'addNumbers',
  description: 'Add two numbers together',
  input: z.object({ a: z.number(), b: z.number() }),
  output: z.number(),
  handler: async ({ a, b }) => a + b,
  deterministic: true,
  idempotent: true,
})

// Execute the function
const result = await execute('fn_add_numbers', { a: 5, b: 3 })
console.log(result.output) // 8
```

### Generative Function

AI-powered generation with model configuration:

```typescript
import { defineGenerativeFunction } from 'functions.do'
import { z } from 'zod'

const summarizeText = defineGenerativeFunction({
  name: 'summarizeText',
  description: 'Generate a summary of text',
  input: z.object({ text: z.string() }),
  output: z.object({ summary: z.string() }),
  model: 'gpt-5',
  systemPrompt: 'You are a helpful assistant that summarizes text.',
  userPrompt: (input) => `Summarize this text:\n\n${input.text}`,
  temperature: 0.7,
  handler: async (input, ctx) => {
    // AI worker handles the actual generation
    const response = await ctx.env.AI.generate({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes text.' },
        { role: 'user', content: `Summarize this text:\n\n${input.text}` },
      ],
    })
    return { summary: response.choices[0].message.content }
  },
})
```

### Agentic Function

Multi-step reasoning with tools:

```typescript
import { defineAgenticFunction } from 'functions.do'
import { z } from 'zod'

const researchTopic = defineAgenticFunction({
  name: 'researchTopic',
  description: 'Research a topic using web search and analysis',
  input: z.object({ topic: z.string() }),
  output: z.object({
    findings: z.array(z.string()),
    conclusion: z.string(),
  }),
  model: 'gpt-5',
  tools: ['webSearch', 'readUrl', 'summarize'],
  maxSteps: 10,
  instructions: 'Research the topic thoroughly and provide comprehensive findings.',
  handler: async (input, ctx) => {
    // Agent worker handles multi-step reasoning
    return { findings: [], conclusion: '' }
  },
})
```

### Human Function

Human-in-the-loop with Slack BlockKit:

```typescript
import { defineHumanFunction } from 'functions.do'
import { z } from 'zod'

const approveExpense = defineHumanFunction({
  name: 'approveExpense',
  description: 'Request human approval for an expense',
  input: z.object({
    amount: z.number(),
    description: z.string(),
  }),
  output: z.object({
    approved: z.boolean(),
    notes: z.string().optional(),
  }),
  uiType: 'slack',
  render: (input, ctx) => ({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Expense Approval Request*\n\nAmount: $${input.amount}\nDescription: ${input.description}`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Approve' },
            value: 'approve',
            style: 'primary',
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Reject' },
            value: 'reject',
            style: 'danger',
          },
        ],
      },
    ],
  }),
  responseTimeout: 3600000, // 1 hour
  reminderInterval: 1800000, // 30 minutes
  handler: async (input, ctx) => {
    // Human worker handles UI and response
    return { approved: false }
  },
})
```

## Function Registry

All functions are automatically registered in a singleton registry:

```typescript
import { getRegistry, listFunctions } from 'functions.do'

// Get registry instance
const registry = getRegistry()

// List all functions
const allFunctions = listFunctions()

// Filter by type
const codeFunctions = listFunctions({ type: 'code' })

// Filter by tags
const publicFunctions = listFunctions({ tags: ['public'] })

// Get function stats
const stats = registry.getStats('fn_add_numbers')
console.log(stats.successRate) // 0.95
console.log(stats.avgDuration) // 150ms
```

## Execution

Execute functions with automatic retry, timeout, and validation:

```typescript
import { execute, executeByName } from 'functions.do'

// Execute by ID
const result = await execute('fn_add_numbers', { a: 5, b: 3 })

// Execute by name
const result = await executeByName('addNumbers', { a: 5, b: 3 })

// With options
const result = await execute(
  'fn_add_numbers',
  { a: 5, b: 3 },
  {
    timeout: 5000,
    retries: 3,
    context: {
      user: { id: 'user_123', email: 'user@example.com' },
      traceId: 'trace_abc',
    },
  }
)

// Check result
if (result.status === 'completed') {
  console.log(result.output)
} else {
  console.error(result.error)
}
```

## Configuration

Functions support rich metadata and configuration:

```typescript
defineCodeFunction({
  name: 'processOrder',
  displayName: 'Process Order',
  description: 'Process an e-commerce order',
  version: '2.0.0',
  tags: ['ecommerce', 'orders', 'public'],
  timeout: 10000,
  retries: 3,
  retryBackoff: 'exponential',
  permissions: ['orders:write', 'inventory:read'],
  cost: 10, // credits
  idempotent: true,
  deterministic: false,
  author: 'platform',
  input: OrderSchema,
  output: OrderResultSchema,
  handler: async (input, ctx) => {
    // Process order
  },
})
```

## Validation

Automatic input/output validation with Zod schemas:

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
})

const func = defineCodeFunction({
  name: 'createUser',
  input: UserSchema,
  output: z.object({ success: z.boolean(), userId: z.string() }),
  handler: async (input, ctx) => {
    // input is automatically validated against UserSchema
    // output will be validated before returning
    return { success: true, userId: input.id }
  },
})
```

## Context

Every function receives execution context:

```typescript
handler: async (input, ctx) => {
  // Execution metadata
  console.log(ctx.executionId)
  console.log(ctx.functionName)
  console.log(ctx.traceId)
  console.log(ctx.parentExecutionId)

  // User context
  console.log(ctx.user?.id)
  console.log(ctx.user?.email)
  console.log(ctx.user?.permissions)

  // Environment
  console.log(ctx.env) // Cloudflare bindings
  console.log(ctx.headers) // Request headers

  // Custom data
  console.log(ctx.custom)
}
```

## Type Safety

Full TypeScript support with generic types:

```typescript
interface AddInput {
  a: number
  b: number
}

type AddOutput = number

const addNumbers = defineCodeFunction<AddInput, AddOutput>({
  name: 'addNumbers',
  input: z.object({ a: z.number(), b: z.number() }),
  output: z.number(),
  handler: async (input, ctx) => {
    // input is typed as AddInput
    // return type must be AddOutput
    return input.a + input.b
  },
})
```

## Integration

Functions are the universal building block of the .do platform:

- **SDK** (`sdk.do`) - Call functions via TypeScript
- **API** (`api.do`) - HTTP REST API for functions
- **CLI** (`cli.do`) - Execute functions from terminal
- **MCP** (`mcp.do`) - Model Context Protocol access
- **RPC** - Service bindings for zero-latency calls
- **Workflows** (`workflows.do`) - Compose functions with durable execution

## Next Steps

- **Workflows** - Compose functions with durable execution via Cloudflare Workflows
- **Semantic API** - Fluent syntax like `db.forEach.Occupation.tasks(ifAICapableOfDelivering.generateService)`
- **Higher-Order Functions** - `compose()`, `parallel()`, `retry()`, `timeout()`, `when().then().else()`

## License

MIT
