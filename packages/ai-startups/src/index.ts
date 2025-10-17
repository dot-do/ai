import { storyBrand, leanCanvas, Goals, Plans } from 'ai-business'
import { StartupConfig, StartupInstance, ServiceDefinition } from './types'
import { generateSite } from './site-generator'
import { generateDatabase } from './db-schema'

/**
 * Create a business foundation with name, vision, and goals
 */
const Business = ({
  name,
  vision,
  goals,
  ...config
}: {
  name: string
  vision: string
  goals: Array<{ objective: string; keyResults: string[] }>
  [key: string]: any
}) => {
  return {
    name,
    vision,
    goals,
    ...config,
  }
}

/**
 * Create a service with pricing and implementation details
 */
const Service = (config: ServiceDefinition) => {
  const { name, objective, pricing, implementation, metadata = {} } = config

  return {
    name,
    objective,
    pricing,
    implementation,
    metadata,

    calculatePrice: async (usage: any) => {
      if (pricing.model === 'subscription' && pricing.subscription) {
        return pricing.subscription.price
      } else if (pricing.model === 'activity-based' && pricing.activities) {
        const activity = pricing.activities.find((a) => a.name === usage.activity)
        return activity ? activity.rate * (usage.quantity || 1) : 0
      } else if (pricing.model === 'usage-based') {
        return (usage.quantity || 1) * 0.01 // Default rate
      } else if (pricing.model === 'tiered' && pricing.tiers) {
        const tier = pricing.tiers.find((t) => !t.limit || (usage.quantity || 0) <= t.limit)
        return tier ? tier.price : 0
      }
      return 0
    },
  }
}

/**
 * Startup function that combines Business and Service patterns
 * to enable selling Functions, Workflows, and Agents while
 * generating both a website and database.
 *
 * @param config Configuration for the startup
 * @returns Enhanced startup instance with business and service capabilities
 */
export const Startup = ({ name, vision, goals, services = [], ...businessConfig }: StartupConfig): StartupInstance => {
  const business = Business({
    name,
    vision,
    goals,
    ...businessConfig,
  })

  const serviceOfferings = services.map((svc: ServiceDefinition) => Service(svc))

  const generateSiteMethod = () => {
    return generateSite({
      business,
      services: serviceOfferings,
    })
  }

  const generateDatabaseMethod = () => {
    return generateDatabase({
      business,
      services: serviceOfferings,
    })
  }

  return {
    ...business,
    services: serviceOfferings,
    generateSite: generateSiteMethod,
    generateDatabase: generateDatabaseMethod,

    createStoryBrand: async () => storyBrand(business),
    createLeanCanvas: async () => leanCanvas(business),
  }
}

export * from './types'
