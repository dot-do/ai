# Atlassian Integration

Atlassian provides developer tools and collaboration software, including Jira and Confluence, to empower teams with comprehensive issue tracking, project planning, documentation, and agile workflows capabilities

**Category**: developer-tools
**Service**: Atlassian
**Base URL**: https://api.atlassian.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/atlassian](https://integrations.do/atlassian)

## Installation

```bash
npm install @dotdo/integration-atlassian
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-atlassian
```

## Quick Start

```typescript
import { AtlassianClient } from '@dotdo/integration-atlassian'

// Initialize client
const client = new AtlassianClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new AtlassianClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Atlassian actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `AtlassianError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof AtlassianError) {
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
