import { CollectionConfig } from 'payload'

export const Batches: CollectionConfig = {
  slug: 'batches',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
    description: 'Batches of completions',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'status', type: 'select', defaultValue: 'queued', options: ['queued', 'processing', 'completed', 'failed'] },
    { name: 'completions', type: 'relationship', relationTo: 'completions', hasMany: true },
    { name: 'startedAt', type: 'date' },
    { name: 'completedAt', type: 'date' },
  ],
}
