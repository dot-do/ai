# Codeinterpreter Integration

CodeInterpreter extends Python-based coding environments with integrated data analysis, enabling developers to run scripts, visualize results, and prototype solutions inside supported platforms

**Category**: developer-tools
**Service**: Codeinterpreter
**Base URL**: https://api.codeinterpreter.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/codeinterpreter](https://integrations.do/codeinterpreter)

## Installation

```bash
npm install @dotdo/integration-codeinterpreter
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-codeinterpreter
```

## Quick Start

```typescript
import { CodeinterpreterClient } from '@dotdo/integration-codeinterpreter'

// Initialize client
const client = new CodeinterpreterClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CodeinterpreterClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Codeinterpreter actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CodeinterpreterError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CodeinterpreterError) {
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
