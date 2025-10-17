import { CollectionConfig } from 'payload'

export const Executions: CollectionConfig = {
  slug: 'executions',
  admin: {
    group: 'Observability',
    description: 'Records of function executions',
  },
  access: { update: () => false, delete: () => false },
  fields: [
    { name: 'function', type: 'relationship', relationTo: 'functions' },
    { name: 'input', type: 'json' },
    { name: 'output', type: 'json' },
    { name: 'error', type: 'json' },
    { name: 'status', type: 'select', options: ['success', 'error'] },
    { name: 'duration', type: 'number' },
    { name: 'startedAt', type: 'date' },
    { name: 'completedAt', type: 'date' },
  ],
}
