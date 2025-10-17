# Token metrics Integration

Token Metrics provides an API offering real-time, AI-powered cryptocurrency data and insights for developers to build trading bots, dashboards, and portfolio tools.

**Category**: productivity
**Service**: TokenMetrics
**Base URL**: https://api.token_metrics.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/token_metrics](https://integrations.do/token_metrics)

## Installation

```bash
npm install @dotdo/integration-token_metrics
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-token_metrics
```

## Quick Start

```typescript
import { TokenMetricsClient } from '@dotdo/integration-token_metrics'

// Initialize client
const client = new TokenMetricsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TokenMetricsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Token metrics actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TokenMetricsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TokenMetricsError) {
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
