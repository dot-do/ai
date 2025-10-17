# Visme Integration

Visme is a visual content creation platform, enabling users to build engaging presentations, infographics, and graphics with customizable templates and multimedia elements

**Category**: productivity
**Service**: Visme
**Base URL**: https://api.visme.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/visme](https://integrations.do/visme)

## Installation

```bash
npm install @dotdo/integration-visme
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-visme
```

## Quick Start

```typescript
import { VismeClient } from '@dotdo/integration-visme'

// Initialize client
const client = new VismeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new VismeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Visme actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `VismeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof VismeError) {
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
