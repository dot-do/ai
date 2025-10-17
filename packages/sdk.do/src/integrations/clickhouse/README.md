# Clickhouse Integration

ClickHouse is a fast open-source column-oriented database management system for real-time analytics and big data processing with SQL support

**Category**: analytics
**Service**: Clickhouse
**Base URL**: https://api.clickhouse.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/clickhouse](https://integrations.do/clickhouse)

## Installation

```bash
npm install @dotdo/integration-clickhouse
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-clickhouse
```

## Quick Start

```typescript
import { ClickhouseClient } from '@dotdo/integration-clickhouse'

// Initialize client
const client = new ClickhouseClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new ClickhouseClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Clickhouse actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ClickhouseError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ClickhouseError) {
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
