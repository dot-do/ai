import type { CollectionConfig } from 'payload'
import { editorOptions, isLoggedIn } from '@/lib/collections'

export const Generations: CollectionConfig = {
  slug: 'generations',
  admin: {
    group: 'AI'
  },
  access: {
    create: () => false,
    update: () => false,
    delete: () => false,
    read: isLoggedIn,
  },
  fields: [
    { type: 'row', fields: [
      { name: 'provider', type: 'text' },
      { name: 'type', type: 'select', options: ['Realtime', 'Batch'] },
      { name: 'batch', type: 'relationship', relationTo: 'batches', admin: { condition: ({ type }) => type === 'Batch' } },
    ]},
    { name: 'request', type: 'json', admin: { editorOptions } },
    { name: 'response', type: 'json', admin: { editorOptions } },
    { name: 'metadata', type: 'json', admin: { editorOptions } },
  ],
}
