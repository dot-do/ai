import { languageModel } from 'ai-providers'
import { z } from 'zod'

/**
 * Create a Lean Canvas for a business idea or product
 *
 * @param input - Input data or string to create Lean Canvas for
 * @param config - Configuration options
 * @returns A Lean Canvas object
 */
export const leanCanvas = async (
  input: any,
  config: {
    modelName?: string
    system?: string
    temperature?: number
  } = {}
) => {
  const {
    modelName = 'gpt-5-mini',
    system = 'You are an expert business consultant specializing in Lean Canvas for startups and new products',
    temperature = 0.7,
  } = config

  const inputStr = typeof input === 'string' ? input : JSON.stringify(input)

  const schema = z.object({
    productName: z.string().describe('name of the product or service'),
    problem: z.array(z.string()).describe('top 3 problems the product solves'),
    solution: z.array(z.string()).describe('top 3 solutions the product offers'),
    uniqueValueProposition: z.string().describe('clear message that states the benefit of your product'),
    unfairAdvantage: z.string().describe('something that cannot be easily copied or bought'),
    customerSegments: z.array(z.string()).describe('list of target customer segments'),
    keyMetrics: z.array(z.string()).describe('key numbers that tell you how your business is doing'),
    channels: z.array(z.string()).describe('path to customers'),
    costStructure: z.array(z.string()).describe('list of operational costs'),
    revenueStreams: z.array(z.string()).describe('list of revenue sources'),
  })

  try {
    const result = await (languageModel(modelName) as any).doGenerate({
      prompt: `Create a Lean Canvas for: \n\n${inputStr}`,
      system,
      temperature,
      schema,
    })

    return JSON.parse(result.text)
  } catch (error) {
    console.error('Error generating Lean Canvas:', error)
    throw new Error('Failed to generate Lean Canvas')
  }
}
