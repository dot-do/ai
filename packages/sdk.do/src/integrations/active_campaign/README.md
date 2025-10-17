# Active campaign Integration

ActiveCampaign is a marketing automation and CRM platform enabling businesses to manage email campaigns, sales pipelines, and customer segmentation to boost engagement and drive growth

**Category**: marketing
**Service**: ActiveCampaign
**Base URL**: https://api.active_campaign.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/active_campaign](https://integrations.do/active_campaign)

## Installation

```bash
npm install @dotdo/integration-active_campaign
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-active_campaign
```

## Quick Start

```typescript
import { ActiveCampaignClient } from '@dotdo/integration-active_campaign'

// Initialize client
const client = new ActiveCampaignClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new ActiveCampaignClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Active campaign actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `ActiveCampaignError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof ActiveCampaignError) {
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
