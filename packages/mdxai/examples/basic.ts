/**
 * Basic example of using mdxai
 */

import { createAI, build, test } from '../src'

async function main() {
  // Create AI instance
  const ai = createAI({
    // apiKey will be read from OPENROUTER_API_KEY env var
    model: 'openai/gpt-5',
    temperature: 0.7,
  })

  console.log('=== Generating Content ===')
  const result = await ai.generate({
    prompt: 'Create a simple React component for a hero section',
    system: 'You are an expert React developer',
  })

  console.log('Generated content:')
  console.log(result.content)
  console.log('\nUsage:', result.usage)

  console.log('\n=== Streaming Generation ===')
  process.stdout.write('Streaming: ')
  for await (const chunk of ai.generateStream({
    prompt: 'Write a short tagline for an AI-powered MDX tool',
  })) {
    process.stdout.write(chunk)
  }
  console.log('\n')

  // Note: Build and test would require actual MDX files
  // console.log('=== Building ===')
  // await build({ path: './content' })

  // console.log('=== Testing ===')
  // await test({ path: './content' })
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { main }
