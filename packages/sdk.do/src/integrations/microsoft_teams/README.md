# Microsoft teams Integration

Microsoft Teams integrates chat, video meetings, and file storage within Microsoft 365, providing virtual collaboration and communication for distributed teams

**Category**: communication
**Service**: MicrosoftTeams
**Base URL**: https://api.microsoft_teams.com

This Integration is auto-generated from MDXLD definition: [https://integrations.do/microsoft_teams](https://integrations.do/microsoft_teams)

## Installation

```bash
npm install @dotdo/integration-microsoft_teams
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-microsoft_teams
```

## Quick Start

```typescript
import { MicrosoftTeamsClient } from '@dotdo/integration-microsoft_teams'

// Initialize client
const client = new MicrosoftTeamsClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new MicrosoftTeamsClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Action

Execute Microsoft teams actions

#### `action.execute()`

```typescript
const result = await client.action.execute({
  action: 'example', // Action name to execute
  parameters: {}, // Action parameters
})
```

## Error Handling

All errors are thrown as `MicrosoftTeamsError` instances with additional metadata:

```typescript
try {
  const result = await client.action.list()
} catch (error) {
  if (error instanceof MicrosoftTeamsError) {
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
