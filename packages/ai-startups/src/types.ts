export type ServiceWrapped<T> = T & {
  name: string
  objective: string
  pricing: any
  implementation: any
}

/**
 * Goal definition with objective and key results
 */
export interface Goal {
  objective: string
  keyResults: string[]
}

/**
 * Service definition for startup offerings
 */
export interface ServiceDefinition {
  name: string
  objective: string
  pricing: {
    model: 'subscription' | 'activity-based' | 'usage-based' | 'tiered'
    activities?: Array<{
      name: string
      rate: number
    }>
    tiers?: Array<{
      name: string
      price: number
      limit?: number
    }>
    subscription?: {
      price: number
      interval: 'month' | 'year'
    }
  }
  implementation: {
    type: 'function' | 'workflow' | 'agent'
    id: string
    entity?: any
  }
  metadata?: Record<string, any>
}

/**
 * Configuration for creating a startup
 */
export interface StartupConfig {
  name: string
  vision: string
  goals: Goal[]
  services?: ServiceDefinition[]
  [key: string]: any
}

/**
 * Site generation result
 */
export interface SiteGenerationResult {
  pages: {
    home: string
    services: string
    pricing: string
    about: string
    [key: string]: string
  }
  assets: {
    [key: string]: string
  }
  config: {
    theme: string
    navigation: Array<{
      label: string
      path: string
    }>
    [key: string]: any
  }
}

/**
 * Database schema generation result
 */
export interface DatabaseGenerationResult {
  collections: {
    startup: Record<string, any>
    services: Record<string, any>
    customers: Record<string, any>
    subscriptions: Record<string, any>
    usage: Record<string, any>
    [key: string]: Record<string, any>
  }
  relationships: Array<{
    from: string
    to: string
    type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  }>
  indexes: Array<{
    collection: string
    fields: string[]
    unique?: boolean
  }>
}

/**
 * Startup instance returned by the Startup function
 */
export interface StartupInstance {
  name: string
  vision: string
  goals: Goal[]
  services: Array<ServiceWrapped<any>>
  generateSite: () => SiteGenerationResult
  generateDatabase: () => DatabaseGenerationResult
  createStoryBrand: () => Promise<any>
  createLeanCanvas: () => Promise<any>
  [key: string]: any
}
