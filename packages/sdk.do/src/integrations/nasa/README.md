# Nasa Integration

NASA offers a suite of APIs providing access to a wide range of data, including Earth science, planetary imagery, and technology transfer information.

**Category**: productivity
**Service**: Nasa
**Base URL**: https://api.nasa.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/nasa](https://integrations.do/nasa)

## Installation

```bash
npm install @dotdo/integration-nasa
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-nasa
```

## Quick Start

```typescript
import { NasaClient } from '@dotdo/integration-nasa'

// Initialize client
const client = new NasaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NasaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Nasa actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NasaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NasaError) {
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
