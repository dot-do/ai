# Modelry Integration

Modelry is a platform that provides tools and services for building, deploying, and managing machine learning models.

**Category**: productivity
**Service**: Modelry
**Base URL**: https://api.modelry.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/modelry](https://integrations.do/modelry)

## Installation

```bash
npm install @dotdo/integration-modelry
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-modelry
```

## Quick Start

```typescript
import { ModelryClient } from '@dotdo/integration-modelry'

// Initialize client
const client = new ModelryClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ModelryClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Modelry actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ModelryError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ModelryError) {
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
