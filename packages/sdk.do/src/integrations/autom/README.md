# Autom Integration

Autom is a service that delivers lightning-fast search engine results page (SERP) outcomes for Google, Bing, and Brave, offering developers rapid access to search data with minimal latency.

**Category**: productivity
**Service**: Autom
**Base URL**: https://api.autom.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/autom](https://integrations.do/autom)

## Installation

```bash
npm install @dotdo/integration-autom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-autom
```

## Quick Start

```typescript
import { AutomClient } from '@dotdo/integration-autom'

// Initialize client
const client = new AutomClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AutomClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Autom actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AutomError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AutomError) {
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
