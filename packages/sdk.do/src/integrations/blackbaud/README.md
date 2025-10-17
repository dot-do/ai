# Blackbaud Integration

Blackbaud offers cloud-based software for nonprofits, schools, and healthcare institutions, supporting fundraising, financial management, and donor engagement in mission-driven organizations

**Category**: productivity
**Service**: Blackbaud
**Base URL**: https://api.blackbaud.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/blackbaud](https://integrations.do/blackbaud)

## Installation

```bash
npm install @dotdo/integration-blackbaud
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-blackbaud
```

## Quick Start

```typescript
import { BlackbaudClient } from '@dotdo/integration-blackbaud'

// Initialize client
const client = new BlackbaudClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new BlackbaudClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Blackbaud actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BlackbaudError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BlackbaudError) {
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
