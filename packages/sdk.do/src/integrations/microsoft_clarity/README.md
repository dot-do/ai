# Microsoft clarity Integration

Microsoft Clarity is a free user behavior analytics tool that captures heatmaps, session recordings, and engagement metrics to help improve website experiences

**Category**: analytics
**Service**: MicrosoftClarity
**Base URL**: https://api.microsoft_clarity.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/microsoft_clarity](https://integrations.do/microsoft_clarity)

## Installation

```bash
npm install @dotdo/integration-microsoft_clarity
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-microsoft_clarity
```

## Quick Start

```typescript
import { MicrosoftClarityClient } from '@dotdo/integration-microsoft_clarity'

// Initialize client
const client = new MicrosoftClarityClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new MicrosoftClarityClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Microsoft clarity actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MicrosoftClarityError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MicrosoftClarityError) {
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
