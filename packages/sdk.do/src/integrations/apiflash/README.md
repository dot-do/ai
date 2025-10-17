# Apiflash Integration

ApiFlash is a website screenshot API that allows users to capture high-quality screenshots of web pages programmatically.

**Category**: productivity
**Service**: Apiflash
**Base URL**: https://api.apiflash.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/apiflash](https://integrations.do/apiflash)

## Installation

```bash
npm install @dotdo/integration-apiflash
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-apiflash
```

## Quick Start

```typescript
import { ApiflashClient } from '@dotdo/integration-apiflash'

// Initialize client
const client = new ApiflashClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ApiflashClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Apiflash actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ApiflashError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ApiflashError) {
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
