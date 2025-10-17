# Hypeauditor Integration

HypeAuditor provides comprehensive influencer marketing solutions, offering tools for influencer discovery, analytics, and campaign management across multiple social media platforms.

**Category**: marketing
**Service**: Hypeauditor
**Base URL**: https://api.hypeauditor.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/hypeauditor](https://integrations.do/hypeauditor)

## Installation

```bash
npm install @dotdo/integration-hypeauditor
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-hypeauditor
```

## Quick Start

```typescript
import { HypeauditorClient } from '@dotdo/integration-hypeauditor'

// Initialize client
const client = new HypeauditorClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HypeauditorClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Hypeauditor actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HypeauditorError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HypeauditorError) {
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
