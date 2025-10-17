# Magnetic Integration

Magnetic is an all-in-one platform designed to help professional services firms manage projects, resources, and finances efficiently.

**Category**: productivity
**Service**: Magnetic
**Base URL**: https://api.magnetic.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/magnetic](https://integrations.do/magnetic)

## Installation

```bash
npm install @dotdo/integration-magnetic
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-magnetic
```

## Quick Start

```typescript
import { MagneticClient } from '@dotdo/integration-magnetic'

// Initialize client
const client = new MagneticClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MagneticClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Magnetic actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MagneticError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MagneticError) {
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
