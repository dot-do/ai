# Finerworks Integration

FinerWorks is an online platform specializing in fine art and photo printing services, offering artists and photographers the ability to order prints and manage their inventory.

**Category**: productivity
**Service**: Finerworks
**Base URL**: https://api.finerworks.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/finerworks](https://integrations.do/finerworks)

## Installation

```bash
npm install @dotdo/integration-finerworks
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-finerworks
```

## Quick Start

```typescript
import { FinerworksClient } from '@dotdo/integration-finerworks'

// Initialize client
const client = new FinerworksClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new FinerworksClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Finerworks actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `FinerworksError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof FinerworksError) {
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
