# Serpdog Integration

Serpdog provides APIs for scraping Google search results and related services, enabling developers to access real-time data from Google Search, Maps, Scholar, and more.

**Category**: productivity
**Service**: Serpdog
**Base URL**: https://api.serpdog.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/serpdog](https://integrations.do/serpdog)

## Installation

```bash
npm install @dotdo/integration-serpdog
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-serpdog
```

## Quick Start

```typescript
import { SerpdogClient } from '@dotdo/integration-serpdog'

// Initialize client
const client = new SerpdogClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SerpdogClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Serpdog actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SerpdogError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SerpdogError) {
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
