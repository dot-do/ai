# Promptmate io Integration

Promptmate.io enables users to build AI-powered applications by integrating various AI systems like ChatGPT, Google Gemini, and Stability AI, offering features such as multi-step AI workflows, bulk processing, and automation through Zapier.

**Category**: productivity
**Service**: PromptmateIo
**Base URL**: https://api.promptmate_io.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/promptmate_io](https://integrations.do/promptmate_io)

## Installation

```bash
npm install @dotdo/integration-promptmate_io
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-promptmate_io
```

## Quick Start

```typescript
import { PromptmateIoClient } from '@dotdo/integration-promptmate_io'

// Initialize client
const client = new PromptmateIoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new PromptmateIoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Promptmate io actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `PromptmateIoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof PromptmateIoError) {
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
