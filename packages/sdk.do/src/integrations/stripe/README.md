# Stripe Integration

Payment processing for internet businesses

**Category**: payments
**Service**: Stripe
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/stripe](https://integrations.do/stripe)

## Installation

```bash
npm install @dotdo/integration-stripe
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-stripe
```

## Quick Start

```typescript
import { StripeClient } from '@dotdo/integration-stripe'

// Initialize client
const client = new StripeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new StripeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Customer

#### `customer.create()`

```typescript
const result = await client.customer.create({
  params: value, // Customer creation parameters
})
```

#### `customer.get()`

```typescript
const result = await client.customer.get({
  id: 'example', // Customer ID
})
```

#### `customer.update()`

```typescript
const result = await client.customer.update({
  id: 'example', // Customer ID
  params: value, // Update parameters
})
```

#### `customer.delete()`

```typescript
const result = await client.customer.delete({
  id: 'example', // Customer ID
})
```

#### `customer.list()`

```typescript
const result = await client.customer.list({
  params: value, // List parameters
})
```

### PaymentIntent

#### `paymentIntent.create()`

```typescript
const result = await client.paymentIntent.create({
  params: value, // Payment intent creation parameters (amount, currency, etc.)
})
```

#### `paymentIntent.get()`

```typescript
const result = await client.paymentIntent.get({
  id: 'example', // Payment intent ID
})
```

#### `paymentIntent.update()`

```typescript
const result = await client.paymentIntent.update({
  id: 'example', // Payment intent ID
  params: value, // Update parameters
})
```

#### `paymentIntent.confirm()`

```typescript
const result = await client.paymentIntent.confirm({
  id: 'example', // Payment intent ID
  params: value, // Confirmation parameters
})
```

#### `paymentIntent.cancel()`

```typescript
const result = await client.paymentIntent.cancel({
  id: 'example', // Payment intent ID
})
```

#### `paymentIntent.list()`

```typescript
const result = await client.paymentIntent.list({
  params: value, // List parameters
})
```

### Subscription

#### `subscription.create()`

```typescript
const result = await client.subscription.create({
  params: value, // Subscription creation parameters
})
```

#### `subscription.get()`

```typescript
const result = await client.subscription.get({
  id: 'example', // Subscription ID
})
```

#### `subscription.update()`

```typescript
const result = await client.subscription.update({
  id: 'example', // Subscription ID
  params: value, // Update parameters
})
```

#### `subscription.cancel()`

```typescript
const result = await client.subscription.cancel({
  id: 'example', // Subscription ID
})
```

#### `subscription.list()`

```typescript
const result = await client.subscription.list({
  params: value, // List parameters
})
```

### Charge

#### `charge.create()`

```typescript
const result = await client.charge.create({
  params: value, // Charge creation parameters
})
```

#### `charge.get()`

```typescript
const result = await client.charge.get({
  id: 'example', // Charge ID
})
```

#### `charge.list()`

```typescript
const result = await client.charge.list({
  params: value, // List parameters
})
```

## Error Handling

All errors are thrown as `StripeError` instances with additional metadata:

```typescript
try {
  const result = await client.customer.list()
} catch (error) {
  if (error instanceof StripeError) {
    console.error('Error type:', error.type)
    console.error('Error code:', error.code)
    console.error('Status code:', error.statusCode)
    console.error('Retryable:', error.isRetriable())
  }
}
```

**Error Types:**

- `authentication` - Authentication failed
- `authorization` - Insufficient permissions
- `validation` - Invalid parameters
- `not_found` - Resource not found
- `rate_limit` - Rate limit exceeded
- `server` - Server error
- `network` - Network error
- `unknown` - Unknown error

## Webhooks

This Integration supports webhooks for real-time event notifications.

```typescript
import { StripeWebhookHandler, WebhookEventRouter } from '@dotdo/integration-stripe'

// Initialize webhook handler
const handler = new StripeWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onCustomerCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `customer.created` - Occurs when a new customer is created
- `customer.updated` - Occurs when a customer is updated
- `customer.deleted` - Occurs when a customer is deleted
- `payment_intent.created` - Occurs when a payment intent is created
- `payment_intent.succeeded` - Occurs when a payment intent succeeds
- `payment_intent.payment_failed` - Occurs when a payment intent fails
- `payment_intent.canceled` - Occurs when a payment intent is canceled
- `charge.succeeded` - Occurs when a charge succeeds
- `charge.failed` - Occurs when a charge fails
- `charge.refunded` - Occurs when a charge is refunded
- `subscription.created` - Occurs when a subscription is created
- `subscription.updated` - Occurs when a subscription is updated
- `subscription.deleted` - Occurs when a subscription is deleted

## License

MIT
