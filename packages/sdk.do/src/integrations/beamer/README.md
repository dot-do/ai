# Beamer Integration

Beamer is a platform that enables companies to announce news, updates, and features directly within their applications or websites, enhancing user engagement and communication.

**Category**: productivity
**Service**: Beamer
**Base URL**: https://api.beamer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/beamer](https://integrations.do/beamer)

## Installation

```bash
npm install @dotdo/integration-beamer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-beamer
```

## Quick Start

```typescript
import { BeamerClient } from '@dotdo/integration-beamer'

// Initialize client
const client = new BeamerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BeamerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Beamer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BeamerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BeamerError) {
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
