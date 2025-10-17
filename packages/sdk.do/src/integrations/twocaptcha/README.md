# Twocaptcha Integration

2Captcha is a service that provides automated CAPTCHA solving solutions, enabling developers to bypass various types of CAPTCHAs in their applications.

**Category**: productivity
**Service**: Twocaptcha
**Base URL**: https://api.twocaptcha.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/twocaptcha](https://integrations.do/twocaptcha)

## Installation

```bash
npm install @dotdo/integration-twocaptcha
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-twocaptcha
```

## Quick Start

```typescript
import { TwocaptchaClient } from '@dotdo/integration-twocaptcha'

// Initialize client
const client = new TwocaptchaClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new TwocaptchaClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Twocaptcha actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `TwocaptchaError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof TwocaptchaError) {
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
