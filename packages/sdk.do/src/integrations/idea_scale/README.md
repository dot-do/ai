# Idea scale Integration

Integrate IdeaScale to access and manage innovation and idea management solutions for your organization.

**Category**: communication
**Service**: IdeaScale
**Base URL**: https://api.idea_scale.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/idea_scale](https://integrations.do/idea_scale)

## Installation

```bash
npm install @dotdo/integration-idea_scale
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-idea_scale
```

## Quick Start

```typescript
import { IdeaScaleClient } from '@dotdo/integration-idea_scale'

// Initialize client
const client = new IdeaScaleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new IdeaScaleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Idea scale actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `IdeaScaleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof IdeaScaleError) {
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
