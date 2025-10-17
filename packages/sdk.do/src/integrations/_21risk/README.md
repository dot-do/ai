# 21risk Integration

21RISK is a web application that simplifies working with checklists, audits, and actions, facilitating compliance and risk management processes.

**Category**: productivity
**Service**: 21risk
**Base URL**: https://api.\_21risk.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/\_21risk](https://integrations.do/_21risk)

## Installation

```bash
npm install @dotdo/integration-_21risk
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-_21risk
```

## Quick Start

```typescript
import { 21riskClient } from '@dotdo/integration-_21risk'

// Initialize client
const client = new 21riskClient({
  apiKey: 'your-api-key',
})

```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new 21riskClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute 21risk actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `21riskError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof 21riskError) {
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
