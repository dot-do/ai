# Ashby Integration

Ashby delivers an applicant tracking system for modern teams, offering features like job postings, candidate management, and data-driven hiring insights to streamline the recruitment process

**Category**: hr
**Service**: Ashby
**Base URL**: https://api.ashby.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/ashby](https://integrations.do/ashby)

## Installation

```bash
npm install @dotdo/integration-ashby
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-ashby
```

## Quick Start

```typescript
import { AshbyClient } from '@dotdo/integration-ashby'

// Initialize client
const client = new AshbyClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new AshbyClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Ashby actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AshbyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AshbyError) {
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
