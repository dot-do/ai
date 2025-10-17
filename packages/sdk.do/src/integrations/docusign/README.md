# Docusign Integration

DocuSign provides eSignature and digital agreement solutions, enabling businesses to send, sign, track, and manage documents electronically

**Category**: storage
**Service**: Docusign
**Base URL**: https://api.docusign.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/docusign](https://integrations.do/docusign)

## Installation

```bash
npm install @dotdo/integration-docusign
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-docusign
```

## Quick Start

```typescript
import { DocusignClient } from '@dotdo/integration-docusign'

// Initialize client
const client = new DocusignClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new DocusignClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Docusign actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `DocusignError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof DocusignError) {
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
