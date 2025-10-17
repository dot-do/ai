# Webscraping ai Integration

WebScraping.AI provides an API for web scraping with features like Chrome JS rendering, rotating proxies, and HTML parsing.

**Category**: productivity
**Service**: WebscrapingAi
**Base URL**: https://api.webscraping_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/webscraping_ai](https://integrations.do/webscraping_ai)

## Installation

```bash
npm install @dotdo/integration-webscraping_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-webscraping_ai
```

## Quick Start

```typescript
import { WebscrapingAiClient } from '@dotdo/integration-webscraping_ai'

// Initialize client
const client = new WebscrapingAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new WebscrapingAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Webscraping ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `WebscrapingAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof WebscrapingAiError) {
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
