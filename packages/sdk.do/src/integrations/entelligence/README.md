# Entelligence Integration

Entelligence leverages artificial intelligence to provide insights, recommendations, and predictive analytics for businesses seeking data-driven decision-making capabilities

**Category**: developer-tools
**Service**: Entelligence
**Base URL**: https://api.entelligence.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/entelligence](https://integrations.do/entelligence)

## Installation

```bash
npm install @dotdo/integration-entelligence
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-entelligence
```

## Quick Start

```typescript
import { EntelligenceClient } from '@dotdo/integration-entelligence'

// Initialize client
const client = new EntelligenceClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new EntelligenceClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Entelligence actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `EntelligenceError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof EntelligenceError) {
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
