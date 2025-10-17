import { Hero } from '@/components/Hero'
import { ScrollyLayout, Selectable } from '@/components/ScrollyCode'
import { CodePlayground } from '@/components/CodePlayground'

const examples = [
  {
    title: 'Basic Generation',
    code: `import { $ } from '@dotdo/sdk.do'

// Generate text with GPT-5
const response = await $.ai.generate({
  model: 'gpt-5',
  prompt: 'Write a compelling product description for wireless headphones'
})

console.log(response.text)`,
  },
  {
    title: 'Structured Output',
    code: `import { $ } from '@dotdo/sdk.do'

// Generate structured data with schema validation
const product = await $.ai.generate({
  model: 'gpt-5',
  prompt: 'Create a product listing for wireless headphones',
  schema: {
    name: 'string',
    description: 'string',
    price: 'number',
    features: 'string[]',
    specifications: {
      battery: 'string',
      wireless: 'boolean',
      noiseCanceling: 'boolean'
    }
  }
})

// Type-safe response
console.log(product.data.price) // number
console.log(product.data.features) // string[]`,
  },
  {
    title: 'Chat Conversations',
    code: `import { $ } from '@dotdo/sdk.do'

// Multi-turn conversations
const response = await $.ai.chat({
  model: 'claude-sonnet-4.5',
  messages: [
    { role: 'system', content: 'You are a helpful product expert.' },
    { role: 'user', content: 'What are the best wireless headphones?' },
    { role: 'assistant', content: 'I recommend...' },
    { role: 'user', content: 'What about battery life?' }
  ]
})

console.log(response.message.content)`,
  },
  {
    title: 'Streaming Responses',
    code: `import { $ } from '@dotdo/sdk.do'

// Stream AI responses for real-time UX
const stream = await $.ai.stream({
  model: 'gpt-5',
  prompt: 'Write a detailed blog post about AI in e-commerce'
})

for await (const chunk of stream) {
  process.stdout.write(chunk.text)
}`,
  },
  {
    title: 'Embeddings',
    code: `import { $ } from '@dotdo/sdk.do'

// Generate embeddings for semantic search
const embedding = await $.ai.embed({
  model: 'text-embedding-3-large',
  input: 'wireless headphones with noise canceling'
})

// Use embeddings for similarity search
const results = await $.db.search('products', {
  vector: embedding.values,
  limit: 10
})`,
  },
  {
    title: 'Batch Processing',
    code: `import { $ } from '@dotdo/sdk.do'

// Process large datasets with 50% cost savings
const batchJob = await $.ai.batch({
  requests: products.map(p => ({
    model: 'gpt-5',
    prompt: \`Analyze this product: \${p.description}\`,
    schema: {
      sentiment: 'positive' | 'neutral' | 'negative',
      tags: 'string[]',
      category: 'string'
    }
  }))
})

// Check status
const status = await $.ai.batchStatus(batchJob.id)

// Retrieve results when complete
if (status.status === 'completed') {
  const results = await $.ai.batchResults(batchJob.id)
}`,
  },
  {
    title: 'Multi-Model Support',
    code: `import { $ } from '@dotdo/sdk.do'

// Use different models for different tasks
const models = {
  creative: 'gpt-5',
  fast: 'gpt-5-mini',
  coding: 'gpt-5-codex',
  reasoning: 'claude-sonnet-4.5',
  vision: 'gemini-2.5-pro'
}

// Creative content
const copy = await $.ai.generate({
  model: models.creative,
  prompt: 'Write creative ad copy'
})

// Fast classification
const category = await $.ai.generate({
  model: models.fast,
  prompt: 'Categorize this: ...',
  schema: { category: 'string' }
})

// Code generation
const code = await $.ai.generate({
  model: models.coding,
  prompt: 'Write a TypeScript function to...'
})`,
  },
  {
    title: 'Function Calling',
    code: `import { $ } from '@dotdo/sdk.do'

// Define tools for AI to use
const tools = [
  {
    name: 'get_product',
    description: 'Get product details by ID',
    parameters: {
      productId: 'string'
    }
  },
  {
    name: 'search_products',
    description: 'Search products by query',
    parameters: {
      query: 'string',
      limit: 'number'
    }
  }
]

const response = await $.ai.chat({
  model: 'gpt-5',
  messages: [
    { role: 'user', content: 'Find me wireless headphones under $200' }
  ],
  tools
})

// Handle tool calls
if (response.toolCalls) {
  for (const call of response.toolCalls) {
    if (call.name === 'search_products') {
      const results = await $.db.search('products', {
        query: call.parameters.query,
        where: { price: { $lt: 200 } }
      })
    }
  }
}`,
  },
]

export default function AIPage() {
  return (
    <main className="min-h-screen">
      <Hero
        title="AI Services"
        description="Integrate GPT-5, Claude Sonnet 4.5, and other leading AI models with type-safe schemas and semantic patterns."
        packageName="@dotdo/sdk.do"
        gradient="from-purple-500 to-pink-600"
      />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <ScrollyLayout
          steps={[
            <Selectable key={0} index={0}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Simple Text Generation</h2>
                <p className="text-xl text-gray-400">Start generating AI content with a single function call. No complex setup required.</p>
              </div>
            </Selectable>,

            <Selectable key={1} index={1}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Type-Safe Structured Output</h2>
                <p className="text-xl text-gray-400">
                  Define schemas to get validated, type-safe responses. Perfect for generating product data, API responses, and more.
                </p>
              </div>
            </Selectable>,

            <Selectable key={2} index={2}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Multi-Turn Conversations</h2>
                <p className="text-xl text-gray-400">Build chatbots and assistants with context-aware conversations. System prompts included.</p>
              </div>
            </Selectable>,

            <Selectable key={3} index={3}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Real-Time Streaming</h2>
                <p className="text-xl text-gray-400">Stream responses token-by-token for responsive user experiences. Works with all models.</p>
              </div>
            </Selectable>,

            <Selectable key={4} index={4}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Semantic Search with Embeddings</h2>
                <p className="text-xl text-gray-400">Generate embeddings for similarity search. Find related products, documents, and content.</p>
              </div>
            </Selectable>,

            <Selectable key={5} index={5}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Batch Processing</h2>
                <p className="text-xl text-gray-400">Process thousands of requests asynchronously with 50% cost savings. Perfect for data pipelines.</p>
              </div>
            </Selectable>,

            <Selectable key={6} index={6}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Multi-Model Strategy</h2>
                <p className="text-xl text-gray-400">Use the right model for each task. Creative, fast, coding, reasoning, and vision models all available.</p>
              </div>
            </Selectable>,

            <Selectable key={7} index={7}>
              <div className="max-w-xl">
                <h2 className="text-4xl font-bold mb-4">Function Calling & Tools</h2>
                <p className="text-xl text-gray-400">Let AI use your functions and APIs. Perfect for building autonomous agents and workflows.</p>
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

      {/* Models Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Supported Models</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModelCard name="GPT-5" provider="OpenAI" use="General purpose, creative content" />
          <ModelCard name="GPT-5 Mini" provider="OpenAI" use="Fast responses, cost-effective" />
          <ModelCard name="GPT-5 Codex" provider="OpenAI" use="Code generation, agentic coding" />
          <ModelCard name="Claude Sonnet 4.5" provider="Anthropic" use="Complex reasoning, analysis" />
          <ModelCard name="Gemini 2.5 Pro" provider="Google" use="Multimodal, vision tasks" />
          <ModelCard name="Llama 4" provider="Meta" use="Open source, on-premise" />
        </div>
      </div>
    </main>
  )
}

function ModelCard({ name, provider, use }: { name: string; provider: string; use: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-800 hover:border-purple-500 transition-colors">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-sm text-gray-500 mb-3">{provider}</p>
      <p className="text-gray-400">{use}</p>
    </div>
  )
}
