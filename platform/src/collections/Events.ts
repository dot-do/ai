import type { CollectionConfig } from 'payload'
import { editorOptions } from '@/lib/collections'
import { isLoggedIn } from '@/lib/collections'
import { onEventCreate } from '@/hooks/onEventCreate'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'Data'
  },
  versions: true,
  access: {
    create: isLoggedIn,
    update: () => false,
    delete: () => false,
    read: isLoggedIn,
  },
  fields: [
    { type: 'row', fields: [
      // { name: 'id', type: 'text', admin: { hidden: true } },
      { name: 'status', type: 'select', defaultValue: 'Pending', options: ['Pending', 'Processing', 'Success', 'Error'], admin: { readOnly: true } },
      { name: 'execution', type: 'relationship', relationTo: 'functions', admin: { readOnly: true, condition: ({ execution }) => !!execution } },
      { name: 'workflow', type: 'relationship', relationTo: 'workflows', admin: { readOnly: true, condition: ({ workflow }) => !!workflow } },
      { name: 'generation', type: 'relationship', relationTo: 'generations', admin: { readOnly: true, condition: ({ generation }) => !!generation } },
      { name: 'noun', type: 'relationship', relationTo: 'nouns', admin: { readOnly: true, condition: ({ noun }) => !!noun } },
      { name: 'thing', type: 'relationship', relationTo: 'things', admin: { readOnly: true, condition: ({ thing }) => !!thing } },
    ]},
    { name: 'input', type: 'code', admin: { editorOptions, language: 'mdx', condition: ({ execution }) => !!execution } },
    { name: 'data', type: 'json', admin: { editorOptions, readOnly: true, condition: ({ data }) => !!data } },
    { name: 'webhooks', type: 'array', admin: { readOnly: true, condition: ({ status }) => status !== 'Pending' }, fields: [
      { name: 'webhook', type: 'relationship', relationTo: 'webhooks' },
      { name: 'timestamp', type: 'date', defaultValue: () => new Date().toISOString() },
      { name: 'status', type: 'select', defaultValue: 'Pending', options: ['Pending', 'Success', 'Error'] },
      { name: 'data', type: 'json' },
    ]},
  ],
  hooks: {
    afterOperation: [onEventCreate],
  },
}
