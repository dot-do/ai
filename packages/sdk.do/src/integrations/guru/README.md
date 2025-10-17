# Guru Integration

Guru is a knowledge management solution that captures, organizes, and shares company information, enabling teams to access expert-verified insights and reduce repetitive questions

**Category**: storage
**Service**: Guru
**Base URL**: https://api.guru.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/guru](https://integrations.do/guru)

## Installation

```bash
npm install @dotdo/integration-guru
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-guru
```

## Quick Start

```typescript
import { GuruClient } from '@dotdo/integration-guru'

// Initialize client
const client = new GuruClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new GuruClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Guru actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GuruError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GuruError) {
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
