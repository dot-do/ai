# Dripcel Integration

Dripcel is a cloud-based SMS marketing platform that leverages AI and machine learning to automate and optimize customer communication campaigns.

**Category**: productivity
**Service**: Dripcel
**Base URL**: https://api.dripcel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/dripcel](https://integrations.do/dripcel)

## Installation

```bash
npm install @dotdo/integration-dripcel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-dripcel
```

## Quick Start

```typescript
import { DripcelClient } from '@dotdo/integration-dripcel'

// Initialize client
const client = new DripcelClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DripcelClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Dripcel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DripcelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DripcelError) {
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
