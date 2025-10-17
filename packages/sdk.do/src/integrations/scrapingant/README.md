# Scrapingant Integration

ScrapingAnt is a web scraping API that provides tools for data extraction, including features like Chrome page rendering, low latency rotating proxies, JavaScript execution, and unlimited parallel requests.

**Category**: productivity
**Service**: Scrapingant
**Base URL**: https://api.scrapingant.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/scrapingant](https://integrations.do/scrapingant)

## Installation

```bash
npm install @dotdo/integration-scrapingant
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-scrapingant
```

## Quick Start

```typescript
import { ScrapingantClient } from '@dotdo/integration-scrapingant'

// Initialize client
const client = new ScrapingantClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ScrapingantClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Scrapingant actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ScrapingantError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ScrapingantError) {
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
