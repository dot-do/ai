# Braintree Integration

Payment processing platform with fraud protection (PayPal owned)

**Category**: payments
**Service**: Braintree
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/braintree](https://integrations.do/braintree)

## Installation

```bash
npm install @dotdo/integration-braintree
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-braintree
```

## Quick Start

```typescript
import { BraintreeClient } from '@dotdo/integration-braintree'

// Initialize client
const client = new BraintreeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BraintreeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Transaction

Process payment transactions

#### `transaction.create()`

```typescript
const result = await client.transaction.create({
  amount: 'example', // Transaction amount
  payment_method_nonce: 'example', // Payment method nonce from client
  customer_id: 'example', // Customer ID
  options: {}, // Transaction options
})
```

#### `transaction.get()`

```typescript
const result = await client.transaction.get({
  transaction_id: 'example', // Transaction ID
})
```

#### `transaction.list()`

```typescript
const result = await client.transaction.list({
  query: {}, // Search criteria
})
```

#### `transaction.refund()`

```typescript
const result = await client.transaction.refund({
  transaction_id: 'example', // Transaction ID
  amount: 'example', // Refund amount
})
```

### Customer

Manage customer profiles

#### `customer.create()`

```typescript
const result = await client.customer.create({
  first_name: 'example', // Customer first name
  last_name: 'example', // Customer last name
  email: 'example', // Customer email
  phone: 'example', // Customer phone
})
```

#### `customer.get()`

```typescript
const result = await client.customer.get({
  customer_id: 'example', // Customer ID
})
```

#### `customer.update()`

```typescript
const result = await client.customer.update({
  customer_id: 'example', // Customer ID
  first_name: 'example', // Updated first name
  email: 'example', // Updated email
})
```

#### `customer.delete()`

```typescript
const result = await client.customer.delete({
  customer_id: 'example', // Customer ID
})
```

### Subscription

Manage recurring subscriptions

#### `subscription.create()`

```typescript
const result = await client.subscription.create({
  plan_id: 'example', // Subscription plan ID
  payment_method_token: 'example', // Payment method token
  price: 'example', // Subscription price
})
```

#### `subscription.get()`

```typescript
const result = await client.subscription.get({
  subscription_id: 'example', // Subscription ID
})
```

#### `subscription.update()`

```typescript
const result = await client.subscription.update({
  subscription_id: 'example', // Subscription ID
  price: 'example', // Updated price
})
```

#### `subscription.cancel()`

```typescript
const result = await client.subscription.cancel({
  subscription_id: 'example', // Subscription ID
})
```

### Plan

Manage subscription plans

#### `plan.list()`

```typescript
const result = await client.plan.list()
```

#### `plan.get()`

```typescript
const result = await client.plan.get({
  plan_id: 'example', // Plan ID
})
```

## Error Handling

All errors are thrown as `BraintreeError` instances with additional metadata:

```typescript
try {
  const result = await client.transaction.list()
} catch (error) {
  if (error instanceof BraintreeError) {
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
import { BraintreeWebhookHandler, WebhookEventRouter } from '@dotdo/integration-braintree'

// Initialize webhook handler
const handler = new BraintreeWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onSubscriptionChargedSuccessfully(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `subscription_charged_successfully` - Subscription charged successfully
- `subscription_charged_unsuccessfully` - Subscription charge failed
- `subscription_canceled` - Subscription was canceled
- `subscription_expired` - Subscription expired
- `subscription_went_active` - Subscription became active
- `subscription_went_past_due` - Subscription went past due
- `transaction_settled` - Transaction was settled
- `transaction_settlement_declined` - Transaction settlement declined

## License

MIT
