# Browserless Integration

Browserless is a service that provides headless browser automation, allowing users to run automations on their own sites with browser infrastructure.

**Category**: productivity
**Service**: Browserless
**Base URL**: https://api.browserless.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/browserless](https://integrations.do/browserless)

## Installation

```bash
npm install @dotdo/integration-browserless
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-browserless
```

## Quick Start

```typescript
import { BrowserlessClient } from '@dotdo/integration-browserless'

// Initialize client
const client = new BrowserlessClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BrowserlessClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Browserless actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrowserlessError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrowserlessError) {
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

## License

MIT
