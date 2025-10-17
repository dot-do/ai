# Elasticsearch Integration

Elasticsearch is a distributed, RESTful search and analytics engine capable of addressing a growing number of use cases. It provides real-time search and analytics for all types of data.

**Category**: productivity
**Service**: Elasticsearch
**Base URL**: https://api.elasticsearch.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/elasticsearch](https://integrations.do/elasticsearch)

## Installation

```bash
npm install @dotdo/integration-elasticsearch
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-elasticsearch
```

## Quick Start

```typescript
import { ElasticsearchClient } from '@dotdo/integration-elasticsearch'

// Initialize client
const client = new ElasticsearchClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new ElasticsearchClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Elasticsearch actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ElasticsearchError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ElasticsearchError) {
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
