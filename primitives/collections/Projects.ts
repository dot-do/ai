import type { CollectionConfig } from 'payload'
import { editorOptions } from '../lib/collections'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', unique: true },
        { name: 'domain', type: 'text', unique: true },
      ],
    },
    { name: 'context', type: 'code', admin: { language: 'mdx', editorOptions } },
  ],
}
