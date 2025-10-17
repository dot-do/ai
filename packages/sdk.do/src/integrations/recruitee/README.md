# Recruitee Integration

Recruitee is a collaborative hiring software that streamlines recruitment processes, enabling teams to source, interview, and hire candidates efficiently.

**Category**: productivity
**Service**: Recruitee
**Base URL**: https://api.recruitee.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/recruitee](https://integrations.do/recruitee)

## Installation

```bash
npm install @dotdo/integration-recruitee
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-recruitee
```

## Quick Start

```typescript
import { RecruiteeClient } from '@dotdo/integration-recruitee'

// Initialize client
const client = new RecruiteeClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new RecruiteeClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Recruitee actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RecruiteeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RecruiteeError) {
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
