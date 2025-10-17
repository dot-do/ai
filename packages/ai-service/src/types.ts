/**
 * Type definitions for ai-service package
 */

/**
 * Type for AI function that can be called with input
 * Matches the AIFunction type from ai-functions package
 */
export type AIFunction<TInput = any, TOutput = any> = {
  (input: TInput, config?: any): Promise<TOutput>
}

/**
 * Types of entities that can be wrapped by Service
 */
export type EntityType = 'function' | 'workflow' | 'agent'

/**
 * Consumption units for pricing models
 */
export type ConsumptionUnit = 'tokens' | 'requests' | 'compute_ms'

/**
 * Billing interval for subscription-based pricing
 */
export type BillingInterval = 'monthly' | 'yearly' | 'hourly' | 'daily'

/**
 * Pricing model types supported by Service
 */
export type PricingModel = 'payPerUse' | 'prepaid' | 'postpaid' | 'subscription' | 'outcome'

/**
 * Base pricing configuration interface
 */
export interface BasePricingConfig {
  model: PricingModel
  consumptionUnit?: ConsumptionUnit
  consumptionRate?: number
  billingPlanId?: string
  outcomes?: Record<string, number>
}

/**
 * Pay-per-use pricing configuration
 */
export interface PayPerUsePricingConfig extends BasePricingConfig {
  model: 'payPerUse'
  pricePerUse: number
}

/**
 * Prepaid pricing configuration
 */
export interface PrepaidPricingConfig extends BasePricingConfig {
  model: 'prepaid'
  pricePerUnit: number
}

/**
 * Postpaid pricing configuration
 */
export interface PostpaidPricingConfig extends BasePricingConfig {
  model: 'postpaid'
  pricePerUnit: number
}

/**
 * Subscription pricing configuration
 */
export interface SubscriptionPricingConfig extends BasePricingConfig {
  model: 'subscription'
  perUser?: {
    price: number
    interval?: BillingInterval
  }
  perInstance?: {
    price: number
    interval?: BillingInterval
  }
}

/**
 * Outcome-based pricing configuration
 */
export interface OutcomePricingConfig extends BasePricingConfig {
  model: 'outcome'
  outcomes: Record<string, number>
}

/**
 * Union type of all pricing configurations
 */
export type PricingConfig = PayPerUsePricingConfig | PrepaidPricingConfig | PostpaidPricingConfig | SubscriptionPricingConfig | OutcomePricingConfig

/**
 * Usage data for calculating prices
 */
export interface UsageData {
  /**
   * User ID
   */
  userId?: string
  /**
   * Instance ID for instance-based pricing
   */
  instanceId?: string
  /**
   * Number of input tokens
   */
  inputs?: number
  /**
   * Number of output tokens
   */
  outputs?: number
  /**
   * Number of requests
   */
  requests?: number
  /**
   * Compute time in milliseconds
   */
  computeMs?: number
  /**
   * Usage time in hours (for instance-based pricing)
   */
  usageTimeHours?: number
  /**
   * Outcome of the execution (for outcome-based pricing)
   */
  outcome?: string
  /**
   * Subscription item ID for recording usage
   */
  subscriptionItemId?: string
  /**
   * Additional metadata for usage tracking
   */
  metadata?: Record<string, any>
}

/**
 * Service configuration
 */
export interface ServiceConfig<T> {
  /**
   * The entity to wrap (Function, Workflow, or Agent)
   */
  entity: T
  /**
   * Type of the entity
   */
  type: EntityType
  /**
   * Pricing configuration
   */
  pricing: PricingConfig
  /**
   * Additional metadata
   */
  metadata?: Record<string, any>
}

/**
 * Methods added to the entity by the Service wrapper
 */
export interface ServiceMethods {
  /**
   * Calculate the price for the given usage
   */
  calculatePrice: (usage: UsageData) => Promise<number>
  /**
   * Record usage for billing
   */
  recordUsage: (usage: UsageData) => Promise<any>
  /**
   * Create a subscription for a customer
   */
  createSubscription: (customerId: string) => Promise<any>
  /**
   * Get the Stripe product ID for this service
   */
  getProductId: () => string
  /**
   * Get the Stripe price ID for this service
   */
  getPriceId: () => string
}

/**
 * A service-wrapped entity with additional methods
 */
export type ServiceWrapped<T> = T & ServiceMethods
