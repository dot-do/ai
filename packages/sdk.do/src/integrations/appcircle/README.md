# Appcircle Integration

Appcircle is an enterprise-grade mobile CI/CD platform that enables developers to build, test, and publish mobile applications efficiently, offering both cloud-based and self-hosted deployment options.

**Category**: productivity
**Service**: Appcircle
**Base URL**: https://api.appcircle.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/appcircle](https://integrations.do/appcircle)

## Installation

```bash
npm install @dotdo/integration-appcircle
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-appcircle
```

## Quick Start

```typescript
import { AppcircleClient } from '@dotdo/integration-appcircle'

// Initialize client
const client = new AppcircleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AppcircleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Appcircle actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AppcircleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AppcircleError) {
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
