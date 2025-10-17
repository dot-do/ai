# Adobe Integration

Adobe provides creative software and digital media solutions, including Photoshop and Acrobat, empowering individuals and enterprises to design, edit, and distribute content across multiple formats

**Category**: productivity
**Service**: Adobe
**Base URL**: https://api.adobe.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/adobe](https://integrations.do/adobe)

## Installation

```bash
npm install @dotdo/integration-adobe
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-adobe
```

## Quick Start

```typescript
import { AdobeClient } from '@dotdo/integration-adobe'

// Initialize client
const client = new AdobeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AdobeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Adobe actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AdobeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AdobeError) {
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
