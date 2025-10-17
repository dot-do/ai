# Segmetrics Integration

SegMetrics is a marketing analytics platform that provides detailed insights into customer journeys, helping businesses optimize their marketing strategies.

**Category**: productivity
**Service**: Segmetrics
**Base URL**: https://api.segmetrics.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/segmetrics](https://integrations.do/segmetrics)

## Installation

```bash
npm install @dotdo/integration-segmetrics
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-segmetrics
```

## Quick Start

```typescript
import { SegmetricsClient } from '@dotdo/integration-segmetrics'

// Initialize client
const client = new SegmetricsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SegmetricsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Segmetrics actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SegmetricsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SegmetricsError) {
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
