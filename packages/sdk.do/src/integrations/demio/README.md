# Demio Integration

Demio is a webinar software for marketers, offering live and automated sessions, audience engagement tools, and analytics to optimize lead generation

**Category**: marketing
**Service**: Demio
**Base URL**: https://api.demio.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/demio](https://integrations.do/demio)

## Installation

```bash
npm install @dotdo/integration-demio
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-demio
```

## Quick Start

```typescript
import { DemioClient } from '@dotdo/integration-demio'

// Initialize client
const client = new DemioClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DemioClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Demio actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DemioError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DemioError) {
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
