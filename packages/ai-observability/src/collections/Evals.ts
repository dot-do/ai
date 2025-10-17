import { CollectionConfig } from 'payload'

export const Evals: CollectionConfig = {
  slug: 'evals',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
    description: 'Evaluation metrics for AI operations',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'metrics', type: 'json' },
    { name: 'completion', type: 'relationship', relationTo: 'completions' },
    { name: 'execution', type: 'relationship', relationTo: 'executions' },
    { name: 'experiment', type: 'relationship', relationTo: 'experiments' },
    { name: 'createdAt', type: 'date' },
  ],
}
