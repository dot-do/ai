# Rocketlane Integration

Collaborative customer onboarding and implementation platform for professional services teams.

**Category**: productivity
**Service**: Rocketlane
**Base URL**: https://api.rocketlane.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rocketlane](https://integrations.do/rocketlane)

## Installation

```bash
npm install @dotdo/integration-rocketlane
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rocketlane
```

## Quick Start

```typescript
import { RocketlaneClient } from '@dotdo/integration-rocketlane'

// Initialize client
const client = new RocketlaneClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RocketlaneClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Rocketlane actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RocketlaneError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RocketlaneError) {
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
