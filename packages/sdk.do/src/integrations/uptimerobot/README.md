# Uptimerobot Integration

UptimeRobot is a service that monitors the uptime and performance of websites, applications, and services, providing real-time alerts and detailed logs.

**Category**: productivity
**Service**: Uptimerobot
**Base URL**: https://api.uptimerobot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/uptimerobot](https://integrations.do/uptimerobot)

## Installation

```bash
npm install @dotdo/integration-uptimerobot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-uptimerobot
```

## Quick Start

```typescript
import { UptimerobotClient } from '@dotdo/integration-uptimerobot'

// Initialize client
const client = new UptimerobotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new UptimerobotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Uptimerobot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `UptimerobotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof UptimerobotError) {
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
