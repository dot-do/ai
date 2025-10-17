import { PricingConfig, UsageData } from '../types'

/**
 * Calculate price based on pay-per-use pricing model
 */
export function calculatePayPerUsePrice(pricing: PricingConfig, usage: UsageData): number {
  if (pricing.model !== 'payPerUse') {
    throw new Error('Invalid pricing model')
  }

  return pricing.pricePerUse
}

/**
 * Calculate price based on prepaid pricing model
 */
export function calculatePrepaidPrice(pricing: PricingConfig, usage: UsageData): number {
  if (pricing.model !== 'prepaid') {
    throw new Error('Invalid pricing model')
  }

  const unit = pricing.consumptionUnit || 'requests'
  const rate = pricing.consumptionRate || 1

  switch (unit) {
    case 'tokens':
      return ((usage.inputs || 0) + (usage.outputs || 0)) * rate * (pricing.pricePerUnit || 0)
    case 'requests':
      return (usage.requests || 1) * rate * (pricing.pricePerUnit || 0)
    case 'compute_ms':
      return (usage.computeMs || 0) * rate * (pricing.pricePerUnit || 0)
    default:
      return 0
  }
}

/**
 * Calculate price based on postpaid pricing model
 */
export function calculatePostpaidPrice(pricing: PricingConfig, usage: UsageData): number {
  if (pricing.model !== 'postpaid') {
    throw new Error('Invalid pricing model')
  }

  const unit = pricing.consumptionUnit || 'requests'
  const rate = pricing.consumptionRate || 1

  switch (unit) {
    case 'tokens':
      return ((usage.inputs || 0) + (usage.outputs || 0)) * rate * (pricing.pricePerUnit || 0)
    case 'requests':
      return (usage.requests || 1) * rate * (pricing.pricePerUnit || 0)
    case 'compute_ms':
      return (usage.computeMs || 0) * rate * (pricing.pricePerUnit || 0)
    default:
      return 0
  }
}

/**
 * Calculate price based on subscription pricing model
 */
export function calculateSubscriptionPrice(pricing: PricingConfig, usage: UsageData): number {
  if (pricing.model !== 'subscription') {
    throw new Error('Invalid pricing model')
  }

  if (pricing.perUser && usage.userId) {
    return pricing.perUser.price
  } else if (pricing.perInstance && usage.instanceId) {
    return pricing.perInstance.price * (usage.usageTimeHours || 1)
  }

  return 0
}

/**
 * Calculate price based on outcome pricing model
 */
export function calculateOutcomePrice(pricing: PricingConfig, usage: UsageData): number {
  if (pricing.model !== 'outcome') {
    throw new Error('Invalid pricing model')
  }

  const outcome = usage.outcome || 'default'
  return pricing.outcomes?.[outcome] || pricing.outcomes?.['default'] || 0
}

/**
 * Calculate price based on the pricing model and usage data
 */
export function calculatePrice(pricing: PricingConfig, usage: UsageData): number {
  switch (pricing.model) {
    case 'payPerUse':
      return calculatePayPerUsePrice(pricing, usage)
    case 'prepaid':
      return calculatePrepaidPrice(pricing, usage)
    case 'postpaid':
      return calculatePostpaidPrice(pricing, usage)
    case 'subscription':
      return calculateSubscriptionPrice(pricing, usage)
    case 'outcome':
      return calculateOutcomePrice(pricing, usage)
    default:
      return 0
  }
}
