# Sms alert Integration

SMS Alert is a versatile multi-channel communication platform enabling businesses to engage with customers through SMS, RCS, Telegram, and WhatsApp via a unified REST API.

**Category**: productivity
**Service**: SmsAlert
**Base URL**: https://api.sms_alert.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/sms_alert](https://integrations.do/sms_alert)

## Installation

```bash
npm install @dotdo/integration-sms_alert
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-sms_alert
```

## Quick Start

```typescript
import { SmsAlertClient } from '@dotdo/integration-sms_alert'

// Initialize client
const client = new SmsAlertClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new SmsAlertClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Sms alert actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SmsAlertError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SmsAlertError) {
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
