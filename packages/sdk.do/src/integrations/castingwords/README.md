# Castingwords Integration

CastingWords offers high-quality, human-powered transcription services with a RESTful API for seamless integration into various workflows.

**Category**: productivity
**Service**: Castingwords
**Base URL**: https://api.castingwords.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/castingwords](https://integrations.do/castingwords)

## Installation

```bash
npm install @dotdo/integration-castingwords
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-castingwords
```

## Quick Start

```typescript
import { CastingwordsClient } from '@dotdo/integration-castingwords'

// Initialize client
const client = new CastingwordsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CastingwordsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Castingwords actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CastingwordsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CastingwordsError) {
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
