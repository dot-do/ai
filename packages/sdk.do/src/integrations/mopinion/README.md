# Mopinion Integration

Mopinion captures user feedback across websites and apps, providing insights, analytics, and reporting to optimize user experiences and drive conversions

**Category**: crm
**Service**: Mopinion
**Base URL**: https://api.mopinion.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/mopinion](https://integrations.do/mopinion)

## Installation

```bash
npm install @dotdo/integration-mopinion
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-mopinion
```

## Quick Start

```typescript
import { MopinionClient } from '@dotdo/integration-mopinion'

// Initialize client
const client = new MopinionClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MopinionClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Mopinion actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MopinionError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MopinionError) {
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
