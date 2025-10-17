# OneDrive Integration

Microsoft cloud storage and file synchronization service

**Category**: storage
**Service**: Onedrive
**Base URL**: https://graph.microsoft.com/v1.0

This Integration is auto-generated from MDXLD definition: [https://integrations.do/onedrive](https://integrations.do/onedrive)

## Installation

```bash
npm install @dotdo/integration-onedrive
```

Or with pnpm:

```bash
pnpm add @dotdo/integration-onedrive
```

## Quick Start

```typescript
import { OnedriveClient } from '@dotdo/integration-onedrive'

// Initialize client
const client = new OnedriveClient({
  accessToken: 'your-access-token',
})
```

## Authentication

This Integration uses **oauth2** authentication.

This Integration uses OAuth2 for authentication. You need to obtain an access token first:

```typescript
const client = new OnedriveClient({
  accessToken: process.env.ACCESS_TOKEN,
})
```

## Resources

### Drive

Access user drives

#### `drive.get()`

```typescript
const result = await client.drive.get()
```

#### `drive.list()`

```typescript
const result = await client.drive.list()
```

### File

Upload, download, and manage files

#### `file.upload()`

```typescript
const result = await client.file.upload({
  file_path: 'example', // File path in OneDrive
  content: value, // File contents
})
```

#### `file.get()`

```typescript
const result = await client.file.get({
  item_id: 'example', // Item ID
})
```

#### `file.download()`

```typescript
const result = await client.file.download({
  item_id: 'example', // Item ID
})
```

#### `file.update()`

```typescript
const result = await client.file.update({
  item_id: 'example', // Item ID
  name: 'example', // New file name
  description: 'example', // File description
})
```

#### `file.delete()`

```typescript
const result = await client.file.delete({
  item_id: 'example', // Item ID
})
```

#### `file.copy()`

```typescript
const result = await client.file.copy({
  item_id: 'example', // Item ID
  parentReference: {}, // Destination folder reference
  name: 'example', // New file name
})
```

#### `file.move()`

```typescript
const result = await client.file.move({
  item_id: 'example', // Item ID
  parentReference: {}, // New parent folder
  name: 'example', // New file name
})
```

### Folder

Create and manage folders

#### `folder.create()`

```typescript
const result = await client.folder.create({
  parent_id: 'example', // Parent folder ID (root for root folder)
  name: 'example', // Folder name
  folder: {}, // Folder facet (empty object)
})
```

#### `folder.get()`

```typescript
const result = await client.folder.get({
  item_id: 'example', // Folder ID
})
```

#### `folder.list()`

```typescript
const result = await client.folder.list({
  item_id: 'example', // Folder ID (root for root folder)
})
```

#### `folder.delete()`

```typescript
const result = await client.folder.delete({
  item_id: 'example', // Folder ID
})
```

### SharedLink

Create and manage sharing permissions

#### `sharedLink.create()`

```typescript
const result = await client.sharedLink.create({
  item_id: 'example', // Item ID
  type: 'example', // Link type (view, edit, embed)
  scope: 'example', // Scope (anonymous, organization)
})
```

#### `sharedLink.list()`

```typescript
const result = await client.sharedLink.list({
  item_id: 'example', // Item ID
})
```

#### `sharedLink.delete()`

```typescript
const result = await client.sharedLink.delete({
  item_id: 'example', // Item ID
  permission_id: 'example', // Permission ID
})
```

### Subscription

Create and manage webhook subscriptions

#### `subscription.create()`

```typescript
const result = await client.subscription.create({
  changeType: 'example', // Change type (created, updated, deleted)
  notificationUrl: 'example', // Webhook URL
  resource: 'example', // Resource path (e.g., /me/drive/root)
  expirationDateTime: 'example', // Subscription expiry (max 6 months)
})
```

#### `subscription.get()`

```typescript
const result = await client.subscription.get({
  subscription_id: 'example', // Subscription ID
})
```

#### `subscription.list()`

```typescript
const result = await client.subscription.list()
```

#### `subscription.update()`

```typescript
const result = await client.subscription.update({
  subscription_id: 'example', // Subscription ID
  expirationDateTime: 'example', // New expiry date
})
```

#### `subscription.delete()`

```typescript
const result = await client.subscription.delete({
  subscription_id: 'example', // Subscription ID
})
```

## Error Handling

All errors are thrown as `OnedriveError` instances with additional metadata:

```typescript
try {
  const result = await client.drive.list()
} catch (error) {
  if (error instanceof OnedriveError) {
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

## Webhooks

This Integration supports webhooks for real-time event notifications.

```typescript
import { OnedriveWebhookHandler, WebhookEventRouter } from '@dotdo/integration-onedrive'

// Initialize webhook handler
const handler = new OnedriveWebhookHandler(process.env.WEBHOOK_SECRET)

// Verify and parse webhook
const event = await handler.handleRequest(request)

// Route events to handlers
const router = new WebhookEventRouter()
router.onFileCreated(async (event) => {
  console.log(event.data)
})

await router.route(event)
```

**Available Events:**

- `created` - File or folder created
- `updated` - File or folder updated
- `deleted` - File or folder deleted

## License

MIT
