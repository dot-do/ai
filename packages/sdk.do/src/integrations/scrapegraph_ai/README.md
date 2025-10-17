# Scrapegraph ai Integration

ScrapeGraphAI is an AI-powered web scraping API that enables developers to extract structured data from any website using natural language prompts. Website https://scrapegraphai.com

**Category**: productivity
**Service**: ScrapegraphAi
**Base URL**: https://api.scrapegraph_ai.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/scrapegraph_ai](https://integrations.do/scrapegraph_ai)

## Installation

```bash
npm install @dotdo/integration-scrapegraph_ai
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-scrapegraph_ai
```

## Quick Start

```typescript
import { ScrapegraphAiClient } from '@dotdo/integration-scrapegraph_ai'

// Initialize client
const client = new ScrapegraphAiClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ScrapegraphAiClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Scrapegraph ai actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ScrapegraphAiError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ScrapegraphAiError) {
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
