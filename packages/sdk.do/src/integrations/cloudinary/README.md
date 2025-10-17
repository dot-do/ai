# Cloudinary Integration

Template description for cloudinary

**Category**: productivity
**Service**: Cloudinary
**Base URL**: https://api.cloudinary.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cloudinary](https://integrations.do/cloudinary)

## Installation

```bash
npm install @dotdo/integration-cloudinary
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cloudinary
```

## Quick Start

```typescript
import { CloudinaryClient } from '@dotdo/integration-cloudinary'

// Initialize client
const client = new CloudinaryClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloudinaryClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cloudinary actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloudinaryError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloudinaryError) {
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
