# Scrapingbee Integration

ScrapingBee is a web scraping API that handles headless browsers and proxy rotation, allowing developers to extract HTML from any website in a single API call.

**Category**: productivity
**Service**: Scrapingbee
**Base URL**: https://api.scrapingbee.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/scrapingbee](https://integrations.do/scrapingbee)

## Installation

```bash
npm install @dotdo/integration-scrapingbee
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-scrapingbee
```

## Quick Start

```typescript
import { ScrapingbeeClient } from '@dotdo/integration-scrapingbee'

// Initialize client
const client = new ScrapingbeeClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ScrapingbeeClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Scrapingbee actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ScrapingbeeError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ScrapingbeeError) {
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
