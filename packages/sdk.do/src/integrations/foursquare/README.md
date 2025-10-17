# Foursquare Integration

Search for places and place recommendations from the Foursquare Places database

**Category**: productivity
**Service**: Foursquare
**Base URL**: https://api.foursquare.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/foursquare](https://integrations.do/foursquare)

## Installation

```bash
npm install @dotdo/integration-foursquare
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-foursquare
```

## Quick Start

```typescript
import { FoursquareClient } from '@dotdo/integration-foursquare'

// Initialize client
const client = new FoursquareClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FoursquareClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Foursquare actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FoursquareError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FoursquareError) {
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
