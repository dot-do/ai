# Deel Integration

Deel provides a global payroll and compliance platform for hiring international contractors and employees, automating onboarding, payments, and legal documentation

**Category**: hr
**Service**: Deel
**Base URL**: https://api.deel.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/deel](https://integrations.do/deel)

## Installation

```bash
npm install @dotdo/integration-deel
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-deel
```

## Quick Start

```typescript
import { DeelClient } from '@dotdo/integration-deel'

// Initialize client
const client = new DeelClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new DeelClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Deel actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DeelError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DeelError) {
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
