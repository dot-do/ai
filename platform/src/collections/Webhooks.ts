import type { CollectionConfig } from 'payload'

export const Webhooks: CollectionConfig = {
  slug: 'webhooks',
  admin: {
    group: 'Admin'
  },
  versions: true,
  fields: [
    { name: 'type', type: 'select', defaultValue: 'Outgoing', options: ['Incoming', 'Outgoing'] },
    { name: 'events', type: 'select', defaultValue: ['Create', 'Update', 'Delete'], options: ['Create', 'Update', 'Delete'], hasMany: true },
    { name: 'things', type: 'relationship', relationTo: 'things', hasMany: true },
  ],
}
