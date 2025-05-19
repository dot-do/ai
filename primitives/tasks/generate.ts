import { TaskConfig } from 'payload'
import { generateText, generateObject } from 'ai'
import { model } from '../lib/ai'
import { toZodSchema } from '../lib/schema'

export const generate: TaskConfig<'generate'> = {
  slug: 'generate',
  inputSchema: [
    { name: 'prompt', type: 'text', required: true },
    { name: 'model', type: 'text', defaultValue: 'google/gemini-2.5-pro-preview' },
    { name: 'system', type: 'text' },
    { name: 'format', type: 'select', required: true, options: ['Text', 'Object', 'Code', 'List'] },
    { name: 'schema', type: 'json' },
    { name: 'settings', type: 'json' },
    { name: 'context', type: 'text' },
    { name: 'event', type: 'relationship', relationTo: 'events' },
    { name: 'object', type: 'relationship', relationTo: 'nouns' },
    { name: 'project', type: 'relationship', relationTo: 'projects' },
  ],
  outputSchema: [
    { name: 'content', type: 'text' },
    { name: 'data', type: 'json' },
    { name: 'citations', type: 'json' },
    { name: 'reasoning', type: 'text' },
    { name: 'headers', type: 'json' },
    { name: 'body', type: 'json' },
    { name: 'latency', type: 'number' },
    { name: 'status', type: 'number' },
    { name: 'statusText', type: 'text' },
  ],
  handler: async ({ job, req }) => {
    let error, data, headers, body, text, latency, status, statusText, reasoning, content, citations
    const start = Date.now()
    const { payload } = req
    // TODO: figure out why job.input has an inferred type of string when it should be the input schema object type
    let { model: modelName, prompt, system, format, schema, ...settings } = job.input
    if (format === 'Object') {
      if (!system?.toLowerCase().includes('json')) system += '\n\nRespond only in JSON format.'
    }
    if (format === 'Code') {
      if (!system?.toLowerCase().includes('typescript')) system += '\n\nRespond only with TypeScript code.'
    }
    if (format === 'List') {
      if (!system?.toLowerCase().includes('list')) system += '\n\nRespond only with a numbered, Markdown ordered list.'
    }
    system = system?.trim()
    
    try {
      const aiModel = model(modelName || 'google/gemini-2.5-pro-preview', { 
        structuredOutputs: true,
        ...settings 
      })
      
      if (format === 'Object') {
        const results = schema 
          ? await generateObject({
              model: aiModel,
              prompt,
              system,
              schema: toZodSchema(schema)
            })
          : await generateObject({
              model: aiModel,
              prompt,
              system,
              output: 'no-schema'
            })

        latency = Date.now() - start
        data = results.object
        content = results.object ? JSON.stringify(results.object) : ''
        body = results.response
        status = 200
        statusText = 'OK'
        headers = {}
      } else {
        const results = await generateText({
          model: aiModel,
          prompt,
          system,
        })

        latency = Date.now() - start
        content = results.text
        reasoning = results.reasoning
        body = results.response
        status = 200
        statusText = 'OK'
        headers = {}
      }
    } catch (e) {
      error = String(e)
      console.error(e)
    }
    
    if (format === 'List' && typeof content === 'string') {
      try {
        // Extract numbered, markdown ordered lists and keep only the content after the numbers
        const regex = /\d+\.\s+(.*)/g
        const matches = []
        let match
        while ((match = regex.exec(content)) !== null) {
          // match[1] contains just the captured group - the text after the number
          matches.push(match[1].trim())
        }
        data = matches
        console.log('extracted list', { data })
      } catch (e) {
        error = String(e)
        console.error(e)
      }
    }

    if (job.input.event) {
      await payload.update({
        collection: 'events',
        id: job.input.event,
        data: { status: 'Success', content, data, reasoning, citations, error },
      })
    }

    // TODO: if function has an object (ie. the associated Noun), create a new Thing of that Noun

    if (job.input.object) {
      if (!job.input.project) {
        throw new Error('You must select a tenant (project) when creating a thing')
      }
      
      const thing = {
        type: job.input.object,
        content,
        data,
        reasoning,
        context: job.input.context,
        citations: '',
        // citations,
        // error,
        project: job.input.project, // Add project field for multi-tenant support
      }
      console.log({ thing })
      await payload.create({
        collection: 'things',
        data: thing,
      })
    }

    // TODO: get usage / cost information

    // } catch (e) {
    //   error = String(e)
    //   console.error(e)
    // }

    const output = { headers, body, text, latency, status, statusText, data, reasoning, content, citations, error }
    return { output }
  },
}
