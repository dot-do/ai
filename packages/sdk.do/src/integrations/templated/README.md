# Templated Integration

Templated is a platform that automates the generation of images and PDFs through a simple API, allowing users to design templates and render them multiple times with dynamic content.

**Category**: productivity
**Service**: Templated
**Base URL**: https://api.templated.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/templated](https://integrations.do/templated)

## Installation

```bash
npm install @dotdo/integration-templated
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-templated
```

## Quick Start

```typescript
import { TemplatedClient } from '@dotdo/integration-templated'

// Initialize client
const client = new TemplatedClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TemplatedClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Templated actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TemplatedError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TemplatedError) {
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
