import { Config } from 'ai-primitives/payload.types'

export type LLMs = Config['collections']['functions']['model']

type OmitPayloadTypes<T> = {
  [K in keyof T as K extends `payload-${string}` ? never : K]: T[K]
}

export type APIs = OmitPayloadTypes<Config['collections']>

export type APIConfig = {
  baseUrl?: string
  apiKey?: string
}
