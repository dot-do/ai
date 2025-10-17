# Bamboohr Integration

BambooHR is an American technology company that provides human resources software as a service.

**Category**: productivity
**Service**: Bamboohr
**Base URL**: https://api.bamboohr.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bamboohr](https://integrations.do/bamboohr)

## Installation

```bash
npm install @dotdo/integration-bamboohr
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bamboohr
```

## Quick Start

```typescript
import { BamboohrClient } from '@dotdo/integration-bamboohr'

// Initialize client
const client = new BamboohrClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BamboohrClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bamboohr actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BamboohrError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BamboohrError) {
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
