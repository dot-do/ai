import { cartesian } from './cartesian'
import { ExperimentConfig, ExperimentResult } from './types'

/**
 * Runs an experiment with the given configuration
 */
export async function Experiment<T = any, E = any>(name: string, config: ExperimentConfig<T, E>): Promise<ExperimentResult> {
  const startTime = Date.now()

  const normalizedConfig = normalizeConfig(config)

  const paramCombinations = generateParamCombinations(normalizedConfig)

  const inputs = await getInputs(normalizedConfig.inputs)

  const results: Array<{
    params: Record<string, any>
    output: any
    timeTaken: number
  }> = []

  for (const params of paramCombinations) {
    for (const input of inputs) {
      const combinationStartTime = Date.now()

      const prompts = generatePrompts(normalizedConfig.prompt, { input })

      const output = await callAITask(params, prompts, normalizedConfig.schema)

      const timeTaken = Date.now() - combinationStartTime

      results.push({
        params: { ...params, input },
        output,
        timeTaken,
      })
    }
  }

  const totalTime = Date.now() - startTime

  const result: ExperimentResult = {
    name,
    results,
    totalTime,
    timestamp: new Date().toISOString(),
  }

  return result
}

/**
 * Normalizes the configuration by converting single values to arrays
 */
function normalizeConfig<T, E>(config: ExperimentConfig<T, E>) {
  return {
    ...config,
    models: Array.isArray(config.models) ? config.models : [config.models],
    temperature: Array.isArray(config.temperature) ? config.temperature : [config.temperature],
    seed: config.seed ? (Array.isArray(config.seed) ? config.seed : [config.seed]) : undefined,
  }
}

/**
 * Generates all parameter combinations using cartesian product
 */
function generateParamCombinations(config: ReturnType<typeof normalizeConfig>) {
  const paramSpec: Record<string, readonly any[]> = {
    model: config.models,
    temperature: config.temperature,
  }

  if (config.seed) {
    paramSpec.seed = config.seed
  }

  return cartesian(paramSpec)
}

/**
 * Gets inputs from the configuration
 */
async function getInputs<T>(inputs: (() => Promise<T[]>) | T[] | undefined): Promise<T[]> {
  if (!inputs) return [undefined as any]

  if (typeof inputs === 'function') {
    return await (inputs as () => Promise<T[]>)()
  }

  return inputs as T[]
}

/**
 * Generates prompts from the prompt template or function
 */
function generatePrompts(promptTemplate: ((params: { input: any }) => string[]) | string | undefined, params: { input: any }): string[] {
  if (!promptTemplate) return []

  if (typeof promptTemplate === 'function') {
    return promptTemplate(params)
  }

  return [promptTemplate]
}

/**
 * Calls the appropriate AI task based on the configuration
 * This is a simplified implementation
 */
async function callAITask(params: Record<string, any>, prompts: string[], schema?: any): Promise<any> {
  return {
    completion: `This is a mock completion for model: ${params.model} with temperature: ${params.temperature}`,
    prompts,
    ...(schema ? { structured: { mockData: 'This would be structured according to the schema' } } : {}),
  }
}
