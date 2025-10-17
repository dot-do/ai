# Survey monkey Integration

SurveyMonkey is an online survey development platform that enables users to create, distribute, and analyze surveys for various purposes.

**Category**: productivity
**Service**: SurveyMonkey
**Base URL**: https://api.survey_monkey.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/survey_monkey](https://integrations.do/survey_monkey)

## Installation

```bash
npm install @dotdo/integration-survey_monkey
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-survey_monkey
```

## Quick Start

```typescript
import { SurveyMonkeyClient } from '@dotdo/integration-survey_monkey'

// Initialize client
const client = new SurveyMonkeyClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new SurveyMonkeyClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Survey monkey actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `SurveyMonkeyError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof SurveyMonkeyError) {
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
