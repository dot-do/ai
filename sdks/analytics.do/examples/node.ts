/**
 * analytics.do Node.js Server Example
 */

import { analytics } from '@dotdo/analytics.do/server'

// Initialize server analytics
analytics.init({
  writeKey: process.env.ANALYTICS_WRITE_KEY!,
  host: 'https://analytics.do',
  debug: true,
  batchSize: 100,
  batchInterval: 5000,
  flushInterval: 10000,
})

// Track server-side events
async function trackServerEvents() {
  // Track user signup
  await analytics.track('user_signup', {
    method: 'email',
    plan: 'free',
  }, {
    userId: 'user-123',
  })

  // Identify user
  await analytics.identify('user-123', {
    email: 'user@example.com',
    name: 'John Doe',
    createdAt: new Date().toISOString(),
  })

  // Track bulk events
  await analytics.trackBulk([
    {
      event: 'api_request',
      userId: 'user-123',
      properties: { endpoint: '/api/users', method: 'GET' },
    },
    {
      event: 'api_request',
      userId: 'user-456',
      properties: { endpoint: '/api/orders', method: 'POST' },
    },
  ])

  // Group user
  await analytics.group('user-123', 'org-abc', {
    name: 'Acme Inc',
    plan: 'enterprise',
  })
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...')
  await analytics.shutdown()
  process.exit(0)
})

// Run example
trackServerEvents().catch(console.error)
