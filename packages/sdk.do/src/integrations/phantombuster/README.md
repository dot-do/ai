# Phantombuster Integration

PhantomBuster is a cloud-based data extraction and automation platform that enables users to automate actions on the web, such as scraping data, generating leads, and automating social media tasks.

**Category**: productivity
**Service**: Phantombuster
**Base URL**: https://api.phantombuster.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/phantombuster](https://integrations.do/phantombuster)

## Installation

```bash
npm install @dotdo/integration-phantombuster
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-phantombuster
```

## Quick Start

```typescript
import { PhantombusterClient } from '@dotdo/integration-phantombuster'

// Initialize client
const client = new PhantombusterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PhantombusterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Phantombuster actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PhantombusterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PhantombusterError) {
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
