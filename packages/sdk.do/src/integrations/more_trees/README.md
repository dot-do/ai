# More trees Integration

More Trees is a sustainability-focused platform planting trees on behalf of individuals or businesses aiming to offset carbon footprints and support reforestation

**Category**: productivity
**Service**: MoreTrees
**Base URL**: https://api.more_trees.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/more_trees](https://integrations.do/more_trees)

## Installation

```bash
npm install @dotdo/integration-more_trees
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-more_trees
```

## Quick Start

```typescript
import { MoreTreesClient } from '@dotdo/integration-more_trees'

// Initialize client
const client = new MoreTreesClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MoreTreesClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute More trees actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MoreTreesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MoreTreesError) {
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
