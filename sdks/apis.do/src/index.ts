import { Config } from 'ai-primitives/payload.types'

// Define the LLMs type to include all supported models
export type LLMs = Config['collections']['functions']['model']

// Create a type that excludes all collection types starting with 'payload-'
type OmitPayloadTypes<T> = {
  [K in keyof T as K extends `payload-${string}` ? never : K]: T[K]
}

export type APIs = OmitPayloadTypes<Config['collections']>

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
