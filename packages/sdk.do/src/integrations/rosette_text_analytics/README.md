# Rosette text analytics Integration

Rosette Text Analytics is a platform that uses natural language processing, statistical modeling, and machine learning to analyze unstructured and semi-structured text across 364 language-encoding-script combinations, revealing valuable information and actionable data.

**Category**: productivity
**Service**: RosetteTextAnalytics
**Base URL**: https://api.rosette_text_analytics.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/rosette_text_analytics](https://integrations.do/rosette_text_analytics)

## Installation

```bash
npm install @dotdo/integration-rosette_text_analytics
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-rosette_text_analytics
```

## Quick Start

```typescript
import { RosetteTextAnalyticsClient } from '@dotdo/integration-rosette_text_analytics'

// Initialize client
const client = new RosetteTextAnalyticsClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new RosetteTextAnalyticsClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Rosette text analytics actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `RosetteTextAnalyticsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof RosetteTextAnalyticsError) {
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
