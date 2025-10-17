/**
 * Runtime environment types
 */
export type Runtime = 'nodejs' | 'cloudflare-workers' | 'browser'

/**
 * Options for MDX evaluation
 */
export interface EvaluateOptions {
  /**
   * Runtime environment (auto-detected if not specified)
   */
  runtime?: Runtime

  /**
   * Variables to make available in the MDX scope
   */
  scope?: Record<string, unknown>

  /**
   * Custom components to use in MDX
   */
  components?: Record<string, unknown>

  /**
   * MDX compile options
   */
  compileOptions?: {
    /**
     * JSX runtime mode (default: 'automatic')
     */
    jsxRuntime?: 'automatic' | 'classic'

    /**
     * Development mode (includes more helpful errors)
     */
    development?: boolean

    /**
     * Custom pragma for JSX (default: 'React.createElement')
     */
    pragma?: string

    /**
     * Custom pragma for fragments (default: 'React.Fragment')
     */
    pragmaFrag?: string
  }

  /**
   * Timeout for evaluation in milliseconds (Node.js only)
   */
  timeout?: number

  /**
   * Memory limit for evaluation in MB (Node.js only)
   */
  memoryLimit?: number
}

/**
 * Result of MDX evaluation
 */
export interface EvaluateResult {
  /**
   * The default export from the MDX file
   */
  default: unknown

  /**
   * Named exports from the MDX file
   */
  [key: string]: unknown
}
