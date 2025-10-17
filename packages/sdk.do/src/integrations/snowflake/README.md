# Snowflake Integration

Snowflake is a cloud-based data warehouse offering elastic scaling, secure data sharing, and SQL analytics across multiple cloud environments

**Category**: analytics
**Service**: Snowflake
**Base URL**: https://api.snowflake.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/snowflake](https://integrations.do/snowflake)

## Installation

```bash
npm install @dotdo/integration-snowflake
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-snowflake
```

## Quick Start

```typescript
import { SnowflakeClient } from '@dotdo/integration-snowflake'

// Initialize client
const client = new SnowflakeClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SnowflakeClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Snowflake actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SnowflakeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SnowflakeError) {
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
