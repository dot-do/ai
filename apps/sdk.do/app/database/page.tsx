import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Basic CRUD',
    code: `import { $ } from '@dotdo/sdk.do'

// Create
const product = await $.db.create('products', {
  name: 'Wireless Headphones',
  price: 299,
  category: 'electronics'
})

// Read
const item = await $.db.get('products', product.id)

// Update
await $.db.update('products', product.id, {
  price: 249
})

// Delete
await $.db.delete('products', product.id)`,
  },
  {
    title: 'Query & Filter',
    code: `import { $ } from '@dotdo/sdk.do'

// List with filters
const products = await $.db.list('products', {
  where: {
    category: 'electronics',
    price: { $gte: 100, $lte: 500 },
    inStock: true
  },
  orderBy: { price: 'asc' },
  limit: 20,
  offset: 0
})

// Count
const total = await $.db.count('products', {
  where: { category: 'electronics' }
})`,
  },
  {
    title: 'Relationships',
    code: `import { $ } from '@dotdo/sdk.do'

// Create relationship
await $.db.relate(
  'users', 'user_123',
  'orders', 'order_456'
)

// Query with relationships
const user = await $.db.get('users', 'user_123', {
  include: {
    orders: true,
    addresses: {
      where: { isDefault: true }
    }
  }
})

// Navigate relationships
user.orders.forEach(order => {
  console.log(order.total)
})`,
  },
  {
    title: 'Transactions',
    code: `import { $ } from '@dotdo/sdk.do'

// Atomic operations
await $.db.transaction(async (tx) => {
  // Deduct from inventory
  const product = await tx.get('products', 'prod_123')
  await tx.update('products', 'prod_123', {
    stock: product.stock - 1
  })

  // Create order
  await tx.create('orders', {
    productId: 'prod_123',
    quantity: 1,
    total: product.price
  })

  // If anything fails, entire transaction rolls back
})`,
  },
  {
    title: 'Batch Operations',
    code: `import { $ } from '@dotdo/sdk.do'

// Batch create
const result = await $.db.batchCreate('products', [
  { name: 'Product 1', price: 100 },
  { name: 'Product 2', price: 200 },
  { name: 'Product 3', price: 300 }
])

console.log(\`Created \${result.created} products\`)

// Batch update
await $.db.batchUpdate('products',
  [{ id: 'p1', price: 150 }, { id: 'p2', price: 250 }]
)

// Batch delete
await $.db.batchDelete('products', ['p1', 'p2', 'p3'])`,
  },
  {
    title: 'Full-Text Search',
    code: `import { $ } from '@dotdo/sdk.do'

// Semantic search
const results = await $.db.search('products', {
  query: 'wireless bluetooth headphones',
  fields: ['name', 'description', 'features'],
  limit: 10,
  threshold: 0.7 // Similarity threshold
})

// Highlighted matches
results.forEach(result => {
  console.log(result.highlight.name) // Highlighted text
  console.log(result.score) // Relevance score
})`,
  },
  {
    title: 'Schema Management',
    code: `import { $ } from '@dotdo/sdk.do'

// Define collection schema
await $.db.defineSchema('products', {
  fields: {
    name: { type: 'string', required: true },
    description: { type: 'text' },
    price: { type: 'number', required: true },
    tags: { type: 'array', items: 'string' },
    metadata: { type: 'json' }
  },
  indexes: [
    { fields: ['category', 'price'] },
    { fields: ['name'], type: 'text' }
  ],
  relationships: {
    category: {
      type: 'belongsTo',
      collection: 'categories'
    },
    reviews: {
      type: 'hasMany',
      collection: 'reviews'
    }
  }
})`,
  },
  {
    title: 'Graph Queries',
    code: `import { $ } from '@dotdo/sdk.do'

// Traverse relationships
const graph = await $.db.graph('users', 'user_123', {
  depth: 3,
  relationships: ['orders', 'orders.products', 'orders.products.category'],
  where: {
    'orders.status': 'completed',
    'orders.products.price': { $gt: 100 }
  }
})

// Access nested data
graph.orders.forEach(order => {
  order.products.forEach(product => {
    console.log(product.category.name)
  })
})`,
  },
]

export default function DatabasePage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="Database Service"
        description="Semantic database operations with CRUD, relationships, transactions, and graph queries. Works with any collection."
        packageName="@dotdo/sdk.do"
        gradient="from-green-500 to-teal-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Simple CRUD Operations</h2>
                <p className="text-xl text-gray-400">Create, read, update, and delete with intuitive APIs. No ORM configuration needed.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Powerful Queries</h2>
                <p className="text-xl text-gray-400">Filter, sort, paginate, and count with MongoDB-style query operators.</p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Relationships Made Easy</h2>
                <p className="text-xl text-gray-400">Define and query relationships without complex joins. Nested includes supported.</p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">ACID Transactions</h2>
                <p className="text-xl text-gray-400">Atomic operations with automatic rollback. Keep your data consistent.</p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Batch Operations</h2>
                <p className="text-xl text-gray-400">Process thousands of records efficiently. Bulk create, update, and delete.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Semantic Search</h2>
                <p className="text-xl text-gray-400">Full-text search with relevance scoring and highlighting. Find exactly what you need.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Type-Safe Schemas</h2>
                <p className="text-xl text-gray-400">Define schemas for validation and autocomplete. Indexes and relationships included.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Graph Queries</h2>
                <p className="text-xl text-gray-400">Traverse relationships with depth control. Perfect for social graphs and hierarchies.</p>
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
        <h2 className="text-4xl font-bold text-center mb-16">Database Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard title="PostgreSQL Backend" description="Production-ready PostgreSQL with connection pooling via Hyperdrive" />
          <FeatureCard title="Vector Search" description="Similarity search with embeddings via Vectorize integration" />
          <FeatureCard title="JSON Support" description="Store and query JSON data with path expressions" />
          <FeatureCard title="Migrations" description="Version-controlled schema migrations with rollback support" />
          <FeatureCard title="Soft Deletes" description="Keep audit trails with soft delete and restore" />
          <FeatureCard title="Audit Logs" description="Automatic change tracking for compliance" />
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
