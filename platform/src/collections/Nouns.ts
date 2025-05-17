import type { CollectionConfig } from 'payload'
import dedent from 'dedent'
import { editorOptions } from '@/lib/collections'
import matter from 'gray-matter'

const defaultValue = dedent`
---
$id: 
$type: 
name: 
image: 
description: 
sameAs: 
subjectOf:
url: 
---

# {name}

{description}

`

export const Nouns: CollectionConfig = {
  slug: 'nouns',
  admin: {
    group: 'Data',
    // useAsTitle: 'ns.id'
  },
  versions: true,
  fields: [
    { type: 'row', fields: [
      // { name: 'id', type: 'text', admin: { hidden: true } },
      // { name: 'ns', type: 'relationship', relationTo: 'databases', label: 'Namespace' },
      { name: 'id', type: 'text', required: true, label: 'Name' },
      // { name: 'name', type: 'text', label: 'Name' },
      { name: 'typeOf', type: 'relationship', relationTo:'nouns', hasMany: true },
      // { name: 'sameAs', type: 'relationship', relationTo: 'types' },
      // { name: 'generate', type: 'select', defaultValue: 'Object', options: ['List', 'Object', 'Markdown', 'Code', 'Nothing'] },
      { name: 'generate', type: 'relationship', relationTo: 'functions' },
    ]},
    { name: 'context', type: 'code', admin: { language: 'mdx', editorOptions } },
    { name: 'relationships', type: 'array', fields: [
      { type: 'row', fields: [
        { name: 'predicate', type: 'text' },
        { name: 'object', type: 'relationship', relationTo: ['nouns','things'] },
      ]},
    ]},
    // { name: 'subClasses', type: 'join', collection: 'nouns', on: 'subClassOf' },
    { name: 'related', type: 'join', collection: 'nouns', on: 'relationships.object' },
    { name: 'things', type: 'join', collection: 'things', on: 'type' },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        const { content } = matter(data.context || '')
        data.content = content
        return data
      },
    ],
  }
}
