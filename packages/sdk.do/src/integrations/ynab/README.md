# Ynab Integration

YNAB (You Need A Budget) is a budgeting tool helping users track expenses, plan finances, and gain control over spending to reduce debt

**Category**: accounting
**Service**: Ynab
**Base URL**: https://api.ynab.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ynab](https://integrations.do/ynab)

## Installation

```bash
npm install @dotdo/integration-ynab
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ynab
```

## Quick Start

```typescript
import { YnabClient } from '@dotdo/integration-ynab'

// Initialize client
const client = new YnabClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new YnabClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Ynab actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `YnabError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof YnabError) {
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
