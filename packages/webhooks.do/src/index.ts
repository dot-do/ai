/**
 * webhooks.do - Webhook verification and signing utilities
 *
 * Provides comprehensive webhook signature verification for major providers
 * and utilities for signing and sending webhooks from the .do platform.
 *
 * @example
 * ```typescript
 * import { verifyWebhook, sendWebhook } from 'webhooks.do'
 *
 * // Verify incoming webhook (auto-detects provider)
 * const result = await verifyWebhook(request, {
 *   github: env.GITHUB_WEBHOOK_SECRET,
 *   stripe: env.STRIPE_WEBHOOK_SECRET,
 * })
 *
 * if (!result.valid) {
 *   return new Response('Invalid signature', { status: 401 })
 * }
 *
 * // Send signed webhook
 * await sendWebhook(
 *   'https://example.com/webhook',
 *   { event: 'user.created', data: { userId: '123' } },
 *   env.WEBHOOK_SECRET
 * )
 * ```
 */

export {
  verifyGitHubWebhook,
  verifyStripeWebhook,
  verifyWorkOSWebhook,
  verifyZapierWebhook,
  verifyDoWebhook,
  signWebhook,
  verifyWebhook,
  sendWebhook,
} from './webhooks'

export type { WebhookVerificationResult } from './webhooks'
