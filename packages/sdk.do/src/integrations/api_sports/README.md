# Api sports Integration

API-Sports provides comprehensive sports data APIs covering over 2,000 competitions with more than 15 years of historical data, offering real-time updates and easy integration for developers.

**Category**: productivity
**Service**: ApiSports
**Base URL**: https://api.api_sports.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/api_sports](https://integrations.do/api_sports)

## Installation

```bash
npm install @dotdo/integration-api_sports
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-api_sports
```

## Quick Start

```typescript
import { ApiSportsClient } from '@dotdo/integration-api_sports'

// Initialize client
const client = new ApiSportsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApiSportsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Api sports actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApiSportsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApiSportsError) {
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
