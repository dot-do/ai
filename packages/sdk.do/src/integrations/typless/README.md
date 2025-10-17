# Typless Integration

Typless is an AI-powered document extraction platform that automates manual data entry from various documents using a simple API.

**Category**: productivity
**Service**: Typless
**Base URL**: https://api.typless.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/typless](https://integrations.do/typless)

## Installation

```bash
npm install @dotdo/integration-typless
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-typless
```

## Quick Start

```typescript
import { TyplessClient } from '@dotdo/integration-typless'

// Initialize client
const client = new TyplessClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TyplessClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Typless actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TyplessError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TyplessError) {
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
