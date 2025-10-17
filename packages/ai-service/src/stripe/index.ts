import Stripe from 'stripe'
import { PricingConfig, PricingModel, EntityType, ServiceConfig } from '../types'

const stripe = new Stripe(process.env.STRIPE_API_KEY || '')

/**
 * Create or get Stripe product for a service
 */
export async function createOrGetProduct<T>(config: ServiceConfig<T>): Promise<string> {
  try {
    const { type, pricing, metadata = {} } = config
    const name = metadata.name || `AI ${type} Service`
    const description = metadata.description || `AI ${type} with ${pricing.model} pricing`

    const existingProducts = await stripe.products.list({
      active: true,
    })

    const productMetadata = {
      entityType: type,
      pricingModel: pricing.model,
      ...metadata,
    }

    const existing = existingProducts.data.find(
      (p) => p.metadata.entityType === type && p.metadata.pricingModel === pricing.model && p.metadata.id === metadata.id
    )

    if (existing) {
      return existing.id
    }

    const product = await stripe.products.create({
      name,
      description,
      metadata: productMetadata,
    })

    return product.id
  } catch (error) {
    console.error('Error creating Stripe product:', error)
    throw new Error(`Failed to create Stripe product: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Create or get Stripe price for a service
 */
export async function createOrGetPrice<T>(config: ServiceConfig<T>, productId: string): Promise<string> {
  try {
    const { pricing, metadata = {} } = config

    const existingPrices = await stripe.prices.list({
      product: productId,
      active: true,
    })

    if (existingPrices.data.length > 0) {
      return existingPrices.data[0].id
    }

    let priceData: Stripe.PriceCreateParams = {
      product: productId,
      currency: 'usd',
      metadata: { ...metadata },
    }

    switch (pricing.model) {
      case 'payPerUse': {
        priceData = {
          ...priceData,
          unit_amount: Math.round(pricing.pricePerUse * 100), // Convert to cents
          currency: 'usd',
        }
        break
      }
      case 'subscription': {
        if (pricing.perUser) {
          const interval = pricing.perUser.interval || 'monthly'
          priceData = {
            ...priceData,
            unit_amount: Math.round(pricing.perUser.price * 100),
            currency: 'usd',
            recurring: {
              interval: interval === 'yearly' ? 'year' : interval === 'daily' ? 'day' : interval === 'hourly' ? 'day' : 'month',
            },
          }
        } else if (pricing.perInstance) {
          const interval = pricing.perInstance.interval || 'monthly'
          priceData = {
            ...priceData,
            unit_amount: Math.round(pricing.perInstance.price * 100),
            currency: 'usd',
            recurring: {
              interval: interval === 'yearly' ? 'year' : interval === 'daily' ? 'day' : interval === 'hourly' ? 'day' : 'month',
            },
          }
        }
        break
      }
      default: {
        priceData = {
          ...priceData,
          unit_amount: 100, // $1.00
          currency: 'usd',
        }
      }
    }

    const price = await stripe.prices.create(priceData)
    return price.id
  } catch (error) {
    console.error('Error creating Stripe price:', error)
    throw new Error(`Failed to create Stripe price: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Create a subscription for a customer
 */
export async function createSubscription(customerId: string, priceId: string, metadata: Record<string, any> = {}): Promise<any> {
  try {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Record usage for a metered subscription
 */
export async function recordUsage(subscriptionItemId: string, quantity: number): Promise<any> {
  try {
    return await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
      quantity,
      action: 'increment',
    })
  } catch (error) {
    console.error('Error recording usage:', error)
    throw new Error(`Failed to record usage: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
