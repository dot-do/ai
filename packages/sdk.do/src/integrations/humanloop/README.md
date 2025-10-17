# Humanloop Integration

Humanloop helps developers build and refine AI applications, offering user feedback loops, model training, and data annotation to iterate on language model performance

**Category**: developer-tools
**Service**: Humanloop
**Base URL**: https://api.humanloop.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/humanloop](https://integrations.do/humanloop)

## Installation

```bash
npm install @dotdo/integration-humanloop
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-humanloop
```

## Quick Start

```typescript
import { HumanloopClient } from '@dotdo/integration-humanloop'

// Initialize client
const client = new HumanloopClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new HumanloopClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Humanloop actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HumanloopError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HumanloopError) {
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
