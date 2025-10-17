import { CollectionConfig } from 'payload'

export const Functions: CollectionConfig = {
  slug: 'functions',
  admin: {
    group: 'Observability',
    useAsTitle: 'name',
    description: 'AI function definitions',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'parameters', type: 'json' },
    { name: 'implementation', type: 'code', admin: { language: 'javascript' } },
    { name: 'version', type: 'text' },
    { name: 'createdAt', type: 'date' },
    { name: 'updatedAt', type: 'date' },
  ],
}
