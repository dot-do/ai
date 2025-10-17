import { expect, test, vi, describe, beforeEach } from 'vitest'
import { Service } from '../src'

const mockFunction = async (input: string) => {
  return `Result: ${input}`
}

vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      products: {
        create: vi.fn().mockResolvedValue({ id: 'prod_mock123' }),
        list: vi.fn().mockResolvedValue({ data: [] }),
      },
      prices: {
        create: vi.fn().mockResolvedValue({ id: 'price_mock123' }),
        list: vi.fn().mockResolvedValue({ data: [] }),
      },
      subscriptions: {
        create: vi.fn().mockResolvedValue({ id: 'sub_mock123' }),
      },
      subscriptionItems: {
        createUsageRecord: vi.fn().mockResolvedValue({ id: 'usage_mock123' }),
      },
    })),
  }
})

describe('Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('wraps a function with service methods', async () => {
    const pricedFunction = Service({
      entity: mockFunction,
      type: 'function',
      pricing: {
        model: 'payPerUse',
        pricePerUse: 0.05,
      },
    })

    const result = await pricedFunction('test input')
    expect(result).toBe('Result: test input')

    expect(typeof pricedFunction.calculatePrice).toBe('function')
    expect(typeof pricedFunction.recordUsage).toBe('function')
    expect(typeof pricedFunction.createSubscription).toBe('function')
    expect(typeof pricedFunction.getProductId).toBe('function')
    expect(typeof pricedFunction.getPriceId).toBe('function')
  })

  test('calculates pay-per-use price correctly', async () => {
    const pricedFunction = Service({
      entity: mockFunction,
      type: 'function',
      pricing: {
        model: 'payPerUse',
        pricePerUse: 0.05,
      },
    })

    const price = await pricedFunction.calculatePrice({})
    expect(price).toBe(0.05)
  })

  test('calculates subscription price correctly', async () => {
    const pricedFunction = Service({
      entity: mockFunction,
      type: 'function',
      pricing: {
        model: 'subscription',
        perUser: {
          price: 10,
          interval: 'monthly',
        },
      },
    })

    const price = await pricedFunction.calculatePrice({ userId: 'user123' })
    expect(price).toBe(10)
  })

  test('creates subscription for customer', async () => {
    const pricedFunction = Service({
      entity: mockFunction,
      type: 'function',
      pricing: {
        model: 'subscription',
        perUser: {
          price: 10,
          interval: 'monthly',
        },
      },
    })

    const subscription = await pricedFunction.createSubscription('cus_123456')
    expect(subscription).toEqual({ id: 'sub_mock123' })
  })
})
