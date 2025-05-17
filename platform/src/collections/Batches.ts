import type { CollectionConfig } from 'payload'

export const Batches: CollectionConfig = {
  slug: 'batches',
  admin: {
    group: 'AI',
    hidden: true,
  },
  versions: true,
  fields: [
    { name: 'status', type: 'select', defaultValue: 'Pending', options: ['Pending', 'Generating', 'Completed', 'Failed'], required: true },
    { name: 'generations', type: 'join', collection: 'generations', on: 'batch' },
  ],
}
