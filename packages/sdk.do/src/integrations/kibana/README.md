# Kibana Integration

Kibana is a visualization and analytics platform for Elasticsearch, offering dashboards, data exploration, and monitoring capabilities for gaining insights from data

**Category**: analytics
**Service**: Kibana
**Base URL**: https://api.kibana.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kibana](https://integrations.do/kibana)

## Installation

```bash
npm install @dotdo/integration-kibana
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kibana
```

## Quick Start

```typescript
import { KibanaClient } from '@dotdo/integration-kibana'

// Initialize client
const client = new KibanaClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new KibanaClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Kibana actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KibanaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KibanaError) {
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
