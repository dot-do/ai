# Workday Integration

Workday is a cloud-based enterprise resource planning (ERP) software that provides comprehensive solutions for human capital management, financial management, and analytics

**Category**: productivity
**Service**: Workday
**Base URL**: https://api.workday.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/workday](https://integrations.do/workday)

## Installation

```bash
npm install @dotdo/integration-workday
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-workday
```

## Quick Start

```typescript
import { WorkdayClient } from '@dotdo/integration-workday'

// Initialize client
const client = new WorkdayClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new WorkdayClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Workday actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WorkdayError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WorkdayError) {
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
