# Appveyor Integration

AppVeyor is a hosted continuous integration service for building and deploying applications.

**Category**: productivity
**Service**: Appveyor
**Base URL**: https://api.appveyor.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/appveyor](https://integrations.do/appveyor)

## Installation

```bash
npm install @dotdo/integration-appveyor
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-appveyor
```

## Quick Start

```typescript
import { AppveyorClient } from '@dotdo/integration-appveyor'

// Initialize client
const client = new AppveyorClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AppveyorClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Appveyor actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AppveyorError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AppveyorError) {
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
