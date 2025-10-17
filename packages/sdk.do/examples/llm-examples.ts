/**
 * LLM Service Examples
 *
 * Demonstrates how to use the llm.do SDK for accessing LLM capabilities
 * across multiple providers.
 */

import { create$, type ChatMessage, type Tool } from '../src/index'

// Create SDK instance
const $ = create$({
  apiKey: process.env.DO_TOKEN,
  baseUrl: 'https://llm.do',
})

/**
 * Example 1: Basic Text Generation
 */
async function textGeneration() {
  console.log('Example 1: Text Generation\n')

  const response = await $.llm.generate('Write a haiku about TypeScript', {
    temperature: 0.7,
    maxTokens: 100,
  })

  console.log('Generated text:', response.text)
  console.log('Finish reason:', response.finishReason)
  console.log('Token usage:', response.usage)
  console.log()
}

/**
 * Example 2: Chat Completions
 */
async function chatCompletions() {
  console.log('Example 2: Chat Completions\n')

  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are a helpful TypeScript expert' },
    { role: 'user', content: 'What are the benefits of using TypeScript over JavaScript?' },
  ]

  const response = await $.llm.chat(messages, {
    model: 'gpt-5',
    temperature: 0.7,
  })

  console.log('Assistant:', response.message.content)
  console.log('Token usage:', response.usage)
  console.log()
}

/**
 * Example 3: Streaming Text Generation
 */
async function streamingGeneration() {
  console.log('Example 3: Streaming Generation\n')

  const stream = await $.llm.stream('Write a short story about a robot learning to code', {
    model: 'claude-sonnet-4.5',
    temperature: 0.8,
    maxTokens: 500,
    onChunk: (chunk) => {
      if (chunk.text) {
        process.stdout.write(chunk.text)
      }
    },
  })

  console.log('\n\nStreaming complete!')
  console.log()
}

/**
 * Example 4: Function Calling
 */
async function functionCalling() {
  console.log('Example 4: Function Calling\n')

  const tools: Tool[] = [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get the current weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
            unit: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
              description: 'The temperature unit',
            },
          },
          required: ['location'],
        },
      },
    },
  ]

  const messages: ChatMessage[] = [{ role: 'user', content: 'What is the weather in London?' }]

  const response = await $.llm.chat(messages, {
    model: 'gpt-5',
    tools,
    tool_choice: 'auto',
  })

  if (response.message.tool_calls) {
    console.log('Tool calls requested:')
    for (const toolCall of response.message.tool_calls) {
      console.log(`- ${toolCall.function.name}(${toolCall.function.arguments})`)
    }
  }
  console.log()
}

/**
 * Example 5: Embeddings
 */
async function embeddings() {
  console.log('Example 5: Embeddings\n')

  // Single text
  const singleEmbedding = await $.llm.embed('Hello world', {
    model: 'text-embedding-ada-002',
  })

  console.log('Single embedding dimensions:', singleEmbedding.dimensions)
  console.log('First 5 values:', singleEmbedding.embedding.slice(0, 5))

  // Multiple texts
  const texts = ['Hello world', 'TypeScript is great', 'AI is amazing']

  const multipleEmbeddings = await $.llm.embed(texts, {
    model: 'text-embedding-3-small',
    dimensions: 768,
  })

  if (Array.isArray(multipleEmbeddings)) {
    console.log(`Generated ${multipleEmbeddings.length} embeddings`)
    console.log('Dimensions:', multipleEmbeddings[0].dimensions)
  }
  console.log()
}

/**
 * Example 6: List Available Models
 */
async function listModels() {
  console.log('Example 6: List Models\n')

  const allModels = await $.llm.models()

  console.log('All available models:')
  for (const model of allModels) {
    console.log(`- ${model.id} (${model.provider})`)
    console.log(`  Context window: ${model.contextWindow}`)
    console.log(
      `  Capabilities: ${Object.entries(model.capabilities)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(', ')}`
    )
  }

  // Filter by provider
  const openaiModels = await $.llm.models('openai')
  console.log(`\nOpenAI models: ${openaiModels.length}`)
  console.log()
}

/**
 * Example 7: Get Model Details
 */
async function modelDetails() {
  console.log('Example 7: Model Details\n')

  const model = await $.llm.model('claude-sonnet-4.5')

  console.log('Model:', model.name)
  console.log('Provider:', model.provider)
  console.log('Context window:', model.contextWindow)
  console.log('Max output tokens:', model.maxOutputTokens)
  console.log('Input price (per 1M tokens):', `$${model.inputPrice}`)
  console.log('Output price (per 1M tokens):', `$${model.outputPrice}`)
  console.log('Capabilities:', model.capabilities)
  console.log()
}

/**
 * Example 8: Check Model Availability
 */
async function checkAvailability() {
  console.log('Example 8: Check Availability\n')

  const gpt5Available = await $.llm.isAvailable('gpt-5')
  console.log('GPT-5 available:', gpt5Available)

  const futureModel = await $.llm.isAvailable('future-model')
  console.log('Future model available:', futureModel)
  console.log()
}

/**
 * Example 9: Batch Processing
 */
async function batchProcessing() {
  console.log('Example 9: Batch Processing\n')

  // Create batch job
  const requests = [
    { custom_id: '1', prompt: 'What is TypeScript?' },
    { custom_id: '2', prompt: 'What is JavaScript?' },
    { custom_id: '3', prompt: 'What is Python?' },
    { custom_id: '4', prompt: 'What is Rust?' },
    { custom_id: '5', prompt: 'What is Go?' },
  ]

  const batch = await $.llm.batch(requests, {
    model: 'gpt-5-mini',
    temperature: 0.7,
  })

  console.log('Batch created:', batch.id)
  console.log('Status:', batch.status)
  console.log('Total requests:', batch.totalRequests)

  // Check batch status
  let status = await $.llm.batchStatus(batch.id)
  console.log('Current status:', status.status)
  console.log('Completed:', status.completedRequests)
  console.log('Failed:', status.failedRequests)

  // Wait for completion (in real code, you'd poll or use webhooks)
  // const results = await $.llm.batchResults(batch.id)
  // console.log('Results:', results)

  console.log()
}

/**
 * Example 10: Multi-Provider Usage
 */
async function multiProvider() {
  console.log('Example 10: Multi-Provider Usage\n')

  // OpenAI
  const gptResponse = await $.llm.generate('Say hello', {
    provider: 'openai',
    model: 'gpt-5',
  })
  console.log('GPT-5:', gptResponse.text)

  // Anthropic
  const claudeResponse = await $.llm.generate('Say hello', {
    provider: 'anthropic',
    model: 'claude-sonnet-4.5',
  })
  console.log('Claude:', claudeResponse.text)

  // Google
  const geminiResponse = await $.llm.generate('Say hello', {
    provider: 'google',
    model: 'gemini-2.5-pro',
  })
  console.log('Gemini:', geminiResponse.text)

  // Meta
  const llamaResponse = await $.llm.generate('Say hello', {
    provider: 'meta',
    model: 'llama-4',
  })
  console.log('Llama:', llamaResponse.text)

  console.log()
}

/**
 * Example 11: Multi-Turn Conversation
 */
async function multiTurnConversation() {
  console.log('Example 11: Multi-Turn Conversation\n')

  const conversation: ChatMessage[] = []

  // Turn 1
  conversation.push({
    role: 'user',
    content: 'What is the difference between const and let in TypeScript?',
  })

  let response = await $.llm.chat(conversation, { model: 'gpt-5' })
  conversation.push(response.message)
  console.log('Assistant:', response.message.content)

  // Turn 2
  conversation.push({
    role: 'user',
    content: 'Can you give me an example?',
  })

  response = await $.llm.chat(conversation, { model: 'gpt-5' })
  conversation.push(response.message)
  console.log('\nAssistant:', response.message.content)

  console.log()
}

/**
 * Example 12: Cost Estimation
 */
async function costEstimation() {
  console.log('Example 12: Cost Estimation\n')

  const model = await $.llm.model('gpt-5')

  const response = await $.llm.generate('Write a detailed explanation of TypeScript interfaces', {
    model: 'gpt-5',
    maxTokens: 1000,
  })

  const inputCost = (response.usage.promptTokens / 1000000) * model.inputPrice
  const outputCost = (response.usage.completionTokens / 1000000) * model.outputPrice
  const totalCost = inputCost + outputCost

  console.log('Token usage:')
  console.log(`- Input: ${response.usage.promptTokens} tokens`)
  console.log(`- Output: ${response.usage.completionTokens} tokens`)
  console.log(`- Total: ${response.usage.totalTokens} tokens`)
  console.log('\nCost breakdown:')
  console.log(`- Input cost: $${inputCost.toFixed(6)}`)
  console.log(`- Output cost: $${outputCost.toFixed(6)}`)
  console.log(`- Total cost: $${totalCost.toFixed(6)}`)
  console.log()
}

/**
 * Run all examples
 */
async function main() {
  try {
    await textGeneration()
    await chatCompletions()
    // await streamingGeneration() // Uncomment to see streaming
    await functionCalling()
    await embeddings()
    await listModels()
    await modelDetails()
    await checkAvailability()
    // await batchProcessing() // Uncomment to test batch processing
    await multiProvider()
    await multiTurnConversation()
    await costEstimation()
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run examples if called directly
if (require.main === module) {
  main()
}

// Export individual examples
export {
  textGeneration,
  chatCompletions,
  streamingGeneration,
  functionCalling,
  embeddings,
  listModels,
  modelDetails,
  checkAvailability,
  batchProcessing,
  multiProvider,
  multiTurnConversation,
  costEstimation,
}
