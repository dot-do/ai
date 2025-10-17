# Campaign cleaner Integration

Campaign Cleaner is a tool designed to optimize email campaigns by ensuring compatibility across email clients, improving deliverability, and enhancing overall performance.

**Category**: productivity
**Service**: CampaignCleaner
**Base URL**: https://api.campaign_cleaner.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/campaign_cleaner](https://integrations.do/campaign_cleaner)

## Installation

```bash
npm install @dotdo/integration-campaign_cleaner
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-campaign_cleaner
```

## Quick Start

```typescript
import { CampaignCleanerClient } from '@dotdo/integration-campaign_cleaner'

// Initialize client
const client = new CampaignCleanerClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CampaignCleanerClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Campaign cleaner actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CampaignCleanerError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CampaignCleanerError) {
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
