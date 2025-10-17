# Alttext ai Integration

AltText.ai is a service that automatically generates alt text for images, enhancing accessibility and SEO.

**Category**: productivity
**Service**: AlttextAi
**Base URL**: https://api.alttext_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/alttext_ai](https://integrations.do/alttext_ai)

## Installation

```bash
npm install @dotdo/integration-alttext_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-alttext_ai
```

## Quick Start

```typescript
import { AlttextAiClient } from '@dotdo/integration-alttext_ai'

// Initialize client
const client = new AlttextAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new AlttextAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Alttext ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AlttextAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AlttextAiError) {
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
