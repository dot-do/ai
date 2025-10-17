# Printnode Integration

PrintNode provides cloud printing services, enabling remote printing from web or desktop applications and simplifying multi-location print management

**Category**: productivity
**Service**: Printnode
**Base URL**: https://api.printnode.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/printnode](https://integrations.do/printnode)

## Installation

```bash
npm install @dotdo/integration-printnode
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-printnode
```

## Quick Start

```typescript
import { PrintnodeClient } from '@dotdo/integration-printnode'

// Initialize client
const client = new PrintnodeClient({
  username: 'your-username',
  password: 'your-password',
})
```

## Authentication

This Integration uses **basic** authentication.

Provide your username and password:

```typescript
const client = new PrintnodeClient({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
})
```

## Resources

### Action

Execute Printnode actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PrintnodeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PrintnodeError) {
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
