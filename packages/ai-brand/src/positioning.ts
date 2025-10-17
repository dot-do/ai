import { storyBrand } from 'ai-business'
import { BrandInput, BrandOptions, BrandPositioning, BrandVoice } from './types'
import { model } from 'ai-providers'
import { z } from 'zod'

/**
 * Generate brand positioning using storyBrand framework
 *
 * @param input - Brand input data
 * @param options - Configuration options
 * @returns Brand positioning information
 */
export async function generateBrandPositioning(input: BrandInput, options: BrandOptions = {}): Promise<BrandPositioning> {
  const storyBrandResult = await storyBrand(input, {
    modelName: options.modelName,
    system: options.system || 'You are an expert brand strategist specializing in the StoryBrand framework',
    temperature: options.temperature,
  })

  const voice = await generateBrandVoice(input, options)

  return {
    story: {
      hero: storyBrandResult.hero,
      problem: storyBrandResult.problem.external,
      guide: storyBrandResult.guide,
      plan: storyBrandResult.plan.join('\n'),
      callToAction: storyBrandResult.callToAction,
      success: storyBrandResult.success,
      failure: storyBrandResult.failure,
    },
    voice,
    messaging: {
      tagline: storyBrandResult.messagingExamples[0] || '',
      elevator: storyBrandResult.messagingExamples[1] || '',
      valueProposition: storyBrandResult.messagingExamples[2] || '',
      keyMessages: storyBrandResult.messagingExamples.slice(3) || [],
    },
  }
}

/**
 * Generate brand voice characteristics
 *
 * @param input - Brand input data
 * @param options - Configuration options
 * @returns Brand voice information
 */
async function generateBrandVoice(input: BrandInput, options: BrandOptions = {}): Promise<BrandVoice> {
  const { modelName = options.modelName || 'google/gemini-2.5-flash-preview', temperature = options.temperature || 0.7 } = options

  const schema = z.object({
    tone: z.string().describe('overall tone of the brand voice'),
    personality: z.array(z.string()).describe('key personality traits of the brand voice'),
    examples: z.array(z.string()).describe('example phrases or sentences that demonstrate the brand voice'),
  })

  try {
    const result = await model(modelName).generate({
      prompt: `Create a distinctive brand voice for ${input.name}, which is ${input.description}.
      ${input.values ? `The brand values are: ${input.values.join(', ')}.` : ''}
      ${input.targetAudience ? `The target audience is: ${input.targetAudience}.` : ''}
      ${input.mission ? `The brand mission is: ${input.mission}.` : ''}
      ${input.vision ? `The brand vision is: ${input.vision}.` : ''}
      ${input.customPrompt || ''}`,
      system: options.system || 'You are an expert brand strategist specializing in creating distinctive brand voices',
      temperature,
      schema,
    })

    return JSON.parse(result.text)
  } catch (error) {
    console.error('Error generating brand voice:', error)
    return {
      tone: 'professional',
      personality: ['clear', 'concise', 'helpful'],
      examples: ['We help you achieve your goals.', 'Simple solutions for complex problems.'],
    }
  }
}
