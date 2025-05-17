import type { CollectionConfig } from 'payload'
import { editorOptions } from '@/lib/collections'

editorOptions.language = 'ts'

const defaultValue = `
export default (event, { ai, db }) => {

  const { data } = event

  const related = await db.ideas.findSimilar({ data })

  const result = ai.generateIdeas({ data, related })

  await db.ideas.create({ data: result })

  return result
  
}
`.trim()

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    group: 'AI',
    useAsTitle: 'name',
  },
  versions: true,
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'code', type: 'code', defaultValue, admin: { editorOptions } },
  ],
}