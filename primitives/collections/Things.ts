import type { CollectionConfig } from 'payload'
import { editorOptions } from '../lib/collections'
import { onThingCreate } from '../hooks/onThingCreate'

export const Things: CollectionConfig = {
  slug: 'things',
  admin: {
    group: 'Data',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'type', type: 'relationship', relationTo: 'nouns', required: true },
        // { name: 'format', type: 'select', defaultValue: 'Object', options: ['Object', 'Markdown'] },
        // {
        //   name: 'generation',
        //   type: 'relationship',
        //   relationTo: 'generations',
        //   admin: { readOnly: true, condition: ({ generation }) => !!generation },
        // },
      ],
    },
    { name: 'content', type: 'code', admin: { language: 'mdx', editorOptions } },
    { name: 'data', type: 'json', admin: { editorOptions } },
    { name: 'reasoning', type: 'code', admin: { language: 'mdx', editorOptions } },
    { name: 'citations', type: 'code', admin: { language: 'mdx', editorOptions } },
    {
      name: 'relationships',
      type: 'array',
      fields: [
        { name: 'predicate', type: 'text' },
        { name: 'object', type: 'relationship', relationTo: 'things' },
      ],
    },
    {
      name: 'events',
      type: 'join',
      collection: 'events',
      on: 'thing',
      admin: { condition: ({ events }) => !!events },
    },
  ],
  hooks: {
    afterOperation: [onThingCreate],
  },
}
