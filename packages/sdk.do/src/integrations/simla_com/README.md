# Simla com Integration

Simla.com is a platform offering API services for integrating delivery services, managing orders, and customer data.

**Category**: productivity
**Service**: SimlaCom
**Base URL**: https://api.simla_com.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/simla_com](https://integrations.do/simla_com)

## Installation

```bash
npm install @dotdo/integration-simla_com
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-simla_com
```

## Quick Start

```typescript
import { SimlaComClient } from '@dotdo/integration-simla_com'

// Initialize client
const client = new SimlaComClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SimlaComClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Simla com actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SimlaComError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SimlaComError) {
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
