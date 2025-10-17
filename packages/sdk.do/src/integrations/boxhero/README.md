# Boxhero Integration

BoxHero is a cloud-based inventory management solution designed for small to medium-sized businesses, offering real-time updates, barcode scanning, team collaboration, and analytics.

**Category**: productivity
**Service**: Boxhero
**Base URL**: https://api.boxhero.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/boxhero](https://integrations.do/boxhero)

## Installation

```bash
npm install @dotdo/integration-boxhero
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-boxhero
```

## Quick Start

```typescript
import { BoxheroClient } from '@dotdo/integration-boxhero'

// Initialize client
const client = new BoxheroClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BoxheroClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Boxhero actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BoxheroError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BoxheroError) {
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
