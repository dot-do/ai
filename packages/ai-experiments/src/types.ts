import { ConfigEnv, UserConfig } from 'vitest/config'

/**
 * Configuration for the Experiment function
 */
export interface ExperimentConfig<T = any, E = any> {
  /**
   * Models to use for the experiment
   */
  models: string[]

  /**
   * Temperature values to use
   */
  temperature: number | number[]

  /**
   * Optional seed values for reproducibility
   */
  seed?: number | number[]

  /**
   * Prompt template or function that generates prompts
   */
  prompt?: ((params: { input: any }) => string[]) | string

  /**
   * Input values or function that returns input values
   */
  inputs?: (() => Promise<T[]>) | T[]

  /**
   * Expected output for validation
   */
  expected?: E

  /**
   * Schema for structured output
   */
  schema?: any
}

/**
 * Result of an experiment run
 */
export interface ExperimentResult {
  /**
   * Name of the experiment
   */
  name: string

  /**
   * Results for each parameter combination
   */
  results: Array<{
    /**
     * Parameter combination
     */
    params: Record<string, any>

    /**
     * Output from the model
     */
    output: any

    /**
     * Time taken to run this combination
     */
    timeTaken: number
  }>

  /**
   * Total time taken for the experiment
   */
  totalTime: number

  /**
   * Timestamp when the experiment was run
   */
  timestamp: string
}

/**
 * Configuration for the experiment runner
 */
export interface RunnerConfig {
  /**
   * Directory where experiment results will be saved
   */
  outputDir?: string

  /**
   * Custom test matcher pattern
   */
  testMatch?: string[]

  /**
   * Whether to watch for file changes
   */
  watch?: boolean
}

/**
 * Type for Vitest configuration
 */
export type VitestConfig = (env: ConfigEnv) => UserConfig
