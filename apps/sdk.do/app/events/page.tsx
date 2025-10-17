import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Basic Publish',
    code: `import { $ } from '@dotdo/sdk.do'

// Publish an event
await $.send('Order.created', {
  orderId: 'order_123',
  customerId: 'user_456',
  total: 299.99,
  items: [
    { productId: 'prod_789', quantity: 2, price: 149.99 }
  ],
  timestamp: new Date().toISOString()
})

// Event is published to all subscribers
// with automatic retry and DLQ support`,
  },
  {
    title: 'Subscribe to Events',
    code: `import { $ } from '@dotdo/sdk.do'

// Subscribe to specific event types
$.on('Order.created', async (event) => {
  console.log('New order:', event.data.orderId)

  // Process the order
  await $.db.create('notifications', {
    userId: event.data.customerId,
    type: 'order_confirmation',
    message: \`Order \${event.data.orderId} received\`
  })

  // Send confirmation email
  await $.actions.email.send({
    to: event.data.customerEmail,
    template: 'order-confirmation',
    data: event.data
  })
})

// Subscribers run automatically when events are published`,
  },
  {
    title: 'Pattern Matching',
    code: `import { $ } from '@dotdo/sdk.do'

// Subscribe to all Order events
$.on('Order.*', async (event) => {
  console.log('Order event:', event.type)
})

// Subscribe to multiple patterns
$.on(['Order.created', 'Order.updated'], async (event) => {
  // Handle creation and updates
  await $.db.update('order_stats', 'stats_1', {
    lastModified: new Date()
  })
})

// Subscribe with semantic patterns
$.on($.Order.fulfilled, async (event) => {
  // Type-safe event handling
  const orderId = event.data.orderId // string (autocomplete)

  await $.actions.shipping.createLabel({
    orderId,
    address: event.data.shippingAddress
  })
})`,
  },
  {
    title: 'Event Filtering',
    code: `import { $ } from '@dotdo/sdk.do'

// Filter events by data properties
$.on('Order.created', async (event) => {
  // Only handle high-value orders
  if (event.data.total > 1000) {
    await $.actions.notify.team({
      message: \`High-value order: $\${event.data.total}\`,
      channel: 'sales'
    })
  }
})

// Conditional subscriptions
$.on('Product.updated', async (event) => {
  // Only process if price changed
  if (event.data.changes.includes('price')) {
    await $.ai.generate({
      model: 'gpt-5',
      prompt: \`Generate announcement for price change on \${event.data.productName}\`
    })
  }
})`,
  },
  {
    title: 'Event Streaming',
    code: `import { $ } from '@dotdo/sdk.do'

// Stream events in real-time
const stream = $.stream('Order.*')

// WebSocket-compatible event stream
for await (const event of stream) {
  console.log('Event:', event.type)
  console.log('Data:', event.data)
  console.log('Timestamp:', event.timestamp)

  // Process events as they arrive
  if (event.type === 'Order.created') {
    // Handle new order
  } else if (event.type === 'Order.fulfilled') {
    // Handle fulfillment
  }
}

// Stream with filters
const highValueStream = $.stream('Order.*', {
  filter: (event) => event.data.total > 500
})`,
  },
  {
    title: 'Dead Letter Queue',
    code: `import { $ } from '@dotdo/sdk.do'

// Events that fail after retries go to DLQ
$.on('Order.created', async (event) => {
  // This might fail
  await $.actions.external.createOrder(event.data)
}, {
  retry: {
    maxAttempts: 3,
    backoff: 'exponential'
  },
  dlq: true // Enable dead letter queue
})

// Handle failed events from DLQ
$.on('dlq:Order.created', async (event) => {
  // Log the failure
  await $.db.create('failed_events', {
    type: event.type,
    data: event.data,
    error: event.error,
    attempts: event.attempts,
    timestamp: new Date()
  })

  // Alert team
  await $.actions.notify.team({
    message: \`Event processing failed after \${event.attempts} attempts\`,
    severity: 'high'
  })
})`,
  },
  {
    title: 'Event Metrics',
    code: `import { $ } from '@dotdo/sdk.do'

// Track event metrics automatically
$.on('Order.created', async (event) => {
  await processOrder(event.data)
}, {
  metrics: {
    track: ['latency', 'errors', 'throughput'],
    sampleRate: 1.0 // Track all events
  }
})

// Query event metrics
const metrics = await $.events.metrics('Order.created', {
  period: '24h'
})

console.log({
  totalEvents: metrics.count,
  avgLatency: metrics.latency.avg,
  errorRate: metrics.errors.rate,
  throughput: metrics.throughput.perSecond
})

// Get event history
const events = await $.events.history('Order.*', {
  limit: 100,
  since: '2025-10-10T00:00:00Z'
})`,
  },
  {
    title: 'WebSocket Integration',
    code: `import { $ } from '@dotdo/sdk.do'

// Server-side: Subscribe to events and broadcast via WebSocket
const connections = new Set<WebSocket>()

// Add new connections
function handleWebSocket(ws: WebSocket) {
  connections.add(ws)

  ws.addEventListener('close', () => {
    connections.delete(ws)
  })
}

// Subscribe to events and broadcast
$.on('Order.*', async (event) => {
  // Broadcast to all connected clients
  const message = JSON.stringify({
    type: event.type,
    data: event.data,
    timestamp: event.timestamp
  })

  for (const ws of connections) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message)
    }
  }
})

// Client-side: Receive real-time events
const ws = new WebSocket('wss://api.your-domain.com/events')
ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Real-time event:', data.type, data.data)
}`,
  },
]

export default function EventsPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Events"
        description="Publish and subscribe to events with pattern matching, streaming, retries, and automatic dead letter queue support."
        packageName="@dotdo/sdk.do"
        gradient="from-orange-500 to-red-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Publish Events</h2>
                <p className="text-xl text-gray-400">Send events to subscribers with a single function call. Automatic retry and DLQ handling included.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Subscribe to Events</h2>
                <p className="text-xl text-gray-400">Handle events with async functions. Full SDK access for processing: database, AI, actions, and more.</p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Pattern Matching</h2>
                <p className="text-xl text-gray-400">
                  Subscribe to multiple events with wildcards and semantic patterns. Type-safe event handling with autocomplete.
                </p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Filter Events</h2>
                <p className="text-xl text-gray-400">Process events conditionally based on data. Perfect for high-value transactions and specific triggers.</p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Real-Time Streaming</h2>
                <p className="text-xl text-gray-400">Stream events as they happen. WebSocket-compatible with filtering and backpressure support.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Dead Letter Queue</h2>
                <p className="text-xl text-gray-400">
                  Failed events automatically go to DLQ after retries. Handle failures gracefully with dedicated handlers.
                </p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Built-In Metrics</h2>
                <p className="text-xl text-gray-400">Track latency, throughput, and error rates. Query event history and performance metrics easily.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">WebSocket Integration</h2>
                <p className="text-xl text-gray-400">Broadcast events to WebSocket clients in real-time. Perfect for live dashboards and notifications.</p>
              </div>
            </Selectable>,
          ]}
          code={
            <div className="sticky top-24 h-[600px]">
              <CodePlayground examples={examples} />
            </div>
          }
        />
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-800">
        <h2 className="text-4xl font-bold text-center mb-16">Event System Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="At-Least-Once Delivery" description="Events are guaranteed to be delivered. Automatic retries with exponential backoff." />
          <FeatureCard title="Ordered Processing" description="Events are processed in the order they were published within each partition." />
          <FeatureCard title="Semantic Patterns" description="Use $.Subject.predicate patterns for type-safe event handling with autocomplete." />
          <FeatureCard title="Event Replay" description="Replay historical events for debugging, testing, or reprocessing data." />
          <FeatureCard title="Fan-Out" description="Single event triggers multiple subscribers. Perfect for microservices architectures." />
          <FeatureCard title="Schema Validation" description="Validate event payloads against schemas. Prevent invalid data propagation." />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-800">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
