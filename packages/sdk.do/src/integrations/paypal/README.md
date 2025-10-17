# PayPal Integration

Payment processing platform for online transactions

**Category**: payments
**Service**: Paypal
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/paypal](https://integrations.do/paypal)

## Installation

```bash
npm install @dotdo/integration-paypal
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-paypal
```

## Quick Start

```typescript
import { PaypalClient } from '@dotdo/integration-paypal'

// Initialize client
const client = new PaypalClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new PaypalClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Payment

Process payment transactions

#### `payment.create()`

```typescript
const result = await client.payment.create({
  intent: 'example', // Payment intent (CAPTURE or AUTHORIZE)
  purchase_units: [], // Purchase units with amount and breakdown
  payer: {}, // Payer information
})
```

#### `payment.get()`

```typescript
const result = await client.payment.get({
  payment_id: 'example', // Payment ID
})
```

#### `payment.capture()`

```typescript
const result = await client.payment.capture({
  authorization_id: 'example', // Authorization ID
  amount: {}, // Amount to capture
})
```

### Order

Create and manage orders

#### `order.create()`

```typescript
const result = await client.order.create({
  intent: 'example', // Order intent (CAPTURE, AUTHORIZE)
  purchase_units: [], // Purchase units
  payer: {}, // Payer details
})
```

#### `order.get()`

```typescript
const result = await client.order.get({
  order_id: 'example', // Order ID
})
```

#### `order.capture()`

```typescript
const result = await client.order.capture({
  order_id: 'example', // Order ID
})
```

#### `order.authorize()`

```typescript
const result = await client.order.authorize({
  order_id: 'example', // Order ID
})
```

### Refund

Issue refunds for captured payments

#### `refund.create()`

```typescript
const result = await client.refund.create({
  capture_id: 'example', // Capture ID
  amount: {}, // Refund amount
  note_to_payer: 'example', // Note to payer
})
```

#### `refund.get()`

```typescript
const result = await client.refund.get({
  refund_id: 'example', // Refund ID
})
```

### Subscription

Manage recurring subscriptions

#### `subscription.create()`

```typescript
const result = await client.subscription.create({
  plan_id: 'example', // Billing plan ID
  subscriber: {}, // Subscriber information
  application_context: {}, // Application context
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
  operations: [], // JSON Patch operations
})
```

#### `subscription.cancel()`

```typescript
const result = await client.subscription.cancel({
  subscription_id: 'example', // Subscription ID
  reason: 'example', // Cancellation reason
})
```

## Error Handling

All errors are thrown as `PaypalError` instances with additional metadata:

```typescript
try {
  const result = await client.payment.list()
} catch (error) {
  if (error instanceof PaypalError) {
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
import { PaypalWebhookHandler, WebhookEventRouter } from '@dotdo/integration-paypal'

// Initialize webhook handler
const handler = new PaypalWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onPaymentCaptureCompleted(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `PAYMENT.CAPTURE.COMPLETED` - Payment capture completed
- `PAYMENT.CAPTURE.DENIED` - Payment capture denied
- `PAYMENT.CAPTURE.REFUNDED` - Payment was refunded
- `CHECKOUT.ORDER.APPROVED` - Order was approved
- `CHECKOUT.ORDER.COMPLETED` - Order was completed
- `BILLING.SUBSCRIPTION.CREATED` - Subscription created
- `BILLING.SUBSCRIPTION.ACTIVATED` - Subscription activated
- `BILLING.SUBSCRIPTION.CANCELLED` - Subscription cancelled

## License

MIT
