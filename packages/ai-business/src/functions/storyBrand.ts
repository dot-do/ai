import { languageModel } from 'ai-providers'
import { z } from 'zod'

/**
 * Create a StoryBrand framework for a business or product
 *
 * @param input - Input data or string to create StoryBrand for
 * @param config - Configuration options
 * @returns A StoryBrand framework object
 */
export const storyBrand = async (
  input: any,
  config: {
    modelName?: string
    system?: string
    temperature?: number
  } = {}
) => {
  const {
    modelName = 'gpt-5-mini',
    system = 'You are an expert business consultant specializing in the StoryBrand framework for clarifying marketing messages',
    temperature = 0.7,
  } = config

  const inputStr = typeof input === 'string' ? input : JSON.stringify(input)

  const schema = z.object({
    productName: z.string().describe('name of the product or service'),
    hero: z.string().describe('description of the customer and their challenges'),
    problem: z.object({
      external: z.string().describe('tangible external problem the customer faces'),
      internal: z.string().describe('internal frustration caused by the external problem'),
      philosophical: z.string().describe('why this matters on a deeper level'),
      villain: z.string().describe('antagonistic force causing the problem'),
    }),
    guide: z.string().describe('how the brand positions itself as a guide with empathy and authority'),
    plan: z.array(z.string()).describe('clear steps the customer needs to take'),
    callToAction: z.string().describe('specific action the customer should take'),
    success: z.string().describe('description of what success looks like after using the product'),
    failure: z.string().describe("description of what failure looks like if they don't use the product"),
    messagingExamples: z.array(z.string()).describe('example marketing messages based on this framework'),
  })

  try {
    const result = await (languageModel(modelName) as any).doGenerate({
      prompt: `Create a StoryBrand framework for: \n\n${inputStr}`,
      system,
      temperature,
      schema,
    })

    return JSON.parse(result.text)
  } catch (error) {
    console.error('Error generating StoryBrand framework:', error)
    throw new Error('Failed to generate StoryBrand framework')
  }
}
