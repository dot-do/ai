import { TaskConfig, TaskHandlerResult } from 'payload'
import { waitUntil } from '@vercel/functions'

export const generate: TaskConfig<'generate'> = {
  slug: 'generate',
  inputSchema: [
    { name: 'model', type: 'text', defaultValue: 'google/gemini-2.5-pro-preview' },
    { name: 'prompt', type: 'text', required: true },
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
    const request = JSON.stringify(job.input)
    const response = await fetch(process.env.AI_GATEWAY_URL!, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.AI_GATEWAY_TOKEN}`,
        'HTTP-Referer': 'https://workflows.do',
        'X-Title': 'Workflows.do Business-as-Code',
        'Content-Type': 'application/json',
      },
      body: request,
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
    try {
      data = JSON.parse(content)
    } catch (error) { }
    const output = { headers, body, latency, status, statusText, data, reasoning, content, citations }
    return { output } 
  },
}
