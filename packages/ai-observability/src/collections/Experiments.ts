import { CollectionConfig } from 'payload'

export const Experiments: CollectionConfig = {
  slug: 'experiments',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
    description: 'A/B testing experiments for AI operations',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'variants', type: 'json' },
    { name: 'status', type: 'select', options: ['draft', 'active', 'completed', 'archived'] },
    { name: 'results', type: 'json' },
    { name: 'startedAt', type: 'date' },
    { name: 'completedAt', type: 'date' },
  ],
}
