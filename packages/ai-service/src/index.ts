import { ServiceConfig, ServiceWrapped, UsageData, PricingConfig } from './types'
import { createOrGetProduct, createOrGetPrice, createSubscription as createStripeSubscription, recordUsage as recordStripeUsage } from './stripe'
import { calculatePrice } from './pricing'

const productIds = new Map<string, string>()
const priceIds = new Map<string, string>()

/**
 * Service function to wrap Functions, Workflows, or Agents with pricing capabilities
 * @param config Configuration for the service
 * @returns Enhanced entity with pricing/billing methods
 */
export function Service<T>({ entity, type, pricing, metadata = {} }: ServiceConfig<T>): ServiceWrapped<T> {
  let productId: string = ''
  let priceId: string = ''

  const initializeStripe = async () => {
    const instanceId = metadata.id || Math.random().toString(36).substring(2, 15)
    const cacheKey = `${type}-${pricing.model}-${instanceId}`

    if (productIds.has(cacheKey) && priceIds.has(cacheKey)) {
      productId = productIds.get(cacheKey) || ''
      priceId = priceIds.get(cacheKey) || ''
      return
    }

    productId = await createOrGetProduct({ entity, type, pricing, metadata })
    productIds.set(cacheKey, productId)

    priceId = await createOrGetPrice({ entity, type, pricing, metadata }, productId)
    priceIds.set(cacheKey, priceId)
  }

  const ensureInitialized = async () => {
    if (!productId || !priceId) {
      await initializeStripe()
    }
  }

  const calculatePriceForUsage = async (usage: UsageData): Promise<number> => {
    return calculatePrice(pricing, usage)
  }

  const recordUsageForBilling = async (usage: UsageData): Promise<any> => {
    await ensureInitialized()

    if (usage.subscriptionItemId) {
      const amount = await calculatePriceForUsage(usage)
      return recordStripeUsage(usage.subscriptionItemId, Math.round(amount * 100))
    }

    return {
      usage,
      price: await calculatePriceForUsage(usage),
      timestamp: new Date().toISOString(),
    }
  }

  const createSubscriptionForCustomer = async (customerId: string): Promise<any> => {
    await ensureInitialized()
    return createStripeSubscription(customerId, priceId, {
      entityType: type,
      pricingModel: pricing.model,
      ...metadata,
    })
  }

  const getProductIdMethod = (): string => {
    if (!productId) {
      throw new Error('Product ID not initialized')
    }
    return productId
  }

  const getPriceIdMethod = (): string => {
    if (!priceId) {
      throw new Error('Price ID not initialized')
    }
    return priceId
  }

  if (typeof entity === 'function') {
    const wrappedFunction = async (...args: any[]) => {
      return (entity as any)(...args)
    }

    Object.assign(wrappedFunction, {
      calculatePrice: calculatePriceForUsage,
      recordUsage: recordUsageForBilling,
      createSubscription: createSubscriptionForCustomer,
      getProductId: getProductIdMethod,
      getPriceId: getPriceIdMethod,
    })

    return wrappedFunction as ServiceWrapped<T>
  } else {
    return {
      ...entity,
      calculatePrice: calculatePriceForUsage,
      recordUsage: recordUsageForBilling,
      createSubscription: createSubscriptionForCustomer,
      getProductId: getProductIdMethod,
      getPriceId: getPriceIdMethod,
    } as ServiceWrapped<T>
  }
}

export * from './types'
