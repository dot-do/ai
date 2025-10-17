# Piloterr Integration

Piloterr is a developer-first platform offering over 50 ready-to-use APIs for web scraping and data extraction, enabling businesses to efficiently gather and integrate web data into their systems.

**Category**: productivity
**Service**: Piloterr
**Base URL**: https://api.piloterr.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/piloterr](https://integrations.do/piloterr)

## Installation

```bash
npm install @dotdo/integration-piloterr
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-piloterr
```

## Quick Start

```typescript
import { PiloterrClient } from '@dotdo/integration-piloterr'

// Initialize client
const client = new PiloterrClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PiloterrClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Piloterr actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PiloterrError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PiloterrError) {
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
