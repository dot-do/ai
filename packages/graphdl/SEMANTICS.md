# Semantic Versioning: Verb Tenses & Naming Conventions

This document describes the semantic patterns implemented in graphdl for consistent naming across the `.do` platform.

## Overview

The semantic patterns provide a consistent way to work with collections, items, actions, activities, and events using natural language patterns that align with Business-as-Code principles.

## Patterns

| Pattern         | Form               | Example                               | Usage                          |
| --------------- | ------------------ | ------------------------------------- | ------------------------------ |
| **Collections** | Plural noun        | `$.Orders`, `$.Customers`             | Multiple items, lists          |
| **Items**       | Singular noun      | `$.Order`, `$.Customer`               | Single entity, type definition |
| **Actions**     | Infinitive verb    | `$.Order.create`, `$.Email.send`      | Functions to execute           |
| **Activities**  | Present continuous | `$.Order.creating`, `$.Email.sending` | Ongoing processes              |
| **Events**      | Past tense         | `$.Order.created`, `$.Email.sent`     | Completed actions              |

## Type Definitions

### Collection<T>

Represents multiple items of the same type.

```typescript
import { Collection } from 'graphdl/types'

// Type definition
type Orders = Collection<Order>

// Usage
const orders: Orders = [
  { id: '1', total: 100 },
  { id: '2', total: 200 },
]
```

### Item<T>

Represents a single entity of a type.

```typescript
import { Item } from 'graphdl/types'

// Type definition
type Order = Item<{
  id: string
  total: number
  customer: string
}>

// Usage
const order: Order = { id: '1', total: 100, customer: 'John' }
```

### Action<TInput, TOutput>

Represents a function that performs an action and returns a promise.

```typescript
import { Action } from 'graphdl/types'

// Type definition
type CreateOrder = Action<OrderInput, Order>

// Implementation
const createOrder: CreateOrder = async (input) => {
  // Perform order creation
  return order
}

// Usage
await createOrder({ customer: 'John', total: 100 })
```

### Activity<T>

Represents an ongoing process with state tracking. Activities can be in one of five states: `pending`, `in_progress`, `completed`, `failed`, or `cancelled`.

```typescript
import { Activity, ActivityState } from 'graphdl/types'

// Type definition
type OrderCreating = Activity<Order>

// Usage - in progress
const activity: OrderCreating = {
  state: 'in_progress',
  data: { id: '1', total: 100, customer: 'John' },
  startedAt: '2025-10-09T12:00:00Z',
  progress: 0.5,
}

// Usage - completed
const completedActivity: OrderCreating = {
  state: 'completed',
  data: { id: '1', total: 100, customer: 'John' },
  startedAt: '2025-10-09T12:00:00Z',
  completedAt: '2025-10-09T12:05:00Z',
  progress: 1.0,
}

// Usage - failed
const failedActivity: OrderCreating = {
  state: 'failed',
  data: { id: '1', total: 100, customer: 'John' },
  startedAt: '2025-10-09T12:00:00Z',
  completedAt: '2025-10-09T12:02:00Z',
  error: 'Payment processing failed',
}
```

### Event<T>

Represents a completed action with timestamp and metadata.

```typescript
import { Event } from 'graphdl/types'

// Type definition
type OrderCreated = Event<Order>

// Usage
const event: OrderCreated = {
  timestamp: '2025-10-09T12:00:00Z',
  data: { id: '1', total: 100, customer: 'John' },
  metadata: {
    source: 'api',
    userId: 'user123',
  },
}
```

## Naming Helpers

The package provides helper functions to convert between different forms:

### toPlural(word: string): string

Converts a singular word to its plural form, handling irregular plurals and common English rules.

```typescript
import { toPlural } from 'graphdl/types'

toPlural('order') // 'orders'
toPlural('person') // 'people'
toPlural('category') // 'categories'
toPlural('box') // 'boxes'
```

**Supports:**

- Regular plurals (add 's')
- Irregular plurals (person → people, child → children)
- Words ending in 'y' (category → categories)
- Words ending in 's', 'ss', 'sh', 'ch', 'x', 'z' (add 'es')
- Words ending in 'f' or 'fe' (knife → knives)
- Words ending in 'o' (hero → heroes)
- Case preservation (Order → Orders, ORDER → ORDERS)

### toAction(verb: string): string

Returns the verb in infinitive/base form (already in action form).

```typescript
import { toAction } from 'graphdl/types'

toAction('create') // 'create'
toAction('send') // 'send'
toAction('update') // 'update'
```

### toActivity(verb: string): string

Converts a verb to present continuous form (adds 'ing').

```typescript
import { toActivity } from 'graphdl/types'

toActivity('create') // 'creating'
toActivity('send') // 'sending'
toActivity('run') // 'running'
toActivity('update') // 'updating'
```

**Handles:**

- Regular verbs (add 'ing')
- Verbs ending in 'e' (create → creating)
- CVC pattern doubling (run → running)
- Verbs ending in 'ie' (lie → lying)

### toEvent(verb: string): string

Converts a verb to past tense.

```typescript
import { toEvent } from 'graphdl/types'

toEvent('create') // 'created'
toEvent('send') // 'sent' (irregular)
toEvent('update') // 'updated'
toEvent('run') // 'ran' (irregular)
```

**Handles:**

- Regular verbs (add 'ed')
- Irregular past tense (send → sent, make → made)
- Verbs ending in 'y' (apply → applied)
- CVC pattern doubling (stop → stopped)
- Case preservation (Create → Created, SEND → SENT)

## Usage Examples

### Building Semantic APIs

```typescript
import { Action, Event, toEvent } from 'graphdl/types'

// Define actions
type CreateOrder = Action<OrderInput, Order>
type SendEmail = Action<EmailInput, void>

// Define events
type OrderCreated = Event<Order>
type EmailSent = Event<{ to: string; subject: string }>

// Use naming helpers to derive event names
const actionVerb = 'create'
const eventName = toEvent(actionVerb) // 'created'

// Build semantic event patterns
const eventType = `$.Order.${eventName}` // '$.Order.created'
```

### Working with Collections

```typescript
import { Collection, Item, toPlural } from 'graphdl/types'

// Define item type
interface Customer {
  id: string
  name: string
  email: string
}

// Define collection
type Customers = Collection<Customer>

// Use naming helper
const itemName = 'Customer'
const collectionName = toPlural(itemName) // 'Customers'

// Access in semantic pattern
const items = $.Customers // Collection<Customer>
const item = $.Customer // Item<Customer>
```

### Tracking Activities

```typescript
import { Activity, toActivity } from 'graphdl/types'

// Define activity type
type OrderProcessing = Activity<Order>

// Use naming helper
const actionVerb = 'process'
const activityName = toActivity(actionVerb) // 'processing'

// Track activity state
const activity: OrderProcessing = {
  state: 'in_progress',
  data: order,
  startedAt: new Date().toISOString(),
  progress: 0.75,
}
```

## Integration with SDK

These patterns integrate with the `sdk.do` semantic proxy:

```typescript
// Collections (plural)
const orders = await $.db.list('Orders')

// Items (singular)
const order = await $.db.get('Order', '123')

// Actions (infinitive)
await $.Order.create({ customer: 'John', total: 100 })

// Events (past tense)
$.on('$.Order.created', async (event) => {
  console.log('Order created:', event.data)
})

// Activities (present continuous)
await $.send('$.Order.processing', { order, progress: 0.5 })
```

## Best Practices

1. **Use consistent patterns**: Always use plural for collections, singular for items, infinitive for actions, present continuous for activities, and past tense for events.

2. **Leverage naming helpers**: Use `toPlural()`, `toActivity()`, and `toEvent()` to derive consistent names programmatically.

3. **Type safety**: Use TypeScript types (`Collection<T>`, `Action<TInput, TOutput>`, etc.) for compile-time safety.

4. **Semantic clarity**: Choose verb and noun combinations that clearly express intent:
   - `$.Order.create` (action to perform)
   - `$.Order.creating` (process happening now)
   - `$.Order.created` (event that occurred)

5. **Natural language alignment**: The patterns follow natural English grammar, making code intuitive and readable.

## Testing

Run tests for the naming helpers:

```bash
cd ai/packages/graphdl
pnpm test
```

## Related Documentation

- [GraphDL Package](./README.md)
- [Business-as-Code Patterns](../business-as-code/README.md)
- [SDK Documentation](../../../docs/sdk.md)
