# Cloudlayer Integration

cloudlayer.io is a document and asset generation service that enables users to dynamically create PDFs and images through a REST-based API, SDKs, or no-code integrations.

**Category**: productivity
**Service**: Cloudlayer
**Base URL**: https://api.cloudlayer.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cloudlayer](https://integrations.do/cloudlayer)

## Installation

```bash
npm install @dotdo/integration-cloudlayer
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cloudlayer
```

## Quick Start

```typescript
import { CloudlayerClient } from '@dotdo/integration-cloudlayer'

// Initialize client
const client = new CloudlayerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloudlayerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cloudlayer actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloudlayerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloudlayerError) {
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
