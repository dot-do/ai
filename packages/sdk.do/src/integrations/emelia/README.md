# Emelia Integration

Emelia is an all-in-one B2B prospecting tool offering features like cold-emailing, LinkedIn outreach, email warm-up, email finder, and LinkedIn Sales Navigator scraping.

**Category**: productivity
**Service**: Emelia
**Base URL**: https://api.emelia.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/emelia](https://integrations.do/emelia)

## Installation

```bash
npm install @dotdo/integration-emelia
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-emelia
```

## Quick Start

```typescript
import { EmeliaClient } from '@dotdo/integration-emelia'

// Initialize client
const client = new EmeliaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EmeliaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Emelia actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EmeliaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EmeliaError) {
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
