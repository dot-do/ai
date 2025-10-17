# Doppler marketing automation Integration

Doppler is a marketing automation platform that enables users to create, send, and analyze email campaigns, manage subscriber lists, and integrate with various tools to enhance marketing efforts.

**Category**: productivity
**Service**: DopplerMarketingAutomation
**Base URL**: https://api.doppler_marketing_automation.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/doppler_marketing_automation](https://integrations.do/doppler_marketing_automation)

## Installation

```bash
npm install @dotdo/integration-doppler_marketing_automation
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-doppler_marketing_automation
```

## Quick Start

```typescript
import { DopplerMarketingAutomationClient } from '@dotdo/integration-doppler_marketing_automation'

// Initialize client
const client = new DopplerMarketingAutomationClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DopplerMarketingAutomationClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Doppler marketing automation actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DopplerMarketingAutomationError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DopplerMarketingAutomationError) {
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
