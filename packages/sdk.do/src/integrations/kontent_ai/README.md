# Kontent ai Integration

Kontent.ai is a headless CMS that delivers content via API, allowing developers to build websites and applications using their preferred frameworks, languages, or libraries.

**Category**: productivity
**Service**: KontentAi
**Base URL**: https://api.kontent_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/kontent_ai](https://integrations.do/kontent_ai)

## Installation

```bash
npm install @dotdo/integration-kontent_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-kontent_ai
```

## Quick Start

```typescript
import { KontentAiClient } from '@dotdo/integration-kontent_ai'

// Initialize client
const client = new KontentAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new KontentAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Kontent ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `KontentAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof KontentAiError) {
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
