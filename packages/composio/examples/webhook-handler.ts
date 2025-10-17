/**
 * Example webhook handler for Composio triggers
 */

import crypto from 'crypto'

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

/**
 * Example webhook handler (Express/Hono compatible)
 */
export async function handleComposioWebhook(request: Request, webhookSecret: string): Promise<Response> {
  // Get signature from header
  const signature = request.headers.get('x-composio-signature')
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing signature' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Get payload
  const payload = await request.text()

  // Verify signature
  if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Parse event
  const event = JSON.parse(payload)

  // Return 200 immediately (process async)
  processWebhookAsync(event)

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Process webhook asynchronously
 */
async function processWebhookAsync(event: any) {
  try {
    console.log('Processing webhook:', event.trigger_name)

    // Route to appropriate handler
    switch (event.trigger_name) {
      case 'SLACK_RECEIVE_MESSAGE':
        await handleSlackMessage(event)
        break
      case 'GITHUB_COMMIT_EVENT':
        await handleGitHubCommit(event)
        break
      case 'GITHUB_PULL_REQUEST_EVENT':
        await handleGitHubPR(event)
        break
      default:
        console.log('Unknown trigger:', event.trigger_name)
    }
  } catch (error) {
    console.error('Webhook processing failed:', error)
    // Log to error tracking service (Sentry, etc.)
  }
}

/**
 * Handle Slack message
 */
async function handleSlackMessage(event: any) {
  const { text, user, channel } = event.payload

  console.log(`Slack message from ${user} in ${channel}: ${text}`)

  // Example: Respond to support requests
  if (text.toLowerCase().includes('help') || text.toLowerCase().includes('support')) {
    // Generate AI response or create support ticket
    console.log('Creating support ticket...')
  }
}

/**
 * Handle GitHub commit
 */
async function handleGitHubCommit(event: any) {
  const { message, author, url } = event.payload

  console.log(`GitHub commit by ${author}: ${message}`)
  console.log(`URL: ${url}`)

  // Example: Trigger CI/CD or notify team
  console.log('Triggering CI/CD pipeline...')
}

/**
 * Handle GitHub PR
 */
async function handleGitHubPR(event: any) {
  const { action, number, title } = event.payload

  console.log(`GitHub PR #${number} ${action}: ${title}`)

  // Example: Run code review or tests
  if (action === 'opened') {
    console.log('Running automated code review...')
  }
}

/**
 * Example: Cloudflare Worker webhook handler
 */
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/webhooks/composio' && request.method === 'POST') {
      return handleComposioWebhook(request, env.COMPOSIO_WEBHOOK_SECRET)
    }

    return new Response('Not found', { status: 404 })
  },
}
