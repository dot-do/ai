# Tavily Integration

Tavily offers search and data retrieval solutions, helping teams quickly locate and filter relevant information from documents, databases, or web sources

**Category**: analytics
**Service**: Tavily
**Base URL**: https://api.tavily.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/tavily](https://integrations.do/tavily)

## Installation

```bash
npm install @dotdo/integration-tavily
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-tavily
```

## Quick Start

```typescript
import { TavilyClient } from '@dotdo/integration-tavily'

// Initialize client
const client = new TavilyClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TavilyClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Tavily actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TavilyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TavilyError) {
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
