import { StartupInstance, DatabaseGenerationResult } from './types'

/**
 * Generate a database schema based on the startup configuration
 *
 * @param config Configuration for database schema generation
 * @returns Generated database schema structure
 */
export const generateDatabase = (config: { business: any; services: any[] }): DatabaseGenerationResult => {
  const { business, services } = config

  const startupCollection = {
    name: {
      type: 'string',
      required: true,
    },
    vision: {
      type: 'string',
      required: true,
    },
    goals: {
      type: 'array',
      fields: [
        {
          name: 'objective',
          type: 'string',
          required: true,
        },
        {
          name: 'keyResults',
          type: 'array',
          fields: [
            {
              name: 'description',
              type: 'string',
              required: true,
            },
            {
              name: 'target',
              type: 'number',
            },
            {
              name: 'currentValue',
              type: 'number',
              defaultValue: 0,
            },
          ],
        },
      ],
    },
    createdAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
    updatedAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
  }

  const servicesCollection = {
    name: {
      type: 'string',
      required: true,
    },
    objective: {
      type: 'string',
      required: true,
    },
    pricingModel: {
      type: 'select',
      options: ['subscription', 'activity-based', 'usage-based', 'tiered'],
      required: true,
    },
    pricingDetails: {
      type: 'json',
    },
    implementationType: {
      type: 'select',
      options: ['function', 'workflow', 'agent'],
      required: true,
    },
    implementationId: {
      type: 'string',
      required: true,
    },
    metadata: {
      type: 'json',
    },
    startup: {
      type: 'relationship',
      relationTo: 'startups',
      required: true,
    },
    createdAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
    updatedAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
  }

  const customersCollection = {
    email: {
      type: 'email',
      required: true,
      unique: true,
    },
    name: {
      type: 'string',
    },
    company: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    address: {
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'string',
        },
        {
          name: 'city',
          type: 'string',
        },
        {
          name: 'state',
          type: 'string',
        },
        {
          name: 'zip',
          type: 'string',
        },
        {
          name: 'country',
          type: 'string',
        },
      ],
    },
    metadata: {
      type: 'json',
    },
    createdAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
    updatedAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
  }

  const subscriptionsCollection = {
    customer: {
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    service: {
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    status: {
      type: 'select',
      options: ['active', 'canceled', 'past_due', 'trialing', 'paused'],
      defaultValue: 'active',
      required: true,
    },
    currentPeriodStart: {
      type: 'date',
      required: true,
    },
    currentPeriodEnd: {
      type: 'date',
      required: true,
    },
    cancelAtPeriodEnd: {
      type: 'boolean',
      defaultValue: false,
    },
    priceId: {
      type: 'string',
    },
    metadata: {
      type: 'json',
    },
    createdAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
    updatedAt: {
      type: 'date',
      defaultValue: () => new Date(),
    },
  }

  const usageCollection = {
    subscription: {
      type: 'relationship',
      relationTo: 'subscriptions',
      required: true,
    },
    service: {
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    customer: {
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    quantity: {
      type: 'number',
      required: true,
    },
    activityName: {
      type: 'string',
    },
    timestamp: {
      type: 'date',
      defaultValue: () => new Date(),
      required: true,
    },
    metadata: {
      type: 'json',
    },
  }

  const relationships: Array<{
    from: string
    to: string
    type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  }> = [
    {
      from: 'services',
      to: 'startups',
      type: 'many-to-many',
    },
    {
      from: 'subscriptions',
      to: 'customers',
      type: 'one-to-many',
    },
    {
      from: 'subscriptions',
      to: 'services',
      type: 'one-to-many',
    },
    {
      from: 'usage',
      to: 'subscriptions',
      type: 'one-to-many',
    },
    {
      from: 'usage',
      to: 'services',
      type: 'one-to-many',
    },
    {
      from: 'usage',
      to: 'customers',
      type: 'one-to-many',
    },
  ]

  const indexes = [
    {
      collection: 'customers',
      fields: ['email'],
      unique: true,
    },
    {
      collection: 'subscriptions',
      fields: ['customer', 'service'],
      unique: true,
    },
    {
      collection: 'usage',
      fields: ['subscription', 'timestamp'],
    },
    {
      collection: 'usage',
      fields: ['service', 'timestamp'],
    },
    {
      collection: 'usage',
      fields: ['customer', 'timestamp'],
    },
  ]

  return {
    collections: {
      startup: startupCollection,
      services: servicesCollection,
      customers: customersCollection,
      subscriptions: subscriptionsCollection,
      usage: usageCollection,
    },
    relationships,
    indexes,
  }
}
