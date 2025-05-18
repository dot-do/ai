export type { LLMs, APIs } from './types'
import { Config } from 'ai-primitives/payload.types'
import { createClient } from 'payload-rest-client'

export type APIConfig = {
  baseUrl?: string
  apiKey?: string
}

export const API = ({ baseUrl, apiKey }: APIConfig = {}) => {
  const client = createClient<Config, 'en'>({
    apiUrl: baseUrl || 'https://do.mw', // 'https://apis.do'
    headers: {
      Authorization: `users API-Key ${apiKey || process.env.DO_TOKEN}`,
    },
  })
  return client.collections
}

export const api = API()
