# Webhook Verification Utilities

The SDK provides comprehensive webhook verification and signing utilities for all major webhook providers and the .do platform.

## Installation

```bash
npm install sdk.do
```

## Features

- ✅ **GitHub Webhooks** - HMAC SHA-256 signature verification
- ✅ **Stripe Webhooks** - Timestamp + HMAC SHA-256 with 5-minute tolerance
- ✅ **WorkOS Webhooks** - Timestamp + HMAC SHA-256 verification
- ✅ **Zapier Webhooks** - Optional HMAC SHA-256 verification
- ✅ **`.do` Platform Webhooks** - Signed webhooks from webhooks.do
- ✅ **Auto-detection** - Automatically detect and verify any supported provider
- ✅ **Outbound Signing** - Sign your own webhooks with HMAC SHA-256
- ✅ **TypeScript** - Full type safety and IntelliSense support

## Receiving Webhooks

### Verify Any Provider (Auto-detection)

The easiest way to verify webhooks - automatically detects the provider based on headers:

```typescript
import { verifyWebhook } from 'sdk.do'

export default {
  async fetch(request: Request, env: Env) {
    const result = await verifyWebhook(request, {
      github: env.GITHUB_WEBHOOK_SECRET,
      stripe: env.STRIPE_WEBHOOK_SECRET,
      workos: env.WORKOS_WEBHOOK_SECRET,
      zapier: env.ZAPIER_WEBHOOK_SECRET,
      do: env.WEBHOOK_SECRET,
    })

    if (!result.valid) {
      return new Response(`Invalid signature: ${result.error}`, { status: 401 })
    }

    console.log(`Valid webhook from ${result.provider}`)
    const payload = await request.json()

    // Handle webhook...
    return new Response('OK')
  },
}
```

### Verify GitHub Webhooks

```typescript
import { verifyGitHubWebhook } from 'sdk.do'

const body = await request.text()
const signature = request.headers.get('x-hub-signature-256')

if (!signature) {
  return new Response('Missing signature', { status: 400 })
}

const isValid = await verifyGitHubWebhook(body, signature, env.GITHUB_WEBHOOK_SECRET)

if (!isValid) {
  return new Response('Invalid signature', { status: 401 })
}

// Process webhook...
```

**Headers Required:**

- `x-hub-signature-256`: GitHub's HMAC SHA-256 signature (format: `sha256=...`)
- `x-github-event`: Event type (e.g., `issues`, `pull_request`)
- `x-github-delivery`: Unique delivery ID

### Verify Stripe Webhooks

```typescript
import { verifyStripeWebhook } from 'sdk.do'

const body = await request.text()
const signature = request.headers.get('stripe-signature')

if (!signature) {
  return new Response('Missing signature', { status: 400 })
}

const isValid = await verifyStripeWebhook(
  body,
  signature,
  env.STRIPE_WEBHOOK_SECRET,
  300 // tolerance in seconds (default: 300 = 5 minutes)
)

if (!isValid) {
  return new Response('Invalid signature', { status: 401 })
}

// Process webhook...
```

**Headers Required:**

- `stripe-signature`: Stripe's signature (format: `t=timestamp,v1=sig1,v1=sig2`)

**Timestamp Protection:** Stripe webhooks include a timestamp to prevent replay attacks. The default tolerance is 5 minutes.

### Verify WorkOS Webhooks

```typescript
import { verifyWorkOSWebhook } from 'sdk.do'

const body = await request.text()
const signature = request.headers.get('workos-signature')

if (!signature) {
  return new Response('Missing signature', { status: 400 })
}

const isValid = await verifyWorkOSWebhook(
  body,
  signature,
  env.WORKOS_WEBHOOK_SECRET,
  300000 // tolerance in milliseconds (default: 300000 = 5 minutes)
)

if (!isValid) {
  return new Response('Invalid signature', { status: 401 })
}

// Process webhook...
```

**Headers Required:**

- `workos-signature`: WorkOS HMAC SHA-256 signature

**Timestamp Protection:** WorkOS includes `created_at` in the payload. The default tolerance is 5 minutes.

### Verify Zapier Webhooks

```typescript
import { verifyZapierWebhook } from 'sdk.do'

const body = await request.text()
const signature = request.headers.get('x-zapier-signature')

// Note: Zapier signatures are optional
if (signature && env.ZAPIER_WEBHOOK_SECRET) {
  const isValid = await verifyZapierWebhook(body, signature, env.ZAPIER_WEBHOOK_SECRET)

  if (!isValid) {
    return new Response('Invalid signature', { status: 401 })
  }
} else {
  console.warn('Zapier webhook received without signature verification')
}

// Process webhook...
```

**Headers Optional:**

- `x-zapier-signature`: HMAC SHA-256 signature (not all Zapier webhooks include this)

### Verify .do Platform Webhooks

Verify webhooks sent by the .do platform (from `webhooks.do/send`):

```typescript
import { verifyDoWebhook } from 'sdk.do'

const body = await request.text()
const signature = request.headers.get('x-webhook-signature')
const timestamp = request.headers.get('x-webhook-timestamp')

if (!signature) {
  return new Response('Missing signature', { status: 400 })
}

const isValid = await verifyDoWebhook(
  body,
  signature,
  env.WEBHOOK_SECRET,
  timestamp || undefined,
  300 // tolerance in seconds
)

if (!isValid) {
  return new Response('Invalid signature', { status: 401 })
}

// Process webhook...
```

**Headers:**

- `x-webhook-signature`: HMAC SHA-256 signature (format: `sha256=...`)
- `x-webhook-timestamp`: ISO 8601 timestamp (optional, for replay protection)
- `x-webhook-attempt`: Attempt number if retried

## Sending Webhooks

### Send Signed Webhook

Send a webhook with automatic signature generation:

```typescript
import { sendWebhook } from 'sdk.do'

const response = await sendWebhook(
  'https://example.com/webhook', // URL
  {
    // Payload
    event: 'user.created',
    data: {
      userId: '123',
      email: 'user@example.com',
      createdAt: new Date().toISOString(),
    },
  },
  env.WEBHOOK_SECRET // Optional signing secret
)

if (!response.ok) {
  console.error('Webhook delivery failed:', response.statusText)
}
```

**Generated Headers:**

- `Content-Type: application/json`
- `User-Agent: sdk.do/1.0`
- `X-Webhook-Timestamp`: Current ISO 8601 timestamp
- `X-Webhook-Signature`: HMAC SHA-256 signature (if secret provided)

### Manual Signing

Sign a payload manually for custom webhook implementations:

```typescript
import { signWebhook } from 'sdk.do'

const payload = {
  event: 'order.completed',
  data: { orderId: '456' },
}

const signature = await signWebhook(payload, env.WEBHOOK_SECRET)

await fetch('https://example.com/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature, // sha256=...
    'X-Webhook-Timestamp': new Date().toISOString(),
  },
  body: JSON.stringify(payload),
})
```

## Using with Cloudflare Workers

### Complete Example

```typescript
import { Hono } from 'hono'
import { verifyWebhook } from 'sdk.do'

interface Env {
  GITHUB_WEBHOOK_SECRET: string
  STRIPE_WEBHOOK_SECRET: string
  WORKOS_WEBHOOK_SECRET: string
  WEBHOOK_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

// Receive webhooks from any provider
app.post('/webhook', async (c) => {
  const result = await verifyWebhook(c.req.raw, {
    github: c.env.GITHUB_WEBHOOK_SECRET,
    stripe: c.env.STRIPE_WEBHOOK_SECRET,
    workos: c.env.WORKOS_WEBHOOK_SECRET,
    do: c.env.WEBHOOK_SECRET,
  })

  if (!result.valid) {
    return c.json({ error: result.error }, 401)
  }

  const payload = await c.req.json()

  console.log(`Processing ${result.provider} webhook:`, payload)

  // Handle webhook based on provider
  switch (result.provider) {
    case 'github':
      // Handle GitHub webhook
      break
    case 'stripe':
      // Handle Stripe webhook
      break
    case 'workos':
      // Handle WorkOS webhook
      break
  }

  return c.json({ success: true })
})

export default app
```

## Security Best Practices

### 1. Always Verify Signatures

**❌ DON'T** skip signature verification:

```typescript
// BAD: Accepting webhooks without verification
app.post('/webhook', async (c) => {
  const payload = await c.req.json()
  // Process payload without verification - INSECURE!
})
```

**✅ DO** always verify signatures:

```typescript
// GOOD: Verify before processing
app.post('/webhook', async (c) => {
  const result = await verifyWebhook(c.req.raw, { ... })
  if (!result.valid) {
    return c.json({ error: 'Invalid signature' }, 401)
  }
  const payload = await c.req.json()
  // Safe to process
})
```

### 2. Use Environment Variables for Secrets

**❌ DON'T** hardcode secrets:

```typescript
// BAD
const isValid = await verifyGitHubWebhook(body, sig, 'my-secret-123')
```

**✅ DO** use environment variables:

```typescript
// GOOD
const isValid = await verifyGitHubWebhook(body, sig, env.GITHUB_WEBHOOK_SECRET)
```

### 3. Check Timestamps

For providers that include timestamps (Stripe, WorkOS, .do), always verify them to prevent replay attacks:

```typescript
// Use default 5-minute tolerance
await verifyStripeWebhook(body, sig, secret) // 300 seconds default

// Or customize tolerance
await verifyStripeWebhook(body, sig, secret, 60) // 1 minute tolerance
```

### 4. Log Verification Failures

Monitor for potential attacks:

```typescript
const result = await verifyWebhook(request, secrets)

if (!result.valid) {
  console.error('Webhook verification failed:', {
    error: result.error,
    ip: request.headers.get('cf-connecting-ip'),
    userAgent: request.headers.get('user-agent'),
  })
  return new Response('Unauthorized', { status: 401 })
}
```

### 5. Rate Limiting

Implement rate limiting for webhook endpoints:

```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: env.REDIS,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
})

app.post('/webhook', async (c) => {
  const ip = c.req.header('cf-connecting-ip')
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return c.json({ error: 'Rate limit exceeded' }, 429)
  }

  // Verify and process webhook...
})
```

## Provider-Specific Notes

### GitHub

- Signature format: `sha256=<hex>`
- Header: `x-hub-signature-256`
- Secret: Configure in repository settings → Webhooks
- Events: `issues`, `pull_request`, `push`, `release`, etc.
- [Documentation](https://docs.github.com/webhooks)

### Stripe

- Signature format: `t=<timestamp>,v1=<sig1>,v1=<sig2>`
- Header: `stripe-signature`
- Secret: Found in Stripe Dashboard → Developers → Webhooks
- Includes timestamp for replay protection
- May include multiple signatures (use any valid one)
- [Documentation](https://stripe.com/docs/webhooks)

### WorkOS

- Signature format: `<hex>`
- Header: `workos-signature`
- Secret: Configure in WorkOS Dashboard → Webhooks
- Timestamp in payload (`created_at` field)
- [Documentation](https://workos.com/docs/webhooks)

### Zapier

- Signature format: `<hex>`
- Header: `x-zapier-signature`
- **Optional**: Not all Zapier webhooks include signatures
- Configure in Zapier webhook settings
- [Documentation](https://zapier.com/help/create/customize/set-up-webhooks-in-zaps)

### .do Platform

- Signature format: `sha256=<hex>`
- Headers: `x-webhook-signature`, `x-webhook-timestamp`, `x-webhook-attempt`
- Secret: Your webhook signing secret
- Includes retry attempt number
- Sent from `webhooks.do/send` endpoint

## API Reference

### `verifyWebhook(request, secrets): Promise<WebhookVerificationResult>`

Auto-detect and verify webhook from any supported provider.

**Parameters:**

- `request: Request` - Fetch API Request object
- `secrets: object` - Webhook secrets for each provider
  - `github?: string` - GitHub webhook secret
  - `stripe?: string` - Stripe webhook secret
  - `workos?: string` - WorkOS webhook secret
  - `zapier?: string` - Zapier webhook secret
  - `do?: string` - .do platform webhook secret

**Returns:** `Promise<WebhookVerificationResult>`

```typescript
interface WebhookVerificationResult {
  valid: boolean // Whether signature is valid
  error?: string // Error message if invalid
  provider?: string // Detected provider (github, stripe, workos, zapier, do)
}
```

### `verifyGitHubWebhook(body, signature, secret): Promise<boolean>`

Verify GitHub webhook signature.

### `verifyStripeWebhook(body, signature, secret, tolerance?): Promise<boolean>`

Verify Stripe webhook signature with timestamp validation.

### `verifyWorkOSWebhook(body, signature, secret, tolerance?): Promise<boolean>`

Verify WorkOS webhook signature with timestamp validation.

### `verifyZapierWebhook(body, signature, secret): Promise<boolean>`

Verify Zapier webhook signature (optional).

### `verifyDoWebhook(body, signature, secret, timestamp?, tolerance?): Promise<boolean>`

Verify .do platform webhook signature with optional timestamp validation.

### `signWebhook(payload, secret): Promise<string>`

Sign webhook payload for outbound delivery.

**Returns:** Signature in format `sha256=<hex>`

### `sendWebhook(url, payload, secret?, options?): Promise<Response>`

Send signed webhook to external endpoint.

**Parameters:**

- `url: string` - Target webhook URL
- `payload: any` - Webhook payload (will be JSON stringified)
- `secret?: string` - Optional signing secret
- `options?: RequestInit` - Additional fetch options

**Returns:** `Promise<Response>` - Fetch API Response

## Testing

### Mock Webhook Signatures

For testing, you can generate valid signatures:

```typescript
import { signWebhook } from 'sdk.do'

const payload = { test: 'data' }
const secret = 'test-secret'
const signature = await signWebhook(payload, secret)

// Use in test requests
const request = new Request('http://localhost/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature,
  },
  body: JSON.stringify(payload),
})
```

### Example Test

```typescript
import { describe, it, expect } from 'vitest'
import { verifyDoWebhook, signWebhook } from 'sdk.do'

describe('Webhook Verification', () => {
  it('should verify valid signature', async () => {
    const payload = { event: 'test' }
    const secret = 'test-secret'
    const body = JSON.stringify(payload)
    const signature = await signWebhook(body, secret)

    const isValid = await verifyDoWebhook(body, signature, secret)
    expect(isValid).toBe(true)
  })

  it('should reject invalid signature', async () => {
    const body = JSON.stringify({ event: 'test' })
    const secret = 'test-secret'
    const invalidSignature = 'sha256=invalid'

    const isValid = await verifyDoWebhook(body, invalidSignature, secret)
    expect(isValid).toBe(false)
  })
})
```

## Troubleshooting

### Signature Verification Fails

1. **Check secret** - Ensure you're using the correct secret for the provider
2. **Check body** - Must be raw body (string or Uint8Array), not parsed JSON
3. **Check headers** - Verify signature header is present and correctly named
4. **Check timestamp** - For Stripe/WorkOS, ensure system time is synchronized

### Example: Debugging Failed Verification

```typescript
const result = await verifyWebhook(request, secrets)

if (!result.valid) {
  console.error('Verification failed:', {
    error: result.error,
    provider: result.provider,
    headers: Object.fromEntries(request.headers),
    bodyPreview: (await request.text()).slice(0, 100),
  })
}
```

### Common Mistakes

**❌ Parsing body before verification:**

```typescript
// BAD: Don't parse before verifying
const payload = await request.json() // Consumes body stream
const isValid = await verifyWebhook(request, secrets) // Fails - body already read
```

**✅ Verify raw body first:**

```typescript
// GOOD: Verify raw body first
const result = await verifyWebhook(request, secrets) // Reads raw body
if (result.valid) {
  const payload = await request.json() // Now safe to parse
}
```

## License

MIT
