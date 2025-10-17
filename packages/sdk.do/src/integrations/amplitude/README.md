# Amplitude Integration

Amplitude Inc. is an American publicly trading company that develops digital analytics software.

**Category**: analytics
**Service**: Amplitude
**Base URL**: https://api.amplitude.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/amplitude](https://integrations.do/amplitude)

## Installation

```bash
npm install @dotdo/integration-amplitude
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-amplitude
```

## Quick Start

```typescript
import { AmplitudeClient } from '@dotdo/integration-amplitude'

// Initialize client
const client = new AmplitudeClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new AmplitudeClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Amplitude actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AmplitudeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AmplitudeError) {
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
