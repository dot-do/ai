/**
 * Generative Function Examples
 *
 * AI-powered generation via AI worker
 */

import { defineGenerativeFunction, execute } from '../src'
import { z } from 'zod'

// Text summarization
export const summarizeText = defineGenerativeFunction({
  name: 'summarizeText',
  description: 'Generate a concise summary of text',
  input: z.object({
    text: z.string(),
    maxLength: z.number().optional(),
  }),
  output: z.object({
    summary: z.string(),
  }),
  model: 'gpt-5',
  systemPrompt: 'You are a helpful assistant that creates concise summaries.',
  userPrompt: (input) => {
    const lengthConstraint = input.maxLength ? ` Keep it under ${input.maxLength} words.` : ''
    return `Summarize this text:${lengthConstraint}\n\n${input.text}`
  },
  temperature: 0.7,
  maxTokens: 500,
  handler: async (input, ctx) => {
    // AI worker handles generation
    const response = await ctx.env.AI.generate({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that creates concise summaries.' },
        { role: 'user', content: `Summarize this text:\n\n${input.text}` },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })
    return { summary: response.choices[0].message.content }
  },
})

// Code generation
export const generateCode = defineGenerativeFunction({
  name: 'generateCode',
  description: 'Generate code from a description',
  input: z.object({
    description: z.string(),
    language: z.enum(['typescript', 'python', 'go', 'rust']),
  }),
  output: z.object({
    code: z.string(),
    explanation: z.string(),
  }),
  model: 'gpt-5-codex',
  systemPrompt: 'You are an expert programmer. Generate clean, well-documented code.',
  userPrompt: (input) => `Generate ${input.language} code for the following:\n\n${input.description}\n\nProvide both the code and a brief explanation.`,
  temperature: 0.3,
  examples: [
    {
      input: { description: 'Function to check if a number is prime', language: 'typescript' },
      output: {
        code: 'function isPrime(n: number): boolean {\n  if (n <= 1) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}',
        explanation: 'This function checks if a number is prime by testing divisibility up to the square root.',
      },
    },
  ],
  handler: async (input, ctx) => {
    // AI worker handles generation
    return { code: '// Generated code', explanation: 'Explanation here' }
  },
})

// Data extraction
export const extractEntities = defineGenerativeFunction({
  name: 'extractEntities',
  description: 'Extract structured entities from text',
  input: z.object({
    text: z.string(),
  }),
  output: z.object({
    people: z.array(z.string()),
    organizations: z.array(z.string()),
    locations: z.array(z.string()),
    dates: z.array(z.string()),
  }),
  model: 'gpt-5',
  systemPrompt: 'Extract entities from text and return them in structured JSON format.',
  userPrompt: (input) => `Extract all people, organizations, locations, and dates from this text:\n\n${input.text}`,
  temperature: 0.1, // Low temperature for more deterministic extraction
  handler: async (input, ctx) => {
    // AI worker handles generation
    return {
      people: [],
      organizations: [],
      locations: [],
      dates: [],
    }
  },
})

// Creative writing
export const generateBlogPost = defineGenerativeFunction({
  name: 'generateBlogPost',
  description: 'Generate a blog post from a topic',
  input: z.object({
    topic: z.string(),
    tone: z.enum(['professional', 'casual', 'technical']),
    length: z.enum(['short', 'medium', 'long']),
  }),
  output: z.object({
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()),
  }),
  model: 'gpt-5',
  systemPrompt: 'You are a skilled content writer.',
  userPrompt: (input) => {
    const lengthMap = { short: '300-500', medium: '700-1000', long: '1500-2000' }
    return `Write a ${input.tone} blog post about "${input.topic}". Length: ${lengthMap[input.length]} words. Include a compelling title and relevant tags.`
  },
  temperature: 0.8, // Higher temperature for more creative output
  maxTokens: 2000,
  handler: async (input, ctx) => {
    // AI worker handles generation
    return {
      title: 'Generated Title',
      content: 'Generated content...',
      tags: [],
    }
  },
})

// Translation
export const translateText = defineGenerativeFunction({
  name: 'translateText',
  description: 'Translate text between languages',
  input: z.object({
    text: z.string(),
    from: z.string(), // e.g., 'en', 'es', 'fr'
    to: z.string(),
  }),
  output: z.object({
    translated: z.string(),
    confidence: z.number(),
  }),
  model: 'gpt-5',
  systemPrompt: 'You are a professional translator.',
  userPrompt: (input) => `Translate the following text from ${input.from} to ${input.to}:\n\n${input.text}`,
  temperature: 0.3,
  handler: async (input, ctx) => {
    // AI worker handles generation
    return {
      translated: 'Translated text',
      confidence: 0.95,
    }
  },
})

// Example usage
async function main() {
  // Summarize text
  const summary = await execute('fn_summarize_text', {
    text: 'Long article text here...',
    maxLength: 50,
  })
  console.log('Summary:', summary.output)

  // Generate code
  const code = await execute('fn_generate_code', {
    description: 'Function to validate email addresses',
    language: 'typescript',
  })
  console.log('Generated:', code.output)

  // Extract entities
  const entities = await execute('fn_extract_entities', {
    text: 'Apple Inc. was founded by Steve Jobs in Cupertino, California on April 1, 1976.',
  })
  console.log('Entities:', entities.output)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
