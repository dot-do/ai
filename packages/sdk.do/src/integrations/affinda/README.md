# Affinda Integration

Affinda provides an AI-powered document processing platform that automates data extraction from various document types.

**Category**: productivity
**Service**: Affinda
**Base URL**: https://api.affinda.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/affinda](https://integrations.do/affinda)

## Installation

```bash
npm install @dotdo/integration-affinda
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-affinda
```

## Quick Start

```typescript
import { AffindaClient } from '@dotdo/integration-affinda'

// Initialize client
const client = new AffindaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AffindaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Affinda actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AffindaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AffindaError) {
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
