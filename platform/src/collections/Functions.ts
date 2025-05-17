import type { CollectionConfig, Condition } from 'payload'
import { editorOptions } from '@/lib/collections'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, unique: true },
        {
          name: 'output',
          type: 'select',
          defaultValue: 'Object',
          options: ['Object', 'ObjectArray', 'Text', 'TextArray', 'Code'],
        },
        {
          name: 'model',
          type: 'text',
          defaultValue: ({ req }) => req.payload.findGlobal({ slug: 'settings' }).then((settings) => settings.defaultModel || 'gemini-2.5-pro-preview'),
        },
      ],
    },
    { name: 'system', type: 'code', admin: { language: 'mdx', editorOptions } },
    { name: 'prompt', type: 'code', admin: { language: 'mdx', editorOptions } },
    {
      name: 'schema',
      type: 'code',
      admin: {
        language: 'yaml',
        editorOptions,
        condition: (data) => data.output === 'Object' || data.output === 'ObjectArray',
      },
    },
    {
      name: 'settings',
      type: 'code',
      defaultValue: 'temperature: 1.0',
      admin: { language: 'yaml', editorOptions },
    },
    { name: 'data', type: 'json', admin: { hidden: true } },
    // { name: 'executions', type: 'join', collection: 'events', on: 'execution', hasMany: true },
    // { name: 'executions', type: 'join', collection: 'payload-jobs', on: 'input.function', hasMany: true },
  ],
}
