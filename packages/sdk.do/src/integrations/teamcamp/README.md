# Teamcamp Integration

An all-in-one project management tool designed for teams to efficiently manage projects, collaborate seamlessly, and streamline workflows.

**Category**: productivity
**Service**: Teamcamp
**Base URL**: https://api.teamcamp.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/teamcamp](https://integrations.do/teamcamp)

## Installation

```bash
npm install @dotdo/integration-teamcamp
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-teamcamp
```

## Quick Start

```typescript
import { TeamcampClient } from '@dotdo/integration-teamcamp'

// Initialize client
const client = new TeamcampClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TeamcampClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Teamcamp actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TeamcampError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TeamcampError) {
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
