/**
 * Webhook Verification Utilities
 * Provides utilities for verifying webhook signatures from various providers
 * and for sending signed webhooks from .do platform
 */

/**
 * Convert ArrayBuffer to hex string
 */
function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Generate HMAC SHA-256 signature
 */
async function generateSignature(payload: string, secret: string): Promise<string> {
  const secretBytes = new TextEncoder().encode(secret)
  const payloadBytes = new TextEncoder().encode(payload)

  const hmac = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])

  const signature = await crypto.subtle.sign('HMAC', hmac, payloadBytes)

  return toHex(signature)
}

/**
 * Verify GitHub webhook signature
 *
 * @param body - Raw request body (string or Uint8Array)
 * @param signature - Signature from x-hub-signature-256 header (format: "sha256=...")
 * @param secret - GitHub webhook secret
 * @returns true if signature is valid
 *
 * @example
 * ```ts
 * import { verifyGitHubWebhook } from 'sdk.do'
 *
 * const body = await request.text()
 * const signature = request.headers.get('x-hub-signature-256')
 * const isValid = await verifyGitHubWebhook(body, signature, process.env.GITHUB_WEBHOOK_SECRET)
 * ```
 */
export async function verifyGitHubWebhook(body: string | Uint8Array, signature: string, secret: string): Promise<boolean> {
  try {
    const bodyBytes = typeof body === 'string' ? new TextEncoder().encode(body) : body
    const bodyString = typeof body === 'string' ? body : new TextDecoder().decode(body)
    const secretBytes = new TextEncoder().encode(secret)

    const hmac = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])

    const computedSignature = await crypto.subtle.sign('HMAC', hmac, bodyBytes)
    const expectedSignature = `sha256=${toHex(computedSignature)}`

    return timingSafeEqual(signature, expectedSignature)
  } catch (error) {
    console.error('[webhooks] GitHub signature validation error:', error)
    return false
  }
}

/**
 * Verify Stripe webhook signature
 *
 * @param body - Raw request body (string or Uint8Array)
 * @param signature - Signature from stripe-signature header (format: "t=timestamp,v1=sig1,v1=sig2")
 * @param secret - Stripe webhook secret
 * @param tolerance - Maximum age of webhook in seconds (default: 300 = 5 minutes)
 * @returns true if signature is valid
 *
 * @example
 * ```ts
 * import { verifyStripeWebhook } from 'sdk.do'
 *
 * const body = await request.text()
 * const signature = request.headers.get('stripe-signature')
 * const isValid = await verifyStripeWebhook(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
 * ```
 */
export async function verifyStripeWebhook(body: string | Uint8Array, signature: string, secret: string, tolerance: number = 300): Promise<boolean> {
  try {
    const bodyString = typeof body === 'string' ? body : new TextDecoder().decode(body)

    // Parse signature header: "t=timestamp,v1=sig1,v1=sig2"
    const parts = signature.split(',')
    const timestampPart = parts.find((p) => p.startsWith('t='))
    const signatureParts = parts.filter((p) => p.startsWith('v1='))

    if (!timestampPart || signatureParts.length === 0) {
      return false
    }

    const timestamp = parseInt(timestampPart.split('=')[1])
    const providedSignatures = signatureParts.map((p) => p.split('=')[1])

    // Check timestamp tolerance
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - timestamp) > tolerance) {
      console.warn('[webhooks] Stripe webhook timestamp outside tolerance window')
      return false
    }

    // Construct signed payload: timestamp.body
    const signedPayload = `${timestamp}.${bodyString}`

    // Compute expected signature
    const expectedSignature = await generateSignature(signedPayload, secret)

    // Check if any provided signature matches (Stripe may send multiple)
    return providedSignatures.some((sig) => timingSafeEqual(sig, expectedSignature))
  } catch (error) {
    console.error('[webhooks] Stripe signature validation error:', error)
    return false
  }
}

/**
 * Verify WorkOS webhook signature
 *
 * @param body - Raw request body (string or Uint8Array)
 * @param signature - Signature from workos-signature header
 * @param secret - WorkOS webhook secret
 * @param tolerance - Maximum age of webhook in milliseconds (default: 300000 = 5 minutes)
 * @returns true if signature is valid
 *
 * @example
 * ```ts
 * import { verifyWorkOSWebhook } from 'sdk.do'
 *
 * const body = await request.text()
 * const signature = request.headers.get('workos-signature')
 * const isValid = await verifyWorkOSWebhook(body, signature, process.env.WORKOS_WEBHOOK_SECRET)
 * ```
 */
export async function verifyWorkOSWebhook(body: string | Uint8Array, signature: string, secret: string, tolerance: number = 300000): Promise<boolean> {
  try {
    const bodyString = typeof body === 'string' ? body : new TextDecoder().decode(body)
    const payload = JSON.parse(bodyString)

    // Check timestamp in payload
    if (!payload.created_at) {
      return false
    }

    const createdAt = new Date(payload.created_at).getTime()
    const now = Date.now()

    if (Math.abs(now - createdAt) > tolerance) {
      console.warn('[webhooks] WorkOS webhook timestamp outside tolerance window')
      return false
    }

    // Compute expected signature
    const expectedSignature = await generateSignature(bodyString, secret)

    return timingSafeEqual(signature, expectedSignature)
  } catch (error) {
    console.error('[webhooks] WorkOS signature validation error:', error)
    return false
  }
}

/**
 * Verify Zapier webhook signature (optional, not all Zapier webhooks include signatures)
 *
 * @param body - Raw request body (string or Uint8Array)
 * @param signature - Signature from x-zapier-signature header
 * @param secret - Zapier webhook secret
 * @returns true if signature is valid
 *
 * @example
 * ```ts
 * import { verifyZapierWebhook } from 'sdk.do'
 *
 * const body = await request.text()
 * const signature = request.headers.get('x-zapier-signature')
 * if (signature) {
 *   const isValid = await verifyZapierWebhook(body, signature, process.env.ZAPIER_WEBHOOK_SECRET)
 * }
 * ```
 */
export async function verifyZapierWebhook(body: string | Uint8Array, signature: string, secret: string): Promise<boolean> {
  try {
    const bodyString = typeof body === 'string' ? body : new TextDecoder().decode(body)

    const expectedSignature = await generateSignature(bodyString, secret)

    return timingSafeEqual(signature, expectedSignature)
  } catch (error) {
    console.error('[webhooks] Zapier signature validation error:', error)
    return false
  }
}

/**
 * Verify .do platform webhook signature
 * Used to verify webhooks sent by the .do platform (webhooks.do/send)
 *
 * @param body - Raw request body (string or Uint8Array)
 * @param signature - Signature from x-webhook-signature header (format: "sha256=...")
 * @param secret - Webhook signing secret
 * @param timestamp - Timestamp from x-webhook-timestamp header
 * @param tolerance - Maximum age of webhook in seconds (default: 300 = 5 minutes)
 * @returns true if signature is valid
 *
 * @example
 * ```ts
 * import { verifyDoWebhook } from 'sdk.do'
 *
 * const body = await request.text()
 * const signature = request.headers.get('x-webhook-signature')
 * const timestamp = request.headers.get('x-webhook-timestamp')
 * const isValid = await verifyDoWebhook(body, signature, process.env.WEBHOOK_SECRET, timestamp)
 * ```
 */
export async function verifyDoWebhook(
  body: string | Uint8Array,
  signature: string,
  secret: string,
  timestamp?: string,
  tolerance: number = 300
): Promise<boolean> {
  try {
    const bodyString = typeof body === 'string' ? body : new TextDecoder().decode(body)

    // Check timestamp if provided
    if (timestamp) {
      const webhookTime = new Date(timestamp).getTime()
      const now = Date.now()
      if (Math.abs(now - webhookTime) > tolerance * 1000) {
        console.warn('[webhooks] Webhook timestamp outside tolerance window')
        return false
      }
    }

    // Remove "sha256=" prefix if present
    const providedSignature = signature.startsWith('sha256=') ? signature.slice(7) : signature

    const expectedSignature = await generateSignature(bodyString, secret)

    return timingSafeEqual(providedSignature, expectedSignature)
  } catch (error) {
    console.error('[webhooks] .do signature validation error:', error)
    return false
  }
}

/**
 * Sign webhook payload for outbound webhooks
 * Generates HMAC SHA-256 signature for webhook payload
 *
 * @param payload - Webhook payload (will be JSON stringified if object)
 * @param secret - Signing secret
 * @returns Signature in format "sha256=..."
 *
 * @example
 * ```ts
 * import { signWebhook } from 'sdk.do'
 *
 * const payload = { event: 'user.created', data: { userId: '123' } }
 * const signature = await signWebhook(payload, process.env.WEBHOOK_SECRET)
 *
 * await fetch('https://example.com/webhook', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'X-Webhook-Signature': signature,
 *     'X-Webhook-Timestamp': new Date().toISOString(),
 *   },
 *   body: JSON.stringify(payload),
 * })
 * ```
 */
export async function signWebhook(payload: any, secret: string): Promise<string> {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const signature = await generateSignature(body, secret)
  return `sha256=${signature}`
}

/**
 * Webhook verification result
 */
export interface WebhookVerificationResult {
  valid: boolean
  error?: string
  provider?: string
}

/**
 * Verify webhook from any supported provider
 * Auto-detects provider based on headers and verifies signature accordingly
 *
 * @param request - Fetch API Request object
 * @param secrets - Object with webhook secrets for each provider
 * @returns Verification result with provider information
 *
 * @example
 * ```ts
 * import { verifyWebhook } from 'sdk.do'
 *
 * const result = await verifyWebhook(request, {
 *   github: process.env.GITHUB_WEBHOOK_SECRET,
 *   stripe: process.env.STRIPE_WEBHOOK_SECRET,
 *   workos: process.env.WORKOS_WEBHOOK_SECRET,
 *   zapier: process.env.ZAPIER_WEBHOOK_SECRET,
 *   do: process.env.WEBHOOK_SECRET,
 * })
 *
 * if (!result.valid) {
 *   return new Response('Invalid signature', { status: 401 })
 * }
 * ```
 */
export async function verifyWebhook(
  request: Request,
  secrets: {
    github?: string
    stripe?: string
    workos?: string
    zapier?: string
    do?: string
  }
): Promise<WebhookVerificationResult> {
  try {
    const body = await request.text()

    // Detect provider based on headers
    const githubSig = request.headers.get('x-hub-signature-256')
    const stripeSig = request.headers.get('stripe-signature')
    const workosSig = request.headers.get('workos-signature')
    const zapierSig = request.headers.get('x-zapier-signature')
    const doSig = request.headers.get('x-webhook-signature')
    const doTimestamp = request.headers.get('x-webhook-timestamp')

    // GitHub
    if (githubSig && secrets.github) {
      const valid = await verifyGitHubWebhook(body, githubSig, secrets.github)
      return {
        valid,
        provider: 'github',
        error: valid ? undefined : 'Invalid GitHub signature',
      }
    }

    // Stripe
    if (stripeSig && secrets.stripe) {
      const valid = await verifyStripeWebhook(body, stripeSig, secrets.stripe)
      return {
        valid,
        provider: 'stripe',
        error: valid ? undefined : 'Invalid Stripe signature',
      }
    }

    // WorkOS
    if (workosSig && secrets.workos) {
      const valid = await verifyWorkOSWebhook(body, workosSig, secrets.workos)
      return {
        valid,
        provider: 'workos',
        error: valid ? undefined : 'Invalid WorkOS signature',
      }
    }

    // Zapier (optional)
    if (zapierSig && secrets.zapier) {
      const valid = await verifyZapierWebhook(body, zapierSig, secrets.zapier)
      return {
        valid,
        provider: 'zapier',
        error: valid ? undefined : 'Invalid Zapier signature',
      }
    }

    // .do platform
    if (doSig && secrets.do) {
      const valid = await verifyDoWebhook(body, doSig, secrets.do, doTimestamp || undefined)
      return {
        valid,
        provider: 'do',
        error: valid ? undefined : 'Invalid .do webhook signature',
      }
    }

    return {
      valid: false,
      error: 'No recognized webhook signature found',
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send webhook to external endpoint
 * Convenience function for sending signed webhooks
 *
 * @param url - Target webhook URL
 * @param payload - Webhook payload
 * @param secret - Optional signing secret
 * @param options - Additional fetch options
 * @returns Fetch Response
 *
 * @example
 * ```ts
 * import { sendWebhook } from 'sdk.do'
 *
 * const response = await sendWebhook(
 *   'https://example.com/webhook',
 *   { event: 'user.created', data: { userId: '123' } },
 *   process.env.WEBHOOK_SECRET
 * )
 * ```
 */
export async function sendWebhook(url: string, payload: any, secret?: string, options?: RequestInit): Promise<Response> {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload)

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'User-Agent': 'sdk.do/1.0',
    'X-Webhook-Timestamp': new Date().toISOString(),
    ...(options?.headers || {}),
  }

  // Add signature if secret provided
  if (secret) {
    const signature = await signWebhook(body, secret)
    headers['X-Webhook-Signature'] = signature
  }

  return fetch(url, {
    method: 'POST',
    headers,
    body,
    ...options,
  })
}
