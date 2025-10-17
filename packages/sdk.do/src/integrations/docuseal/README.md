# Docuseal Integration

DocuSeal is a platform that provides a powerful and easy-to-use API to implement eSignature workflows, allowing users to automate document and template management processes without relying on the web interface.

**Category**: productivity
**Service**: Docuseal
**Base URL**: https://api.docuseal.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/docuseal](https://integrations.do/docuseal)

## Installation

```bash
npm install @dotdo/integration-docuseal
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-docuseal
```

## Quick Start

```typescript
import { DocusealClient } from '@dotdo/integration-docuseal'

// Initialize client
const client = new DocusealClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DocusealClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Docuseal actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DocusealError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DocusealError) {
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
