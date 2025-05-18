import { TaskConfig } from 'payload'
// import { waitUntil } from '@vercel/functions'
import { toJsonSchema, toZodSchema } from '../lib/schema'

export const generate: TaskConfig<'generate'> = {
  slug: 'generate',
  inputSchema: [
    { name: 'prompt', type: 'text', required: true },
    { name: 'model', type: 'text', defaultValue: 'google/gemini-2.5-pro-preview' },
    { name: 'system', type: 'text'},
    { name: 'format', type: 'select', required: true, options: ['Text', 'Object', 'Code', 'List'] },
    { name: 'schema', type: 'json' },
    { name: 'settings', type: 'json' },
    { name: 'context', type: 'text'},
    { name: 'event', type: 'relationship', relationTo: 'events' },
    { name: 'object', type: 'relationship', relationTo: 'nouns' },
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
    let error, data, headers, body, bodyText, text, latency, status, statusText, reasoning, content, citations
    const start = Date.now()
    const { payload } = req
    // TODO: figure out why job.input has an inferred type of string when it should be the input schema object type
    let { model, prompt, system, format, schema, ...settings } = job.input
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
    const request: object = {
      model,
      prompt: system ? undefined : prompt,
      messages: system ? [{ role: 'system', content: system }, { role: 'user', content: prompt }] : undefined,
      response_format: format === 'Object' 
        ? schema 
          ? { type: 'json_schema', json_schema: toJsonSchema(schema) } 
          : { type: 'json_object' } 
        : undefined,
      ...settings,
    }
    // try {
      const response = await fetch(process.env.AI_GATEWAY_URL + '/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${process.env.AI_GATEWAY_TOKEN}`,
          'HTTP-Referer': 'https://workflows.do',
          'X-Title': 'Workflows.do Business-as-Code',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
      latency = Date.now() - start
      headers = Object.fromEntries(response.headers)
      status = response.status
      statusText = response.statusText
      
      bodyText = await response.text()
      console.log(bodyText.trim().slice(0, 1000))
      try {
        body = JSON.parse(bodyText)
      } catch (e) {
        error = String(e)
        console.error(e)
      }
      content = body?.choices?.[0]?.text || body?.choices?.[0]?.message?.content
      reasoning = body?.choices?.[0]?.reasoning
      citations = body?.citations
      // console.log({ content, citations, reasoning })
      if (format === 'Object') {
        try {
          data = JSON.parse(content)
          // try to parse with zod
          if (schema) {
            data = toZodSchema(schema).parse(data)
          }
        } catch (e) {
          error = String(e)
          console.error(e)
        }
      }
      if (format === 'List') {
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
      const thing = {
        type: job.input.object,
        content,
        data,
        reasoning,
        context: job.input.context,
        citations: citations?.join('\n'),
        // citations,
        // error,
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
