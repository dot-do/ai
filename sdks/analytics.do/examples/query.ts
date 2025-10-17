/**
 * analytics.do Query Example
 */

import { AnalyticsClient } from '@dotdo/analytics.do'

const analytics = new AnalyticsClient({
  writeKey: process.env.ANALYTICS_WRITE_KEY!,
  host: 'https://analytics.do',
})

async function queryAnalytics() {
  // Query events
  const events = await analytics.query({
    event: 'button_clicked',
    from: '2025-01-01',
    to: '2025-01-31',
    limit: 100,
    sort: { timestamp: 'desc' },
  })

  console.log('Events:', events)
  console.log('Total:', events.total)

  // Aggregate metrics
  const metrics = await analytics.aggregate({
    metric: 'count',
    groupBy: ['event', 'properties.page'],
    from: '2025-01-01',
    to: '2025-01-31',
    interval: 'day',
  })

  console.log('Metrics:', metrics)

  // Cohort analysis
  const cohorts = await analytics.cohort({
    activation: 'signup',
    retention: 'login',
    period: 'week',
    cohorts: 12,
    from: '2025-01-01',
  })

  console.log('Cohorts:', cohorts)

  // Funnel analysis
  const funnel = await analytics.funnel({
    steps: ['page_view', 'signup_clicked', 'signup_completed'],
    from: '2025-01-01',
    to: '2025-01-31',
  })

  console.log('Funnel:', funnel)
  console.log('Conversion rate:', funnel.conversion)
}

queryAnalytics().catch(console.error)
