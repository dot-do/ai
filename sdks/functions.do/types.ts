/** Configuration options for an AI function. */
export interface AIConfig {
  /** Model identifier used for generation. */
  model?: string
  /** Optional system prompt appended before user input. */
  system?: string
  /** Sampling temperature. */
  temperature?: number
  /** Deterministic seed if supported by the model. */
  seed?: number
}

/** An AI function that transforms an input into a typed output. */
export type AIFunction<Input = unknown, Output = unknown> = (input: Input, config?: AIConfig) => Promise<Output>

/** Collection of AI functions accessible through the SDK. */
export type AIInstance = Record<string, AIFunction>

/** Create a typed collection of AI functions from a schema definition. */
export declare function AI<T extends Record<string, any>>(definition: T): AIInstance

/** Default AI proxy for calling functions without explicit definitions. */
export declare const ai: AIInstance
