import { CollectionConfig } from 'payload'

export const Completions: CollectionConfig = {
  slug: 'completions',
  admin: {
    group: 'Observability',
    description: 'Records of AI model completion requests and responses',
  },
  access: { update: () => false, delete: () => false },
  fields: [
    { name: 'request', type: 'json' },
    { name: 'response', type: 'json' },
    { name: 'error', type: 'json' },
    { name: 'status', type: 'select', options: ['success', 'error'] },
    { name: 'duration', type: 'number' },
    { name: 'batch', type: 'relationship', relationTo: 'batches' },
  ],
}
