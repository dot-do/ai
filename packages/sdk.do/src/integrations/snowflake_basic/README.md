# Snowflake basic Integration

Snowflake is a cloud-based data warehouse offering elastic scaling, secure data sharing, and SQL analytics across multiple cloud environments

**Category**: analytics
**Service**: SnowflakeBasic
**Base URL**: https://api.snowflake_basic.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/snowflake_basic](https://integrations.do/snowflake_basic)

## Installation

```bash
npm install @dotdo/integration-snowflake_basic
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-snowflake_basic
```

## Quick Start

```typescript
import { SnowflakeBasicClient } from '@dotdo/integration-snowflake_basic'

// Initialize client
const client = new SnowflakeBasicClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new SnowflakeBasicClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Snowflake basic actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SnowflakeBasicError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SnowflakeBasicError) {
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
