declare module 'ai-functions' {
  export interface GenerateObjectOptions {
    model: any
    prompt: string
    schema?: any
    output?: 'object' | 'array'
    temperature?: number
    maxTokens?: number
    [key: string]: any
  }

  export interface GenerateObjectResult {
    object: any
    warnings?: string[]
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }

  export function generateObject(options: GenerateObjectOptions): Promise<GenerateObjectResult>
}
