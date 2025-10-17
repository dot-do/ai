# Project bubble Integration

ProProfs Project is a project management tool that helps teams plan, collaborate, and deliver projects efficiently.

**Category**: productivity
**Service**: ProjectBubble
**Base URL**: https://api.project_bubble.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/project_bubble](https://integrations.do/project_bubble)

## Installation

```bash
npm install @dotdo/integration-project_bubble
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-project_bubble
```

## Quick Start

```typescript
import { ProjectBubbleClient } from '@dotdo/integration-project_bubble'

// Initialize client
const client = new ProjectBubbleClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ProjectBubbleClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Project bubble actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ProjectBubbleError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ProjectBubbleError) {
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
