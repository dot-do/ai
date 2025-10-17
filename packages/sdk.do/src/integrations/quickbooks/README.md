# QuickBooks Integration

Accounting software for small business financial management

**Category**: accounting
**Service**: Quickbooks
**Base URL**: https://quickbooks.api.intuit.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/quickbooks](https://integrations.do/quickbooks)

## Installation

```bash
npm install @dotdo/integration-quickbooks
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-quickbooks
```

## Quick Start

```typescript
import { QuickbooksClient } from '@dotdo/integration-quickbooks'

// Initialize client
const client = new QuickbooksClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new QuickbooksClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Invoice

Sales forms for customer payments

#### `invoice.create()`

```typescript
const result = await client.invoice.create({
  realmId: 'example', // Company realm ID
  Line: [], // Invoice line items
  CustomerRef: {}, // Customer reference
  DueDate: 'example', // Due date (YYYY-MM-DD)
})
```

#### `invoice.get()`

```typescript
const result = await client.invoice.get({
  realmId: 'example', // Company realm ID
  invoice_id: 'example', // Invoice ID
})
```

#### `invoice.update()`

```typescript
const result = await client.invoice.update({
  realmId: 'example', // Company realm ID
  Id: 'example', // Invoice ID
  SyncToken: 'example', // Sync token for optimistic locking
  sparse: true, // Partial update if true
})
```

#### `invoice.delete()`

```typescript
const result = await client.invoice.delete({
  realmId: 'example', // Company realm ID
  Id: 'example', // Invoice ID
  SyncToken: 'example', // Sync token
})
```

#### `invoice.list()`

```typescript
const result = await client.invoice.list({
  realmId: 'example', // Company realm ID
  query: 'example', // SQL-like query (e.g., "SELECT * FROM Invoice")
})
```

### Customer

Consumers of services or products

#### `customer.create()`

```typescript
const result = await client.customer.create({
  realmId: 'example', // Company realm ID
  DisplayName: 'example', // Display name
  GivenName: 'example', // First name
  FamilyName: 'example', // Last name
  PrimaryEmailAddr: {}, // Email address
})
```

#### `customer.get()`

```typescript
const result = await client.customer.get({
  realmId: 'example', // Company realm ID
  customer_id: 'example', // Customer ID
})
```

#### `customer.update()`

```typescript
const result = await client.customer.update({
  realmId: 'example', // Company realm ID
  Id: 'example', // Customer ID
  SyncToken: 'example', // Sync token
  sparse: true, // Partial update if true
})
```

#### `customer.list()`

```typescript
const result = await client.customer.list({
  realmId: 'example', // Company realm ID
  query: 'example', // SQL-like query (e.g., "SELECT * FROM Customer")
})
```

### Payment

Payment transactions from customers

#### `payment.create()`

```typescript
const result = await client.payment.create({
  realmId: 'example', // Company realm ID
  TotalAmt: 123, // Total payment amount
  CustomerRef: {}, // Customer reference
  Line: [], // Payment line items (invoice links)
})
```

#### `payment.get()`

```typescript
const result = await client.payment.get({
  realmId: 'example', // Company realm ID
  payment_id: 'example', // Payment ID
})
```

#### `payment.update()`

```typescript
const result = await client.payment.update({
  realmId: 'example', // Company realm ID
  Id: 'example', // Payment ID
  SyncToken: 'example', // Sync token
})
```

#### `payment.list()`

```typescript
const result = await client.payment.list({
  realmId: 'example', // Company realm ID
  query: 'example', // SQL-like query (e.g., "SELECT * FROM Payment")
})
```

### Expense

Expense transactions and purchases

#### `expense.create()`

```typescript
const result = await client.expense.create({
  realmId: 'example', // Company realm ID
  PaymentType: 'example', // Payment type (Cash, Check, CreditCard)
  AccountRef: {}, // Account reference
  Line: [], // Expense line items
})
```

#### `expense.get()`

```typescript
const result = await client.expense.get({
  realmId: 'example', // Company realm ID
  expense_id: 'example', // Expense ID
})
```

#### `expense.update()`

```typescript
const result = await client.expense.update({
  realmId: 'example', // Company realm ID
  Id: 'example', // Expense ID
  SyncToken: 'example', // Sync token
})
```

#### `expense.list()`

```typescript
const result = await client.expense.list({
  realmId: 'example', // Company realm ID
  query: 'example', // SQL-like query (e.g., "SELECT * FROM Purchase")
})
```

## Error Handling

All errors are thrown as `QuickbooksError` instances with additional metadata:

```typescript
try {
  const result = await client.invoice.list()
} catch (error) {
  if (error instanceof QuickbooksError) {
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
import { QuickbooksWebhookHandler, WebhookEventRouter } from '@dotdo/integration-quickbooks'

// Initialize webhook handler
const handler = new QuickbooksWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onCustomerCreate(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `Customer.Create` - Customer was created
- `Customer.Update` - Customer was updated
- `Customer.Delete` - Customer was deleted
- `Invoice.Create` - Invoice was created
- `Invoice.Update` - Invoice was updated
- `Invoice.Delete` - Invoice was deleted
- `Payment.Create` - Payment was created
- `Payment.Update` - Payment was updated
- `Payment.Delete` - Payment was deleted

## License

MIT
