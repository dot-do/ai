/**
 * Example: Using the mdxai agent with tools
 */

import { createAgent } from '../src/agent'

async function main() {
  // Create an agent instance
  const agent = createAgent({
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'openai/gpt-5',
  })

  console.log('Example 1: Simple generation')
  console.log('='.repeat(50))

  const result1 = await agent.run({
    prompt: 'Generate a short description of MDX',
    maxSteps: 5,
  })

  console.log('Response:', result1.text)
  console.log('Steps taken:', result1.steps.length)
  console.log()

  console.log('Example 2: Using tools')
  console.log('='.repeat(50))

  const result2 = await agent.run({
    prompt: 'Create a todo list with 3 tasks: compile MDX, validate syntax, and deploy',
    maxSteps: 10,
  })

  console.log('Response:', result2.text)
  console.log('Tool calls:')
  result2.steps.forEach((step, i) => {
    if (step.type === 'tool-call') {
      console.log(`  ${i + 1}. ${step.toolName}:`, JSON.stringify(step.toolArgs, null, 2))
    }
  })
  console.log()

  console.log('Example 3: Smart generate with schema detection')
  console.log('='.repeat(50))

  // First, let's use the simple generate methods
  const text = await agent.generateText({
    prompt: 'Write a haiku about coding',
  })
  console.log('Generated text:', text)
  console.log()

  // Generate structured data
  const { z } = await import('zod')
  const person = await agent.generateObject({
    prompt: 'Create a person with name John and age 30',
    schema: z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().optional(),
    }),
  })
  console.log('Generated object:', person)
  console.log()

  console.log('Example 4: Complex multi-step task')
  console.log('='.repeat(50))

  const result4 = await agent.run({
    prompt: 'List all files in the current directory, then create a todo for each .mdx file to validate it',
    maxSteps: 20,
  })

  console.log('Response:', result4.text)
  console.log('Total steps:', result4.steps.length)
  console.log('Usage:', result4.usage)
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
