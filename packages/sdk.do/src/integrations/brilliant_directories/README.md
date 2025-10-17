# Brilliant directories Integration

Brilliant Directories is an all-in-one platform that enables users to create and manage online membership communities and business directories.

**Category**: productivity
**Service**: BrilliantDirectories
**Base URL**: https://api.brilliant_directories.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/brilliant_directories](https://integrations.do/brilliant_directories)

## Installation

```bash
npm install @dotdo/integration-brilliant_directories
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-brilliant_directories
```

## Quick Start

```typescript
import { BrilliantDirectoriesClient } from '@dotdo/integration-brilliant_directories'

// Initialize client
const client = new BrilliantDirectoriesClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BrilliantDirectoriesClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Brilliant directories actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BrilliantDirectoriesError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BrilliantDirectoriesError) {
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
