# Apipie ai Integration

APIpie.ai is an AI super aggregator providing a unified API to access a vast array of AI models from leading providers, enabling cost-effective and latency-optimized solutions.

**Category**: productivity
**Service**: ApipieAi
**Base URL**: https://api.apipie_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apipie_ai](https://integrations.do/apipie_ai)

## Installation

```bash
npm install @dotdo/integration-apipie_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apipie_ai
```

## Quick Start

```typescript
import { ApipieAiClient } from '@dotdo/integration-apipie_ai'

// Initialize client
const client = new ApipieAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApipieAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apipie ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApipieAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApipieAiError) {
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
