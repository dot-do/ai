# Ngrok Integration

Ngrok creates secure tunnels to locally hosted applications, enabling developers to share and test webhooks or services without configuring complex network settings

**Category**: developer-tools
**Service**: Ngrok
**Base URL**: https://api.ngrok.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ngrok](https://integrations.do/ngrok)

## Installation

```bash
npm install @dotdo/integration-ngrok
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ngrok
```

## Quick Start

```typescript
import { NgrokClient } from '@dotdo/integration-ngrok'

// Initialize client
const client = new NgrokClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NgrokClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Ngrok actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NgrokError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NgrokError) {
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
