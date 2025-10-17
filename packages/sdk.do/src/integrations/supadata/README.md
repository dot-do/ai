# Supadata Integration

Supadata is a web and video-to-text API that enables developers to extract structured data from videos and websites, facilitating AI training and content analysis.

**Category**: productivity
**Service**: Supadata
**Base URL**: https://api.supadata.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/supadata](https://integrations.do/supadata)

## Installation

```bash
npm install @dotdo/integration-supadata
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-supadata
```

## Quick Start

```typescript
import { SupadataClient } from '@dotdo/integration-supadata'

// Initialize client
const client = new SupadataClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SupadataClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Supadata actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SupadataError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SupadataError) {
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
