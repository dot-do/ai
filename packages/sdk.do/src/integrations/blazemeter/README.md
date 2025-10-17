# Blazemeter Integration

BlazeMeter is a continuous testing platform that enables users to create, run, and analyze performance and functional tests for web and mobile applications.

**Category**: productivity
**Service**: Blazemeter
**Base URL**: https://api.blazemeter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/blazemeter](https://integrations.do/blazemeter)

## Installation

```bash
npm install @dotdo/integration-blazemeter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-blazemeter
```

## Quick Start

```typescript
import { BlazemeterClient } from '@dotdo/integration-blazemeter'

// Initialize client
const client = new BlazemeterClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new BlazemeterClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Blazemeter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BlazemeterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BlazemeterError) {
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
