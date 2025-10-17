# Pandadoc Integration

PandaDoc offers document creation, e-signatures, and workflow automation, helping sales teams and businesses streamline proposals, contracts, and agreement processes

**Category**: storage
**Service**: Pandadoc
**Base URL**: https://api.pandadoc.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/pandadoc](https://integrations.do/pandadoc)

## Installation

```bash
npm install @dotdo/integration-pandadoc
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-pandadoc
```

## Quick Start

```typescript
import { PandadocClient } from '@dotdo/integration-pandadoc'

// Initialize client
const client = new PandadocClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PandadocClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Pandadoc actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PandadocError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PandadocError) {
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
