# Neuronwriter Integration

NeuronWriter is a content optimization tool that leverages semantic SEO and AI to enhance content creation and improve search engine rankings.

**Category**: productivity
**Service**: Neuronwriter
**Base URL**: https://api.neuronwriter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/neuronwriter](https://integrations.do/neuronwriter)

## Installation

```bash
npm install @dotdo/integration-neuronwriter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-neuronwriter
```

## Quick Start

```typescript
import { NeuronwriterClient } from '@dotdo/integration-neuronwriter'

// Initialize client
const client = new NeuronwriterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new NeuronwriterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Neuronwriter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `NeuronwriterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof NeuronwriterError) {
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
