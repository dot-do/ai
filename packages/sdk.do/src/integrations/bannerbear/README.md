# Bannerbear Integration

Bannerbear offers an automated image and video generation API, allowing businesses to create graphics, social media visuals, and marketing collateral with customizable templates at scale

**Category**: productivity
**Service**: Bannerbear
**Base URL**: https://api.bannerbear.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/bannerbear](https://integrations.do/bannerbear)

## Installation

```bash
npm install @dotdo/integration-bannerbear
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-bannerbear
```

## Quick Start

```typescript
import { BannerbearClient } from '@dotdo/integration-bannerbear'

// Initialize client
const client = new BannerbearClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new BannerbearClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Bannerbear actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `BannerbearError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof BannerbearError) {
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
