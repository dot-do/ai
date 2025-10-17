# functions.do SDK

**Universal function abstraction for the `.do` platform** - Everything is a Function.

## Overview

The `functions.do` SDK provides a unified API for defining and executing four types of functions:

1. **Code Functions** - Pure computation and logic
2. **Generative Functions** - AI-powered generation with LLMs
3. **Agentic Functions** - Multi-step reasoning with tools
4. **Human Functions** - Human-in-the-loop interactions

## Philosophy

> **Everything is a Function** - The universal abstraction for Business-as-Code

All work in the `.do` platform is modeled as functions with typed inputs and outputs. This enables:

- **Composability** - Functions can call other functions
- **Observability** - All executions are tracked and logged
- **Type Safety** - Input/output schemas enforced with Zod
- **Semantic Routing** - Functions selected by intent, not name

## Installation

```bash
npm install functions.do
# or
pnpm add functions.do
```

## Quick Start

### Code Function

```typescript
import { defineCodeFunction } from 'functions.do'
import { z } from 'zod'

const calculateTotal = defineCodeFunction({
  name: 'calculateTotal',
  description: 'Calculate order total with tax and shipping',
  inputSchema: z.object({
    items: z.array(
      z.object({
        price: z.number(),
        quantity: z.number(),
      })
    ),
    taxRate: z.number(),
    shippingCost: z.number(),
  }),
  outputSchema: z.object({
    subtotal: z.number(),
    tax: z.number(),
    shipping: z.number(),
    total: z.number(),
  }),
  handler: async (input) => {
    const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * input.taxRate
    const total = subtotal + tax + input.shippingCost

    return {
      subtotal,
      tax,
      shipping: input.shippingCost,
      total,
    }
  },
})

// Execute
const result = await calculateTotal.execute({
  items: [
    { price: 29.99, quantity: 2 },
    { price: 49.99, quantity: 1 },
  ],
  taxRate: 0.08,
  shippingCost: 5.99,
})

console.log(result.total) // 125.05
```

### Generative Function

```typescript
import { defineGenerativeFunction } from 'functions.do'
import { z } from 'zod'

const generateProductDescription = defineGenerativeFunction({
  name: 'generateProductDescription',
  description: 'Generate compelling product descriptions',
  inputSchema: z.object({
    productName: z.string(),
    features: z.array(z.string()),
    targetAudience: z.string(),
  }),
  outputSchema: z.object({
    description: z.string(),
    tagline: z.string(),
    keywords: z.array(z.string()),
  }),
  model: 'gpt-5',
  systemPrompt: 'You are an expert copywriter specializing in product descriptions.',
  userPrompt: (input) => `
    Create a compelling product description for:

    Product: ${input.productName}
    Features: ${input.features.join(', ')}
    Target Audience: ${input.targetAudience}

    Include a catchy tagline and relevant SEO keywords.
  `,
  temperature: 0.7,
})

// Execute
const result = await generateProductDescription.execute({
  productName: 'CloudSync Pro',
  features: ['Real-time sync', '256-bit encryption', 'Unlimited storage'],
  targetAudience: 'Small businesses and freelancers',
})

console.log(result.description)
console.log(result.tagline)
```

### Agentic Function

```typescript
import { defineAgenticFunction } from 'functions.do'
import { z } from 'zod'

const researchCompetitor = defineAgenticFunction({
  name: 'researchCompetitor',
  description: 'Research competitor products and pricing',
  inputSchema: z.object({
    companyName: z.string(),
    industry: z.string(),
  }),
  outputSchema: z.object({
    products: z.array(
      z.object({
        name: z.string(),
        price: z.number(),
        features: z.array(z.string()),
      })
    ),
    marketPosition: z.string(),
    insights: z.array(z.string()),
  }),
  agent: {
    model: 'gpt-5',
    tools: ['web_search', 'scrape_website', 'analyze_content'],
    maxSteps: 10,
    instructions: `
      Research the competitor thoroughly:
      1. Search for their website and products
      2. Extract pricing and feature information
      3. Analyze their market positioning
      4. Provide actionable insights
    `,
  },
})

// Execute
const result = await researchCompetitor.execute({
  companyName: 'Acme Corp',
  industry: 'SaaS',
})

console.log(result.products)
console.log(result.insights)
```

### Human Function

```typescript
import { defineHumanFunction } from 'functions.do'
import { z } from 'zod'

const approveExpense = defineHumanFunction({
  name: 'approveExpense',
  description: 'Request approval for expense report',
  inputSchema: z.object({
    employeeName: z.string(),
    amount: z.number(),
    category: z.string(),
    receipt: z.string().url(),
    justification: z.string(),
  }),
  outputSchema: z.object({
    approved: z.boolean(),
    comments: z.string().optional(),
    approverName: z.string(),
  }),
  uiType: 'slack',
  channel: 'expense-approvals',
  timeout: 86400000, // 24 hours
  reminderInterval: 3600000, // 1 hour
})

// Execute (waits for human response)
const result = await approveExpense.execute({
  employeeName: 'Alice Johnson',
  amount: 450.0,
  category: 'Travel',
  receipt: 'https://receipts.example.com/12345',
  justification: 'Client meeting in San Francisco',
})

if (result.approved) {
  console.log(`Expense approved by ${result.approverName}`)
} else {
  console.log(`Expense rejected: ${result.comments}`)
}
```

## Function Types

### Code Functions

Pure computational functions with deterministic output.

**Use Cases**:

- Data transformation
- Calculations
- Validation
- Business logic

**Features**:

- Fast execution
- Deterministic
- No external dependencies
- Easy to test

### Generative Functions

AI-powered generation using Large Language Models.

**Use Cases**:

- Content generation
- Text transformation
- Summarization
- Classification

**Features**:

- Powered by GPT-5, Claude, or other LLMs
- Template-based prompts
- Few-shot learning
- Structured output

### Agentic Functions

Multi-step AI reasoning with tool use.

**Use Cases**:

- Research tasks
- Data collection
- Multi-step workflows
- Complex decision-making

**Features**:

- Autonomous tool use
- Multi-step reasoning
- Web search and scraping
- Self-correction

### Human Functions

Human-in-the-loop interactions with automatic reminders.

**Use Cases**:

- Approvals and reviews
- Feedback collection
- Manual verification
- Expert input

**Features**:

- Multi-platform (Slack, Discord, Teams, Web, Email)
- Automatic reminders
- Timeout handling
- Webhook callbacks

**Platforms**:

- ✅ **Slack** - BlockKit messages with interactive components
- ✅ **Discord** - Rich embeds with button components
- ✅ **Microsoft Teams** - Adaptive Cards v1.5
- ✅ **Web UI** - HTML5 forms with modern styling
- ✅ **Email** - Beautiful HTML emails via Resend

See [Human Functions Documentation](../../docs/api-reference/human-functions.mdx) for details.

## Function Composition

Functions can call other functions, enabling complex workflows:

```typescript
import { defineWorkflow } from 'functions.do'

const processOrder = defineWorkflow({
  name: 'processOrder',
  description: 'Complete order processing workflow',
  steps: [
    calculateTotal, // Code function
    generateProductDescription, // Generative function
    approveExpense, // Human function
    researchCompetitor, // Agentic function
  ],
})

const result = await processOrder.execute({
  /* input */
})
```

## Function Registry

All functions are automatically registered and discoverable:

```typescript
import { FunctionRegistry } from 'functions.do'

// List all functions
const functions = FunctionRegistry.list()

// Get function by name
const fn = FunctionRegistry.get('calculateTotal')

// Search by tag
const approvalFunctions = FunctionRegistry.search({
  tags: ['approval'],
})

// Get execution stats
const stats = FunctionRegistry.stats('calculateTotal')
console.log(stats.executions)
console.log(stats.avgDuration)
```

## Semantic Function Selection

Use natural language to select functions:

```typescript
import { selectFunction } from 'functions.do'

// Semantic search
const fn = await selectFunction('I need to calculate the total cost of an order including tax and shipping')

// Execute selected function
const result = await fn.execute({
  /* input */
})
```

## Execution Context

All functions receive execution context:

```typescript
const myFunction = defineCodeFunction({
  name: 'myFunction',
  handler: async (input, ctx) => {
    console.log(ctx.executionId)
    console.log(ctx.user)
    console.log(ctx.traceId)
    console.log(ctx.env)

    // Use context for logging, auth, etc.
    return {
      /* output */
    }
  },
})
```

## Error Handling

Functions support automatic retries and error handling:

```typescript
const reliableFunction = defineCodeFunction({
  name: 'reliableFunction',
  metadata: {
    retries: 3,
    retryBackoff: 'exponential',
    timeout: 30000,
  },
  handler: async (input) => {
    // Function logic that may fail
  },
})
```

## Type Safety

All functions are strongly typed with Zod schemas:

```typescript
// Input validation
const result = await myFunction.execute(input)
// TypeScript knows the exact type of result

// Invalid input throws validation error
await myFunction.execute({ invalid: 'data' })
// ❌ Validation error: ...
```

## Testing

Functions are easy to test:

```typescript
import { describe, it, expect } from 'vitest'

describe('calculateTotal', () => {
  it('calculates total correctly', async () => {
    const result = await calculateTotal.execute({
      items: [{ price: 10, quantity: 2 }],
      taxRate: 0.1,
      shippingCost: 5,
    })

    expect(result.total).toBe(27) // 20 + 2 + 5
  })
})
```

## API Reference

### `defineCodeFunction<TInput, TOutput>(options)`

Define a pure code function.

**Options**:

- `name` - Unique function name
- `description` - Function description
- `inputSchema` - Zod schema for input
- `outputSchema` - Zod schema for output
- `handler` - Function implementation
- `metadata` - Optional metadata (timeout, retries, etc.)

### `defineGenerativeFunction<TInput, TOutput>(options)`

Define an AI-powered generative function.

**Options**:

- All Code Function options, plus:
- `model` - LLM model to use ('gpt-5', 'claude-sonnet-4.5', etc.)
- `systemPrompt` - System prompt template
- `userPrompt` - User prompt template or function
- `temperature` - Generation temperature (0-2)
- `maxTokens` - Maximum tokens to generate
- `examples` - Few-shot examples

### `defineAgenticFunction<TInput, TOutput>(options)`

Define a multi-step agentic function.

**Options**:

- All Code Function options, plus:
- `agent.model` - Agent model
- `agent.tools` - Available tools
- `agent.maxSteps` - Maximum reasoning steps
- `agent.instructions` - Agent instructions

### `defineHumanFunction<TInput, TOutput>(options)`

Define a human-in-the-loop function.

**Options**:

- All Code Function options, plus:
- `uiType` - Platform ('slack', 'discord', 'teams', 'web')
- `timeout` - Response timeout in milliseconds
- `reminderInterval` - Reminder interval in milliseconds
- Platform-specific options (channel, webhookUrl, etc.)

See [Human Functions Documentation](../../docs/api-reference/human-functions.mdx) for complete details.

## Related Documentation

- **Human Functions**: [ai/docs/api-reference/human-functions.mdx](../../docs/api-reference/human-functions.mdx)
- **Package**: [ai/packages/functions.do](../../packages/functions.do)
- **Human-in-the-Loop Package**: [ai/packages/human-in-the-loop](../../packages/human-in-the-loop)
- **Worker Implementation**: [workers/human](../../../workers/human)

## Support

- **Documentation**: [docs.do](https://docs.do)
- **GitHub**: [github.com/dot-do/platform](https://github.com/dot-do/platform)
- **Community**: [community.do](https://community.do)
