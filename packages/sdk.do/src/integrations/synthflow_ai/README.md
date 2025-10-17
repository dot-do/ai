# Synthflow ai Integration

Synthflow AI provides AI-powered voice agents to automate both inbound and outbound calls, enhancing customer engagement and operational efficiency.

**Category**: productivity
**Service**: SynthflowAi
**Base URL**: https://api.synthflow_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/synthflow_ai](https://integrations.do/synthflow_ai)

## Installation

```bash
npm install @dotdo/integration-synthflow_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-synthflow_ai
```

## Quick Start

```typescript
import { SynthflowAiClient } from '@dotdo/integration-synthflow_ai'

// Initialize client
const client = new SynthflowAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SynthflowAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Synthflow ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SynthflowAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SynthflowAiError) {
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
