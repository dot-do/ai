# Hackernews Integration

Hacker News is a tech-focused news aggregator by Y Combinator, featuring user-submitted stories and discussions on startups, programming, and emerging trends

**Category**: productivity
**Service**: Hackernews
**Base URL**: https://api.hackernews.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/hackernews](https://integrations.do/hackernews)

## Installation

```bash
npm install @dotdo/integration-hackernews
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-hackernews
```

## Quick Start

```typescript
import { HackernewsClient } from '@dotdo/integration-hackernews'

// Initialize client
const client = new HackernewsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HackernewsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Hackernews actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HackernewsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HackernewsError) {
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
