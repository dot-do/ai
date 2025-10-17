# The odds api Integration

The Odds API provides real-time sports betting odds data from various bookmakers worldwide, covering multiple sports and betting markets.

**Category**: productivity
**Service**: TheOddsApi
**Base URL**: https://api.the_odds_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/the_odds_api](https://integrations.do/the_odds_api)

## Installation

```bash
npm install @dotdo/integration-the_odds_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-the_odds_api
```

## Quick Start

```typescript
import { TheOddsApiClient } from '@dotdo/integration-the_odds_api'

// Initialize client
const client = new TheOddsApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TheOddsApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute The odds api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TheOddsApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TheOddsApiError) {
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
