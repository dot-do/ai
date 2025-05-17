import { TaskConfig, TaskHandlerResult } from 'payload'
import { waitUntil } from '@vercel/functions'
import { toJsonSchema, toZodSchema } from '../lib/schema'

export const generate: TaskConfig<'generate'> = {
  slug: 'generate',
  inputSchema: [
    { name: 'prompt', type: 'text', required: true },
    { name: 'model', type: 'text', defaultValue: 'google/gemini-2.5-pro-preview' },
    { name: 'system', type: 'text'},
    { name: 'format', type: 'select', defaultValue: 'text', options: ['text', 'object', 'code', 'list'] },
    { name: 'schema', type: 'json' },
    { name: 'settings', type: 'json' },
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
  handler: async ({ job, tasks, req }) => {
    const start = Date.now()
    const { payload } = req
    let { model, prompt, system, format, schema, ...settings } = job.input as any
    if (format === 'object') {
      if (!system?.toLowerCase().includes('json')) system += '\n\nRespond only in JSON format.'
    }
    if (format === 'code') {
      if (!system?.toLowerCase().includes('typescript')) system += '\n\nRespond only with TypeScript code.'
    }
    if (format === 'list') {
      if (!system?.toLowerCase().includes('list')) system += '\n\nRespond only with a numbered, Markdown ordered list.'
    }
    system = system?.trim()
    const request: object = {
      model,
      prompt: system ? undefined : prompt,
      messages: system ? [{ role: 'system', content: system }, { role: 'user', content: prompt }] : undefined,
      response_format: format === 'object' 
        ? schema 
          ? { type: 'json_schema', json_schema: toJsonSchema(schema) } 
          : { type: 'json_object' } 
        : undefined,
      ...settings,
    }
    const response = await fetch(process.env.AI_GATEWAY_URL!, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.AI_GATEWAY_TOKEN}`,
        'HTTP-Referer': 'https://workflows.do',
        'X-Title': 'Workflows.do Business-as-Code',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    const latency = Date.now() - start
    const headers = Object.fromEntries(response.headers)
    const status = response.status
    const statusText = response.statusText
    const body = await response.json()
    const content = body.choices?.[0]?.message?.content
    const citations = body.choices?.[0]?.message?.citations
    const reasoning = body.choices?.[0]?.message?.reasoning
    let data
    let error
    try {
      data = JSON.parse(content)
      // try to parse with zod
      if (schema) {
        data = toZodSchema(schema).parse(data)
      }
    } catch (e) {
      if (e instanceof Error) {
        error = { message: e.message, stack: e.stack }
      } else {
        error = { message: String(e) }
      }
     }
    const output = { headers, body, latency, status, statusText, data, reasoning, content, citations, error }
    return { output } 
  },
}
