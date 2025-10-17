# Google cloud vision Integration

Google Cloud Vision API enables developers to integrate vision detection features into applications, including image labeling, face and landmark detection, optical character recognition (OCR), and explicit content tagging.

**Category**: productivity
**Service**: GoogleCloudVision
**Base URL**: https://api.google_cloud_vision.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google_cloud_vision](https://integrations.do/google_cloud_vision)

## Installation

```bash
npm install @dotdo/integration-google_cloud_vision
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google_cloud_vision
```

## Quick Start

```typescript
import { GoogleCloudVisionClient } from '@dotdo/integration-google_cloud_vision'

// Initialize client
const client = new GoogleCloudVisionClient({
  apiKey: 'your-api-key',
})
```

## Authentication

This Integration uses **api-key** authentication.

Provide your API key when initializing the client:

```typescript
const client = new GoogleCloudVisionClient({
  apiKey: process.env.API_KEY,
})
```

## Resources

### Action

Execute Google cloud vision actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleCloudVisionError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleCloudVisionError) {
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
