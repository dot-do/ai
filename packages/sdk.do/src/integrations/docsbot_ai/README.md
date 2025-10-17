# Docsbot ai Integration

DocsBot AI enables the creation of custom chatbots trained on your documentation, facilitating automated customer support and content generation.

**Category**: productivity
**Service**: DocsbotAi
**Base URL**: https://api.docsbot_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/docsbot_ai](https://integrations.do/docsbot_ai)

## Installation

```bash
npm install @dotdo/integration-docsbot_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-docsbot_ai
```

## Quick Start

```typescript
import { DocsbotAiClient } from '@dotdo/integration-docsbot_ai'

// Initialize client
const client = new DocsbotAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DocsbotAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Docsbot ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DocsbotAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DocsbotAiError) {
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
