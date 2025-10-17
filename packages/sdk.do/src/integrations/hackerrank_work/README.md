# Hackerrank work Integration

HackerRank Work enables coding interviews and technical assessments, providing developers with challenges and real-time collaboration for data-driven hiring decisions

**Category**: developer-tools
**Service**: HackerrankWork
**Base URL**: https://api.hackerrank_work.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/hackerrank_work](https://integrations.do/hackerrank_work)

## Installation

```bash
npm install @dotdo/integration-hackerrank_work
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-hackerrank_work
```

## Quick Start

```typescript
import { HackerrankWorkClient } from '@dotdo/integration-hackerrank_work'

// Initialize client
const client = new HackerrankWorkClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new HackerrankWorkClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Hackerrank work actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `HackerrankWorkError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof HackerrankWorkError) {
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
