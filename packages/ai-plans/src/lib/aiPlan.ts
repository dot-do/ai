import { languageModel } from 'ai-providers'
import { z } from 'zod'
import { Plan } from './plan'
import { PlanInput } from '../types'

const planGenerationSchema = z.object({
  name: z.string().describe('Clear, actionable name for the plan'),
  description: z.string().describe('Detailed description of what the plan aims to achieve'),
  goal: z.object({
    objective: z.string().describe('Main objective or goal statement'),
    keyResults: z
      .array(
        z.union([
          z.string().describe('Simple key result description'),
          z.object({
            description: z.string().describe('Specific, measurable key result'),
            target: z.number().optional().describe('Target value if quantifiable'),
            currentValue: z.number().optional().describe('Current baseline value'),
            unit: z.string().optional().describe('Unit of measurement (%, $, users, etc.)'),
          }),
        ])
      )
      .describe('3-5 key results that define success'),
  }),
  steps: z
    .array(
      z.object({
        name: z.string().describe('Name of the step or task'),
        description: z.string().describe('Detailed description of what needs to be done'),
        order: z.number().optional().describe('Order in which this step should be executed'),
        duration: z.number().optional().describe('Estimated duration in hours'),
        status: z.enum(['not_started', 'in_progress', 'completed', 'blocked']).default('not_started'),
      })
    )
    .optional()
    .describe('Actionable steps to achieve the goal'),
})

interface AIPlanOptions {
  model?: string
  temperature?: number
  includeSteps?: boolean
  maxKeyResults?: number
}

export async function generateAIPlan(objective: string, options: AIPlanOptions = {}): Promise<ReturnType<typeof Plan>> {
  const { model = 'google/gemini-2.5-flash-preview', temperature = 0.7, includeSteps = true, maxKeyResults = 5 } = options

  const systemPrompt = `You are an expert strategic planner. Create a comprehensive plan with clear objectives, measurable key results (OKR-style), and actionable steps. Focus on:
- SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- 3-${maxKeyResults} key results that define success
- ${includeSteps ? 'Detailed actionable steps with realistic time estimates' : 'High-level approach'}
- Clear priorities and dependencies`

  try {
    const result = await (languageModel(model) as any).doGenerate({
      prompt: `${systemPrompt}

Create a detailed plan for: ${objective}`,
      temperature,
      schema: planGenerationSchema,
    })

    const planData = JSON.parse(result.text)
    return Plan(planData as PlanInput)
  } catch (error) {
    console.error('Error generating AI plan:', error)
    throw error
  }
}
