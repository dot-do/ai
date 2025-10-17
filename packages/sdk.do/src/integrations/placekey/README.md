# Placekey Integration

Placekey standardizes location data by assigning unique IDs to physical addresses, simplifying address matching and enabling data sharing across platforms

**Category**: analytics
**Service**: Placekey
**Base URL**: https://api.placekey.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/placekey](https://integrations.do/placekey)

## Installation

```bash
npm install @dotdo/integration-placekey
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-placekey
```

## Quick Start

```typescript
import { PlacekeyClient } from '@dotdo/integration-placekey'

// Initialize client
const client = new PlacekeyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PlacekeyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Placekey actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PlacekeyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PlacekeyError) {
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
