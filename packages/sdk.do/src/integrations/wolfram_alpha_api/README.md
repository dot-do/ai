# Wolfram alpha api Integration

Integrate computational knowledge into applications via Wolfram|Alpha's APIs.

**Category**: productivity
**Service**: WolframAlphaApi
**Base URL**: https://api.wolfram_alpha_api.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/wolfram_alpha_api](https://integrations.do/wolfram_alpha_api)

## Installation

```bash
npm install @dotdo/integration-wolfram_alpha_api
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-wolfram_alpha_api
```

## Quick Start

```typescript
import { WolframAlphaApiClient } from '@dotdo/integration-wolfram_alpha_api'

// Initialize client
const client = new WolframAlphaApiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WolframAlphaApiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Wolfram alpha api actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WolframAlphaApiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WolframAlphaApiError) {
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
