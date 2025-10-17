# Icims talent cloud Integration

iCIMS Talent Cloud offers applicant tracking, onboarding, and talent management solutions, empowering organizations to streamline hiring and enhance the candidate experience

**Category**: hr
**Service**: IcimsTalentCloud
**Base URL**: https://api.icims_talent_cloud.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/icims_talent_cloud](https://integrations.do/icims_talent_cloud)

## Installation

```bash
npm install @dotdo/integration-icims_talent_cloud
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-icims_talent_cloud
```

## Quick Start

```typescript
import { IcimsTalentCloudClient } from '@dotdo/integration-icims_talent_cloud'

// Initialize client
const client = new IcimsTalentCloudClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new IcimsTalentCloudClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Icims talent cloud actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `IcimsTalentCloudError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof IcimsTalentCloudError) {
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
