# Google Classroom Integration

Google Classroom is a free web service developed by Google for schools that aims to simplify creating, distributing, and grading assignments

**Category**: productivity
**Service**: GoogleClassroom
**Base URL**: https://api.google_classroom.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/google_classroom](https://integrations.do/google_classroom)

## Installation

```bash
npm install @dotdo/integration-google_classroom
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-google_classroom
```

## Quick Start

```typescript
import { GoogleClassroomClient } from '@dotdo/integration-google_classroom'

// Initialize client
const client = new GoogleClassroomClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new GoogleClassroomClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Google Classroom actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `GoogleClassroomError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof GoogleClassroomError) {
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
