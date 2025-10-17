/**
 * Model metadata interface
 */
export interface Model {
  slug: string
  name: string
  author: string
  description: string
  contextLength: number
  inputModalities: string[]
  outputModalities: string[]
  sorting?: {
    topWeekly: number
    newest: number
    throughputHighToLow: number
    latencyLowToHigh: number
    pricingLowToHigh: number
    pricingHighToLow: number
  }
}

/**
 * Parsed model reference with capabilities and constraints
 */
export interface ParsedModel {
  original: string
  author?: string
  model?: string
  capabilities?: Record<string, boolean>
  providerConstraints?: Array<{
    field: string
    type: string
    value: string
  }>
}
