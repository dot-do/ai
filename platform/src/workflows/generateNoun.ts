import { WorkflowConfig } from 'payload'
import { generateObject } from 'ai'
import matter from 'gray-matter'
import { model } from '@/lib/ai'

type GenerateNounInput = {
  id: string
  queryContext?: Record<string, string>
}

export const generateNoun: WorkflowConfig<'generateNoun'> = {
  slug: 'generateNoun',
  inputSchema: [
    { 
      name: 'id', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'queryContext', 
      type: 'json', 
      required: false 
    }
  ],
  handler: async ({ job, tasks, req }) => {
    const { payload } = req
    const settings = await payload.findGlobal({ slug: 'settings' })
    
    const input = job.input as unknown as GenerateNounInput
    const { id, queryContext } = input
    
    console.log(`Generating Noun/${id} with context:`, queryContext)

    const queryContextStr = queryContext ? 
      `Additional context: ${JSON.stringify(queryContext)}` : ''
    
    const results = await generateObject({
      model: model('google/gemini-2.5-pro-preview', { structuredOutputs: true }),
      prompt: `Generate a Noun with an @id of ${id} with the appropriate properties and relationships.
        ${queryContextStr}`,
      output: 'no-schema',
    }).then((results) => ({
      data: matter.stringify('', { data: results.object }),
      content: matter.stringify('', { data: { $id: id, ...results.object as any } }),
      request: results.request,
      response: results.response,
      usage: results.usage,
    }))
  
    const generation = await payload.create({ collection: 'generations', data: {
      request: JSON.parse(results.request.body || '{}'),
      response: results.response,
      metadata: results.usage,
    } })
  
    try {
      const noun = await payload.create({ 
        collection: 'nouns', 
        data: {
          id,
          generate: null, // We've already generated it
          context: results.content,
        },
      })
      
      console.log(`Created Noun/${id}:`, noun)
    } catch (error) {
      const noun = await payload.update({ 
        collection: 'nouns', 
        id,
        data: {
          generate: null, // We've already generated it
          context: results.content,
        },
      })
      
      console.log(`Updated Noun/${id}:`, noun)
    }
  },
}
