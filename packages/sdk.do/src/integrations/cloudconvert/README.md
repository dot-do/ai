# Cloudconvert Integration

CloudConvert is a file conversion service supporting over 200 formats, including audio, video, document, ebook, archive, image, spreadsheet, and presentation formats.

**Category**: productivity
**Service**: Cloudconvert
**Base URL**: https://api.cloudconvert.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/cloudconvert](https://integrations.do/cloudconvert)

## Installation

```bash
npm install @dotdo/integration-cloudconvert
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-cloudconvert
```

## Quick Start

```typescript
import { CloudconvertClient } from '@dotdo/integration-cloudconvert'

// Initialize client
const client = new CloudconvertClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new CloudconvertClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Cloudconvert actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `CloudconvertError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof CloudconvertError) {
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
