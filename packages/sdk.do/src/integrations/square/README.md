# Square Integration

Payment processing and POS platform for businesses

**Category**: payments
**Service**: Square
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/square](https://integrations.do/square)

## Installation

```bash
npm install @dotdo/integration-square
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-square
```

## Quick Start

```typescript
import { SquareClient } from '@dotdo/integration-square'

// Initialize client
const client = new SquareClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SquareClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Payment

Process payment transactions

#### `payment.create()`

```typescript
const result = await client.payment.create({
  source_id: 'example', // Payment source ID (card nonce)
  idempotency_key: 'example', // Unique idempotency key
  amount_money: {}, // Amount with currency
  customer_id: 'example', // Customer ID
  location_id: 'example', // Location ID
  reference_id: 'example', // Reference ID
  note: 'example', // Payment note
})
```

#### `payment.get()`

```typescript
const result = await client.payment.get({
  payment_id: 'example', // Payment ID
})
```

#### `payment.list()`

```typescript
const result = await client.payment.list({
  begin_time: 'example', // Start time (RFC 3339)
  end_time: 'example', // End time (RFC 3339)
  location_id: 'example', // Filter by location
})
```

#### `payment.cancel()`

```typescript
const result = await client.payment.cancel({
  payment_id: 'example', // Payment ID
})
```

### Customer

Manage customer profiles

#### `customer.create()`

```typescript
const result = await client.customer.create({
  given_name: 'example', // Customer first name
  family_name: 'example', // Customer last name
  email_address: 'example', // Customer email
  phone_number: 'example', // Customer phone
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
  given_name: 'example', // Updated first name
  email_address: 'example', // Updated email
})
```

#### `customer.delete()`

```typescript
const result = await client.customer.delete({
  customer_id: 'example', // Customer ID
})
```

#### `customer.list()`

```typescript
const result = await client.customer.list({
  limit: 123, // Results per page
})
```

### Order

Create and manage orders

#### `order.create()`

```typescript
const result = await client.order.create({
  location_id: 'example', // Location ID
  line_items: [], // Order line items
  customer_id: 'example', // Customer ID
})
```

#### `order.get()`

```typescript
const result = await client.order.get({
  order_id: 'example', // Order ID
})
```

#### `order.update()`

```typescript
const result = await client.order.update({
  order_id: 'example', // Order ID
  order: {}, // Updated order data
})
```

#### `order.list()`

```typescript
const result = await client.order.list({
  location_ids: [], // Location IDs to search
  limit: 123, // Results per page
})
```

### Invoice

Create and manage invoices

#### `invoice.create()`

```typescript
const result = await client.invoice.create({
  invoice: {}, // Invoice data
  idempotency_key: 'example', // Unique idempotency key
})
```

#### `invoice.get()`

```typescript
const result = await client.invoice.get({
  invoice_id: 'example', // Invoice ID
})
```

#### `invoice.update()`

```typescript
const result = await client.invoice.update({
  invoice_id: 'example', // Invoice ID
  invoice: {}, // Updated invoice data
})
```

#### `invoice.delete()`

```typescript
const result = await client.invoice.delete({
  invoice_id: 'example', // Invoice ID
})
```

#### `invoice.list()`

```typescript
const result = await client.invoice.list({
  location_id: 'example', // Location ID
  limit: 123, // Results per page
})
```

## Error Handling

All errors are thrown as `SquareError` instances with additional metadata:

```typescript
try {
  const result = await client.payment.list()
} catch (error) {
  if (error instanceof SquareError) {
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
import { SquareWebhookHandler, WebhookEventRouter } from '@dotdo/integration-square'

// Initialize webhook handler
const handler = new SquareWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onPaymentCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `payment.created` - Payment was created
- `payment.updated` - Payment was updated
- `order.created` - Order was created
- `order.updated` - Order was updated
- `customer.created` - Customer was created
- `customer.updated` - Customer was updated
- `invoice.published` - Invoice was published
- `invoice.payment_made` - Invoice payment was made

## License

MIT
