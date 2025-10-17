# Yelp Integration

Yelp Fusion API provides access to business search, reviews, ratings, and local business information with rich data for location-based services

**Category**: productivity
**Service**: Yelp
**Base URL**: https://api.yelp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/yelp](https://integrations.do/yelp)

## Installation

```bash
npm install @dotdo/integration-yelp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-yelp
```

## Quick Start

```typescript
import { YelpClient } from '@dotdo/integration-yelp'

// Initialize client
const client = new YelpClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new YelpClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Yelp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `YelpError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof YelpError) {
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
