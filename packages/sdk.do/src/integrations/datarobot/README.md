# Datarobot Integration

DataRobot is a machine learning platform that automates model building, deployment, and monitoring, enabling organizations to derive predictive insights from large datasets

**Category**: developer-tools
**Service**: Datarobot
**Base URL**: https://api.datarobot.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/datarobot](https://integrations.do/datarobot)

## Installation

```bash
npm install @dotdo/integration-datarobot
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-datarobot
```

## Quick Start

```typescript
import { DatarobotClient } from '@dotdo/integration-datarobot'

// Initialize client
const client = new DatarobotClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new DatarobotClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Datarobot actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DatarobotError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DatarobotError) {
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
