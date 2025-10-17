# Insighto ai Integration

Insighto.ai is an AI-powered communication platform that enables businesses to create and deploy conversational AI chatbots and voice agents for enhanced customer engagement across multiple channels.

**Category**: productivity
**Service**: InsightoAi
**Base URL**: https://api.insighto_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/insighto_ai](https://integrations.do/insighto_ai)

## Installation

```bash
npm install @dotdo/integration-insighto_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-insighto_ai
```

## Quick Start

```typescript
import { InsightoAiClient } from '@dotdo/integration-insighto_ai'

// Initialize client
const client = new InsightoAiClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new InsightoAiClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Insighto ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `InsightoAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof InsightoAiError) {
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
