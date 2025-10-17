# ai-workflows

Declarative workflow definitions with MDXLD and semantic triggers for building AI-native workflows.

## Overview

`ai-workflows` provides a semantic, declarative API for defining workflows using:

- **Event triggers**: `on.Object.action()` syntax for semantic event patterns
- **Schedule triggers**: `every()` syntax for cron or semantic intervals
- **Type-safe workflows**: Full TypeScript support with generics

## Installation

```bash
pnpm add ai-workflows
```

## Core Concepts

### Event Triggers (`on.Object.action()`)

Use the `on` proxy to create event triggers with semantic patterns:

```typescript
import { on } from 'ai-workflows'

// Trigger when an order is created
on.Order.created(($) => ({
  filter: $.total > 100,
  context: { orderId: $.id, customerId: $.customer.id },
}))

// Trigger when a payment is completed
on.Payment.completed(($) => ({
  filter: $.status === 'succeeded',
  context: { paymentId: $.id, amount: $.amount },
}))
```

### Schedule Triggers (`every()`)

Use the `every()` function for time-based triggers:

```typescript
import { every } from 'ai-workflows'

// Cron expression - every 4 hours
every('0 */4 * * *')

// Semantic intervals
every('$.Hourly')
every('$.Daily')
every('$.Weekly', { day: 'monday', time: '09:00' })
```

### Workflow Definition

Combine triggers with execution logic:

```typescript
import { workflow, on, every } from 'ai-workflows'

export default workflow({
  name: 'Order Fulfillment',
  triggers: [
    on.Order.created(($) => ({
      filter: $.total > 100,
      context: { orderId: $.id },
    })),
    every('0 */4 * * *'),
  ],
  async execute({ trigger, context, $ }) {
    if (trigger.type === 'event') {
      await $.Order.fulfill({ id: context.orderId })
    }
  },
})
```

## License

MIT
