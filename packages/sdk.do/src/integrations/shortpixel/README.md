# Shortpixel Integration

ShortPixel is an image optimization and compression service that offers APIs and plugins to enhance website performance by reducing image sizes without compromising quality.

**Category**: productivity
**Service**: Shortpixel
**Base URL**: https://api.shortpixel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/shortpixel](https://integrations.do/shortpixel)

## Installation

```bash
npm install @dotdo/integration-shortpixel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-shortpixel
```

## Quick Start

```typescript
import { ShortpixelClient } from '@dotdo/integration-shortpixel'

// Initialize client
const client = new ShortpixelClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ShortpixelClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Shortpixel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ShortpixelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ShortpixelError) {
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
