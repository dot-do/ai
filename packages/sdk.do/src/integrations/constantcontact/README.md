# Constant Contact Integration

Email marketing and campaign management platform

**Category**: marketing
**Service**: Constantcontact
**Base URL**: https://api.cc.email/v3

This Integration is auto-generated from MDXLD definition: [https://integrations.do/constantcontact](https://integrations.do/constantcontact)

## Installation

```bash
npm install @dotdo/integration-constantcontact
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-constantcontact
```

## Quick Start

```typescript
import { ConstantcontactClient } from '@dotdo/integration-constantcontact'

// Initialize client
const client = new ConstantcontactClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new ConstantcontactClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Contact

Manage email contacts

#### `contact.create()`

```typescript
const result = await client.contact.create({
  email_address: 'example', // Contact email
  first_name: 'example', // First name
  last_name: 'example', // Last name
})
```

#### `contact.get()`

```typescript
const result = await client.contact.get({
  contact_id: 'example', // Contact ID
})
```

#### `contact.update()`

```typescript
const result = await client.contact.update({
  contact_id: 'example', // Contact ID
  email_address: 'example', // Updated email
})
```

#### `contact.delete()`

```typescript
const result = await client.contact.delete({
  contact_id: 'example', // Contact ID
})
```

#### `contact.list()`

```typescript
const result = await client.contact.list({
  limit: 123, // Results per page
})
```

### Campaign

Manage email campaigns

#### `campaign.create()`

```typescript
const result = await client.campaign.create({
  name: 'example', // Campaign name
})
```

#### `campaign.get()`

```typescript
const result = await client.campaign.get({
  campaign_id: 'example', // Campaign ID
})
```

#### `campaign.list()`

```typescript
const result = await client.campaign.list()
```

## Error Handling

All errors are thrown as `ConstantcontactError` instances with additional metadata:

```typescript
try {
  const result = await client.contact.list()
} catch (error) {
  if (error instanceof ConstantcontactError) {
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
