# Scrape do Integration

Scrape.do is a web scraping API offering rotating residential, data-center, and mobile proxies with headless browser support and session management to bypass anti-bot protections (e.g., Cloudflare, Akamai) and extract data at scale in formats like JSON and HTML.

**Category**: productivity
**Service**: ScrapeDo
**Base URL**: https://api.scrape_do.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/scrape_do](https://integrations.do/scrape_do)

## Installation

```bash
npm install @dotdo/integration-scrape_do
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-scrape_do
```

## Quick Start

```typescript
import { ScrapeDoClient } from '@dotdo/integration-scrape_do'

// Initialize client
const client = new ScrapeDoClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ScrapeDoClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Scrape do actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ScrapeDoError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ScrapeDoError) {
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
