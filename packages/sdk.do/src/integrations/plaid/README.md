# Plaid Integration

Banking data platform for account linking and transaction data

**Category**: payments
**Service**: Plaid
**Base URL**: undefined

This Integration is auto-generated from MDXLD definition: [https://integrations.do/plaid](https://integrations.do/plaid)

## Installation

```bash
npm install @dotdo/integration-plaid
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-plaid
```

## Quick Start

```typescript
import { PlaidClient } from '@dotdo/integration-plaid'

// Initialize client
const client = new PlaidClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PlaidClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Account

Retrieve bank account information

#### `account.list()`

```typescript
const result = await client.account.list({
  access_token: 'example', // Access token for bank account
})
```

#### `account.balance()`

```typescript
const result = await client.account.balance({
  access_token: 'example', // Access token
})
```

### Transaction

Retrieve transaction history

#### `transaction.list()`

```typescript
const result = await client.transaction.list({
  access_token: 'example', // Access token
  start_date: 'example', // Start date (YYYY-MM-DD)
  end_date: 'example', // End date (YYYY-MM-DD)
})
```

#### `transaction.sync()`

```typescript
const result = await client.transaction.sync({
  access_token: 'example', // Access token
  cursor: 'example', // Cursor for pagination
})
```

### Balance

Get real-time balance information

#### `balance.get()`

```typescript
const result = await client.balance.get({
  access_token: 'example', // Access token
})
```

### Identity

Retrieve identity information

#### `identity.get()`

```typescript
const result = await client.identity.get({
  access_token: 'example', // Access token
})
```

## Error Handling

All errors are thrown as `PlaidError` instances with additional metadata:

```typescript
try {
  const result = await client.account.list()
} catch (error) {
  if (error instanceof PlaidError) {
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
import { PlaidWebhookHandler, WebhookEventRouter } from '@dotdo/integration-plaid'

// Initialize webhook handler
const handler = new PlaidWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onTransactionsDefaultUpdate(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `TRANSACTIONS_DEFAULT_UPDATE` - New transaction data available
- `TRANSACTIONS_REMOVED` - Transactions removed
- `ITEM_ERROR` - Item encountered an error
- `ITEM_LOGIN_REQUIRED` - Item requires user login
- `ITEM_PENDING_EXPIRATION` - Item access token expiring soon
- `ITEM_WEBHOOK_UPDATE_ACKNOWLEDGED` - Webhook update acknowledged

## License

MIT
